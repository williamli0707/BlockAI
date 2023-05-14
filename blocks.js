// import '@blockly/field-slider';

/*
Data processing:
    Blocks that allow users to input, pre-process, and visualize data. For example,
    a "Load Data" block that enables users to upload and preprocess a dataset, or a
    "Visualize Data" block that generates charts or graphs to help users better
    understand their data.

Model building:
    Blocks that allow users to build and train models. For example, a "Build Model"
    block that allows users to specify the layers, activation functions, and
    optimization algorithms for their neural network, or a "Train Model" block that
    trains the model on a given dataset.

Model evaluation:
    Blocks that allow users to evaluate the performance of their model. For example,
    an "Evaluate Model" block that calculates metrics such as accuracy or F1 score,
    or a "Visualize Model Performance" block that generates visualizations of the
    model's predictions.

Decision-making:
    Blocks that allow users to make predictions using their trained model. For example,
    a "Make Prediction" block that takes in input data and outputs a predicted value or
    class, or a "Deploy Model" block that exports the trained model for use in a
    production environment.

*Prediction - predict some data from either test dataset, or have user upload data to
    predict
*/

/*
Color:
    Data: 0 degrees (~red)
    Training: 45 degrees (green brown)
    Dataset: 180 degrees (aqua)
    Model: 120 degrees (green)
    Layer: 230 degrees (blue)
    Prediction: 285 degrees (magenta)
*/

/*
//TODO: categories
Data
1. Loading dataset (need dataset blocks including default (CIFAR-10, MNIST), TODO need own dataset blocks)
2. Data processing: Normalization (cropping/stretching?), pixel scaling (size?), random cropping/stretching
3. Data visualization:
    - Pre training: Image gallery
    - Post training: Confusion matrix, Class activation map, Heatmap

Datasets
1. Ability to use own dataset

Model:
1. More models?

Layer:
1. More layers

*/

const {javascriptGenerator} = require("blockly/javascript");
const {MobileNetv3FeatureVectorModel} = require("./models");
const blocks = [
    //Data
    {
        "type": "heatmap",
        "message0": "Show a heatmap (to be implemented)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "",
        "helpUrl": ""
    },

    //Training
    {
        "type": "m_init",
        "message0": "Initialize model %1",
        "args0": [
            {
                "type": "input_value",
                "name": "model",
                "check": "model"
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "This will load a dataset so that you can use it later. ",
        "colour": 45,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "compile",
        "message0": "Compile model %1 with optimizer %2",
        "args0": [
            {
                "type": "input_value",
                "name": "model",
                "check": "model"
            },
            {
                "type": "field_dropdown",
                "name": "optimizer",
                "options": [
                    [ "adam (recommended)", "'adam'" ],
                    [ "adamw", "'adamw'" ],
                    [ "adadelta", "'adadelta'" ],
                    [ "adagrad", "'adagrad'" ],
                    [ "adamax", "'adamax'" ],
                    [ "adafactor", "'adafactor'" ],
                    [ "ftrl", "'ftrl'" ],
                    [ "nadam", "'nadam'" ],
                    [ "rmsprop", "'rmsprop'" ],
                    [ "sgd", "'sgd'" ],
                ]
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "A heatmap is an image that will show you which areas of your pictures are the most influential in determining what classes your pictures are. ",
        "helpUrl": ""
    },
    {
        "type": "train",
        "message0": "Train model %1 on dataset %2 with %3 epochs",
        "args0": [
            {
                "type": "input_value",
                "name": "model",
                "check": "model"
            },
            {
                "type": "input_value",
                "name": "dataset",
                "check": "dataset"
            },
            {
                "type": "field_number",
                "name": "epochs",
                "value": 10,
                "min": 1,
                "max": 100,
                "precision": 1
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Use this dataset to train your model. ",
        "helpUrl": ""
    },

    //Datasets
    {
        "type": "cifar_10",
        "message0": "CIFAR-10 (to be implemented)",
        "output": null,
        "colour": 180,
        "tooltip": "CIFAR-10 is a common dataset used, usually as a benchmark or for research, with 10 different classes representing everyday objects, including cars, birds, airplanes, and more. ",
        "helpUrl": ""
    },
    {
        "type": "mnist",
        "message0": "MNIST (to be implemented)",
        "output": null,
        "colour": 180,
        "tooltip": "MNIST is another common dataset used, like CIFAR-10, as a benchmark or for research. MNIST is a dataset with 10 classes, each representing a digit from 1-10. Each class contains images of handwritten digits. ",
        "helpUrl": ""
    },
    {
        "type": "userdata",
        "message0": "My Dataset 1",
        "output": null,
        "colour": 180,
        "tooltip": "This is the dataset that you create in the Images tab. ",
        "helpUrl": ""
    },

    //Layers
    {
        "type": "conv2d",
        "kind": "block",
        "message0": "Conv2D %1 Activation %2 (Untested)",
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
        "tooltip": "Conv2D is a layer used in ",
        "helpUrl": ""
    },
    {
        "type": "maxpooling2d",
        "kind": "block",
        "message0": "MaxPooling2D (Untested)",
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
        "message0": "Flatten (Untested)",
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
        "message0": "Dropout %1 Rate %2 (Untested)",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_number",
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
                "value": 64,
                "min": 1,
                "max": 5000,
                "precision": 1,
            },
            {
                "type": "field_dropdown",
                "name": "activation",
                "options": [
                    [ "relu", "'relu'" ],
                    [ "sigmoid", "'sigmoid'" ],
                    [ "softmax", "'softmax'" ],
                    [ "softplus", "'softplus'" ],
                    [ "softsign", "'softsign'" ],
                    [ "tanh", "'tanh'" ],
                    [ "selu", "'selu'" ],
                    [ "elu", "'elu'" ],
                    [ "exponential", "'exponential'" ],
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

    //Models
    {
        "type": "cnn_model",
        "kind": "block",
        "message0": "new Sequential Model %1 Number of classes: %2 %3 Layers: %4 (Incomplete)",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_number",
                "name": "num_classes",
                "value": 2,
                "min": 2,
                "max": 100,
                "precision": 1
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "layers",
                "check": "Layer"
            }
        ],
        "output": null,
        "colour": 120,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "mobilenet_model",
        "kind": "block",
        "message0": "new MobileNet Classification Model %1 Number of classes: %2 %3 Layers: %4",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_number",
                "name": "num_classes",
                "value": 2,
                "min": 2,
                "max": 100,
                "precision": 1
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "layers",
                "check": "Layer"
            }
        ],
        "output": null,
        "colour": 120,
        "tooltip": "",
        "helpUrl": ""
    },

    //Prediction
    {
        "type": "prediction-data",
        "message0": "Test your model on sample data (to be implemented)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 285,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "prediction-webcam-live",
        "message0": "Test your model with your webcam (to be implemented)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 285,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "prediction-webcam",
        "message0": "Get a prediction from model %1 from your webcam",
        "args0": [
            {
                "type": "input_value",
                "name": "model",
                "check": "model"
            },
        ],
        "output": null,
        "colour": 285,
        "tooltip": "Will return 1, 2, ... based on what class number the model thinks your webcam is showing. ",
        "helpUrl": ""
    },

    //Placeholders
    {
        "type": "placeholder",
        "message0": "More to come!",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "",
        "helpUrl": ""
    },

    //Misc
    {
        "type": "print",
        "message0": "Print: %1",
        "args0": [
            {
                "type": "input_value",
                "name": "stuff",
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "display",
        "message0": "Display: %1",
        "args0": [
            {
                "type": "input_value",
                "name": "stuff",
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "repeat_time",
        "message0": "Repeat every %1 seconds %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "interval",
                "check": "Number"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "procedure",
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "",
        "helpUrl": ""
    },
]

javascriptGenerator['heatmap'] = function(block) {
    //TODO
    return "// heatmap placeholder \n";
};

javascriptGenerator['m_init'] = function(block) {
    let value_model = javascriptGenerator.valueToCode(block, 'model', Blockly.JavaScript.ORDER_NONE);
    return "await " + value_model + ".init();\n";
};

javascriptGenerator['train'] = function(block) {
    let value_model = javascriptGenerator.valueToCode(block, 'model', Blockly.JavaScript.ORDER_NONE);
    let value_dataset = javascriptGenerator.valueToCode(block, 'dataset', Blockly.JavaScript.ORDER_NONE);
    let value_epochs = block.getFieldValue('epochs');
    return "await " + value_model + ".trainWithPaths(" + value_dataset + ", logProgress, 5, " + value_epochs + ");\n";
};

javascriptGenerator['compile'] = function(block) {
    let value_model = javascriptGenerator.valueToCode(block, 'model', Blockly.JavaScript.ORDER_NONE);
    let value_optimizer = block.getFieldValue('optimizer');
    return "await " + value_model + ".comp(" + value_optimizer + ");\n";
};

javascriptGenerator['cifar-10'] = function(block) {
    //TODO
    return ["// cifar-10 placeholder\n", Blockly.JavaScript.ORDER_NONE];
};

javascriptGenerator['mnist'] = function(block) {
    //TODO
    return ["// mnist placeholder\n", Blockly.JavaScript.ORDER_NONE];
};

javascriptGenerator['userdata'] = function(block) {
    return ["await new ImageDataset(path.join(userDataPath, 'images_folder')).init()", Blockly.JavaScript.ORDER_NONE]; //TODO classnum
};

javascriptGenerator['conv2d'] = function(block) {
    let value_activation = block.getFieldValue('activation');
    return "tf.layers.conv2d({activation: " + value_activation + "}),\n"; //TODO test: is kernel size, input shape required?
};

javascriptGenerator['maxpooling2d'] = function(block) {
    return "tf.layers.maxPooling2d(),\n";
}

javascriptGenerator['flatten'] = function(block) {
    return "tf.layers.flatten(),\n";
}

javascriptGenerator['dropout'] = function(block) {
    let value_rate = block.getFieldValue('rate');
    return "tf.layers.dropout({rate: " + value_rate + "}),\n";
};

javascriptGenerator['dense'] = function(block) {
    let value_neurons = block.getFieldValue('num_neurons');
    let value_activation = block.getFieldValue('num_activation');
    return "tf.layers.dense({units: " + value_neurons + ", activation:  " + value_activation + "}),\n";
};

javascriptGenerator['cnn_model'] = function(block) {
    let value_classes = block.getFieldValue('num_classes');
    let value_statement = javascriptGenerator.statementToCode(block, 'layers');
    return ["new Sequential([\n" + value_statement + "], " + value_classes + ")", Blockly.JavaScript.ORDER_NONE];
}

javascriptGenerator['mobilenet_model'] = function(block) {
    let value_classes = block.getFieldValue('num_classes');
    let value_statement = javascriptGenerator.statementToCode(block, 'layers');
    return ["new MobileNetv3FeatureVectorModel([\n" + value_statement + "], " + value_classes + ")", Blockly.JavaScript.ORDER_NONE];
}

javascriptGenerator['prediction-data'] = function(block) {
    //TODO
    return "";
}

javascriptGenerator['prediction-webcam-live'] = function(block) {
    //TODO
    return "";
}

javascriptGenerator['prediction-webcam'] = function(block) {
    let value_model = javascriptGenerator.valueToCode(block, 'model', Blockly.JavaScript.ORDER_NONE);
    return [value_model + ".picturePredict()", Blockly.JavaScript.ORDER_NONE];
}

javascriptGenerator['print'] = function(block) {
    let value_stuff = javascriptGenerator.valueToCode(block, 'stuff', Blockly.JavaScript.ORDER_NONE);
    return "console.log(" + value_stuff + ")\n";
}

javascriptGenerator['display'] = function(block) {
    let value_stuff = javascriptGenerator.valueToCode(block, 'stuff', Blockly.JavaScript.ORDER_NONE);
    return ""; //TODO
}

javascriptGenerator['repeat_time'] = function(block) {
    let value_int = javascriptGenerator.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_NONE) * 1000;
    let procedure = javascriptGenerator.statementToCode(block, 'procedure');
    return "setInterval(() => {\n" + procedure + "}, " + value_int + ");\n";
}

javascriptGenerator.addReservedWords("dataPath, MobileNetv3FeatureVectorModel, Sequential, ImageDataset, Dataset, " +
    "DefaultDataset, model, predict, video, video2, classNum, carousel, status, tfLoaded, modelTrained, ipcRenderer, " +
    "fs, path, Code, state");