/* Autor: Stefan Rautner */

//Definition Cache-Version
let cacheVersion = 'my-cache';

//Definition Versions-Dokumente
const versionDocuments = [
    /*Stylesheets*/
    './css/controller.css',
    './css/main.css',
    /*Bilder*/
    './images/about_left.png',
    './images/about_right.png',
    './images/controller.png',
    './images/detect.png',
    './images/display.png',
    './images/downkey.png',
    './images/DUCSetup_v4_1_1.exe',
    './images/feature.png',
    './images/leftkey.png',
    './images/login_background.png',
    './images/pat.jpg',
    './images/Patrick.png',
    './images/rightkey.png',
    './images/safety.png',
    './images/speed.png',
    './images/Stefan.jpg',
    './images/team_1330.png',
    './images/team_backimg.png',
    './images/team_phone.png',
    './images/Tobias.jpg',
    './images/upkey.png',
    './images/wlan.png',
    /*Icons*/
    './images/icons/icon.ico',
    './images/icons/replacement_icon.png',
    /*3D Model*/
    './model/mbot2_model.glb',
    /*Skripte*/
    './scripts/connection.js',
    './scripts/firebase.js',
    './scripts/login_button.js',
    './scripts/modelViewer.js',
    './scripts/register.js',
    './scripts/webApp-Connection.js',
    './scripts/website_logic.js',
    /*HTML Dokumente*/
    './index.html',
    './login.html',
    './register.html',
    './start.html',
    /*Manifest*/
    './manifest.json'
    //WebsocketServer noch nicht eingebunden
]

//Hinzufügen der Ressourcen zum Cache
const addToCache = () => {
    try {
        return caches.open(cacheVersion).then((cache) => {
            return cache.addAll(versionDocuments).then(() => {
                console.log("Added documents to Cache");
            });
        });
    } catch (error) {
        console.log(`Error while adding Documents to Cache: $error}`);
    }

};

//Service Worker installieren
self.addEventListener('install', (event) => {
    event.waitUntil(addToCache());
    console.log("Service Worker installed");
});

//Service Worker aktivieren und alte Caches entfernen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((existingCacheName) => {
                    if (existingCacheName !== cacheVersion) {
                        try {
                            console.log("Newer version detected");
                            return caches.delete(existingCacheName);
                        } catch (error) {
                            console.log(`Error while activating the Service-worker: $error}`);
                        }
                    }
                    console.log("No newer version detected");
                })
            );
        })
    );
});


//Beim Öffnen der App auf Updates prüfen
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then((response) => {
                try {
                    checkForUpdates();
                    console.log("Checked for Updates");
                } catch (error) {
                    console.log(`Error while checking for Updates: ${error}`);
                }
                return response;
            }).catch(() => {
                console.log("Failed to check for Updates, using existing version from cache");
                return caches.match(event.request);
            })
        );
    }
});

//Regelmäßiges Überprüfen auf Updates
setInterval(() => {
    try {
        checkForUpdates();
        console.log("Check for Updates (once every 24 hours)");
    } catch (error) {
        console.log(`Error while checking for updates: ${error}`);
    }
}, 24 * 60 * 60 * 1000);   //Alle 24 Stunden

//Überprüfen auf Updates (durch Vergleich der Versionsnummer)
function checkForUpdates() {
    try {
        console.log("Checking for Updates");
        Promise.all(
            versionDocuments.map((document) => fetch(document)
                .then((response) => response.text())
            )
        ).then((versions) => {
            const newerVersion = versions.some((latestVersion) => latestVersion !== cacheVersion);

            if (newerVersion) {
                console.log("Update found");
                cacheVersion = 'my-cache-' + Date.now();
                console.log("Updating cache");
                addToCache().then(() => {
                    console.log("Cache updated");
                });

                self.clients.matchAll({type: 'window'})
                    .then((clients) => {
                        if(clients && clients.length > 0) {
                            clients.forEach((client) => {
                                client.navigate(client.url).then(() => {
                                    console.log("Window updated to newer Version");
                                });
                            });
                        } else {
                            console.log("No clients found");
                        }
                    });
            } else {
                console.log("No Updates found");
                console.log("Cache is up to date");
            }
        });
    } catch (error) {
        console.log(`Error while checking for updates: ${error}`);
    }
}