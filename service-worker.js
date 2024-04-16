/* Autor: Stefan Rautner */

// Definition Cache-Version
let cacheVersion = 'my-cache';

// Definition Versions-Dokumente
const versionDocuments = [          //HIER DAS PROBLEM?
    /* Stylesheets */
    './css/about.css',
    './css/about_feature.css',
    './css/controller.css',
    './css/form.css',
    './css/form-temp.css',
    './css/main.css',
    './css/team.css',
    /* Bilder */
    './images/controller.png',
    './images/detect.png',
    './images/display.png',
    './images/downkey.png',
    './images/feature.png',
    './images/leftkey.png',
    './images/login_background.png',
    './images/pat.jpg',
    './images/Patrick.png',
    './images/rightkey.png',
    './images/safety.png',
    './images/speed.png',
    './images/Stefan.jpg',
    './images/Tobias.jpg',
    './images/upkey.png',
    './images/wlan.png',
    /* Icons */
    './images/icons/icon.ico',
    './images/icons/replacement_icon.png',
    /* 3D Model */
    './Mbot2/mbot2_model.glb',
    /* Librarys */
    /* ModelViewer */
    './librarys/modelViewer/model-viewer-lib.js',
    /* ionicons */
    './librarys/ionicons/svg/close.svg',
    './librarys/ionicons/p-d15ec307.js',
    './librarys/ionicons/p-40ae2aa7.js',
    './librarys/ionicons/p-1c0b2c47.entry.js',
    './librarys/ionicons/ionicons-lib.js',
    './librarys/ionicons/ionicons-lib.esm.js',
    /* gsap */
    './librarys/gsap/gsap.min.js',
    './librarys/gsap/ScrollTrigger.min.js',
    /* Skripte */
    './scripts/about.js',
    './scripts/connection.js',
    './scripts/firebase.js',
    './scripts/login_button.js',
    './scripts/modelViewer.js',
    './scripts/register.js',
    './scripts/website_logic.js',
    /* Connection to WebSocket-Sever (MBot2) */
    './scripts/webApp-Connection.js',
    /* HTML Dokumente */
    './index.html',
    './login.html',
    './register.html',
    './start.html',
    /* Service-Worker & Manifest */
    './service-worker.js',
    './manifest.json'
    // WebsocketServer noch nicht eingebunden
];

// Hinzufügen der Ressourcen zum Cache
const addToCache = async () => {
    try {
        const cache = await caches.open(cacheVersion);
        await cache.addAll(versionDocuments);
        console.log("Added documents to Cache");
    } catch (error) {
        console.error(`Error while adding Documents to Cache: ${error}`);
    }
};

// Service Worker installieren
self.addEventListener('install', (event) => {
    event.waitUntil(addToCache());
    console.log("Service Worker installed");
});

// Service Worker aktivieren und alte Caches entfernen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((existingCacheName) => {
                    if (existingCacheName !== cacheVersion) {
                        console.log("Newer version detected");
                        return caches.delete(existingCacheName);
                    }
                })
            );
        })
    );
    console.log("Service Worker activated");
});

// Beim Öffnen der App auf Updates prüfen
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(async (response) => {
                try {
                    await checkForUpdates();
                    console.log("Checked for Updates");
                } catch (error) {
                    console.error(`Error while checking for Updates: ${error}`);
                }
                return response;
            }).catch(() => {
                console.error("Failed to check for Updates, using existing version from cache");
                return caches.match(event.request);
            })
        );
    }
});

// Regelmäßiges Überprüfen auf Updates
setInterval(async () => {
    try {
        await checkForUpdates();
        console.log("Check for Updates (once every 24 hours)");
    } catch (error) {
        console.error(`Error while checking for updates: ${error}`);
    }
}, 24 * 60 * 60 * 1000);   // Alle 24 Stunden

// Überprüfen auf Updates (durch Vergleich der Versionsnummer)
async function checkForUpdates() {
    try {
        console.log("Checking for Updates");
        const versions = await Promise.all(
            versionDocuments.map((document) => fetch(document)
                .then((response) => response.text())
            )
        );
        const newerVersion = versions.some((latestVersion) => latestVersion !== cacheVersion);

        if (newerVersion) {
            console.log("Update found");
            cacheVersion = 'my-cache-' + Date.now();
            console.log("Updating cache");
            await addToCache();
            console.log("Cache updated");

            const clients = await self.clients.matchAll({ type: 'window' });
            if (clients && clients.length > 0) {
                await Promise.all(clients.map(async (client) => {
                    await client.navigate(client.url);
                    console.log("Window updated to newer Version");
                }));
            } else {
                console.log("No clients found");
            }
        } else {
            console.log("No Updates found\nCache is up to date");
        }
    } catch (error) {
        console.error(`Error while checking for updates: ${error}`);
    }
}
