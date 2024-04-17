# Autor: Stefan Rautner

# imports
import websockets
import asyncio
import json

# Array von allen verbundenen Clients
webApp_Client = None



# Daten von MBot2(TCP) über WebSocket an WebApp senden
async def sendDataToWebAppFromMBot2():
    try:
        if webApp_Client:
            data = {
                "gyroscopePitch": 100,  # Daten des Gyrosensors (Vorwärts & Rückwärts), x-Achse
                "gyroscopeYaw": 100,  # Daten des Gyrosensors (Links & Rechts), y-Achse
                "gyroscopeRoll": 100,  # Daten des Gyroscopesensors (Oben & Unten), z-Achse
                "accelerometer": 10,  # Daten des Beschleunigungsmessers
                # Daten des RGB-Sensors(Lichtsensors), Links
                "rgbSensorLeft": "black",
                # Daten des RGB-Sensors(Lichtsensors), Mitte Links
                "rgbSensorMiddleLeft": "black",
                # Daten des RGB-Sensors(Lichtsensors), Mitte Rechts
                "rgbSensorMiddleRight": "black",
                # Daten des RGB-Sensors(Lichtsensors), Rechts
                "rgbSensorRight": "black",
                "ultrasonicSensor": 9.99  # Daten des Ultraschallsensors
            }
            if data:
                data = json.dumps(data)
                print("Received Data from MBot, sending to WebApp now")
                await webApp_Client.send(data.encode('utf-8'))
    except Exception as e:
        print(f"Error while receiving message from TCP-Server: {e}")


# Daten von WebApp(WebSocket) über TCP an MBot2 senden
async def sendDataToMBot2FromWebApp(websocket):
    global first_message, webApp_Client, possibleMBots
    webApp_Client = websocket
    try:
        async for message in websocket:
                await sendDataToWebAppFromMBot2()
    except Exception as e:
        print(f"Error while sending message to TCP-Server: {e}")


async def main():
    async with websockets.serve(sendDataToMBot2FromWebApp, "localhost", 5431):
        await asyncio.Future()


asyncio.run(main())
