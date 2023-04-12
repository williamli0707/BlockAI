let questions = [
    "What am I doing in this project? ",
    "What is a Neural Network? ",
    "What are layers? ",
    "What is transfer learning? ",
    "What is overfitting/underfitting? ",
    "How do I get pictures? ",
    "What can I do with AI? ",
];
let answers = [
    "This project is an image classification project. You'll use a  Neural Network to predict" +
        " which class an image belongs to. ",
    "A Neural Network is a type of AI. It is commonly represented as a bunch of layers. Neural networks are " +
        "usually used in situations like image classification. ",
    "Layers are parts of a neural network. They take information given to them, change them in some " +
        "way, and then pass it on to the next layer. Layers are important to AI because in our neural network, " +
        "for example, each layer will do different things which can change what output the model gives. " +
        "\nSome common examples of layers are: " +
        "\n    • Convolutional layer: Convolutional layers consist of a bunch of neurons, or pieces of the " +
        "input given to them. Neurons in these layers will connect to neurons in the next layer, and each " +
        "neuron will have a weight which determines how important it is in predicting which class an image " +
        "belongs to. When the neural network trains itself, it will figure out which pieces of the image " +
        "are more important to the final result and adjust the weights accordingly. Stacking convolutional " +
        "layers is a common way to classify images. Early layers can learn things like lines, and later layers " +
        "can even learn how to distinguish shapes or objects. " +
        "\n    • Pooling Layer: Pooling layers can simplify the input given to them. This is especially " +
        "important because some layers contain extra or redundant information, and by simplifying them, models " +
        "can train faster. Another reason for pooling layers is that because convolutional layers have weights " +
        "for precise locations or pixels in an image, a slight shift in the image can drastically change the output. " +
        "Pooling layers help to downsample or downscale the input so that this effect is lessened. Some pooling " +
        "layers will take the average of an area given in the input, some will take the maximum (for example " +
        "MaxPooling2D), and so on. ",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder"
];
let n = questions.length;
for(let i = 0;i < n;i++) {
    let item = document.createElement("div");
    let header = document.createElement("h3");
    let button = document.createElement("button");
    let collapse = document.createElement("div");
    let aBody = document.createElement("div");
    item.classList.add("accordion-item");
    header.classList.add("accordion-header");
    button.classList.add("accordion-button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#collapse" + i);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "collapse" + i);
    collapse.classList.add("accordion-collapse");
    collapse.classList.add("collapse");
    collapse.id = "collapse" + i;
    collapse.setAttribute("aria-labelledby", "heading" + i);
    collapse.setAttribute("data-bs-parent", "#help-accordion");
    aBody.classList.add("accordion-body");

    button.textContent = questions[i];
    aBody.textContent = answers[i];

    header.appendChild(button);
    collapse.appendChild(aBody);
    item.appendChild(header);
    item.appendChild(collapse);
    document.getElementById("help-accordion").appendChild(item);
}