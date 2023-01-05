const Blockly = require("blockly");
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    console.log("Chromium version " + process.versions['chrome'])
    console.log("Node.js version " + process.versions['node'])
    console.log("Electron version " + process.versions['electron'])

    const Blockly = require('blockly');
    const toolbox = {
        "kind": "flyoutToolbox",
        "contents": [
            {
                "kind": "block",
                "type": "controls_if"
            },
            {
                "kind": "block",
                "type": "controls_repeat_ext"
            },
            {
                "kind": "block",
                "type": "logic_compare"
            },
            {
                "kind": "block",
                "type": "math_number"
            },
            {
                "kind": "block",
                "type": "math_arithmetic"
            },
            {
                "kind": "block",
                "type": "text"
            },
            {
                "kind": "block",
                "type": "text_print"
            },
        ]
    };
    const workspace = Blockly.inject('blockly-div', {toolbox: toolbox});
})