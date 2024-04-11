const iconClose = document.querySelector('.icon-close');
const acceptTerms = document.querySelector('.acceptTerms');
const buttonLogin = document.querySelector('#login');
const buttonRegister = document.querySelector('#register');
const terms = document.querySelector('#terms');
const password = document.querySelector('#passw_reg');
const main = document.querySelector('.main');
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');


document.addEventListener('DOMContentLoaded', function () {
    const iconMenu = document.querySelector('.icon-menu');
    const navigation = document.querySelector('.navigation');

    iconMenu.addEventListener('click', function () {
        navigation.classList.toggle('active');
    });
});

document.addEventListener('scroll', function () {
    const parallaxText = document.getElementById('parallax-text');
    const scrollPosition = window.scrollY;

    // Adjust the value (0.5) to control the speed of the parallax effect
    parallaxText.style.transform = 'translate(-50%, ' + scrollPosition * 0.3 + 'px)';
});

// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

let counter = 1;

function slide() {
    if (counter >= slider.children.length) {
        counter = 0;
    }
    slider.style.transform = 'translateX(' + (-counter * 100) + '%)';
    counter++;
}

function prevSlide() {
    if (counter <= 0) {
        counter = slider.children.length - 1;
    } else {
        counter--;
    }
    slider.style.transform = 'translateX(' + (-counter * 100) + '%)';
}

function nextSlide() {
    if (counter >= slider.children.length - 1) {
        counter = 0;
    } else {
        counter++;
    }
    slider.style.transform = 'translateX(' + (-counter * 100) + '%)';
}

    setInterval(slide, 8000); // Change slide every 3 seconds


