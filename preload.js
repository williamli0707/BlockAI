/**
 * namespace for code
 */
var Code = {};
Code.url = "http://www.blockai.great-site.net";

window.addEventListener('DOMContentLoaded', () => {
    console.log("Chromium version " + process.versions['chrome'])
    console.log("Node.js version " + process.versions['node'])
    console.log("Electron version " + process.versions['electron'])
    document.getElementById("back-button").addEventListener("click", () => {
        require('electron').ipcRenderer.send('go-to-home');
    });
    document.getElementById("runConfirmYes").addEventListener("click", () => {
        Code.exp();
    });
    document.getElementById("imagesUploadYes").addEventListener("click", () => {
        Code.uploadImages();
    }) 
    Code.blockly();
});

Code.uploadImages = function() {

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