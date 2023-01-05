const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })
    win.loadFile('workspace.html')
    win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
    console.log("windows all closed")
    if (process.platform !== 'darwin') app.quit()
})
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

