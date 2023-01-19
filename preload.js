window.addEventListener('DOMContentLoaded', () => {
    console.log("Chromium version " + process.versions['chrome'])
    console.log("Node.js version " + process.versions['node'])
    console.log("Electron version " + process.versions['electron'])
    document.getElementById("back-button").addEventListener("click", () => {
        require('electron').ipcRenderer.send('go-to-home');
    });
    // document.getElementById("images-button").addEventListener("click", () => {
    //     // window.open("imagepopup.html", "name", 'height=200,width=400,scrollbars=yes')
    //     document.getElementById("")
    // });
    // document.getElementById("close-button").addEventListener("click", () => {
    //     closeImagePopup();
    // })
    document.getElementById("run-button").addEventListener("click", () => {
        exp();
    });
    blockly();
});

function exp() {
    let fs = require('fs');

}

function openImagePopup() {
    let idiv = document.getElementById("image-popup");
    idiv.style.visibility = "visible";
    idiv.style.pointerEvents = "all";
    idiv.style.zIndex = "101";
    document.getElementById("img-content").style.zIndex = "100";
}
function closeImagePopup() {
    let idiv = document.getElementById("image-popup");
    idiv.style.visibility = "hidden";
    idiv.style.pointerEvents = "none";
    document.getElementById("img-content").style.zIndex = "-5";
}

function blockly() {
    const Blockly = require('blockly');
    const javascriptGenerator = require('blockly/javascript');
    require('@blockly/field-slider');
    const blocklyArea = document.getElementById('blockly-container');
    const blocklyDiv = document.getElementById('blockly-div');

    Blockly.defineBlocksWithJsonArray([
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

    javascriptGenerator['conv2d'] = function(block) {
        var value_activation = Blockly.JavaScript.valueToCode(block, 'activation', Blockly.JavaScript.ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.Conv2D(activation=\'relu\'),\n';
        return code;
    };
    javascriptGenerator['maxpooling2d'] = function(block) {
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.MaxPooling2D(),\n';
        return code;
    };
    javascriptGenerator['flatten'] = function(block) {
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.Flatten(),\n';
        return code;
    };
    javascriptGenerator['dropout'] = function(block) {
        var value_rate = Blockly.JavaScript.valueToCode(block, 'rate', Blockly.JavaScript.ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = '\ttf.keras.layers.Dropout(' + value_rate + '),\n';
        return code;
    };
    javascriptGenerator['dense'] = function(block) {
        var num_neurons = Blockly.JavaScript.valueToCode(block, 'num_neurons', Blockly.JavaScript.ORDER_ATOMIC)
        var value_activation = Blockly.JavaScript.valueToCode(block, 'activation', Blockly.JavaScript.ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = '\tcode;\n';
        return code;
    };

    javascriptGenerator['cnn_model'] = function(block) {
        var statements_layers = Blockly.JavaScript.statementToCode(block, 'layers');
        var code = '...;\n';
        return code;
    };

    const workspace = Blockly.inject(blocklyDiv,
        {toolbox: toolbox});
    console.log(javascriptGenerator)
    const onresize = function(e) {
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
        Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', onresize, false);
    onresize();
}