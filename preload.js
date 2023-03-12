/**
 * namespace for code
 */
let Code = {};
//state is 0 when in workspace, 1 when in training state
let state = 0;
const { app, ipcRenderer, systemPreferences } = require('electron');
const fs = require('fs');
const path = require("path");
let classNum = 2, carousel, webcamCarousel, status;
let tfLoaded = false;
let modelTrained = false;
let trainingDataInputs, trainingDataOutputs;
let mobilenet, model;
let predict = -1;
let video, video2;
const mobilenet_url = "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";
// const userData = app.getPath('userData');

const MOBILE_NET_INPUT_HEIGHT = 224, MOBILE_NET_INPUT_WIDTH = 224;
let classNames = ["Class 1", "Class 2"];
let currWebcamImageCount = 0;

// Code.url = "http://www.blockai.great-site.net";

//TODO: building
/*
1. load tfjs
2. load mobilenet
3.

Later:
change to actual js loaded not placeholder
image carousel cycle
progress bar
cards: 1 for architecture, another for graphs (tfvis)
*/

window.addEventListener('DOMContentLoaded', () => {
    video = document.getElementById("webcam");
    video2 = document.getElementById("webcam-predict");
    carousel = new bootstrap.Carousel('#carousel');
    // webcamCarousel = new bootstrap.Carousel('#webcam-carousel');
    status = document.getElementById("status");
    console.log("Chromium version " + process.versions['chrome'])
    console.log("Node.js version " + process.versions['node'])
    console.log("Electron version " + process.versions['electron'])
    document.getElementById("back-button").addEventListener("click", () => {
        Code.back();
    });

    document.getElementById("run-confirm-yes").addEventListener("click", () => {
        carousel.next();
        let starting = document.createElement("div");
        starting.textContent = "Starting up..."
        starting.id = "startup";
        document.getElementById("status").appendChild(starting);
        window.console.log = function(str) {
            let node = document.createElement("div");
            if (typeof str == 'object') {
                node.innerHTML += (JSON && JSON.stringify ? JSON.stringify(str, null, 2) : str);
            }
            else {
                node.innerHTML += str;
            }
            // node.textContent = (typeof str == 'object') ? (JSON && JSON.stringify ? JSON.stringify(str) : str) : str;
            let status = document.getElementById("status");
            status.appendChild(node);
            status.scrollTop = status.scrollHeight;
        }
        state = 1;
        if(!tfLoaded) {
            let tfscript = document.createElement("script");
            tfscript.onload = function() {
                tfLoaded = true;
                console.log("Loaded TF script");
                Code.loadTensorflow();
            }
            console.log("loading tf script");
            tfscript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js";
            document.getElementById("build-content").appendChild(tfscript);
        }

        console.log("tf script loaded? " + tfLoaded);
        document.getElementById('run-button').classList.add('d-none');
        document.getElementById('images-button').classList.add('d-none');

        // Code.exp();
    });

    document.getElementById("images-upload-yes").addEventListener("click", async () => {
        await Code.uploadImages();
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
        Code.loadImagesPreview();
    });

    document.getElementById("images-preview").addEventListener("hidden.bs.modal", () => {
        Code.unloadImagesPreview();
    });

    document.getElementById("images-preview-no").addEventListener("click", () => {
        ipcRenderer.send('delete-temp');
    });

    document.getElementById("capture-webcam").addEventListener("click", () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        console.log(video.offsetHeight + " " + video.offsetWidth)
        ctx.drawImage(video, 0, 0, 800, 800, 0, 0 ,224, 224); //??
        // console.log(video.naturalWidth + " " + video.naturalHeight);
        let img = canvas.toDataURL("image/png");
        // console.log(img);
        ipcRenderer.send('ensure-folder');
        ipcRenderer.send('webcam-temp', img);
    });

    document.getElementById("images-webcam-next").addEventListener("click", () => {
        // document.getElementById("images-webcam-next").classList.add("d-none");
        // document.getElementById("webcam-upload-confirm").classList.remove("d-none");
        // document.getElementById("webcam-back").classList.remove("d-none");
        let loading = document.createElement("p");
        loading.id = "loading-preview";
        loading.textContent = "Loading...";
        document.getElementById("image-preview-container").appendChild(loading);
        console.log("next");
        let previewModal = new bootstrap.Modal(document.getElementById('images-preview'), {});
        previewModal.show();
    });

    document.getElementById("webcam-confirm-back").addEventListener("click", () => {
        document.getElementById("images-webcam-next").classList.remove("d-none");
        document.getElementById("webcam-upload-confirm").classList.add("d-none");
        document.getElementById("webcam-back").classList.add("d-none");
        console.log("prev");
        // webcamCarousel.prev();
    });

    document.getElementById("upload1").addEventListener("click", () => {
        ipcRenderer.invoke('temp-to-image', ["1"]).then(() => ipcRenderer.send("delete-temp"));
        let imageModal = new bootstrap.Modal(document.getElementById('images-modal'), {});
        imageModal.show();
    });

    document.getElementById("upload2").addEventListener("click", () => {
        ipcRenderer.invoke('temp-to-image', ["2"]).then(() => ipcRenderer.send("delete-temp"));
        let imageModal = new bootstrap.Modal(document.getElementById('images-modal'), {});
        imageModal.show();
    });

    document.getElementById("enable-cam-predict").addEventListener("click", () => {
        if(predict === -1) {
            predict = 1;
            Code.predictLoop();
        }
        else {
            predict = -1;
        }
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

ipcRenderer.on('call-preview-image', (event, args) => {
    //todo change unload as well
    const newDiv = document.createElement("div");
    newDiv.classList.add('image-div');

    newDiv.style.maxWidth = "100px";
    newDiv.style.maxHeight = "100px";

    const imgNode = document.createElement("img");
    imgNode.src = args[0];
    imgNode.classList.add('image-cont');

    const deleteNode = document.createElement("button");
    deleteNode.innerHTML = '<img src="./images/delete-trash.png" class="image-delete"/>';
    deleteNode.classList.add('btn');
    // deleteNode.classList.add('btn-outline-danger');
    deleteNode.classList.add('delete-button');
    // deleteNode.classList.add('d-none')

    imgNode.addEventListener("mouseover", () => {
        // deleteNode.classList.remove('d-none')
    });
    imgNode.addEventListener("mouseout", () => {
        // deleteNode.classList.add('d-none')
    });

    deleteNode.addEventListener("mouseover", () => {
        // deleteNode.classList.remove('d-none')
    });
    deleteNode.addEventListener("mouseout", () => {
        // deleteNode.classList.add('d-none')
    });

    newDiv.appendChild(imgNode);
    newDiv.appendChild(deleteNode);
    let item = document.createElement("li");
    item.appendChild(newDiv);
    item.classList.add("image-item");
    document.getElementById('image-list-preview').appendChild(item);

    deleteNode.addEventListener("click", () => {
        item.remove();
        fs.unlinkSync(args[0]);
        console.log("removing " + args[0]);
    });
});

ipcRenderer.on('accordion-add', (event, args) => {
     let accordionItem = document.createElement("div");
     let heading = document.createElement("h2");
     let button = document.createElement("button");
     let collapse = document.createElement("div");
     let accbody = document.createElement("div");
     let list = document.createElement("ol");
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
     accbody.classList.add('accordion-image-body');
     heading.id = "heading" + args;
     button.id = "button" + args;
     button.textContent = "Class " + args;
     collapse.id = "collapse" + args;
     accbody.id = "accordion-body" + args;
     list.id = "image-list" + args;
     list.classList.add("image-list");
     accbody.appendChild(list);
     heading.appendChild(button);
     collapse.appendChild(accbody);
     accordionItem.appendChild(heading);
     accordionItem.appendChild(collapse);
     document.getElementById('images-accordion').appendChild(accordionItem);
});

ipcRenderer.on('call-display-image', (event, args) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add('image-div');

    newDiv.style.maxWidth = "100px";
    newDiv.style.maxHeight = "100px";

    const imgNode = document.createElement("img");
    imgNode.src = args[0];
    imgNode.classList.add('image-cont');

    const deleteNode = document.createElement("button");
    deleteNode.innerHTML = '<img src="./images/delete-trash.png" class="image-delete"/>';
    deleteNode.classList.add('btn');
    // deleteNode.classList.add('btn-outline-danger');
    deleteNode.classList.add('delete-button');
    // deleteNode.classList.add('d-none')

    imgNode.addEventListener("mouseover", () => {
        // deleteNode.classList.remove('d-none')
    });
    imgNode.addEventListener("mouseout", () => {
        // deleteNode.classList.add('d-none')
    });

    deleteNode.addEventListener("mouseover", () => {
        // deleteNode.classList.remove('d-none')
    });
    deleteNode.addEventListener("mouseout", () => {
        // deleteNode.classList.add('d-none')
    });

    newDiv.appendChild(imgNode);
    newDiv.appendChild(deleteNode);
    let item = document.createElement("li");
    item.appendChild(newDiv);
    item.classList.add("image-item");
    document.getElementById(('image-list' + args[1].toString())).appendChild(item);

    deleteNode.addEventListener("click", () => {
        item.remove();
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
});

ipcRenderer.on('image-to-model', async (event, args) => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = args[0];
        img.onload = async () => {
            const a = tf.browser.fromPixels(img);
            await trainingDataInputs.push(a);
            await trainingDataOutputs.push(args[1]);
            resolve();
        }
    })
});

Code.loadTensorflow = async function() {
    //TODO
    mobilenet = await tf.loadGraphModel(mobilenet_url, {fromTFHub: true});
    console.log("Loaded Mobilenet v3");
    //warm up the model (??) by passing it through zeros
    tf.tidy(function () {
        let answer = mobilenet.predict(tf.zeros([1, 224, 224, 3]));
        console.log(answer.shape);
    });
    model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
    model.add(tf.layers.dense({units: classNum, activation: 'softmax'}));
    await model.compile({
        optimizer: 'adam',
        loss: (classNum === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    await Code.trainAndPredict();
}

Code.trainAndPredict = async function() {
    ipcRenderer.send('ensure-folder');

    trainingDataInputs = [];
    trainingDataOutputs = [];
    let res = await ipcRenderer.invoke('load-images-to-model');
    let inputPaths = res[0];
    for(let imgPath in inputPaths) {
        await new Promise((resolve, reject) => {
            let img = new Image();
            img.src = inputPaths[imgPath];
            img.onload = () => {
                let imageFeatures = tf.tidy(function() {
                    let videoFrameAsTensor = tf.browser.fromPixels(img);
                    let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT,
                        MOBILE_NET_INPUT_WIDTH], true);
                    let normalizedTensorFrame = resizedTensorFrame.div(255);
                    return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
                });
                trainingDataInputs.push(imageFeatures);
                resolve();
            }
        })
    }
    trainingDataOutputs = res[1];

    ipcRenderer.send('done-loading-?');
    tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
    let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
    let oneHotOutputs = tf.oneHot(outputsAsTensor, classNum);
    let inputsAsTensor = tf.stack(trainingDataInputs);

    let results = await model.fit(inputsAsTensor, oneHotOutputs, {
        shuffle: true, batchSize: 5, epochs: 10,
        callbacks: {onEpochEnd: logProgress}
    });

    outputsAsTensor.dispose();
    oneHotOutputs.dispose();
    inputsAsTensor.dispose();
    modelTrained = true;
    console.log("Ready to Predict!");
    document.getElementById("enable-cam-predict").classList.remove("disabled");
    document.getElementById("card-train").classList.remove("border-success");
    document.getElementById("card-predict").classList.add("border-success");
}

Code.back = function() {
    if(!state) {
        require('electron').ipcRenderer.send('go-to-home');
    }
    else {
        carousel.prev();
        state = 0;
        document.getElementById('run-button').classList.remove('d-none');
        document.getElementById('images-button').classList.remove('d-none');
    }
}

Code.unloadImages = function() {
    var imageContainer = document.getElementById('image-container').children;

    while(imageContainer.length) {
        imageContainer[0].remove();
    }
};

Code.unloadImagesPreview = function() {
    let imageListPreview = document.getElementById('image-list-preview').children;
    while(imageListPreview.length) {
        imageListPreview[0].remove();
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
    console.log("loadImagesPreview")
    ipcRenderer.send('load-preview');
}

Code.uploadImages = async function(method) {
    ipcRenderer.send('image-upload');
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
        do {
            x += element.offsetLeft;
            element = element.offsetParent;
        } while (element);
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = '0px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Code.Blockly.svgResize(Code.workspace);
    };
    window.addEventListener('resize', Code.onresize, false);
    Code.onresize();
}

Code.predictLoop = function () {
    if(predict === 1) {
        if (document.getElementById("webcam-predict").getAttribute("playing") === "true") {
            tf.tidy(function () {
                let videoFrameAsTensor = tf.browser.fromPixels(video2).div(255);
                let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT,
                    MOBILE_NET_INPUT_WIDTH], true);

                let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
                let prediction = model.predict(imageFeatures).squeeze();
                let highestIndex = prediction.argMax().arraySync();
                let predictionArray = prediction.arraySync();
                document.getElementById("prediction").innerText = 'Prediction: ' + classNames[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
            });
        }
        window.requestAnimationFrame(Code.predictLoop);
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function logProgress(epoch, logs) {
    console.log('Data for epoch ' + epoch);
    console.log(logs);
}