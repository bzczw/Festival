const { app, BrowserWindow, ipcMain } = require('electron')
// let ipcMain = require('electron').ipcMain;
let win
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 500,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true, // 是否集成 Nodejs,把之前预加载的js去了，发现也可以运行
    }
  })
  // win.openDevTools()
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('window-close', function() {
  win.close();
})