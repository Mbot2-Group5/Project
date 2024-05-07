//Autor: Patrick Thor & Stefan Rautner

//Pfad zum heruntergeladenen Zwischenserver
const fileToDownloadedFile = "%USERPROFILE%\_WebSocketServer_commToMBot2.py";

//Zwischenserver Auto-Downloaden (ohne Benutzerzustimmung)
window.addEventListener("DOMContentLoaded", async function () {
    try {
        //Element für Auto-Download erstellen
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', '../WebSocketServer/commToMBot2.py');
        downloadLink.setAttribute('download', '../WebSocketServer/commToMBot2.py');

        //Element Auto klicken (dadurch Script downloaden)
        downloadLink.click();

        //Debug Ausgabe, wenn Zwischenserver heruntergeladen wurde
        console.log("Intermediary Server downloaded");
    } catch (error) {
        console.error(`Error while downloading the Intermediary Server: ${error}`);
    }

    try {                                                                                                               //Funktioniert nicht (sollte das Script lokal ausführen)
        //Skript automatisch ausführen
        setTimeout(function () {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", fileToDownloadedFile, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const scriptContent = xhr.responseText;
                    eval(scriptContent);
                }
            };
            xhr.send();
        }, 2000);
    } catch (error) {
        console.error(`Error while executing the Intermediary Server: ${error}`);
    }
});