class Sequential {
    model;
    pClassNum;
    constructor(layers, classNum) {
        this.model = tf.sequential();
        for (let layer of layers) {
            this.model.add(layer);
        }
        this.pClassNum = classNum;
        // this.init();
    };

    async init () {
        //placeholder for initialization
    };

    async comp(uOptimizer) {
        await this.model.compile({
            optimizer: uOptimizer, //adam
            loss: (this.pClassNum === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
    }

    /**
     * trains model
     * @param inputs inputs as array of tensors
     * @param outputs outputs as vector
     * @param logProgress
     * @param mBatchSize
     * @param mEpochs
     * @returns {Promise<void>}
     */
    async train (inputs, outputs, logProgress, mBatchSize, mEpochs) {
        tf.util.shuffleCombo(inputs, outputs);
        let outputsAsTensor = tf.tensor1d(outputs, 'int32');
        let oneHotOutputs = tf.oneHot(outputs, classNum);
        let inputsAsTensor = tf.stack(inputs);

        let results = await this.model.fit(inputsAsTensor, oneHotOutputs, {
            shuffle: true, batchSize: mBatchSize, epochs: mEpochs,
            callbacks: {onEpochEnd: logProgress}
        });

        outputsAsTensor.dispose();
        oneHotOutputs.dispose();
        inputsAsTensor.dispose();
    };

    async predict(video) {
        return -1; //TODO
    }

    async picturePredict() {
        await navigator.permissions.query({name: 'camera'});
        let video = document.createElement("video");
        let self = this;
        return await navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
            video.srcObject = stream;
            video.play();
            return new Promise(async (resolve) => {
                video.addEventListener('loadeddata', async function () {
                    let ret = await self.predict(video);
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    video.srcObject = null;
                    // console.log(ret);
                    // console.log(ret.argMax().arraySync() + " " + Math.floor(ret.arraySync()[ret.argMax().arraySync()] * 100))
                    resolve(ret);
                });
            });
        }, err => {
            console.log(err);
            return null;
        });
    }
}
class MobileNetv3FeatureVectorModel extends Sequential {
    mobilenet;
    MOBILE_NET_INPUT_HEIGHT = 224;
    MOBILE_NET_INPUT_WIDTH = 224;
    mobilenet_url = "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";
    constructor(layers, classNum) {
        layers.unshift(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
        layers.push(tf.layers.dense({units: classNum, activation: 'softmax'}));
        //first layer must have input size of 1024 - output from mobilenet
        //last layer must have output size of classNum
        super(layers, classNum);
    };

    async init() {
        await super.init();
        this.mobilenet = await tf.loadGraphModel(this.mobilenet_url, {fromTFHub: true});
    };

    async comp(uOptimizer) {
        await super.comp(uOptimizer);
        //placeholder for any specific compilation needs
    }

    /**
     *
     * @param res an array with two elements - first one is an array with paths of images, second one is class #
     * @param logProgress
     * @param mBatchSize
     * @param mEpochs
     * @returns {Promise<void>}
     */
    async trainWithPaths (res, logProgress, mBatchSize, mEpochs) {
        let inputs = [], outputs = [];
        let inputPaths = res[0];
        let self = this;
        // console.log(res);
        for (let imgPath in inputPaths) {
            await new Promise((resolve, reject) => {
                let img = new Image();
                img.src = inputPaths[imgPath];
                img.onload = () => {
                    let imageFeatures = tf.tidy(function () {
                        let videoFrameAsTensor = tf.browser.fromPixels(img);
                        let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [self.getMobileNetHeight(),
                            self.getMobileNetWidth()], true);
                        let normalizedTensorFrame = resizedTensorFrame.div(255);
                        return self.mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
                    });
                    inputs.push(imageFeatures);
                    resolve();
                }
            })
        }
        outputs = res[1];
        tf.util.shuffleCombo(inputs, outputs);
        let outputsAsTensor = tf.tensor1d(outputs, 'int32');
        let oneHotOutputs = tf.oneHot(outputs, self.pClassNum);
        let inputsAsTensor = tf.stack(inputs);

        let results = await this.model.fit(inputsAsTensor, oneHotOutputs, {
            shuffle: true, batchSize: mBatchSize, epochs: mEpochs,
            callbacks: {onEpochEnd: logProgress}
        });

        outputsAsTensor.dispose();
        oneHotOutputs.dispose();
        inputsAsTensor.dispose();
    };

    async predict (video) {
        let self = this;
        return tf.tidy(function () {
            let videoFrameAsTensor = tf.browser.fromPixels(video).div(255);
            let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor,
                [self.getMobileNetHeight(), self.getMobileNetWidth()], true);

            let imageFeatures = self.mobilenet.predict(resizedTensorFrame.expandDims());
            let prediction = self.model.predict(imageFeatures).squeeze();
            let highestIndex = prediction.argMax().arraySync();
            let predictionArray = prediction.arraySync();
            // prediction is classNames[highestIndex] name with prediction.arraySync()[highestIndex] confidence
            return prediction;
        });
    };

    getMobileNetHeight = () => {
        return this.MOBILE_NET_INPUT_HEIGHT;
    };

    getMobileNetWidth = () => {
        return this.MOBILE_NET_INPUT_WIDTH;
    };
}

module.exports = {
    MobileNetv3FeatureVectorModel,
    Sequential
};

