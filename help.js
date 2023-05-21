let questions = [
    "What am I doing in this project? ",
    "What is a Neural Network? ",
    "What are layers? ",
    "What are some common layers that are used in neural networks?",
    "What is transfer learning? ",
    "What is overfitting/underfitting? ",
    "How do I get pictures? ",
    "What does 'loss' and 'acc' mean when training? ",
    "What can I do with AI and image classification? ",
];
let answers = [
    "This project is an image classification project. You'll use a  Neural Network to predict" +
        " which class an image belongs to. ",
    "A neural network is a type of machine learning model inspired by the structure and functioning of the human brain. It is a computational model composed of interconnected units called neurons, which work together to process and analyze complex data. Neural networks are designed to recognize patterns, make predictions, and perform various tasks by learning from examples or labeled data.<br>" +
    "<br>" +
    "The basic building block of a neural network is an artificial neuron, also known as a perceptron. Each neuron receives input signals, applies weights to those signals, and passes the weighted sum through an activation function to produce an output. The activation function introduces non-linearities and allows the network to model complex relationships between inputs and outputs.<br>" +
    "<br>" +
    "Neurons are organized into layers in a neural network. The input layer receives the initial data, the output layer produces the final result, and there can be one or more hidden layers in between. Hidden layers enable the network to learn and extract increasingly abstract features from the input data, leading to more sophisticated representations.<br>" +
    "<br>" +
    "During training, a neural network learns by adjusting the weights assigned to each neuron based on the errors between its predicted output and the desired output. This process, known as backpropagation, utilizes optimization algorithms like gradient descent to iteratively update the weights and minimize the prediction errors.<br>" +
    "<br>" +
    "Neural networks have demonstrated exceptional performance in various domains, such as image and speech recognition, natural language processing, recommendation systems, and many others. Deep learning, a subfield of machine learning, focuses on building and training neural networks with multiple hidden layers, often referred to as deep neural networks, which have significantly contributed to breakthroughs in artificial intelligence.",


    "Layers refer to the organization of artificial neurons into distinct groups or levels. Each layer in a neural network consists of one or more neurons, and these layers are arranged sequentially from the input layer to the output layer.<br>" +
    "<br>" +
    "Let's explore the different types of layers commonly found in neural networks:<br>" +
    "<br>" +
    "<ol> <li> Input Layer: The input layer is the initial layer that receives the raw input data. It does not perform any computations but simply passes the data to the next layer for processing. The number of neurons in the input layer corresponds to the dimensionality of the input data. </li>" +
    "<li>Hidden Layers: Hidden layers are the intermediate layers between the input and output layers. They perform complex computations by transforming the input data through a series of interconnected neurons. The number of hidden layers and the number of neurons within each layer can vary depending on the complexity of the problem being solved. The presence of multiple hidden layers allows the neural network to learn increasingly abstract representations of the input data. </li>" +
    "<li> Output Layer: The output layer is the final layer of the neural network, which produces the network's predicted output. The number of neurons in the output layer depends on the nature of the task being performed. For example, in a binary classification problem, there might be a single neuron representing the probability of belonging to one class, while in multi-class classification, there can be multiple neurons, each representing the probability of belonging to a specific class. </li> </ol>" +
    "<br>" +
    "Each neuron in a layer is connected to every neuron in the adjacent layers, forming a network of weighted connections. The weights associated with these connections determine the strength of the influence each neuron has on the others. Additionally, each neuron typically applies an activation function to the weighted sum of its inputs, introducing non-linearity into the network and allowing it to model complex relationships.<br>" +
    "<br>" +
    "The arrangement and number of layers in a neural network, known as its architecture, depend on the specific problem being addressed and the complexity of the data. Different architectures, such as feedforward neural networks, convolutional neural networks (CNNs), recurrent neural networks (RNNs), and others, have been developed to address different types of tasks and data structures effectively.<br>",


    "Here are a few common layers used in neural networks: " +
    "<ol> <li> Dense Layer (or Fully Connected Layer):<br>" +
    "Think of a dense layer as a group of neurons that are fully connected to the previous layer. Each neuron in the dense layer takes inputs from all the neurons in the previous layer and produces an output. The dense layer is responsible for learning and capturing patterns in the data. It can be thought of as a layer that looks at different aspects of the input data and combines them to make predictions or classifications. </li>" +
    "<li> Conv2D Layer (Convolutional Layer):<br>" +
    "The Conv2D layer is used in convolutional neural networks (CNNs), which are particularly good at processing images. Imagine you have a picture and you want to identify different features like edges, corners, or textures. The Conv2D layer scans the input image using small filters or kernels, looking for specific patterns. It convolves or slides these filters across the image, applying mathematical operations to extract important features. By doing this, the Conv2D layer can detect and highlight different aspects of the image, helping the neural network recognize objects or patterns.</li>" +
    "<li> Dropout Layer:<br>" +
    "Dropout is a layer that helps prevent overfitting. Overfitting happens when a neural network becomes too specialized in the training data and performs poorly on new, unseen data. Dropout randomly turns off or \"drops out\" a fraction of the neurons in the previous layer during training. By doing so, it forces the network to learn more robust and generalizable features. Dropout can be imagined as a way to encourage a neural network to be more versatile and not rely too heavily on specific neurons. </li>" +
    "<li> MaxPooling2D Layer:<br>" +
    "MaxPooling2D is another layer commonly used in CNNs. Imagine you have a large image, and you want to reduce its size while preserving the important features. The MaxPooling2D layer helps with this. It divides the image into small, non-overlapping regions and selects the maximum value within each region. This process reduces the spatial dimensions of the image, effectively downsampling it. MaxPooling2D helps to retain the essential features while reducing the computational complexity of the network.</li>" +
    "<li> Flatten Layer:<br>" +
    "The Flatten layer is typically used as a bridge between convolutional layers and dense layers. In CNNs, convolutional layers process spatial information, whereas dense layers expect a one-dimensional input. The Flatten layer flattens the multidimensional output from the previous layer into a single long vector. It rearranges the information so that it can be fed into a dense layer for further processing. You can think of it as transforming the output from the convolutional layers into a format that a regular neural network can understand. </li> </ol>" +
    "These layers are just a few examples of the many types available in neural network architectures. Other layers, such as recurrent layers (e.g., LSTM) and activation layers (e.g., ReLU), offer additional functionality and are used for specific purposes in different network architectures. The selection and arrangement of layers depend on the specific task, the structure of the input data, and the desired network behavior.",


    "Transfer learning is a machine learning technique that involves using knowledge gained from solving one problem to help solve a different but related problem. In transfer learning, a pre-trained model that has been trained on a large dataset and has learned useful feature representations is used as a starting point for a new task.<br>" +
    "<br>" +
    "Typically, the pre-trained model is trained on a large-scale dataset, such as ImageNet, which contains a vast number of images belonging to various categories. By training on such a dataset, the model learns to extract useful and general features that can be applied to many different visual recognition tasks. These learned features capture high-level representations of the data, which can be valuable for understanding different visual patterns.<br>" +
    "<br>" +
    "When applying transfer learning, the pre-trained model's learned feature representations are utilized as a foundation for a new task, which may have a smaller dataset or a different target domain. Instead of starting from scratch, the pre-trained model is fine-tuned or adapted using the new dataset specific to the target task. The idea is that the knowledge gained from the pre-training on the large dataset can provide a head start in learning the new task and improve its performance, even with limited training data.<br>" +
    "<br>" +
    "By leveraging transfer learning, the model can benefit from the general knowledge and feature extraction capabilities acquired during pre-training, saving time and computational resources compared to training a new model from scratch. Transfer learning has been successfully applied to various domains, including computer vision, natural language processing, and speech recognition, allowing models to achieve better performance and faster convergence on new tasks.",


    "Overfitting and underfitting are common problems encountered when training machine learning models, including neural networks. They refer to different types of model performance that deviate from the desired goal of generalization. <br>" +
    "Imagine you have a pet robot that you're training to recognize different objects. You show it pictures of cats and dogs and tell it which one is which. The robot learns from these examples and tries to figure out how to identify cats and dogs on its own.<br>" +
    "<br>" +
    "Now, let's say you want to test the robot's ability to recognize new pictures it has never seen before. You give it some new pictures and ask it to classify them as cats or dogs. Here's where overfitting and underfitting come into play:<br>" +
    "<ol> <li> Overfitting: Overfitting happens when your pet robot gets a little too good at recognizing the pictures you showed it during training. It starts to memorize the specific details of those pictures instead of learning the general features that make cats and dogs different. So when you give it new pictures, it may struggle to classify them correctly because it's relying too much on the exact details it memorized. It's like when you memorize answers for a test but don't understand the concepts behind them. The robot becomes too specialized and doesn't generalize well to new situations. Let's consider an analogy: Imagine you're studying for an exam, and you only focus on memorizing the exact answers to the practice questions without understanding the underlying concepts. When you encounter new, slightly different questions on the actual exam, you may struggle to answer correctly because you haven't grasped the fundamental principles. </li> " +
    "<li> Underfitting: On the other hand, underfitting occurs when your pet robot doesn't learn enough from the training examples. It doesn't pay attention to the important characteristics that distinguish cats from dogs. It might classify everything as one category or make random guesses without really understanding what it's doing. It's like if you didn't study at all for a test and just guessed the answers. The robot hasn't learned the necessary knowledge to make accurate predictions.<br> </li> </ol> <br" +
    "In both cases, the robot is not performing well when faced with new pictures because it either relied too heavily on specific details (overfitting) or didn't learn enough from the examples (underfitting). The goal is to find the right balance so that the robot learns the general features that differentiate cats and dogs without getting too fixated on the specific details.<br>" +
    "<br>" +
    "In machine learning, overfitting and underfitting are common challenges when training models. Finding the right balance helps ensure that the model can make accurate predictions on new, unseen data.",


    "To get pictures, it's easiest to upload pictures from your webcam. To do this, you can click the \"Images\" button on your workspace, and then click Upload. Select the \"Upload from your webcam\" button, and take some pictures of a type of object! Make sure to get some different angles and different objects which belong to that type. Once you're done, click \"Next\" and then upload to the class number of your choice. It's best to have at least 30 pictures of a type of object in each class. That way, the machine learning model is able to generalize to a class of object better. ",

    "In the context of training a neural network, \"loss\" refers to a measure of how well the network is performing on a specific task. It quantifies the difference between the predicted output of the network and the actual desired output. The goal of training is to minimize this loss, indicating that the network is making accurate predictions.<br>" +
    "<br>" +
    "\"Acc\" or \"accuracy\" is a metric that measures how well the network is performing in terms of correctly predicting the desired output. It represents the percentage of correct predictions made by the network over a given set of examples.<br>" +
    "<br>" +
    "To summarize, loss measures the deviation between predicted and desired outputs, while accuracy measures the proportion of correct predictions made by the network. The objective is to minimize loss and maximize accuracy during training to ensure the neural network performs well on its intended task.",

    "Image classification neural networks can be used to build various simple apps. Here are a few examples:<br>" +
    "<br>" +
    "<ol> <li> Food Recognition: Create an app that can identify different types of food. Users can take a picture of their meal, and the app will classify it as pizza, burger, salad, or any other food category. </li>" +
    "<li> Plant and Flower Identification: Develop an app that helps users identify various plants and flowers. Users can take a photo of a plant or flower they encounter, and the app will provide information about its species and characteristics. </li>" +
    "<li> Pet Breed Identification: Build an app that can recognize different breeds of dogs or cats. Users can upload a picture of their pet, and the app will determine the breed and offer information about it. </li>" +
    "<li> Object Recognition: Develop an app that can identify common objects or items. Users can take a photo, and the app will classify it as a chair, table, book, or other everyday objects. </li>" +
    "<li> Emotion Recognition: Create an app that can detect and recognize facial expressions. Users can take a selfie, and the app will determine the emotion displayed, such as happiness, sadness, anger, or surprise. </li>" +
    "<li> Clothing Style Recognition: Build an app that can classify clothing styles or fashion trends. Users can take a photo of an outfit, and the app will identify the style, such as casual, formal, sporty, or vintage. </li>" +
    "<li> Gesture Recognition: Develop an app that recognizes hand gestures or signs. Users can make hand gestures in front of their device's camera, and the app will interpret and provide corresponding meanings. </li>" +
    "<br>" +
    "These are just a few examples of the types of simple apps you can create with image classification neural networks. By training a model to recognize specific objects or patterns in images, you can build apps that provide useful information or enhance user experiences in various domains.<br>" +
    "Another cool app you can make is a rock paper scissors program. You can take pictures of the three gestures, and then generate a random number for the computer. Then, you can check the user's and the computer gesture to see who wins! ",
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
    button.classList.add("collapsed");
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