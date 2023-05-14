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
    // chrome.contentSettings.camera.set({primaryPattern:'<all_urls>',setting:'allow'});      // allow|block|ask

    // console.log(chrome)

    navigator.permissions.query({name: 'camera'})
    .then((permissionObj) => {
        console.log(permissionObj.state);
    })
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
            navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
                video.srcObject = stream;
                webCamStream = stream;
                console.log("found stream");
                video.addEventListener('loadeddata', function () {
                    videoPlaying = true;
                    console.log("adding listener");
                    enableCamButton.textContent = "Disable Webcam"
                    captureImageButton.classList.remove("disabled");
                });
            }, err => console.log(err));
        }
    } else {
        console.warn('getUserMedia() is not supported by your browser');
        enableCamButton.textContent = "Get User Media Not Supported";
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
