//Funktionalität hinter dem Download-Button
let deferredPrompt;

// Function to handle the installation prompt
async function installWebApp() {
    if (deferredPrompt) {
        await sleep(4000);
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation prompt');
            } else {
                console.log('User dismissed the installation prompt');
            }
            // Reset the deferredPrompt variable, as it can only be used once
            deferredPrompt = null;
        });
    }
}

// Event listener for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default browser install prompt
    event.preventDefault();

    // Store the event object for later use
    deferredPrompt = event;

    // Show the install button
    document.getElementById('installButton').style.display = 'block';
});

//Wartezeit für Download-Button setzen
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
