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

const blocks = [
    //Data
    {
        "type": "loadset",
        "kind": "block",
        "message0": "Load Dataset:  %1 %2",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "dataset",
                "check": "dataset"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "This will load a dataset so that you can use it later. ",
        "helpUrl": ""
    },
    {
        "type": "heatmap",
        "message0": "Show a heatmap",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "A heatmap is an image that will show you which areas of your pictures are the most influential in determining what classes your pictures are. ",
        "helpUrl": ""
    },
    {
        "type": "usedata",
        "kind": "block",
        "message0": "Use Dataset:  %1 %2",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "dataset",
                "check": "dataset"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "Use this dataset to train your model. ",
        "helpUrl": ""
    },

    //Datasets
    {
        "type": "cifar_10",
        "message0": "CIFAR-10",
        "output": null,
        "colour": 180,
        "tooltip": "CIFAR-10 is a common dataset used, usually as a benchmark or for research, with 10 different classes representing everyday objects, including cars, birds, airplanes, and more. ",
        "helpUrl": ""
    },
    {
        "type": "mnist",
        "message0": "MMIST",
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

    //Data Evaluation

    //Layers
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
        "tooltip": "Conv2D is a layer used in ",
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
        "type": "mobilenet",
        "message0": "Pretrained Feature Vectors #1 - Fast (Mobilenet v3)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    },

    //Models
    {
        "type": "cnn_model",
        "kind": "block",
        "message0": "Sequential Model %1 Optimizer: %2 %3 Epochs: %4 %5 Layers: %6",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_dropdown",
                "name": "activation",
                "options": [
                    [ "adam", "ADAM" ],
                    [ "adadelta", "ADADELTA" ],
                    [ "adagrad", "ADAGRAD" ],
                    [ "adamax", "ADAMAX" ],
                    [ "ftrl", "FTRL" ],
                    [ "nadam", "NADAM" ],
                    [ "optimizer", "OPTIMIZER" ],
                    [ "rmsprop", "RMSPROP" ],
                    [ "sgd", "SGD" ],
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_slider",
                "name": "rate",
                "value": 10,
                "min": 1,
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "mobilenet_model",
        "kind": "block",
        "message0": "MobileNet v3 Classification Model %1 Layers: %2",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "",
        "helpUrl": ""
    },

    //Prediction
    {
        "type": "prediction-data",
        "message0": "Try out your new model on sample data",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 285,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "prediction-webcam",
        "message0": "Try out your new model on video from your webcam",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 285,
        "tooltip": "",
        "helpUrl": ""
    },
]