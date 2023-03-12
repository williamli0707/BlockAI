let video = document.getElementById("webcam-predict");
let videoPlaying = false;
let enableCamButton = document.getElementById("enable-cam-predict");
let webCamStream;


function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

let disableCam = function() {
    video.srcObject = null;
    videoPlaying = false;
    video.setAttribute("playing", "false");
    enableCamButton.textContent = "Enable Webcam"
    webCamStream.getTracks().forEach(function(track) {
        track.stop();
    });
    document.getElementById("prediction").innerText = "Enable your webcam to start predicting. ";
}

let enableCam = function () {
    if (hasGetUserMedia()) {
        if(videoPlaying) {
            disableCam();
        }
        else {
            const constraints = {
                video: true,
                width: 224,
                height: 224
            };
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.srcObject = stream;
                webCamStream = stream;
                video.addEventListener('loadeddata', function () {
                    videoPlaying = true;
                    video.setAttribute("playing", "true");
                    enableCamButton.textContent = "Disable Webcam"
                });
            });
        }
    } else {
        console.warn('getUserMedia() is not supported by your browser');
    }
}

enableCamButton.addEventListener("click", () => {
    enableCam();
});

document.getElementById("back-button").addEventListener("click", () => {
    if(videoPlaying) {
        disableCam();
    }
});

document.getElementById("images-webcam-next").addEventListener("click", () => {
    if(videoPlaying) {
        disableCam();
    }
});
