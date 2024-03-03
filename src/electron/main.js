const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')
const { fetchWrapper } = require('./fetchApi.js'); // Adjust the path to your actual file
const treeKill = require('tree-kill');

const fastapiAppUrl = 'http://127.0.0.1:8888'


let fastApiProcess = null

async function handleFileOpenBackend(filePath) {
  const res = await fetchWrapper.post(
    fastapiAppUrl + '/dir',
    { fileName: filePath }
  )
  const fileInfo = await res.json()
  return fileInfo
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled) {
    const { fileInfo } = await handleFileOpenBackend(filePaths[0])
    // console.log({path: filePaths[0], info: fileInfo})
    return { path: filePaths[0], info: fileInfo }
  }
  return {}
}

function startFastAPI() {
  fastApiProcess = require('child_process').spawn(
    path.join(__dirname, '../../build/backend/main/main.exe'), { windowsHide: true })
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setMenuBarVisibility(false)
  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/index.html'))
    startFastAPI()
  }
}

const stopFastAPI = () => {
  if (fastApiProcess !== null) {
    treeKill(fastApiProcess.pid)
    // fastApiProcess.kill()
    fastApiProcess = null
  }
}

app.on('before-quit', stopFastAPI)

app.whenReady().then(() => {
  ipcMain.handle("config:getBackendUrl", () => fastapiAppUrl);
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})