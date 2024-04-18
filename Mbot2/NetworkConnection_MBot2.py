# Autor: Stefan Rautner

#imports
import time
import json
import usocket
import network
import cyberpi

# Variablen definieren
UDP_socket = usocket.socket(usocket.AF_INET, usocket.SOCK_DGRAM)
TCP_socket = usocket.socket(usocket.AF_INET, usocket.SOCK_STREAM)

# Script startet erst, wenn auf MBot2 Knopf A gedrückt wurde
cyberpi.console.print("A druecken um zu Starten")
while not cyberpi.controller.is_press('a'):
    pass
cyberpi.console.clear()

# Signalisieren, dass der MBot2 eingeschalten ist
cyberpi.led.on(0, 0, 255)

# Verbindung definieren
host = ""
port = 5431

# WLAN-Verbindung initialisieren
wifi = network.WLAN(network.STA_IF)
try:
    wifi.active(True)
    wifi.connect('htljoh-public', 'joh12345')
except Exception as e:
    cyberpi.console.print("Error at initializing Connection to WLAN: " + str(e))

try:
    # Warten auf Verbindung mit Netzwerk
    while not wifi.isconnected():
        cyberpi.console.clear()
        cyberpi.console.print("Getting IP-Address")
        time.sleep(1)
    cyberpi.led.on(0, 255, 0)
    host = wifi.ifconfig()[0]
    cyberpi.console.clear()
    cyberpi.console.print(host)
    time.sleep(1)
except Exception as e:
    cyberpi.console.clear()
    cyberpi.console.print("Error connecting to the network: " + str(e))
    cyberpi.led.on(255, 0, 0)
    time.sleep(5)

# Benutzerdefinierte Broadcast-Nachricht
broadcast_message = "MBot2-Group5_4AHINF"

try:
    # TCP-Server erstellen (max. 1 Verbindung)
    TCP_socket.bind((host, port))
    TCP_socket.listen(1)
    TCP_socket.settimeout(0.1)
except Exception as e:
    cyberpi.console.clear()
    cyberpi.console.print("Error creating TCP-Server: " + str(e))
    cyberpi.led.on(255, 0, 0)
    time.sleep(5)

# UDP Socket erstellen
try:
    # UDP-Socket erstellen
    UDP_socket.bind((host, port))
except Exception as e:
    cyberpi.console.clear()
    cyberpi.console.print("Error creating UDP-Socket: " + str(e))
    cyberpi.led.on(255, 0, 0)
    time.sleep(5)


# Funktion, um Nachricht von Client zu verarbeiten
def onMessage(receivedMessage):
    try:
        if receivedMessage == "Disconnect":
            TCP_socket.close()
            return True
        else:
            # Nachricht verarbeiten
            data = json.loads(receivedMessage)

            # Variablen aus JSON extrahieren
            left = data.get("links", 0)
            right = -data.get("rechts", 0)

            # Rückleuchten & Ton entsprechend der Richtung (duplikate, weil delay beim Verarbeiten der Daten & dadurch kurz alles weiß)
            if -left == right and left >= 0:
                cyberpi.led.on(255, 0, 0, id=1)
                cyberpi.led.on(255, 255, 255, id=2)
                cyberpi.led.on(255, 255, 255, id=3)
                cyberpi.led.on(255, 255, 255, id=4)
                cyberpi.led.on(255, 0, 0, id=5)
            elif -left == right and left < 0:
                cyberpi.led.on(255, 255, 255, id=1)
                cyberpi.led.on(255, 0, 0, id=2)
                cyberpi.led.on(255, 0, 0, id=3)
                cyberpi.led.on(255, 0, 0, id=4)
                cyberpi.led.on(255, 255, 255, id=5)
                cyberpi.audio.add_vol(100)
                cyberpi.audio.play_tone(1000, 0.3)
            elif -left != right and -left < right:
                cyberpi.led.on(255, 0, 0, id=1)
                cyberpi.led.on(255, 255, 255, id=2)
                cyberpi.led.on(255, 255, 255, id=3)
                cyberpi.led.on(255, 255, 255, id=4)
                cyberpi.led.on(255, 255, 0, id=5)
                time.sleep(0.05)
                cyberpi.led.off(id=5)
            elif -left != right and right < -left:
                cyberpi.led.on(255, 255, 0, id=1)
                cyberpi.led.on(255, 255, 255, id=2)
                cyberpi.led.on(255, 255, 255, id=3)
                cyberpi.led.on(255, 255, 255, id=4)
                cyberpi.led.on(255, 0, 0, id=5)
                time.sleep(0.05)
                cyberpi.led.off(id=1)

            # Motoren Geschwindigkeit setzen
            cyberpi.mbot2.drive_power(left, right)
    except Exception as ex:
        cyberpi.console.clear()
        cyberpi.console.print("Error at processing Data from Client: " + str(ex))
        cyberpi.led.on(255, 0, 0)
        time.sleep(5)
        return False
    return False


# Funktion, um Nachricht an Client zu senden
def sendMessage():
    try:
        response_data = {
            "gyroscopePitch": cyberpi.get_pitch(),  # Daten des Gyrosensors (Vorwärts & Rückwärts), x-Achse
            "gyroscopeYaw": cyberpi.get_yaw(),  # Daten des Gyrosensors (Links & Rechts), y-Achse
            "gyroscopeRoll": cyberpi.get_roll(),  # Daten des Gyroscopesensors (Oben & Unten), z-Achse
            "accelerometer": cyberpi.get_acc("y"),  # Daten des Beschleunigungsmessers
            # Daten des RGB-Sensors(Lichtsensors), Links
            "rgbSensorLeft": cyberpi.quad_rgb_sensor.get_color_sta(4, index=1),
            # Daten des RGB-Sensors(Lichtsensors), Mitte Links
            "rgbSensorMiddleLeft": cyberpi.quad_rgb_sensor.get_color_sta(3, index=1),
            # Daten des RGB-Sensors(Lichtsensors), Mitte Rechts
            "rgbSensorMiddleRight": cyberpi.quad_rgb_sensor.get_color_sta(2, index=1),
            # Daten des RGB-Sensors(Lichtsensors), Rechts
            "rgbSensorRight": cyberpi.quad_rgb_sensor.get_color_sta(1, index=1),
            "ultrasonicSensor": cyberpi.ultrasonic2.get(index=1)  # Daten des Ultraschallsensors
        }
        return json.dumps(response_data)
    except Exception as ex:
        cyberpi.console.clear()
        cyberpi.console.print("Error at formating Sensordata to JSON " + str(ex))
        cyberpi.led.on(255, 0, 0)
        time.sleep(5)


while True:
    try:
        # Senden der Broadcast-Nachricht
        UDP_socket.sendto(broadcast_message.encode('utf-8'), ("255.255.255.255", 1900))
    except Exception as e:
        cyberpi.console.clear()
        cyberpi.console.print("Error at sending Broadcast: " + str(e))
        cyberpi.led.on(255, 0, 0)
        time.sleep(5)

    try:
        # Auf Client-Verbindung warten
        connection, address = TCP_socket.accept()
        if connection:
            TCP_socket = connection
            cyberpi.console.clear()
            cyberpi.console.print("Mit Steuerung" + str(address) + "verbunden")
            time.sleep(5)
            cyberpi.console.clear()
            UDP_socket.close()
            break
    except OSError:
        time.sleep(1)
    except Exception as e:
        cyberpi.console.clear()
        cyberpi.console.print("Error at connecting to Client: " + str(e))
        cyberpi.led.on(255, 0, 0)
        time.sleep(5)

try:
    while True:
        closed = False
        # Nachricht empfangen
        try:
            message = TCP_socket.recv(4096).decode('utf-8')
            length = len(message)
            if 22 <= length <= 28:
                closed = onMessage(message)
                cyberpi.console.clear()
                cyberpi.console.print("Message received from WebApp")
        except OSError:
            cyberpi.console.clear()
            cyberpi.console.print("No message received")

        # Überprüfen ob Verbindung getrennt wurde
        if closed:
            TCP_socket.close()
            cyberpi.console.clear()
            cyberpi.console.print("Disconnected")
            TCP_socket.shutdown(usocket.SHUT_RDWR)
            break

        # Antwort senden
        try:
            response = sendMessage()
            if response:
                TCP_socket.send(response.encode('utf-8'))
                cyberpi.console.clear()
                cyberpi.console.print("Message sent to WebApp")
        except Exception as e:
            cyberpi.console.clear()
            cyberpi.console.print("Error at sending message " + str(e))
            cyberpi.led.on(255, 0, 0)

        # Timeout um jede millisekunde auf eingehende Nachrichten zu überprüfen & die Sensordaten zu senden
        time.sleep(0.001)
except Exception as e:
    cyberpi.console.clear()
    cyberpi.console.print("Error at sending/receiving a message: " + str(e))
    cyberpi.led.on(255, 0, 0)
    time.sleep(5)

# TCP-Socket schließen
TCP_socket.close()
