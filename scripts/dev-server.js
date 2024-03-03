process.env.NODE_ENV = 'development';

const Vite = require('vite');
const ChildProcess = require('child_process');
const Path = require('path');
const Chalk = require('chalk');
const Chokidar = require('chokidar');
const Electron = require('electron');
const compileTs = require('./private/tsc');
const FileSystem = require('fs');
const { EOL } = require('os');

let viteServer = null;
let electronProcess = null;
let electronProcessLocker = false;
let backendProcessLocker = false;
let rendererPort = 0;
let backendProcess = null;

const SRC_ROOT = Path.join(__dirname, '..', 'src')

function restartBackend() {
    if (backendProcess) {
        backendProcess.removeAllListeners('exit');
        backendProcess.kill();
        backendProcess = null;
    }

    if (!backendProcessLocker) {
        backendProcessLocker = true;
        startBackend();
    }
}

function startBackend() {
    if (backendProcess) {
        return
    }
    backendProcess = ChildProcess.spawn('python', ['main.py'], { cwd: Path.join(SRC_ROOT, 'backend') });
    backendProcessLocker = false
    backendProcess.stdout.on('data', data => {
        if (data == EOL) {
            return;
        }

        process.stdout.write(Chalk.blueBright(`[backend] `) + Chalk.white(data.toString()))
    });

    backendProcess.stderr.on('data', data =>
        process.stderr.write(Chalk.blueBright(`[backend] `) + Chalk.white(data.toString()))
    );

    backendProcess.on('exit', () => stop());
}

async function startFrontend() {
    viteServer = await Vite.createServer({
        configFile: Path.join(SRC_ROOT, 'frontend', 'vite.config.ts'),
        mode: 'development',
    });

    return viteServer.listen();
}

async function startElectron() {
    if (electronProcess) { // single instance lock
        return;
    }

    try {
        await compileTs(Path.join(SRC_ROOT, 'electron'));
    } catch {
        console.log(Chalk.redBright('Could not start Electron because of the above typescript error(s).'));
        electronProcessLocker = false;
        return;
    }

    const args = [
        Path.join(__dirname, '..', 'build', 'electron', 'main.js'),
        rendererPort,
    ];
    electronProcess = ChildProcess.spawn(Electron, args);
    electronProcessLocker = false;

    electronProcess.stdout.on('data', data => {
        if (data == EOL) {
            return;
        }

        process.stdout.write(Chalk.blueBright(`[electron] `) + Chalk.white(data.toString()))
    });

    electronProcess.stderr.on('data', data =>
        process.stderr.write(Chalk.blueBright(`[electron] `) + Chalk.white(data.toString()))
    );

    electronProcess.on('exit', () => stop());
}

function restartElectron() {
    if (electronProcess) {
        electronProcess.removeAllListeners('exit');
        electronProcess.kill();
        electronProcess = null;
    }

    if (!electronProcessLocker) {
        electronProcessLocker = true;
        startElectron();
    }
}

function copyStaticFiles() {
    copy('static');
}

/*
The working dir of Electron is build/main instead of src/main because of TS.
tsc does not copy static files, so copy them over manually for dev server.
*/
function copy(path) {
    FileSystem.cpSync(
        Path.join(SRC_ROOT, 'electron', path),
        Path.join(__dirname, '..', 'build', 'electron', path),
        { recursive: true }
    );
}

function stop() {
    viteServer.close();
    process.exit();
}

async function start() {
    console.log(`${Chalk.greenBright('=======================================')}`);
    console.log(`${Chalk.greenBright('Starting Development Mode...')}`);
    console.log(`${Chalk.greenBright('=======================================')}`);

    startBackend()

    const devServer = await startFrontend();
    rendererPort = devServer.config.server.port;

    // copyStaticFiles();
    startElectron();

    const path = Path.join(SRC_ROOT, 'electron');
    Chokidar.watch(path, {
        cwd: path,
    }).on('change', (path) => {
        console.log(Chalk.blueBright(`[electron] `) + `Change in ${path}. reloading... 🚀`);

        if (path.startsWith(Path.join('static', '/'))) {
            copy(path);
        }

        restartElectron();
    });
    const backendPath = Path.join(SRC_ROOT, 'backend');
    Chokidar.watch(backendPath, {
        cwd: backendPath,
    }).on('change', (path) => {
        console.log(Chalk.blueBright(`[backend] `) + `Change in ${path}. reloading... 🚀`);
        restartBackend();
    });
}

start();