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
        "<br>Some common examples of layers are: " +
        "<br>    • Convolutional layer: Convolutional layers consist of a bunch of neurons, or pieces of the " +
        "input given to them. Neurons in these layers will connect to neurons in the next layer, and each " +
        "neuron will have a weight which determines how important it is in predicting which class an image " +
        "belongs to. When the neural network trains itself, it will figure out which pieces of the image " +
        "are more important to the final result and adjust the weights accordingly. Stacking convolutional " +
        "layers is a common way to classify images. Early layers can learn things like lines, and later layers " +
        "can even learn how to distinguish shapes or objects. " +
        "<br>    • Pooling Layer: Pooling layers can simplify the input given to them. This is especially " +
        "important because some layers contain extra or redundant information, and by simplifying them, models " +
        "can train faster. Another reason for pooling layers is that because convolutional layers have weights " +
        "for precise locations or pixels in an image, a slight shift in the image can drastically change the output. " +
        "Pooling layers help to downsample or downscale the input so that this effect is lessened. Some pooling " +
        "layers will take the average of an area given in the input, some will take the maximum (for example " +
        "MaxPooling2D), and so on. ",
    "Transfer learning is a machine learning technique that involves using knowledge gained from solving one problem to help solve a different but related problem. In transfer learning, a pre-trained model that has been trained on a large dataset and has learned useful feature representations is used as a starting point for a new task.<br>" +
    "<br>" +
    "Typically, the pre-trained model is trained on a large-scale dataset, such as ImageNet, which contains a vast number of images belonging to various categories. By training on such a dataset, the model learns to extract useful and general features that can be applied to many different visual recognition tasks. These learned features capture high-level representations of the data, which can be valuable for understanding different visual patterns.<br>" +
    "<br>" +
    "When applying transfer learning, the pre-trained model's learned feature representations are utilized as a foundation for a new task, which may have a smaller dataset or a different target domain. Instead of starting from scratch, the pre-trained model is fine-tuned or adapted using the new dataset specific to the target task. The idea is that the knowledge gained from the pre-training on the large dataset can provide a head start in learning the new task and improve its performance, even with limited training data.<br>" +
    "<br>" +
    "By leveraging transfer learning, the model can benefit from the general knowledge and feature extraction capabilities acquired during pre-training, saving time and computational resources compared to training a new model from scratch. Transfer learning has been successfully applied to various domains, including computer vision, natural language processing, and speech recognition, allowing models to achieve better performance and faster convergence on new tasks.",
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

    button.innerHTML = questions[i];
    aBody.innerHTML = answers[i];

    header.appendChild(button);
    collapse.appendChild(aBody);
    item.appendChild(header);
    item.appendChild(collapse);
    document.getElementById("help-accordion").appendChild(item);
}