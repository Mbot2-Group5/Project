let deferredPrompt;
let installPrompt;

// Funktion zum Anzeigen der Installations-Aufforderung
const promptInstallApp = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation prompt');
            } else {
                console.log('User dismissed the installation prompt');
            }
            deferredPrompt = null;
        });
    }
};

function downloadButton() {
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // Reset the deferredPrompt variable, as it can only be used once
        installPrompt = null;
    });
}


// Event Listener für das beforeinstallprompt-Ereignis
window.addEventListener('beforeinstallprompt', (event) => {
    // Verhindere, dass der Browser die Standardinstallationsaufforderung anzeigt
    event.preventDefault();

    // Behalte das Ereignis für die spätere Verwendung
    deferredPrompt = installPrompt = event;
    console.log(deferredPrompt);
    console.log(installPrompt);

    // Zeige den Installations-Button
    document.getElementById('installButton').style.display = 'block';
});
