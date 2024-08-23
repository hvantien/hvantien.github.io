let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
let isScrolling = false;
let isPopupOpen = false;

let touchStartY = 0;
let touchEndY = 0;

const moreButton = document.querySelector('.more-button');

// Prevent touch events on the more-button
moreButton.addEventListener('touchstart', (event) => {
    event.stopImmediatePropagation(); // Stops other touchstart listeners from being triggered
}, { passive: false });

moreButton.addEventListener('touchend', (event) => {
    event.stopImmediatePropagation(); // Stops other touchend listeners from being triggered
}, { passive: false });

document.addEventListener('wheel', (event) => {
    if (!isScrolling && !isPopupOpen) {
        if (event.deltaY > 0) {
            nextSection();
        } else {
            prevSection();
        }
    } else if (isPopupOpen) {
        // Optional: You can handle specific scroll behavior when the modal is open
        console.log("Modal is open, scrolling disabled.");
    }
});

document.addEventListener('touchstart', (event) => {
    if (!isPopupOpen) {
        touchStartY = event.touches[0].clientY;
    }
}, false);

document.addEventListener('touchmove', (event) => {
    if (!isPopupOpen) {
        touchEndY = event.touches[0].clientY;
    }
}, false);

document.addEventListener('touchend', () => {
    if (!isScrolling && !isPopupOpen) {
        handleTouchScroll();
    }
}, false);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (!isScrolling) {
            scrollToSection(index);
        }
    });
});

function handleTouchScroll() {
    if (touchStartY - touchEndY > 50) {
        nextSection();
    } else if (touchEndY - touchStartY > 50) {
        prevSection();
    }
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
    }
}

function prevSection() {
    if (currentSection > 0) {
        currentSection--;
        scrollToSection(currentSection);
    }
}

function scrollToSection(index) {
    isScrolling = true;
    window.scrollTo({
        top: sections[index].offsetTop,
        behavior: 'smooth'
    });
    updateDots(index);
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

function updateDots(index) {
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    currentSection = index;
}

function checkCurrentSection() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    sections.forEach((section, index) => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            updateDots(index);
        }
    });
}

window.addEventListener('load', checkCurrentSection);
window.addEventListener('scroll', checkCurrentSection);

function openModal() {
    isPopupOpen = true;
    document.body.classList.add('no-scroll');
    window.removeEventListener('scroll', checkCurrentSection);
}

function closeModal() {
    isPopupOpen = false;
    document.body.classList.remove('no-scroll');
    window.addEventListener('scroll', checkCurrentSection);
}

const modalElement = document.getElementById('exampleModal');
modalElement.addEventListener('shown.bs.modal', openModal);
modalElement.addEventListener('hidden.bs.modal', closeModal);

const countdownDate = new Date("September 22, 2024 00:00:00").getTime();

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