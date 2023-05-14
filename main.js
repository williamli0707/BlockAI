const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const settings = new Store({
    numClasses: {
        type: 'number',
        default: 2
    },
    workspace: {
        default: {}
    }
});

WIN_WIDTH = 1280;
WIN_HEIGHT = 720;
IMAGES_FOLDER = "images_folder";
PREVIEW_FOLDER = "preview_folder";
let win;
let numClasses;
let extensionList = ["png", "jpg", "jpeg"];

const createHomeWindow = () => {
    win = new BrowserWindow({
        title: "Home",
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

ipcMain.on('go-to-creator', () => {
    // win.preload = path.join(__dirname, 'creator.js');
    win.loadFile('creator.html').then();
});

ipcMain.on('go-to-editor', () => {
    win.close();
    win = new BrowserWindow({
        title: "Project Editor",
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
    win.webContents.openDevTools();
});

ipcMain.on('go-to-home', () => {
    win.close();
    createHomeWindow();
});

deleteTemp = function () {
    fs.rmSync(path.join(path.join(app.getPath('userData'), PREVIEW_FOLDER)), { recursive: true, force: true });
}

ipcMain.on('ensure-folder', (event) => {
    let num_classes = settings.get("datasets").u.numClasses;
    event.sender.send('set-num-classes', num_classes);
    numClasses = num_classes;

    console.log('ensuring: ' + numClasses);

    let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
    }

    let previewFolder = path.join(app.getPath('userData'), PREVIEW_FOLDER);
    if (!fs.existsSync(previewFolder)) {
        fs.mkdirSync(previewFolder);
    }

    for (let i = 1; i <= numClasses; i++) {
        if (!fs.existsSync(path.join(imagesFolder, i.toString()))) {
            fs.mkdirSync(path.join(imagesFolder, i.toString()));
        }
    }
});

ipcMain.on('add-class', (event) => {
    ++numClasses;

    settings.set("datasets.u.numClasses", numClasses);

    fs.mkdirSync(path.join(path.join(app.getPath('userData'), IMAGES_FOLDER), numClasses.toString()));

    event.sender.send('accordion-add', numClasses)
});

ipcMain.on('load-images', async (event) => {
    try {
        // Get the files as an array
        let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);
        console.log(numClasses);

        for(let i = 1; i <= numClasses; i++) {
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

        // event.sender.send('done-loading');
    }
    catch(err) {
        console.log(err);
    }

});

ipcMain.on('load-preview', async (event) => {
    try {
        // Get the files as an array
        if (!fs.existsSync(path.join(app.getPath('userData'), PREVIEW_FOLDER))) {
            fs.mkdirSync(path.join(app.getPath('userData'), PREVIEW_FOLDER));
        }

        const files = await fs.promises.readdir(path.join(app.getPath('userData'), PREVIEW_FOLDER));

        for( const file of files ) {
            const imagePath = path.join(path.join(app.getPath('userData'), PREVIEW_FOLDER), file);
            const stat = await fs.promises.stat(imagePath);
            // console.log(file.toString());
            if(stat.isFile() && extensionList.includes(path.extname(imagePath).substring(1))) {
                event.sender.send('call-preview-image', [imagePath]);
                // require('electron').ipcRenderer.send('display-image', filePath);
            }
        }

        // event.sender.send('done-loading-preview');
    }
    catch(err) {
        console.log(err);
    }

});

//once confirmed, images should be moved to main images folder and temp folder should be deleted
ipcMain.handle('temp-to-image', async (event, args) => {
    try {
        new Promise(async (resolve, reject) => {
            const files = await fs.promises.readdir(path.join(app.getPath('userData'), PREVIEW_FOLDER));
            for (const file of files) {
                const imagePath = path.join(app.getPath('userData'), PREVIEW_FOLDER, file);
                const uploadPath = path.join(app.getPath('userData'), IMAGES_FOLDER, args[0].toString(), file);
                await fs.copyFile(imagePath, uploadPath, (err) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    // console.log(imagePath + ' uploaded to ' + uploadPath);
                });
            }
            resolve();
        }).then(() => {
            return 0;
        })
    }
    catch (err) {
        console.log(err);
    }
})

ipcMain.on('save-workspace', (event, args) => {
    settings.set("workspace", args);
});

//upload to images folder from a directory
ipcMain.on('image-upload', (event) => {
    let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);
    let tempFolder = path.join(app.getPath('userData'), PREVIEW_FOLDER);
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
        fs.mkdirSync(path.join(imagesFolder, "1"));
        fs.mkdirSync(path.join(imagesFolder, "2"));
    }
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
    }

    // If the platform is 'darwin' (macOS)
    dialog.showOpenDialog({
        title: 'Select the File to be uploaded',
        defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Upload',
        filters: [
        {
        name: 'Text Files',
        extensions: extensionList
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
            uploadPath = path.join(path.join(app.getPath('userData'), PREVIEW_FOLDER), fileName);

            // copy file from original location to app data folder
            fs.copyFile(filePath, uploadPath, (err) => {
                if (err) throw err;
                console.log(filePath + ' uploaded to ' + uploadPath);
                event.sender.send('preview-modal');
            });
        }
    }).catch(err => {
        console.log(err)
    });
});

ipcMain.on('webcam-temp', async (event, image) => {
    // console.log(image);
    let tempFolder = path.join(app.getPath('userData'), PREVIEW_FOLDER);
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
    }
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, "base64");
    await fs.writeFile(path.join(tempFolder, new Date().getTime().toString() + ".png"), buf, function(err) {
        if(err) console.log(err);
    });
});

ipcMain.on('delete-temp', () => {
    deleteTemp();
});

ipcMain.handle('load-images-to-model', async () => {
    console.log('loading images')
    let imagesFolder = path.join(app.getPath('userData'), IMAGES_FOLDER);
    let inputs = [], outputs = [];
    return new Promise(async (resolve) => {
        for (let i = 0;i < NUM_CLASSES;i++) {
            const files = await fs.promises.readdir(path.join(imagesFolder, (i + 1).toString()));
            for (const file of files) {
                await new Promise((resolve, reject) => {
                    const imagePath = path.join(imagesFolder, (i + 1).toString(), file);
                    inputs.push(imagePath);
                    outputs.push(i);
                    resolve();
                });
            }
            // for (let j = 0;j < 500;j++) {
            //     await new Promise((resolve, reject) => {
            //         const imagePath = path.join(imagesFolder, (i + 1).toString(), j.toString(), ".jpg");
            //         inputs.push(imagePath);
            //         outputs.push(i);
            //         resolve();
            //     });
            // }

        }
        // console.log('done loading ' + new Date().getTime());
        resolve([inputs, outputs]);
    });
});

ipcMain.handle('rename-directory', (event, args) => {
    return new Promise((resolve, reject) => {
        try {
            let oldP = path.join(app.getPath('userData'), IMAGES_FOLDER, args[0].toString());
            let newP = path.join(app.getPath('userData'), IMAGES_FOLDER, args[1].toString());
            console.log('renaming ' + oldP + ' to ' + newP);
            fs.renameSync(oldP, newP);
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
        resolve();
    });
});

ipcMain.handle('delete-directory', (event, args) => {
    if(numClasses === 2) {
        throw -1;
    }
    numClasses--;
    settings.set("datasets.u.numClasses", numClasses);
    // console.log("numclasses is now " + numClasses);
    // console.log(args)
    return new Promise((resolve, reject) => {
        try {
            let oldP = path.join(app.getPath('userData'), IMAGES_FOLDER, args[0].toString());
            console.log("deleting: " + oldP);
            fs.rmSync(oldP, {recursive: true});
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
        resolve();
    });
});

ipcMain.on('loaded-image-?', (event) => {
    console.log('done loading image in preload');
});

ipcMain.handle('getPath', () => {
    return new Promise((resolve) => {
        resolve(app.getPath("userData"));
    });
});

ipcMain.handle('get-workspace', () => {
    return new Promise((resolve, reject) => {
        resolve(settings.get("workspace"));
    });
})

ipcMain.handle('get-temp-images', async () => {
    let tmp = await fs.promises.readdir(path.join(app.getPath('userData'), PREVIEW_FOLDER));
    return tmp.length;
});

// test
//TODO: https://developers.google.com/blockly/guides/app-integration/attribution
//TODO: https://icons8.com/license

//TODO: dark mode
//TODO: status indicators for code
//TODO: delete all code stuff when pressing back
//TODO: stop user from deleting when only 2 classes left
//TODO: