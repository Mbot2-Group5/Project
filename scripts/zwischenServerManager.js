//Autor: Patrick Thor & Stefan Rautner

const { exec } = require('node:child_process');

//Pfad zum heruntergeladenen Zwischenserver
const fileToDownloadedFile = "%USERPROFILE%\_WebSocketServer_commToMBot2.py";

//Zwischenserver Auto-Downloaden (ohne Benutzerzustimmung)
window.addEventListener("load", async function () {
    try {
        //Element für Auto-Download erstellen
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', '../WebSocketServer/commToMBot2.py');
        downloadLink.setAttribute('download', '../WebSocketServer/commToMBot2.py');

        //Element Auto anklicken
        downloadLink.click();

        //Debug Ausgabe, wenn Zwischenserver heruntergeladen wurde
        console.log("Intermediary Server downloaded");

        //Skript automatisch herunterladen
        exec(`python ${fileToDownloadedFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing the script: ${error}\n${stderr}`);
                alert("Problem with executing needed Intermediary Server (please ensure, that you have python installed and then reload the WebApp)");
                return;
            }
            console.log(`Script executed successfully`);
        });
    } catch (error) {
        console.error(`Error while nuking your PC: ${error}`);
    }
});

//Zwischenserver der Auto-Downloaded wurde wieder löschen
window.addEventListener("beforeunload", async function () {
    try {
        // Script wieder vom User löschen
        exec(`del /q ${fileToDownloadedFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error deleting Intermediary Server: ${error}\n${stderr}`);
                return;
            }
            console.log(`Intermediary Server deleted successfully`);
        });
    } catch (error) {
        console.error(`Error while deleting the Intermediary Server: ${error}`);
    }
});