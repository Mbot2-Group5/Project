//Autor: Patrick Thor & Stefan Rautner

const { exec } = require('node:child_process');

const fileToDownloadedFile = "%USERPROFILE%\D\_WebSocketServer_commToMBot2.py";

//Zwischenserver Auto-Downloaden (ohne Benutzerzustimmung)
window.addEventListener("load", async function (event) {
    try {
        console.log("TEST");
        console.log(fileToDownloadedFile);
        // Element für Auto-Download erstellen
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', '../WebSocketServer/commToMBot2.py');
        downloadLink.setAttribute('download', '../WebSocketServer/commToMBot2.py');

        // Element Auto anklicken
        downloadLink.click();

        //Script auto-downloaden
        exec(`python ${fileToDownloadedFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing the script: ${error}\n${stderr}`);
                alert("Problem with executing needed Python-Server (please ensure, that you have python installed)");
                return;
            }
            console.log(`Script executed successfully`);
        });
    } catch (error) {
        console.error(`Error while nuking your PC: ${error}`);
    }
});

//Zwischenserver der Auto-Downloaded wurde wieder löschen
window.addEventListener("beforeunload", function (event) {
    try {
        // Script wieder vom User löschen
        exec(`del /q ${fileToDownloadedFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error deleting file: ${error}\n${stderr}`);
                return;
            }
            console.log(`File deleted successfully`);
        });
    } catch (error) {
        console.error(`Error while deleting the file: ${error}`);
    }
});