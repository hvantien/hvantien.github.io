window.addEventListener('DOMContentLoaded', function () {
    const loader = document.getElementById('heart-loader');
    const loaderBackground = document.getElementById('heart-loader-background');
    const container = document.querySelector('.container-fluid');
    const images = document.querySelectorAll('.lazy-load-image');
    let imagesLoaded = 0;
    const totalImages = images.length;

    // Hide container initially
    container.style.display = 'none';

    // Check if images are already loaded
    images.forEach(image => {
        if (image.complete) {
            imagesLoaded++;
            hideLoaderIfReady();
        } else {
            image.addEventListener('load', () => {
                imagesLoaded++;
                hideLoaderIfReady();
            });
            image.addEventListener('error', () => {
                imagesLoaded++;
                hideLoaderIfReady();
            });
        }
    });

    // Function to hide loader if all images are loaded
    function hideLoaderIfReady() {
        if (imagesLoaded === totalImages) {
            loader.style.display = 'none'; // Hide loader
            loaderBackground.style.display = 'none'; // Hide background overlay
            container.style.display = 'block'; // Show container
        }
    }
});

// Countdown Timer
const countdownDate = new Date("September 22, 2024 00:00:00 GMT+0000").getTime(); // Ensure timezone is set correctly

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
        document.getElementById('days').textContent = "00";
        document.getElementById('hours').textContent = "00";
        document.getElementById('minutes').textContent = "00";
        document.getElementById('seconds').textContent = "00";
        clearInterval(interval);
    } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days < 10 ? `0${days}` : days;
        document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
    }
};

const interval = setInterval(updateCountdown, 1000);
updateCountdown();
