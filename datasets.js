const path = require('path');
const fs = require('fs');
const {app} = require("electron");

class Dataset {
    numClasses;
    inputs;
    outputs;
     constructor() {
         this.inputs = [];
         this.outputs = [];
     }
}

class ImageDataset extends Dataset {
    #pathToDataset;
    constructor(pathToDataset) {
        super();
        this.#pathToDataset = pathToDataset;
    }

    async init() {
        let self = this;
        let imagesFolder = this.#pathToDataset;
        let folders = await fs.promises.readdir(imagesFolder);
        this.numClasses = folders.length;
        return new Promise(async (resolve) => {
            for (let i = 0;i < self.numClasses;i++) {
                const files = await fs.promises.readdir(path.join(imagesFolder, (i + 1).toString()));
                for (const file of files) {
                    await new Promise((resolve, reject) => {
                        const imagePath = path.join(imagesFolder, (i + 1).toString(), file);
                        self.inputs.push(imagePath);
                        self.outputs.push(i);
                        resolve();
                    });
                }

            }
            console.log("outputs: " + self.outputs)
            resolve([self.inputs, self.outputs]);
        });
    }

    getData() {
        return [this.inputs, this.outputs];
    }
}

class DefaultDataset extends Dataset { //for MNIST, CIFAR, ...

}

module.exports = {
    Dataset,
    ImageDataset,
    DefaultDataset
}