const { CodeGenerator } = require('blockly');
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')
const path = require('path');
const fs = require('fs');
WIN_WIDTH = 1280;
WIN_HEIGHT = 720;
IMAGES_FOLDER = "images_folder";
TEMP_FOLDER = "temp"
let win;
NUM_CLASSES = 2;

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
        },
        // titleBarStyle: "hidden"
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
        },
        // titleBarStyle: "hidden"
    })
    win.loadFile('workspace.html').then();
    win.webContents.openDevTools()
});

ipcMain.on('go-to-home', e => {
    win.close();
    createHomeWindow();
});

deleteTemp = function () {
    fs.rmSync(path.join(path.join(app.getPath('userData'), TEMP_FOLDER)), { recursive: true, force: true });
}

ipcMain.on('ensure-folder', (event) => {
    let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
        fs.mkdirSync(path.join(imagesFolder, "1"));
        fs.mkdirSync(path.join(imagesFolder, "2"));
    }
    event.sender.send('num-classes', NUM_CLASSES);//TODO: once >2 classes are available
});

ipcMain.on('load-images', async (event) => {
    try {
        // Get the files as an array
        let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);

        for(let i = 1;i <= NUM_CLASSES;i++) {
            event.sender.send('accordion-add', i);
            const files = await fs.promises.readdir(path.join(imagesFolder, i.toString()));
            for( const file of files ) {
                const imagePath = path.join(imagesFolder, i.toString(), file);
                const stat = await fs.promises.stat(imagePath);

                if(stat.isFile()) {
                    event.sender.send('call-display-image', [imagePath, i]);
                    // require('electron').ipcRenderer.send('display-image', filePath);
                }
            }
        }

        event.sender.send('done-loading');
    }
    catch(err) {
        console.log(err);
    }

});

ipcMain.on('load-preview', async (event) => {
    try {
        // Get the files as an array
        if (!fs.existsSync(path.join(app.getPath('userData'), TEMP_FOLDER))) {
            fs.mkdirSync(path.join(app.getPath('userData'), TEMP_FOLDER));
        }

        const files = await fs.promises.readdir(path.join(app.getPath('userData'), TEMP_FOLDER));

        for( const file of files ) {
            const imagePath = path.join(path.join(app.getPath('userData'), TEMP_FOLDER), file);
            const stat = await fs.promises.stat(imagePath);

            if(stat.isFile()) {
                event.sender.send('call-preview-image', imagePath);
                // require('electron').ipcRenderer.send('display-image', filePath);
            }
        }

        event.sender.send('done-loading-preview');
    }
    catch(err) {
        console.log(err);
    }

});

//once confirmed, images should be moved to main images folder and temp folder should be deleted
ipcMain.on('temp-to-image', async (event, args) => {
    try {
        const files = await fs.promises.readdir(path.join(app.getPath('userData'), TEMP_FOLDER));
        for(const file of files) {
            const imagePath = path.join(app.getPath('userData'), TEMP_FOLDER, file);
            const uploadPath = path.join(app.getPath('userData'), IMAGES_FOLDER, args[0].toString(), file);
            fs.copyFile(imagePath, uploadPath, (err) => {
                if (err) throw err;
                console.log(imagePath + ' uploaded to ' + uploadPath);
            });
        }
        deleteTemp();
    }
    catch (err) {
        console.log(err);
    }
})

//upload to images folder from a directory
ipcMain.on('image-upload', (event, arg) => {
    let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);
    let tempFolder = path.join(app.getPath('userData'), TEMP_FOLDER)
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
        fs.mkdirSync(path.join(imagesFolder, "1"));
        fs.mkdirSync(path.join(imagesFolder, "2"));
    }
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
    }

    console.log('args[0]: ' + arg[0])

    // If the platform is 'darwin' (macOS)
    dialog.showOpenDialog({
        title: 'Select the File to be uploaded',
        defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Upload',
        filters: [
        {
        name: 'Text Files',
        extensions: ['png', 'jpeg', 'jpg']
        }, ],
        // Specifying the File Selector and Directory
        // Selector Property In macOS
        properties: ['openFile', 'openDirectory']
    }).then(file => {
        let uploadPath;
        if (!file.canceled) {
            const filePath = file.filePaths[0].toString('base64');

            const fileName = path.basename(filePath);
            //0 for temp, 1 for images folder
            uploadPath = path.join(path.join(app.getPath('userData'), arg[0] === 0 ? TEMP_FOLDER : IMAGES_FOLDER), fileName);

            // copy file from original location to app data folder
            fs.copyFile(filePath, uploadPath, (err) => {
                if (err) throw err;
                console.log(filePath + ' uploaded to ' + uploadPath);
                if (arg[0] === 0) {
                    event.sender.send('preview-modal');
                }
            });
        }
    }).catch(err => {
        console.log(err)
    });
});

ipcMain.on('delete-temp', (event) => {
    deleteTemp();
});


// test
//TODO: https://developers.google.com/blockly/guides/app-integration/attribution