const modelViewerTransform = document.querySelector("model-viewer#mbot2Model");

let roll = 0;
let pitch = 3;
let yaw = 0;


const updateOrientation = () => {
    modelViewerTransform.orientation = `${roll}deg ${pitch}deg ${yaw}deg`;
    yaw = yaw+0.2;
    setTimeout(updateOrientation,10);
  };

  updateOrientation();


  let icon_close = document.querySelector('.icon-close');
  let wrapper = document.querySelector('.wrapper');
  let main = document.querySelector('.main-controll-page');

  icon_close.addEventListener('click', function () {
    wrapper.style.display = 'none';
    main.style.display = 'block';
    main.style.pointerEvents = 'auto'; // Re-enable pointer events
    main.style.opacity = '1'; // Set opacity back to 1
});