/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by William Li in 2023 to use Bootstrap Modals
 */

//Use Blockly2 instead of Blockly to avoid overriding the default Blockly which has the Javascript generators?
const Blockly2 = require('blockly');
let inp = document.getElementById("var-name"),
    cancel = document.getElementById("var-modal-cancel"),
    ok = document.getElementById("var-modal-okay");
let CustomModal = bootstrap.Modal.getOrCreateInstance("#var-modal");

CustomDialog = {};

/** Override Blockly.dialog.setAlert() with custom implementation. */
Blockly2.dialog.setAlert(function(message, callback) {
    console.log('Alert: ' + message);
    setTimeout(() => {
        CustomDialog.show('Alert', message, {
            onCancel: callback
        });
    }, 500);
});

/** Override Blockly.dialog.setConfirm() with custom implementation. */
Blockly2.dialog.setConfirm(function(message, callback) {
    console.log('Confirm: ' + message);
    CustomDialog.show('Confirm', message, {
        showOkay: true,
        onOkay: function() {
            callback(true);
        },
        showCancel: true,
        onCancel: function() {
            callback(false);
        }
    });
});

/** Override Blockly.dialog.setPrompt() with custom implementation. */
Blockly2.dialog.setPrompt(function(message, defaultValue, callback) {
    console.log('Prompt: ' + message);
    CustomDialog.show('Variable creation', message, {
        showInput: true,
        showOkay: true,
        onOkay: function() {
            callback(CustomDialog.inputField.value);
        },
        showCancel: true,
        onCancel: function() {
            callback(null);
        },
    });
    CustomDialog.inputField.value = defaultValue;
});

/** Hides any currently visible dialog. */
CustomDialog.hide = function() {
    CustomModal.hide();
};

/**
 * Shows the dialog.
 * Allowed options:
 *  - showOkay: Whether to show the OK button.
 *  - showCancel: Whether to show the Cancel button.
 *  - showInput: Whether to show the text input field.
 *  - onOkay: Callback to handle the okay button.
 *  - onCancel: Callback to handle the cancel button and backdrop clicks.
 */
CustomDialog.show = function(title, message, options) {
    CustomModal.show();
    if(options.showInput && inp.classList.contains('d-none')) inp.classList.remove('d-none');
    if(!options.showInput && !inp.classList.contains('d-none')) inp.classList.add('d-none');
    document.getElementById('var-form-msg').textContent = message;
    document.getElementById('var-modal-label').textContent = title;
    setTimeout(() => inp.focus(), 500);

    var onOkay = function(event) {
        CustomDialog.hide();
        options.onOkay && options.onOkay();
        event && event.stopPropagation();
    };
    var onCancel = function(event) {
        CustomDialog.hide();
        options.onCancel && options.onCancel();
        event && event.stopPropagation();
    };

    var dialogInput = inp;
    CustomDialog.inputField = dialogInput;
    if (dialogInput) {
        dialogInput.focus();

        dialogInput.onkeyup = function(event) {
            if (event.key === 'Enter') {
                // Process as OK when user hits enter.
                onOkay();
                return false;
            } else if (event.key === 'Escape')  {
                // Process as cancel when user hits esc.
                onCancel();
                return false;
            }
        };
    } else {
        let okay = document.getElementById('var-modal-okay');
        okay && okay.focus();
    }

    if(options.showOkay && ok.classList.contains('d-none')) ok.classList.remove('d-none');
    if(!options.showOkay && !ok.classList.contains('d-none')) ok.classList.add('d-none');
    options.showOkay ? ok.onclick = onOkay : null;

    if(options.showCancel && cancel.classList.contains('d-none')) cancel.classList.remove('d-none');
    if(!options.showCancel && !cancel.classList.contains('d-none')) cancel.classList.add('d-none');
    options.showCancel ? cancel.onclick = onCancel : null;

};