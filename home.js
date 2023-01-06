window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("bc-button").addEventListener("click", () => {
        require('electron').ipcRenderer.send('go-to-creator');
    })
});