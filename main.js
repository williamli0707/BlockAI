const { CodeGenerator } = require('blockly');
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')
const path = require('path');
const fs = require('fs');
WIN_WIDTH = 1280;
WIN_HEIGHT = 720;
IMAGES_FOLDER = "images_folder";
let win;

const createHomeWindow = () => {
    win = new BrowserWindow({
        width: WIN_WIDTH,
        height: WIN_HEIGHT,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            // preload: path.join(__dirname, 'home.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
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
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.loadFile('workspace.html').then();
    win.webContents.openDevTools()
});

ipcMain.on('go-to-home', e => {
    win.close();
    createHomeWindow();
});

ipcMain.on('load-images', async (event) => {
    try {
        // Get the files as an array
        if (!fs.existsSync(path.join(app.getPath('userData'), IMAGES_FOLDER))) {
            fs.mkdirSync(path.join(app.getPath('userData'), IMAGES_FOLDER));
        }

        const files = await fs.promises.readdir(path.join(app.getPath('userData'), IMAGES_FOLDER));

        for( const file of files ) {
            const imagePath = path.join(path.join(app.getPath('userData'), IMAGES_FOLDER), file);
            const stat = await fs.promises.stat(imagePath);

            if(stat.isFile()) {
                event.sender.send('call-display-image', imagePath);
                // require('electron').ipcRenderer.send('display-image', filePath);
            }
        }
    }
    catch(err) {
        console.log(err);
    }

});

ipcMain.on('image-upload', (event, arg) => { 
    if (!fs.existsSync(path.join(app.getPath('userData'), IMAGES_FOLDER))) {
        fs.mkdirSync(path.join(app.getPath('userData'), IMAGES_FOLDER));
    }
    // If the platform is 'darwin' (macOS)
    dialog.showOpenDialog({
        title: 'Select the File to be uploaded',
        defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Upload',
        filters: [ 
        { 
        name: 'Text Files', 
        extensions: ['png', 'jpeg'] 
        }, ],
        // Specifying the File Selector and Directory 
        // Selector Property In macOS
        properties: ['openFile', 'openDirectory']
    }).then(file => {
        if (!file.canceled) {
            const filePath = file.filePaths[0].toString('base64');

            const fileName = path.basename(filePath);
            imgFolderPath = path.join(path.join(app.getPath('userData'), IMAGES_FOLDER), fileName);

            // copy file from original location to app data folder
            fs.copyFile(filePath, imgFolderPath, (err) => {
                if (err) throw err;
                // console.log(fileName + ' uploaded.');
                event.sender.send('call-display-image', filePath);
            });
        }  
    }).catch(err => {
        console.log(err)
    });
});

// test
//TODO: https://developers.google.com/blockly/guides/app-integration/attribution