// Captions array (exact order as specified)
const captions = [
    "Will you be my Valentines? ❤️",
    "I am now in the toilet begging you 🚽🙏",
    "How about this egg photo of you, will this be enough to convince you? 🥚",
    "How about a big bribe with your favorite Radler? 🍺",
    "How about another trip to Europe will you maybe consider to be my Valentines? ✈️🇪🇺",
    "Ok, I guess a romantic getaway isnt what you're looking for, how about another day stuck in spain? 🇪🇸",
    "How about your favorite, (totally not mine) China? 🇨🇳",
    "I've got another embarrassing photo of you? 📸",
    "I am literally like this rn 😭",
    "Now i am like this 😢",
    "Dolomites maybe? 🏔️",
    "How about a sexy babe pic? 😍",
    "Ok, this time really, just say yes! 🙏",
    "You're just so pretty, I had to show you another time 💕",
    "Ok, ok, I will work hard for us! 💪",
    "ok, you gotta admit that the sky full of clouds is nice, on a side note, i am still asking you out for valentines day btw ☁️",
    "Another nice photo of us... 📷",
    "Sun.. Sun.. Sun, you know what would make my life full of sunshine and rainbows? you finally saying yes... ☀️🌈",
    "Yeap, I am quite exhausted now... PLEASEEEEE 😩🙏",
    "I am totally not desperate... 😅",
    "Low key about to give up 😔",
    "About to give up soon... 😞",
    "jk, not so fast beach! 🏖️",
    "BUT PLEASEEEEE JUST SAY YESSSS 🙏",
    "Ok, this is really my last one, c'monnnnnnn 🥺",
    "ok, too bad, you're my valentines, see you 14 feb :) ❤️🌹"
];

// State management
let currentImageIndex = 0;
let isYesClicked = false;
let noLoopInterval = null;
let autoPlayInterval = null;
let noButtonScale = 1.0; // Track No button scale
let yesButtonScale = 1.0; // Track Yes button scale

// PNG image numbers (images that are PNG format)
const pngImages = [3, 8, 9, 10, 11, 13, 14, 19, 20, 23, 24];

// Get image file extension based on image number
function getImageExtension(imageNumber) {
    return pngImages.includes(imageNumber) ? 'PNG' : 'JPG';
}

// Get image path for a given image number
function getImagePath(imageNumber) {
    const ext = getImageExtension(imageNumber);
    return `/photos/${imageNumber}.${ext}`;
}

// DOM elements
const imageElement = document.getElementById('valentine-image');
const captionElement = document.getElementById('caption-text');
const yesButton = document.getElementById('yes-btn');
const noButton = document.getElementById('no-btn');
const successMessage = document.getElementById('success-message');
const imageContainer = document.getElementById('image-container');
const captionContainer = document.getElementById('caption-container');
const buttonsContainer = document.getElementById('buttons-container');

// Preload all images
function preloadImages() {
    const images = [];
    for (let i = 1; i <= 26; i++) {
        const img = new Image();
        img.src = getImagePath(i);
        images.push(img);
    }
    return images;
}

// Initialize image preloading
preloadImages();

// Update image and caption
function updateImage(index) {
    // Fade out
    imageContainer.classList.add('fade-out');
    captionContainer.classList.add('fade-out');
    
    setTimeout(() => {
        const imageNumber = index + 1;
        imageElement.src = getImagePath(imageNumber);
        captionElement.textContent = captions[index];
        
        // Fade in
        imageContainer.classList.remove('fade-out');
        imageContainer.classList.add('fade-in');
        captionContainer.classList.remove('fade-out');
        captionContainer.classList.add('fade-in');
        
        setTimeout(() => {
            imageContainer.classList.remove('fade-in');
            captionContainer.classList.remove('fade-in');
        }, 300);
    }, 150);
}

// Handle Yes button click
function handleYes() {
    if (isYesClicked) return;
    
    isYesClicked = true;
    
    // Clear any existing intervals
    if (noLoopInterval) {
        clearInterval(noLoopInterval);
        noLoopInterval = null;
    }
    
    // Show success message
    successMessage.classList.remove('hidden');
    
    // Hide buttons
    buttonsContainer.style.display = 'none';
    
    // Auto-play remaining images
    autoPlayInterval = setInterval(() => {
        currentImageIndex++;
        
        if (currentImageIndex >= 26) {
            clearInterval(autoPlayInterval);
            return;
        }
        
        updateImage(currentImageIndex);
    }, 1000);
}

// Update button scales using CSS custom properties for better layout control
function updateButtonScales() {
    // Use CSS custom properties to maintain proper spacing
    document.documentElement.style.setProperty('--yes-scale', yesButtonScale);
    document.documentElement.style.setProperty('--no-scale', noButtonScale);
    
    // Dynamically adjust gap to maintain spacing between buttons
    // Calculate gap based on the larger button to prevent overlap
    const baseGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--button-gap')) || 20;
    const maxScale = Math.max(yesButtonScale, noButtonScale);
    // Increase gap proportionally to button sizes, but not too much
    const adjustedGap = baseGap + (maxScale - 1) * 10;
    buttonsContainer.style.gap = `${adjustedGap}px`;
}

// Handle No button click
function handleNo() {
    if (isYesClicked) return;
    
    // Shrink No button by 5%
    noButtonScale = Math.max(0.15, noButtonScale * 0.95); // Don't go below 15% of original size
    
    // Grow Yes button by 5% each time No is clicked (cap at 200% to prevent overflow)
    yesButtonScale = Math.min(2.0, yesButtonScale * 1.05);
    
    updateButtonScales();
    
    // Clear any existing no loop interval
    if (noLoopInterval) {
        clearInterval(noLoopInterval);
        noLoopInterval = null;
    }
    
    currentImageIndex++;
    
    if (currentImageIndex >= 26) {
        // Loop image 26 every 1 second
        currentImageIndex = 25; // Keep at index 25 (image 26)
        noLoopInterval = setInterval(() => {
            // Continue shrinking during loop
            noButtonScale = Math.max(0.15, noButtonScale * 0.95);
            
            // Continue growing Yes button during loop (with cap)
            yesButtonScale = Math.min(2.0, yesButtonScale * 1.05);
            
            updateButtonScales();
            
            // Trigger a visual update to show it's looping
            imageContainer.classList.add('fade-out');
            setTimeout(() => {
                imageContainer.classList.remove('fade-out');
                imageContainer.classList.add('fade-in');
                setTimeout(() => {
                    imageContainer.classList.remove('fade-in');
                }, 300);
            }, 150);
        }, 1000);
    } else {
        updateImage(currentImageIndex);
    }
}

// Event listeners
yesButton.addEventListener('click', handleYes);
noButton.addEventListener('click', handleNo);

// Initialize button scales
updateButtonScales();

// Initialize with first image
updateImage(0);
