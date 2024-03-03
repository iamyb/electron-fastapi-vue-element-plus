const Path = require('path');
const Chalk = require('chalk');
const FileSystem = require('fs');
const Vite = require('vite');
const compileTs = require('./private/tsc');
const SRC_ROOT = Path.join(__dirname, '..', 'src')

function buildFrontend() {
    return Vite.build({
        configFile: Path.join(SRC_ROOT, 'frontend', 'vite.config.ts'),
        mode: 'production'
    });
}

function buildElectron() {
    const mainPath = Path.join(SRC_ROOT, 'electron');
    return compileTs(mainPath);
}

function buildBackend() {
    const backendPath = Path.join(SRC_ROOT, 'backend');
    process.chdir(backendPath)
    var exec = require('child_process').exec;

    exec('pyinstaller --distpath=..\\..\\build\\backend main.py',
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
}


FileSystem.rmSync(Path.join(__dirname, '..', 'build'), {
    recursive: true,
    force: true,
})

console.log(Chalk.blueBright('Transpiling Frontend & Electron & Backend...'));

Promise.allSettled([
    buildFrontend(),
    buildElectron(),
    buildBackend()
]).then(() => {
    console.log(Chalk.greenBright('Frontend & Electron & Backend successfully transpiled! (ready to be built with electron-builder)'));
});