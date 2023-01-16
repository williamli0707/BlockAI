window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("bc-button").addEventListener("click", () => {
        require('electron').ipcRenderer.send('go-to-creator');
    })
});
//test comment so i can add to a branch