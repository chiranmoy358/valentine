const textEl = document.getElementById("text");
const catGif = document.getElementById("catGif");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const achievement = document.getElementById("achievement");
const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

let noCount = 0;
let noScale = 1;
let chaseCount = 0;
let noTranslateX = 0;
let noTranslateY = 0;
let chaseMode = false;
let buttonsSwapped = false;
let yesScale = 1;
let minMoveDistance = 140;
let finalDare = false;

const gifs = {
    confident: "https://media.tenor.com/g7q3rx0uoIUAAAAi/mochi-mochimochi.gif",
    smug: "https://media1.tenor.com/m/ZkMfy0jHXM0AAAAC/peach-goma.gif",
    nervous: "https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif",
    angry: "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif",
    veryAngry: "https://media.giphy.com/media/Qr8JE9Hvi7ave/giphy.gif",
    begging: "https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif",
    explosion: "https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif",
    happy: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
};

const messages = [
    "You’re in luck. I’ve chosen you to be my Valentine.",
    "That’s the wrong button. It’s okay, I’ll help you.",
    "Hey. Stop that.",
    "You’re doing this on purpose now.",
    "Wait—why did they switch?",
    "I’m not letting you do this.",
    "WHY are you still trying?",
    "Please. Just click Yes.",
    "I made this website."
];

init();

function init() {
    typeText(messages[0]);
    catGif.src = gifs.confident;
}

noBtn.addEventListener("click", () => {
    if (!chaseMode) {
        // Normal early clicks
        registerNo();
    } else if (isTouchDevice) {
        // Mobile: tap counts as a catch
        registerNo();
    }
});

noBtn.addEventListener("mouseenter", () => {
    if (chaseMode && !isTouchDevice) {
        registerNo();
    }
});

function registerNo() {
    shrinkNoButton();
    noCount++;
    growYes();

    if (navigator.vibrate) {
        navigator.vibrate(30);
    }

    if (noCount === 1) {
        catGif.src = gifs.smug;
        typeText(messages[1]);
        browserWarning("This action may cause feelings.");
        showAchievement("Achievement unlocked: Curious");
    }
    else if (noCount === 2) {
        catGif.src = gifs.nervous;
        typeText(messages[2]);
    }
    else if (noCount === 3) {
        catGif.src = gifs.angry;
        typeText(messages[3]);
        shake();
    }
    else if (noCount === 4) {
        swapButtons();
        typeText(messages[4]);
        shake();
        browserWarning("Unexpected user behavior detected.");
    }
    else if (noCount === 5) {
        swapButtons();
        catGif.src = gifs.veryAngry;
        typeText(messages[5]);
        shake();
    }
    else if (noCount === 6) {
        chaseMode = true;
        catGif.src = gifs.veryAngry;
        typeText(messages[6]);
        moveNo();
        shake();
        browserWarning("System recommends selecting Yes.");
        showAchievement("Achievement Unlocked: Persistent");
    }
    else if (noCount < 10) {
        chaseCount++;
        if (chaseCount === 2) {
            showAchievement("Achievement Unlocked: Testing My Patience");
        }
        minMoveDistance += 30;

        if (chaseCount % 2 === 0) {
            catGif.src = chaseCount >= 4 ? gifs.begging : gifs.veryAngry;
            typeText(messages[Math.min(6 + Math.floor(chaseCount / 2), messages.length - 1)]);
        }

        moveNo();
        shake();
    }
    else if (!finalDare) {
        // Enter final dare mode
        noBtn.classList.add("danger");
        finalDare = true;
        chaseMode = false;

        // Stop movement, keep it tiny
        noTranslateX = 0;
        noTranslateY = 0;
        applyNoTransform();

        // Taunt
        typeText("Go on. Click it one last time.");
        showAchievement("💀 Final Warning Unlocked");

        // Make it feel dangerous
        noBtn.style.boxShadow = "0 0 12px rgba(255,0,0,0.6)";
        shake();
    }
    else {
        burnNoButton();

        setTimeout(() => {
            explodeNo();
        }, 900);
    }
}

yesBtn.addEventListener("click", () => {
    noBtn.classList.add("hidden");
    yesBtn.textContent = "Okay 😊";
    yesBtn.style.left = "50%";
    yesBtn.style.transform = "translateX(-50%) scale(1)";

    catGif.src = gifs.happy;
    typeText("...");

    setTimeout(() => {
        typeText("Hi 😊");
    }, 700);

    setTimeout(() => {
        typeText("Happy Valentine’s Day ❤️");
    }, 1500);

    setTimeout(() => {
        typeText("I’m really glad you’re here.");
    }, 2600);
});

function swapButtons() {
    buttonsSwapped = !buttonsSwapped;

    yesBtn.style.transform = buttonsSwapped
        ? `translateX(20%) scale(${yesScale})`
        : `translateX(-120%) scale(${yesScale})`;

    noTranslateX = buttonsSwapped ? -120 : 20;
    noTranslateY = 0;

    applyNoTransform();
}

function shrinkNoButton() {
    noScale = Math.max(0.55, noScale - 0.06); // floor prevents vanishing
    applyNoTransform();
}

function applyNoTransform() {
    noBtn.style.transform =
        `translate(${noTranslateX}px, ${noTranslateY}px) scale(${noScale})`;
}

function moveNo() {
    const buttonRect = noBtn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 12;

    const maxX = viewportWidth / 2 - buttonRect.width / 2 - margin;
    const maxY = viewportHeight / 2 - buttonRect.height / 2 - margin;

    const angle = Math.random() * Math.PI * 2;
    const distance = minMoveDistance + Math.random() * 100;

    let x = Math.cos(angle) * distance;
    let y = Math.sin(angle) * (distance / 2);

    x = Math.max(-maxX, Math.min(maxX, x));
    y = Math.max(-maxY, Math.min(maxY, y));

    noTranslateX = x;
    noTranslateY = y;

    applyNoTransform();
}

function growYes() {
    yesScale += 0.05;
    if (!buttonsSwapped) {
        yesBtn.style.transform = `translateX(-120%) scale(${yesScale})`;
    } else {
        yesBtn.style.transform = `translateX(20%) scale(${yesScale})`;
    }
}

function shake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
}

function explodeNo() {
    noBtn.classList.remove("danger");
    showAchievement("Achievement Unlocked: Emotional Damage");

    catGif.src = gifs.explosion;

    // Add emojis + dramatic text
    typeText("💣💥 SYSTEM FAILURE 💥💣");

    // Visually destroy the button (but keep it visible for now)
    noBtn.classList.add("exploding");
    noBtn.textContent = "💣";

    // Extra chaos: periodic screen shake during explosion
    const shakeInterval = setInterval(shake, 700);

    // Keep explosion running for ~5 seconds
    setTimeout(() => {
        clearInterval(shakeInterval);

        noBtn.classList.add("hidden");

        catGif.src = gifs.begging;
        typeText("Okay… okay… I’m sorry. Please be my Valentine.");

    }, 5000);
}

function burnNoButton() {
    noBtn.classList.add("burning");
}

function showAchievement(text) {
    achievement.innerHTML = text;
    achievement.classList.add("show");

    achievement.animate(
        [
            { boxShadow: "0 0 0 rgba(255,105,180,0)" },
            { boxShadow: "0 0 30px rgba(255,105,180,0.6)" },
            { boxShadow: "0 12px 30px rgba(255,105,180,0.35)" }
        ],
        { duration: 600 }
    );

    // Stay visible longer (readable)
    setTimeout(() => {
        achievement.classList.remove("show");
    }, 5200);
}

function browserWarning(message) {
    // alert("⚠️ " + message);
}

function typeText(text) {
    textEl.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
        textEl.textContent += text[i++];
        if (i === text.length) clearInterval(interval);
    }, 28);
}

const statusLines = [
    "// confidence decreasing",
    "// this was supposed to be easy",
    "// do not perceive me",
    "// abandon hope"
];
