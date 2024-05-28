import json
import socket
import time

tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
udp_socket.bind(("0.0.0.0", 1900))
udp_socket.settimeout(1)
possibleMBots = []
start_time = time.time()
while time.time() - start_time <= 5:
    try:
        data, addr = udp_socket.recvfrom(1024)
        if data is not None:
            if "MBot2-Group5_4AHINF" in data.decode('utf-8'):
                if addr not in possibleMBots:
                    possibleMBots.append(addr)
    except socket.timeout:
        pass
udp_socket.close()
address = possibleMBots[0]
tcp_socket.connect((address[0], int(address[1])))
tcp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)

print("Connected")

while True:
    data = json.dumps({
        "links": 0,     # Geschwindigkeit linker Motor
        "rechts": 0,    # Geschwindigkeit rechter Motor
        "leftLED": "ffffff",
        "leftMiddleLED": "ffffff",
        "middleLED": "ffffff",
        "rightMiddleLED": "ffffff",
        "rightLED": "ffffff",
        "suicidePrevention": "false"
    })
    tcp_socket.send(data.encode('utf-8'))

# Maximale Geschwindigkeit vorwärts herausfinden (= geradeaus fahren)
# Maximale Geschwindigkeit rechts/links herausfinden (wird zur vorwärts Geschwindigkeit addiert) (= Kurven fahren)
