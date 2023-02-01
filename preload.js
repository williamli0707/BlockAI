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

Code.exp = function(){    // export stuff to server
    let fs = require('fs');
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);  // user's code translated to javascript
    console.log(code);
    Code.xhr = new XMLHttpRequest();

    Code.xhr.addEventListener("progress", Code.updateProgress);
    Code.xhr.addEventListener("load", Code.transferComplete);
    Code.xhr.addEventListener("error", Code.transferFailed);
    Code.xhr.addEventListener("abort", Code.transferCanceled);

    /**
     * TODO: setup url to export to
     */
    Code.setURL(Code.url);
    Code.xhr.send(code);
}

Code.blockly = function() {
    Code.Blockly = require('blockly');
    Code.javascriptGenerator = require('blockly/javascript');
    require('@blockly/field-slider');
    const blocklyArea = document.getElementById('blockly-container');
    const blocklyDiv = document.getElementById('blockly-div');

    Code.Blockly.defineBlocksWithJsonArray([
        {
            "type": "conv2d",
            "kind": "block",
            "message0": "Conv2D %1 Activation %2",
            "args0": [
                {
                    "type": "input_dummy"
                },
                {
                    "type": "field_dropdown",
                    "name": "activation",
                    "options": [
                        [ "relu", "RELU" ],
                        [ "sigmoid", "SIGMOID" ],
                        [ "softmax", "SOFTMAX" ],
                        [ "softplus", "SOFTPLUS" ],
                        [ "softsign", "SOFTSIGN" ],
                        [ "tanh", "TANH" ],
                        [ "selu", "SELU" ],
                        [ "elu", "ELU" ],
                        [ "exponential", "EXPONENTIAL" ],
                    ]
                }
            ],
            "previousStatement": null,
            "nextStatement": 'Layer',
            "inputsInline": true,
            "colour": 230,
            "tooltip": "tooltip1",
            "helpUrl": ""
        },
        {
            "type": "maxpooling2d",
            "kind": "block",
            "message0": "MaxPooling2D",
            "previousStatement": null,
            "nextStatement": null,
            "inputsInline": true,
            "colour": 230,
            "tooltip": "tooltip2",
            "helpUrl": ""
        },
        {
            "type": "flatten",
            "kind": "block",
            "message0": "Flatten",
            "previousStatement": null,
            "nextStatement": null,
            "inputsInline": true,
            "colour": 230,
            "tooltip": "tooltip2",
            "helpUrl": ""
        },
        {
            "type": "dropout",
            "kind": "block",
            "message0": "Dropout %1 Rate %2",
            "args0": [
                {
                    "type": "input_dummy"
                },
                {
                    "type": "field_slider",
                    "name": "rate",
                    "value": 0.2,
                    "min": 0,
                    "max": 1,
                    "precision": 0.01
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        },
        {
            "type": "dense",
            "kind": "block",
            "message0": "Dense %1 Number of Neurons %2 Activation %3",
            "args0": [
                {
                    "type": "input_dummy"
                },
                {
                    "type": "field_number",
                    "name": "num_neurons",
                },
                {
                    "type": "field_dropdown",
                    "name": "activation",
                    "options": [
                        [ "relu", "RELU" ],
                        [ "sigmoid", "SIGMOID" ],
                        [ "softmax", "SOFTMAX" ],
                        [ "softplus", "SOFTPLUS" ],
                        [ "softsign", "SOFTSIGN" ],
                        [ "tanh", "TANH" ],
                        [ "selu", "SELU" ],
                        [ "elu", "ELU" ],
                        [ "exponential", "EXPONENTIAL" ],
                    ]
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "inputsInline": true,
            "colour": 230,
            "tooltip": "tooltip1",
            "helpUrl": ""
        },
        {
            "type": "cnn_model",
            "kind": "block",
            "message0": "Sequential Model %1 Layers: %2",
            "args0": [
                {
                    "type": "input_dummy"
                },
                {
                    "type": "input_statement",
                    "name": "layers",
                    "check": "Layer"
                }
            ],
            "colour": 120,
            "tooltip": "",
            "helpUrl": ""
        }
    ]);

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
    window.addEventListener('resize', onresize, false);
    Code.onresize();
}