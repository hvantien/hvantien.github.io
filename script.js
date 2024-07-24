let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
const shows = document.querySelectorAll('.show');
const video = document.getElementById('video1');
const videoSource = document.getElementById('video-source');
let isScrolling = false;
let isPopupOpen = false;

function checkScreenSize() {
    if (window.innerWidth <= 1024 && (window.innerWidth * 2 < window.innerHeight)) {
        videoSource.src = 'session1-mobile-lang.mp4';
    } else if (window.innerWidth <= 1024) {
        videoSource.src = 'session1-mobile.mp4';
    } else {
        videoSource.src = 'session1.mp4';
    }
    video.load();
}

checkScreenSize();

window.addEventListener('resize', checkScreenSize);

let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('wheel', (event) => {
    if (!isScrolling && !isPopupOpen) {
        if (event.deltaY > 0) {
            nextSection();
        } else {
            prevSection();
        }
    }
});

document.addEventListener('touchstart', (event) => {
    touchStartY = event.touches[0].clientY;
}, false);

document.addEventListener('touchmove', (event) => {
    touchEndY = event.touches[0].clientY;
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
        if (index === 0) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0;
        }
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

const openPopupBtn = document.getElementById('open-popup-btn');
const closePopupBtn = document.getElementById('close-popup-btn');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popup-overlay');

openPopupBtn.addEventListener('click', () => {
    popup.classList.add('active');
    popupOverlay.classList.add('active');
    isPopupOpen = true;  // Set popup open state to true
});

closePopupBtn.addEventListener('click', () => {
    popup.classList.remove('active');
    popupOverlay.classList.remove('active');
    setTimeout(() => {
        isPopupOpen = false;  // Set popup open state to false
    }, 300); // Match the transition duration
});

popupOverlay.addEventListener('click', () => {
    popup.classList.remove('active');
    popupOverlay.classList.remove('active');
    setTimeout(() => {
        isPopupOpen = false;  // Set popup open state to false
    }, 300); // Match the transition duration
});
