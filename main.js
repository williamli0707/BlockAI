const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

WIN_WIDTH = 1280;
WIN_HEIGHT = 720;

let win;

const createHomeWindow = () => {
    win = new BrowserWindow({
        width: WIN_WIDTH,
        height: WIN_HEIGHT,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            // preload: path.join(__dirname, 'home.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadFile('home.html').then();
    win.webContents.openDevTools();
}

app.on('window-all-closed', () => {
    console.log("windows all closed")
    if (process.platform !== 'darwin') app.quit()
});

app.whenReady().then(() => {
    createHomeWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createHomeWindow();
    })
});

ipcMain.on('go-to-creator', e => {
    // win.preload = path.join(__dirname, 'creator.js');
    win.loadFile('creator.html').then();
});

ipcMain.on('go-to-editor', e => {
    win.close();
    win = new BrowserWindow({
        width: WIN_WIDTH,
        height: WIN_HEIGHT,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.preload = path.join(__dirname, 'workspace.js');
    win.loadFile('workspace.html').then();
    win.webContents.openDevTools()
});

ipcMain.on('go-to-home', e => {
    win.close();
    createHomeWindow();
});