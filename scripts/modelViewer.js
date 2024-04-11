//Autor: Patrick Thor
export function updateOrientation(roll, pitch, yaw){
    document.querySelector("model-viewer#mbot2Model").orientation = `${roll}deg ${pitch}deg ${yaw}deg`;
}

window.updateOrientation = updateOrientation;