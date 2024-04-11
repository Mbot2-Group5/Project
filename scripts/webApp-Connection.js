/*Autor: Stefan Rautner*/

//Variablen definieren
let left = 0;
let right = 0;

//Ausgewählter MBot
let mBotID = 999999999;

//Variable für senden/Controller checken
let initialized = false;

//Trigger-Variablen
let lastTriggerSuicidePrevention = 0;
let lastTriggerLineFollower = 0;

//Geschwindigkeit
let speed = 60;

//Liste für alle Verfügbare MBots
let possibleMBot2sToConnect = [];

//MBots geladen Zeitbegrenzung
let lastExecutionTime = 0;
const duration = 11000; //11 Sekunden

//Variable für Verbindungsstatus mit MBot
let connected = false;

//Überprüfung, ob jede Sekunde mindestens eine Nachricht empfangen wurde
setInterval(checkConnectionStatus, 1000);

//UTF-8 En-/Decoder
let encoder;
let decoder;
try {
    encoder = new TextEncoder();
    decoder = new TextDecoder();
} catch (error) {
    console.log(`Error while creating UTF-8 Encoder & Decoder ${error}`);
}

//WebSocket
let socket;
try {
    socket = new WebSocket('ws://localhost:5431');
} catch (error) {
    console.log(`Can't connect to Websocket: ${error}`);
}

//Websocket verbunden
socket.onopen = function () {
    console.log("WebSocket connected");
};

//WebSocket getrennt
socket.onclose = function () {
    console.log("WebSocket disconnected");
};

//WebSocket Error
socket.onerror = function (event) {
    console.log(`WebSocket error: ${event.data}`);
}

//Disconnected Funktion in Console schreiben
function checkConnectionStatus() {
    let state = "";
    let stateColor = "";

    if (!connected) {
        state = "Getrennt";
        stateColor = "red";
        connected = false;
    } else {
        state = "Verbunden";
        stateColor = "green";
        connected = true;
    }

    if (mBotID !== 999999999) {
        try {
            //Listenelement erhalten
            const listElement = document.getElementById(mBotID);

            //Derzeitigen Text aus Listenelement erhalten & ändern
            const content = listElement.innerHTML;
            const currentHTML = content.split("<br>");
            currentHTML[2] = `Status: ${state}`;

            //Neuen Status auf GUI anzeigen
            listElement.innerHTML = currentHTML.join("<br>");

            //Statusanzeige (Kreis erstellen & Farbe zuweisen)
            const stateCycle = document.createElement("div");

            //Statusanzeigen stylen (Größe, Farbe & Kreis)
            stateCycle.style.backgroundColor = stateColor;
            stateCycle.style.width = "10px";
            stateCycle.style.height = "10px";
            stateCycle.style.borderRadius = "50%";

            //Statusanzeige zum Listenelement hinzufügen
            listElement.appendChild(stateCycle);
        } catch (error) {
            console.log(`Couldn't change the Connection-State of the MBot: ${error}`);
        }
    }
}

//Alle MBots mit denen eine Verbindung hergestellt werden kann erhalten
function getPossibleMBots() {
    try {
        if (Date.now() - lastExecutionTime >= duration) {
            socket.send("searchForMBots");
            lastExecutionTime = Date.now();
        }
    } catch (error) {
        console.log(`Looking for MBots failed: ${error}`);
    }
}

//WebSocket Verbindung zum Empfangen einer Nachricht vom MBot2 über Server
socket.onmessage = async function (event) {
    try {
        let receivedData = decoder.decode(await event.data.arrayBuffer());
        let data = JSON.parse(receivedData);

        //Liste an möglichen MBots erhalten
        if (Array.isArray(data) && data.length > 0 && data[0] === "MBots:") {
            const mbots = data.slice(1);

            //Liste in HTML anzeigen
            const myList = document.getElementById("ShowPossibleMBots");
            myList.innerHTML = "";

            if (mbots.length === 0) {
                const messageEmpty = document.createElement("li");
                messageEmpty.innerHTML = "Es wurden keine MBots gefunden";
                myList.appendChild(messageEmpty);
            }

            //MBots anzeigen und in Liste speichern (Name, IP-Adresse & Portnummer, Status (Text & Farbkreis))
            for (let i = 0; i < mbots.length; i++) {
                //MBots in Liste hinzufügen
                possibleMBot2sToConnect.push(mbots[i]);

                //Listenelement zum Anzeigen des MBots erstellen
                let listElement = document.createElement("li");

                //Text zum Listenelement hinzufügen
                listElement.innerHTML = `MBot${i + 1}<br>${mbots[i]}<br>Status: Getrennt`;

                //Statusanzeige (Kreis erstellen & Farbe zuweisen)
                const stateCycle = document.createElement("div");

                //Statusanzeigen stylen (Größe, Farbe & Kreis)
                stateCycle.style.backgroundColor = "red";
                stateCycle.style.width = "10px";
                stateCycle.style.height = "10px";
                stateCycle.style.borderRadius = "50%";

                //Statusanzeige zum Listenelement hinzufügen
                listElement.appendChild(stateCycle);

                //Doppelklick Eventhandler auf Listenelement legen
                listElement.ondblclick = function () {
                    connectToMBot2();
                };

                //Klick Eventhandler auf Listenelement legen
                listElement.onclick = function () {
                    mBotID = this.id;
                }

                //Listenelement ID zuweisen
                listElement.id = `${i}`;

                //Listenelement stylen
                listElement.style.whiteSpace = 'pre-line';

                //Listenelement zu GUI-Liste hinzufügen
                myList.appendChild(listElement);
            }
        } else {
            connected = true;

            //Autor: Patrick Thor
            //Daten des Gyrosensors erhalten & an ModelViewer übergeben
            updateOrientation(data.gyroscopeRoll, data.gyroscopePitch, data.gyroscopeYaw);

            //Andere Sensordaten
            document.getElementById("accelerometer").value = data.accelerometer;
            document.getElementById("rgbSensor").style.background = data.rgbSensorMiddleRight;
            document.getElementById("ultrasonicSensor").value = data.ultrasonicSensor;

            //Überprüfen, ob der LineFollower eingeschalten ist (wenn ja, Daten verarbeiten)
            if (document.getElementById("lineFollower").checked) {
                lineFollower(data.rgbSensorLeft, data.rgbSensorMiddleLeft, data.rgbSensorMiddleRight, data.rgbSensorRight);
            }

            //Überprüfen, ob die SuicidePrevention eingeschalten ist (wenn ja, Daten verarbeiten)
            if (document.getElementById("suicidePrevention").checked) {
                suicidePrevention(data.ultrasonicSensor);
            }

            console.log("Got Message from the TCP-Server");
            connected = true;
        }
    } catch (error) {
        console.log(`Error while receiving Message from MBot: ${error}`);
    }

    if (initialized) {
        await communicating();
    }
}

async function communicating() {
    await sendToMBot2();
    await checkGamepadInput();
}

//Funktion für die Berechnungen des LineFollowers
function lineFollower(lightSensorLeft, lightSensorMiddleLeft, lightSensorMiddleRight, lightSensorRight) {
    try {
        if (lightSensorLeft === "black" && lightSensorRight === "black") {
            speed += 1;
            left = speed;
            right = speed;
        } else if (lightSensorLeft === "black" && lightSensorRight !== "black") {
            left = speed + 1;
            right = speed;
        } else if (lightSensorLeft !== "black" && lightSensorRight === "black") {
            left = speed;
            right = speed + 1;
        } else if (lightSensorLeft !== "black" && lightSensorRight !== "black") {
            speed -= 1;
            left = speed;
            right = speed;
        }

        //Farbflächen des LineFollower setzen
        document.getElementById("lightSensorLeft").style.background = lightSensorLeft;
        document.getElementById("lightSensorMiddleLeft").style.background = lightSensorMiddleLeft;
        document.getElementById("lightSensorMiddleRight").style.background = lightSensorMiddleRight;
        document.getElementById("lightSensorRight").style.background = lightSensorRight;
    } catch (error) {
        console.log(`Error while calculating commands in LineFollower: ${error}`);
    }
}

//SuicidePrevention, sodass der MBot2 nicht gegen die Wand fährt
function suicidePrevention(distanceToObject) {
    try {
        if (distanceToObject < 10) {
            left = 0;
            right = 0;
        }
    } catch (error) {
        console.log(`Error while calculating commands in SuicidePrevention: ${error}`);
    }
}

//Bewegungs-Grafik-Intervals
let moveInterval;

//Grafik-Bewegung beginnen
function startMoving(element) {
    try {
        moveInterval = setInterval(function () {
            move(element);
        }, 100);
    } catch (error) {
        console.log(`Error while moving (with graphic interface): ${error}`);
    }
}

//Grafik-Bewegung stoppen
function stopMoving(element) {
    try {
        clearInterval(moveInterval);
        stopMove(element);
    } catch (error) {
        console.log(`Error while stopping (with graphic interface): ${error}`);
    }
}

//Überprüfen, ob der MBot2 fährt (Angezeigte Steuerelemente)
function move(element) {
    try {
        if (element.id === 'up') {
            speed += 1;
            left = speed;
            right = speed;
            console.log("Moved straight");
        } else if (element.id === 'down') {
            speed -= 1;
            left = speed;
            right = speed;
            console.log("Moved back");
        } else if (element.id === 'left') {
            left = speed;
            right = speed + 1;
            console.log("Moved left");
        } else if (element.id === 'right') {
            left = speed + 1;
            right = speed;
            console.log("Moved right");
        }
    } catch (error) {
        console.log(`Error while moving : ${error}`);
    }
}

//Überprüfen, ob der MBot2 stehen geblieben ist (Angezeigte Steuerelemente)
function stopMove(element) {
    try {
        if (element.id === 'up') {
            speed = 0;
            console.log("Stopped moving straight");
        } else if (element.id === 'down') {
            speed = 0;
            console.log("Stopped moving back");
        } else if (element.id === 'left') {
            console.log("Stopped moving left");
        } else if (element.id === 'right') {
            console.log("Stopped moving right");
        }
        left = speed;
        right = speed;
    } catch (error) {
        console.log(`Error while stopping: ${error}`);
    }

}

//Variablen Statuse definieren
let keyState = {
    'ArrowUp': false,
    'ArrowDown': false,
    'ArrowLeft': false,
    'ArrowRight': false,
    'w': false,
    's': false,
    'a': false,
    'd': false
};

//Listener für KeyDown-Event
document.addEventListener('keydown', (event) => {
    try {
        // Key-State updaten
        keyState[event.key] = true;
        handleKeys();
    } catch (error) {
        console.log(`Error while moving (with keyboard): ${error}`);
    }
});

//Listener für KeyUp-Event
document.addEventListener('keyup', (event) => {
    try {
        // Key-State updaten
        keyState[event.key] = false;
        handleKeys();
    } catch (error) {
        console.log(`Error while stopping (with keyboard): ${error}`);
    }
});

//Auf Tasten reagieren
function handleKeys() {

    try {
        // Check key state and update speed accordingly
        if (keyState['ArrowUp'] || keyState['w']) {
            speed += 1;
            left = speed;
            right = speed;
            console.log("Moving straight");
        } else if (keyState['ArrowDown'] || keyState['s']) {
            speed -= 1;
            left = speed;
            right = speed;
            console.log("Moving back");
        } else if (keyState['ArrowLeft'] || keyState['a']) {
            left = speed;
            right = speed + 1;
            console.log("Moving left");
        } else if (keyState['ArrowRight'] || keyState['d']) {
            left = speed + 1;
            right = speed;
            console.log("Moving right");
        } else {
            speed = 0;
            left = speed;
            right = speed
            console.log("Stopped moving");
        }
    } catch (error) {
        console.log(`Error while handling keyborad keys: ${error}`);
    }
}


//Listener für Ausgabe, ob Controller verbunden wurde
window.addEventListener("gamepadconnected", () => console.log("Controller connected"));

//Listener für Ausgabe, on Controller getrennt wurde
window.addEventListener("gamepaddisconnect", () => console.log("Controller disconnected"));

//Überprüfen, ob Controller (PS & XBOX) zur Steuerung des MBot2 verwendet wird
function checkGamepadInput() {
    try {
        //Alle Gamepads erhalten
        const gamepads = navigator.getGamepads();

        //Alle verbundenen Gamepads überprüfen
        for (const gamepad of gamepads) {
            if (gamepad) {
                // Überprüfen ob Controller das Standard mapping verwendet
                if (gamepad.mapping === 'standard') {

                    // Rechter Joystick
                    const stickX = gamepad.axes[2];
                    const stickY = gamepad.axes[3];

                    //Links & Rechts überprüfen
                    if (stickX >= 1) {
                        left = speed + 1;
                        right = speed;
                        console.log("Moving right");
                    } else if (stickX <= -1) {
                        left = speed;
                        right = speed + 1;
                        console.log("Moving left");
                    } else if (stickX === 0 && (left || right)) {
                        left = speed;
                        right = speed;
                        console.log("Stopped Moving Left/Right")
                    }

                    //Vorwärts & Rückwärts überprüfen
                    if (stickY <= -1) {
                        left = speed;
                        right = speed;
                        console.log("Moving straight");
                    } else if (stickY >= 1) {
                        left = speed;
                        right = speed;
                        console.log("Moved back");
                    } else if (stickY === 0) {
                        left = 0;
                        right = 0;
                        console.log("Stopped Moving Forward/Backward");
                    }

                    // Linker Trigger (Langsamer), begrenzt auf 1 Eingabe pro 250 ms
                    let lastTriggerSlower = 0;
                    if (Date.now() - lastTriggerSlower > 250) {
                        if (gamepad.buttons[6].value) {
                            let drueckstaerke = gamepad.buttons[6].value;
                            speed += -(60 + drueckstaerke * (200 - 60));
                            console.log("Moving slower");
                            lastTriggerSlower = Date.now();
                        }
                    }


                    // Rechter Trigger (Schneller), begrenzt auf 1 Eingabe pro 250 ms
                    let lastTriggerFaster = 0;
                    if (Date.now() - lastTriggerFaster > 250) {
                        if (gamepad.buttons[7].value) {
                            let drueckstaerke = gamepad.buttons[6].value;
                            speed += 60 + drueckstaerke * (200 - 60);
                            console.log("Moving faster");
                            lastTriggerFaster = Date.now();
                        }
                    }

                    // Linker Trigger (SuicidePrevention), begrenzt auf 1 Eingabe pro 250 ms
                    if (Date.now() - lastTriggerSuicidePrevention > 250) {
                        if (gamepad.buttons[4].pressed && document.getElementById("suicidePrevention").checked) {
                            document.getElementById("suicidePrevention").checked = false;
                            console.log("SuicidePrevention deactivated");
                            lastTriggerSuicidePrevention = Date.now();
                        } else if (gamepad.buttons[6].pressed) {
                            document.getElementById("suicidePrevention").checked = true;
                            console.log("SuicidePrevention activated");
                            lastTriggerSuicidePrevention = Date.now();
                        }
                    }

                    // Rechter Trigger (LineFollower), begrenzt auf 1 Eingabe pro 250 ms
                    if (Date.now() - lastTriggerLineFollower > 250) {
                        if (gamepad.buttons[5].pressed && document.getElementById("lineFollower").checked) {
                            document.getElementById("lineFollower").checked = false;
                            console.log("LineFollower deactivated");
                            lastTriggerLineFollower = Date.now();
                        } else if (gamepad.buttons[7].pressed) {
                            document.getElementById("lineFollower").checked = true;
                            console.log("LineFollower activated");
                            lastTriggerLineFollower = Date.now();
                        }
                    }
                } else {
                    console.log("Connected Controller doesn't support standard mapping");
                }
            }
        }
    } catch (error) {
        console.log(`Error while checking controller inputs: ${error}`);
    }
}

//Nachricht an Server senden
async function sendToMBot2() {
    try {
        //Linken Motor limitieren
        if(left > 999) {
            left -= 1;
        }

        //Rechten Motor limitieren
        if(right > 999) {
            right -= 1;
        }

        //JSON für MBot (Motorengeschwindigkeit)
        const data = {
            links: left,
            rechts: right
        }
        //Daten durch WebSocket über Server zu MBot2 senden
        const json = JSON.stringify(data);
        socket.send(encoder.encode(json));

    } catch (error) {
        console.log(`Error while sending Commands to TCP-Server: ${error}`);
    }
}

//Verbindung mit MBot herstellen
async function connectToMBot2() {
    try {
        //Kommunikation mit MBot2 freigeben
        initialized = true;

        //Verbindung des ausgewählten MBots senden
        //socket.send(possibleMBot2sToConnect[mBotID]);                         //Entkommentieren, um Funktionalität wieder herzustellen
        socket.send("TEST");                                                //DEBUG (diese Zeile löschen)
        await communicating();

        console.log("MBot2 connected & communicating");
    } catch (error) {
        console.log(`Error while connecting to MBot: ${error}`);
    }
}

//Von MBot2 trennen
function disconnectFromMBot2() {
    try {
        //Kommunikation beenden
        initialized = false;

        //Trennen nachricht senden
        socket.send("Disconnect");
        connected = false;

        console.log("MBot2 disconnected");
    } catch (error) {
        console.log(`Error while disconnecting from MBot: ${error}`);
    }
}

//Wenn Client WebApp verlässt/zumacht, dann Verbindung beenden
window.addEventListener("beforeunload", function () {
    try {
        socket.send("Close");
        socket.close();
    } catch (error) {
        console.log(`Error while closing Connection with Server: ${error}`);
    }
});