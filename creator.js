window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("ce-button").addEventListener("click", () => {
        require('electron').ipcRenderer.send('go-to-editor');
    })
});