//Zwischenserver Auto-Downloaden
window.addEventListener("DOMContentLoaded", async function () {
    try {
        //Iframe erstellen, konfigurieren & dadurch ZwischenServer Downloaden
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = '../WebSocketServer/IntermediaryServerForMBotConnection.py';

        //Debug Ausgabe, wenn Zwischenserver heruntergeladen wurde
        console.log("Intermediary Server downloaded");
    } catch (error) {
        console.error(`Error while downloading the Intermediary Server: ${error}`);
    }
});