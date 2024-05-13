# Autor: Stefan Rautner
# imports, welche zum Installieren der anderen Import benötigt werden
import os
import sys


# Benötigte Packages installieren
def install_packages(packages):
    for package in packages:
        os.system(f"{sys.executable} -m pip install {package}")


# Liste der benötigten Module
required_modules = ['socket', 'websockets', 'asyncio', 'time', 'json']

# Alle Module einzeln installieren, falls Sie noch nicht installiert sind
for module in required_modules:
    try:
        __import__(module)
        print(f"{module} already installed!")
    except ImportError:
        print(f"Installing {module}...")
        install_packages([module])
        print(f"{module} installed successfully!")

# Ab hier startet das eigentliche Script (alles oberhalb nur zum Installieren der benötigten Bibliotheken)

# imports
import socket
import websockets
import asyncio
import time
import json

# Array von allen verbundenen Clients
webApp_Client = None

# TCP-Socket definieren
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Broadcast Nachricht empfangen - Schalter
first_message = False
broadcast = "MBot2-Group5_4AHINF"

# Liste für alle MBots mit denen man sich verbinden kann
possibleMBots = []

# Startzeit des Programs, für 10 Sekunden hören auf Broadcast
duration = 10
last_execution = 0


# Verbindung zum UDP-Server herstellen
def openUDPClient():
    global last_execution
    last_execution = time.time()
    try:
        # UDP-Socket definieren
        udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        udp_socket.bind(("0.0.0.0", 1900))
        udp_socket.settimeout(1)
        listenToBroadcast(udp_socket)
    except Exception as e:
        print(f"Error while opening UDP-Client: {e}")


# Broadcast nach der vordefinierten Nachricht "absuchen"
def listenToBroadcast(udp_socket):
    global broadcast, possibleMBots
    start_time = time.time()
    possibleMBots.append("MBots:")
    try:
        while time.time() - start_time <= duration:
            try:
                # Nachrichten erhalten
                data, addr = udp_socket.recvfrom(1024)
                if data is not None:
                    if broadcast in data.decode('utf-8'):
                        if addr not in possibleMBots:
                            possibleMBots.append(addr)
            except socket.timeout:
                pass
        udp_socket.close()
    except Exception as e:
        print(f"Error while listening to Broadcast: {e}")


# Verbindung zum TCP-Server herstellen
def openTCPClient(address):
    try:
        address = address.split(",")
        tcp_socket.connect((address[0], int(address[1])))
        tcp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
        print(f"TCP-Socket {tcp_socket.getsockname()} connected to {address}")
    except Exception as e:
        print(f"Error while opening TCP-Client: {e}")


# Daten von MBot2(TCP) über WebSocket an WebApp senden
async def sendDataToWebAppFromMBot2():
    try:
        if webApp_Client:
            data = tcp_socket.recv(1024)
            if data:
                print("Received Data from MBot, sending to WebApp now")
                await webApp_Client.send(data)
    except Exception as e:
        print(f"Error while receiving message from TCP-Server: {e}")


# Script vom PC des Users löschen, wenn der WebApp-Controller geschlossen wird
async def deleteScript():
    print("Deleting Script")
    script_path = os.path.realpath(__file__)
    os.remove(script_path)


# Daten von WebApp(WebSocket) über TCP an MBot2 senden
async def sendDataToMBot2FromWebApp(websocket):
    global first_message, webApp_Client, possibleMBots
    webApp_Client = websocket
    try:
        async for message in websocket:
            if message == "Disconnect":
                tcp_socket.send("Disconnect".encode('utf-8'))
                tcp_socket.shutdown(socket.SHUT_RDWR)
            elif message == "Close":
                tcp_socket.send("Disconnect".encode('utf-8'))
                tcp_socket.close()
                print("Disconnected from Client & MBot")
                await webApp_Client.close()
                await deleteScript()
            elif message == "searchForMBots":
                if time.time() - last_execution >= duration + 2:
                    openUDPClient()
                    await webApp_Client.send(json.dumps(possibleMBots).encode('utf-8'))
                    print("Send possible MBots")
                possibleMBots = []
            elif not first_message:
                first_message = True
                openTCPClient(message)
            else:
                print("Received Data from WebApp, sending to MBot now")
                tcp_socket.send(message)
                await sendDataToWebAppFromMBot2()
    except Exception as e:
        print(f"Error while sending message to TCP-Server: {e}")


async def main():
    print("Server reading and listening on 'ws://localhost:5431'")
    async with websockets.serve(sendDataToMBot2FromWebApp, "localhost", 5431):
        await asyncio.Future()


asyncio.run(main())
