//const { MobileNetv3FeatureVectorModel, Sequential } = require("./models.js");
const { ImageDataset, Dataset, DefaultDataset } = require("./datasets.js");
const path = require('path');
let userDataPath = '/Users/williamli/Library/Application Support/blockai';
function logProgress(epoch, logs) {
    console.log('Data for epoch ' + epoch);
    console.log(logs);
}
var m;


m = (new MobileNetv3FeatureVectorModel([
], 2));
await m.init();
await m.comp('adam');
await m.trainWithPaths(await new ImageDataset(path.join(userDataPath, 'images_folder')).init(), logProgress, 5, 10);
setInterval(() => {
    console.log(m.picturePredict())
}, 1000);