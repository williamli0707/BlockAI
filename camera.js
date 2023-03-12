let video = document.getElementById("webcam");
let videoPlaying = false;
let enableCamButton = document.getElementById("enable-cam");
let captureImageButton = document.getElementById("capture-webcam");
let webCamStream;

let isVideoPlaying = function () {return videoPlaying;}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

let disableCam = function() {
    video.srcObject = null;
    videoPlaying = false;
    enableCamButton.textContent = "Enable Webcam"
    captureImageButton.classList.add("disabled");
    webCamStream.getTracks().forEach(function(track) {
        track.stop();
    });
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
                    enableCamButton.textContent = "Disable Webcam"
                    captureImageButton.classList.remove("disabled");
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

document.getElementById("webcam-preview").addEventListener("hidden.bs.modal", () => {
    if(videoPlaying) {
        disableCam();
    }
});

document.getElementById("images-webcam-next").addEventListener("click", () => {
    if(videoPlaying) {
        disableCam();
    }
});
