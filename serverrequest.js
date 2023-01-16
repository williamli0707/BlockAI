let xhr;

function setURL(url) {
    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', url);
}

function stopProp(ev) {
    ev.stopPropagation();
    ev.preventDefault();
}

function doUpload(e) {
    var xhr = new XMLHttpRequest();
    var file = files;

    xhr.open("POST", "upload.jsp");

    xhr.onload = function() {
        if(xhr.status != 200) { 
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        } 
        else {
            alert(`Done, got ${xhr.response.length} bytes`);
        }
    };
    xhr.onprogress = function(event) {
        if(event.lengthComputable) {
            alert(`Received ${event.loaded} of ${event.total} bytes`);
        } 
        else {
            alert(`Received ${event.loaded} bytes`); // no Content-Length
        }
    };
    xhr.onerror = function() {
        alert("Request failed");
    };

    //Set a few headers so we know the file name in the server
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", file.name);

    //Initiate upload
    xhr.send(file);

    stopProp(e);
}
