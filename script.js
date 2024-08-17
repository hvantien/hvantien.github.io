let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
let isScrolling = false;
let isPopupOpen = false;

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