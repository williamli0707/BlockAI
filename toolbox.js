const toolbox = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Data",
            "colour": "0",
            contents: [
                {
                    "type": "loadset",
                    "kind": "block",
                },
                {
                    "type": "heatmap",
                    "kind": "block",
                },
                {
                    "type": "usedata",
                    "kind": "block",
                },
            ]
        },
        {
            "kind": "category",
            "name": "Datasets",
            "colour": "180",
            contents: [
                {
                    "type": "cifar_10",
                    "kind": "block",
                },
                {
                    "type": "mnist",
                    "kind": "block",
                },
                {
                    "type": "userdata",
                    "kind": "block",
                },
            ]
        },
        {
            "kind": "category",
            "name": "Models",
            "colour": "120",
            contents: [
                {
                    "type": "cnn_model",
                    "kind": "block",
                },
                {
                    "type": "mobilenet_model",
                    "kind": "block",
                },
            ]
        },
        {
            "kind": "category",
            "name": "Layers",
            "colour": "230",
            contents: [
                {
                    "type": "conv2d",
                    "kind": "block",
                },
                {
                    "type": "maxpooling2d",
                    "kind": "block",
                },
                {
                    "type": "flatten",
                    "kind": "block",
                },
                {
                    "type": "dropout",
                    "kind": "block"
                },
                {
                    "type": "dense",
                    "kind": "block",
                },
                {
                    "type": "mobilenet",
                    "kind": "block",
                },
            ]
        },
        {
            "kind": "category",
            "name": "Prediction",
            "colour": "285",
            contents: [
                {
                    "type": "prediction-data",
                    "kind": "block",
                },
                {
                    "type": "prediction-webcam",
                    "kind": "block",
                },
            ]
        }
    ]
};