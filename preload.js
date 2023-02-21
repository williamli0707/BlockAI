/**
 * namespace for code
 */
var Code = {};
const { app, ipcRenderer, systemPreferences } = require('electron');
const fs = require('fs');
const path = require("path");

let classNum;

// Code.url = "http://www.blockai.great-site.net";

window.addEventListener('DOMContentLoaded', () => {
    console.log("Chromium version " + process.versions['chrome'])
    console.log("Node.js version " + process.versions['node'])
    console.log("Electron version " + process.versions['electron'])
    document.getElementById("back-button").addEventListener("click", () => {
        require('electron').ipcRenderer.send('go-to-home');
    });
    document.getElementById("run-confirm-yes").addEventListener("click", () => {
        Code.exp();
    });
    document.getElementById("images-upload-yes").addEventListener("click", async () => {
        await Code.uploadImages(0);
    });
    document.getElementById("images-modal").addEventListener("shown.bs.modal", () => {
        let loading = document.createElement("p");
        loading.id = "loading";
        loading.textContent = "Loading...";
        document.getElementById("image-container").appendChild(loading);
        Code.loadImages();
    });
    document.getElementById("images-modal").addEventListener("hidden.bs.modal", () => {
        Code.unloadImages();
    });
    document.getElementById("images-preview").addEventListener("shown.bs.modal", () => {
        let loading = document.createElement("p");
        loading.id = "loading-preview";
        loading.textContent = "Loading...";
        document.getElementById("image-preview-container").appendChild(loading);
        Code.loadImagesPreview();
    });
    document.getElementById("images-preview").addEventListener("hidden.bs.modal", () => {
        Code.unloadImagesPreview();
    });
    document.getElementById("images-preview-no").addEventListener("click", () => {
        ipcRenderer.send('delete-temp');
    });
    // document.getElementById("images-preview-yes").addEventListener("click", () => {
    //     ipcRenderer.send('temp-to-image', ["1"]);
    //     let imageModal = new bootstrap.Modal(document.getElementById('images-modal'), {});
    //     imageModal.show();
    // });
    document.getElementById("upload1").addEventListener("click", () => {
        ipcRenderer.send('temp-to-image', ["1"]);
        let imageModal = new bootstrap.Modal(document.getElementById('images-modal'), {});
        imageModal.show();
    });
    document.getElementById("upload2").addEventListener("click", () => {
        ipcRenderer.send('temp-to-image', ["2"]);
        let imageModal = new bootstrap.Modal(document.getElementById('images-modal'), {});
        imageModal.show();
    });
    //TODO multiple classes
    Code.blockly();
});

ipcRenderer.on('preview-modal', (event) => {
    let previewModal = new bootstrap.Modal(document.getElementById('images-preview'), {});
    let imageModal = new bootstrap.Modal(document.getElementById('images-modal'), {});
    console.log("closing imageModal " + imageModal.toString())
    previewModal.show();
});

ipcRenderer.on('call-preview-image', (event, imagePath) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add('image-div');
    const imgNode = document.createElement("img");
    imgNode.src = imagePath;
    imgNode.classList.add('image');
    newDiv.appendChild(imgNode);
    document.getElementById('image-preview-container').appendChild(newDiv);
});

ipcRenderer.on('accordion-add', (event, args) => {
     let accordionItem = document.createElement("div");
     let heading = document.createElement("h2");
     let button = document.createElement("button");
     let collapse = document.createElement("div");
     let accbody = document.createElement("div");
     accordionItem.classList.add('accordion-item');
     heading.classList.add('accordion-header');
     button.classList.add('accordion-button');
     button.type = 'button';
     button.setAttribute("data-bs-toggle", "collapse");
     button.setAttribute("data-bs-target", "#collapse" + args)
     button.ariaExpanded = "true";
     button.setAttribute("aria-controls", "collapse" + args);
     collapse.setAttribute("aria-labelledby", "heading" + args);
     collapse.setAttribute("data-bs-parent", "#images-accordion");
     collapse.classList.add('accordion-collapse');
     collapse.classList.add('collapse');
     collapse.classList.add('show');
     heading.id = "heading" + args;
     button.id = "button" + args;
     button.textContent = "Class " + args;
     collapse.id = "collapse" + args;
     accbody.id = "accordion-body" + args;
     heading.appendChild(button);
     collapse.appendChild(accbody);
     accordionItem.appendChild(heading);
     accordionItem.appendChild(collapse);
     document.getElementById('images-accordion').appendChild(accordionItem);
});

ipcRenderer.on('call-display-image', (event, args) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add('image-div');

    const imgNode = document.createElement("img");
    imgNode.src = args[0];
    imgNode.classList.add('image');

    const deleteNode = document.createElement("button");
    deleteNode.innerHTML = '<img src="./images/trashcan_icon.png" class="image"/>';
    deleteNode.classList.add('delete-button');

    imgNode.addEventListener("mouseover", () => {
        deleteNode.style.visibility = 'visible';
    });
    imgNode.addEventListener("mouseout", () => {
        deleteNode.style.visibility = 'hidden';
    });

    deleteNode.addEventListener("mouseover", () => {
        deleteNode.style.visibility = 'visible';
    });
    deleteNode.addEventListener("mouseout", () => {
        deleteNode.style.visibility = 'hidden';
    });

    newDiv.appendChild(imgNode);
    newDiv.appendChild(deleteNode);
    document.getElementById(('accordion-body' + args[1].toString())).appendChild(newDiv);

    deleteNode.addEventListener("click", () => {
        newDiv.remove();
        fs.unlinkSync(args[0]);
        console.log("removing " + args[0]);
    });
});

ipcRenderer.on('done-loading', (event) => {
    document.getElementById("loading").remove();
});

ipcRenderer.on('done-loading-preview', (event) => {
    document.getElementById("loading-preview").remove();
});

ipcRenderer.on('num-classes', (event, args) => {
    classNum = args;
})

Code.unloadImages = function() {
    var imageContainer = document.getElementById('image-container').children;

    while(imageContainer.length) {
        imageContainer[0].remove();
    }
};

Code.unloadImagesPreview = function() {
    var imageContainer = document.getElementById('image-preview-container').children;

    while(imageContainer.length) {
        imageContainer[0].remove();
    }
}

Code.loadImages = function() {
    ipcRenderer.send('ensure-folder');
    let accordion = document.createElement("div");
    accordion.classList.add('accordion');
    accordion.id = 'images-accordion';

    document.getElementById("image-container").appendChild(accordion);

    ipcRenderer.send('load-images');
}

Code.loadImagesPreview = function() {
    ipcRenderer.send('load-preview');
}

Code.uploadImages = async function(method) {
    ipcRenderer.send('image-upload', [method]);
}

Code.setURL = function(url) {
    Code.xhr.open('GET', url);
}

Code.stopProp = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
}

Code.updateProgress = function(ev) {
    if (ev.lengthComputable) {
        const percentComplete = (ev.loaded / ev.total) * 100;
    } 
    else {
      // Unable to compute progress information since the total size is unknown
    }
}
  
Code.transferComplete = function(ev) {
    console.log("The transfer is complete.");
}

Code.transferFailed = function(ev) {
    console.log("An error occurred while transferring the file.");
}

Code.transferCanceled = function(ev) {
    console.log("The transfer has been canceled by the user.");
}

Code.sendHTTPRequest = function(method, url, data) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.responseType = 'json';

        if(data) {
            xhr.setRequestHeader('Content-Type', 'application/json')
        }

        xhr.onload = () => {
            console.log(xhr.status);
            resolve(xhr.response);
        }

        xhr.onerror = () => {
            reject("error - something went wrong");
        }

        xhr.send(JSON.stringify(data));
    });
    return promise;
}

Code.exp = function(){    // export stuff to server
    Code.sendHTTPRequest("POST", "http://192.9.249.213:3000", {
        "Id": 1234,
        "code": Blockly.JavaScript.workspaceToCode(Code.workspace),
    })
}

Code.blockly = function() {
    Code.Blockly = require('blockly');
    Code.javascriptGenerator = require('blockly/javascript');
    Code.path = require("path");
    require('@blockly/field-slider');
    const blocklyArea = document.getElementById('blockly-container');
    const blocklyDiv = document.getElementById('blockly-div');

    Code.Blockly.defineBlocksWithJsonArray(blocks);

    Blockly.JavaScript['conv2d'] = function(block) {
        var value_activation = Blockly.JavaScript.valueToCode(block, 'activation', Blockly.JavaScript.ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.Conv2D(activation=\'' + value_activation + '\'),\n';
        return code;
    };
    Blockly.JavaScript['maxpooling2d'] = function(block) {
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.MaxPooling2D(),\n';
        return code;
    };
    Blockly.JavaScript['flatten'] = function(block) {
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.Flatten(),\n';
        return code;
    };
    Blockly.JavaScript['dropout'] = function(block) {
        var value_rate = Blockly.JavaScript.valueToCode(block, 'rate', Blockly.JavaScript.ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.Dropout(' + value_rate + '),\n';
        return code;
    };
    Blockly.JavaScript['dense'] = function(block) {
        var num_neurons = Blockly.JavaScript.valueToCode(block, 'num_neurons', Blockly.JavaScript.ORDER_ATOMIC)
        var value_activation = Blockly.JavaScript.valueToCode(block, 'activation', Blockly.JavaScript.ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = '\tcode;\n';
        return code;
    };

    Blockly.JavaScript['cnn_model'] = function(block) {
        var statements_layers = Blockly.JavaScript.statementToCode(block, 'layers');
        var code = 'model = tf.keras.models.Sequential([\n' + statements_layers + ']);\n';
        return code;
    };

    Code.workspace = Code.Blockly.inject(blocklyDiv,
        {toolbox: toolbox});
    console.log(Code.javascriptGenerator)
    Code.onresize = function(e) {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        let element = blocklyArea;
        let x = 0;
        let y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Code.Blockly.svgResize(Code.workspace);
    };
    window.addEventListener('resize', Code.onresize, false);
    Code.onresize();
}