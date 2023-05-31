//const { MobileNetv3FeatureVectorModel, Sequential } = require("./models.js");
// const { ImageDataset, Dataset, DefaultDataset } = require("./datasets.js");
// const path = require('path');
let userDataPath = '/Users/williamli/Library/Application Support/blockai';
function logProgress(epoch, logs) {
    console.log('Data for epoch ' + epoch);
    console.log(logs);
}
var x, rand, pred;

function mathRandomInt(a, b) {
    if (a > b) {
        // Swap a and b to ensure a is smaller.
        var c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
}


x = (new MobileNetv3FeatureVectorModel([
    tf.layers.dense({units: 128, activation:  null}),
], 3));
x.init();
x.comp('adam');
x.trainWithPaths(new ImageDataset(path.join(userDataPath, 'images_folder')).init(), logProgress, 5, 10);
setInterval(async () => {
    rand = mathRandomInt(0, 2);
    pred = (x.picturePredict());
    if (rand == 0) {
        if (pred == 0) {
            console.log('Tie! Computer got rock and you gave rock')
        } else if (pred == 1) {
            console.log('You win! Computer got rock and you gave paper')
        } else {
            console.log('You lose! Computer got rock and you gave scissors')
        }
    }
    if (rand == 1) {
        if (pred == 0) {
            console.log('You lose! Computer got paper and you gave rock')
        } else if (pred == 1) {
            console.log('Tie! Computer got paper and you gave paper')
        } else {
            console.log('You win! Computer got paper and you gave scissors')
        }
    }
    if (rand == 2) {
        if (pred == 0) {
            console.log('You win! Computer got scissors and you gave rock')
        } else if (pred == 1) {
            console.log('You lose! Computer got scissors and you gave paper')
        } else {
            console.log('Tie! Computer got scissors and you gave scissors')
        }
    }
    console.log([pred,'<- pred   rand ->',rand].join(''))
}, 5000);