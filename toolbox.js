const toolbox = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Data",
            contents: [
                {
                    "type": "loadset",
                    "kind": "block",
                },
                {
                    "type": "heatmap",
                    "kind": "block",
                }
            ]
        },
        {
            "kind": "category",
            "name": "Datasets",
            contents: [
                {
                    "type": "cifar_10",
                    "kind": "block",
                },
                {
                    "type": "mnist",
                    "kind": "block",
                }
            ]
        },
        {
            "kind": "category",
            "name": "Models",
            contents: [
                {
                    "type": "cnn_model",
                    "kind": "block",
                }
            ]
        },
        {
            "kind": "category",
            "name": "Layers",
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
                    "kind": "block",
                    "type": "controls_if"
                }
            ]
        }
    ]
};