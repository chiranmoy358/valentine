const textEl = document.getElementById("text");
const catGif = document.getElementById("catGif");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const achievementStack = document.getElementById("achievementStack");
const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

let noCount = 0;
let noScale = 1;
let noTranslateX = 0;
let noTranslateY = 0;
let chaseMode = false;
let buttonsSwapped = false;
let yesScale = 1;
let minMoveDistance = 140;
let finalDare = false;
let typeInterval = null;
let lastMessage = null;
let notExploded = false;

const gifs = {
    confident1: "https://media.tenor.com/g7q3rx0uoIUAAAAi/mochi-mochimochi.gif",
    confident2: "https://media.tenor.com/HRngfAzY-fwAAAAi/peach-and.gif",
    nervous1: "https://media.tenor.com/pkm_X_VpOJwAAAAi/mochicat-wave.gif",
    nervous2: "https://media.tenor.com/ciBqGIR2OnAAAAAi/what-mochi.gif",
    nervous3: "./gifs/nervous3.gif",
    nervous4: "./gifs/nervous4.gif",
    nervous5: "./gifs/nervous5.gif",
    sad1: "https://media.tenor.com/CZIv1zVIx-AAAAAi/%E3%82%82%E3%81%A1%E3%81%94%E3%81%BE-%E3%82%82%E3%81%A1%E3%81%AD%E3%81%93.gif",
    sad2: "https://media.tenor.com/Uac8Y5yud28AAAAi/peach-and-goma-goma.gif",
    sad3: "https://media.tenor.com/PAyE85Ez53oAAAAi/mochi-mochimochi.gif",
    angry: "https://media.tenor.com/V4C-veW9biEAAAAi/peach-goma.gif",
    shock: "https://media.tenor.com/mn5Sab8Q2c4AAAAi/bubu-bubu-dudu.gif",
    calm_down: "https://media.tenor.com/t95dbFmGY5EAAAAi/pengu-pudgy.gif",
    valentine: "https://media.tenor.com/J6xumGwaxh8AAAAi/flowers-flower.gif",
    happy: "./gifs/happy.gif"

};

const messages = [
    "You’re in luck!",
    "After reviewing all the applications, I’ve chosen you to be my Valentine.",
    "Now, just click 'Yes' to make it official.",
    "You silly! That’s the wrong button.",
    "Hey! Stop that.",
    "Why are you clicking 'No'?",
    "You’re doing this on purpose, aren’t you?",
    "You don't like me?",
    "Nope, you’re not touching that button again.",
    "I won't letting you do this.",
    "PLEAAASE, JUST SAY YES!",
    "I BEGGGG YOUUU, PLEASE!",
    "That’s it! Go on, I dare you. Click it.",
    "YOU CLICKED IT?! How dare you!!",
    "That’s it! I’m blowing up this button.",
    "Okay, sorry. I’ll calm down now. Let’s try this again.",
    "Miss Ishani, I can’t promise perfection, but I can promise honesty, laughter, warmth, and genuine care.",
    "So I’ll ask again, will you be my Valentine?",
    "Wait… you said yes? Okay, now I’m smiling like an idiot.",
    "The thing is, the buttons are just for show. It won’t actually notify me.",
    "So I’ll come ask you out in person. I hope you’ll wait for me."
];

init();

function init() {
    lastMessage = 0
    typeText(0);

    showAchievement("“I’ve got this. This is easy ”");

    setTimeout(() => {
        typeText(1);
    }, 2500);

    setTimeout(() => {
        typeText(2);
    }, 7000);

    catGif.src = gifs.confident1;
}

function registerNo() {
    clearAchievements();
    shrinkNoButton();
    noCount++;
    growYes();

    if (navigator.vibrate) {
        navigator.vibrate(30);
    }

    if (noCount === 1) {
        catGif.src = gifs.confident2;
        typeText(3);
        showAchievement("“Probably just a misclick.”");
    }
    else if (noCount === 2) {
        catGif.src = gifs.nervous1;
        typeText(4);
    }
    else if (noCount === 3) {
        catGif.src = gifs.nervous2;
        typeText(5);
        shake();
        showAchievement("“She's testing my patience.”");
    }
    else if (noCount === 4) {
        catGif.src = gifs.nervous3;
        swapButtons();
        typeText(6);
        shake();
    }
    else if (noCount === 5) {
        showAchievement("“This was supposed to be easy.”");
        catGif.src = gifs.nervous4;
        swapButtons();
        typeText(7);
        shake();
    }
    else if (noCount === 6) {
        catGif.src = gifs.nervous5;
        chaseMode = true;
        typeText(8);
        moveNo();
        shake();
    }
    else if (noCount < 10) {        
        minMoveDistance += 50;
        moveNo();
        shake();

        if (noCount === 7) {
            showAchievement("“Confidence decreasing.”");
            catGif.src = gifs.sad1;
            typeText(9);
        }
        else if (noCount === 8) {            
            catGif.src = gifs.sad2;
            typeText(10);
        }
        else if (noCount === 9) {
            showAchievement("“Hope abandoned.”");
            catGif.src = gifs.sad3;
            typeText(11);
        }
    }
    else if (!finalDare) {
        catGif.src = gifs.angry;
        typeText(12);

        noBtn.classList.add("danger");
        finalDare = true;
        chaseMode = false;

        noTranslateX = 20;
        noTranslateY = 0;
        applyNoTransform();

        noBtn.style.boxShadow = "0 0 12px rgba(255,0,0,0.6)";
        shake();
    }
    else if (!notExploded) {
        notExploded = true;
        showAchievement("Emotional Damage!!");
        catGif.src = gifs.shock;
        typeText(13);
        
        setTimeout(() => {
            typeText(14);
        }, 3000);
        
        setTimeout(() => {
            burnNoButton();
        }, 5000);

        setTimeout(() => {
            explodeNo();
        }, 7000);
    }
}

yesBtn.addEventListener("click", () => {
    noBtn.classList.add("hidden");
    yesBtn.classList.add("hidden");

    clearAchievements();
    showAchievement("“VICTORYYYYYY!!”");
    catGif.src = gifs.happy;
    typeText(18);

    setTimeout(() => {
        typeText(19);
    }, 5000);

    setTimeout(() => {
        typeText(20);
    }, 10000);
});

noBtn.addEventListener("click", () => {
    if (!chaseMode) {
        registerNo();
    } else if (isTouchDevice) {
        registerNo();
    }
});

noBtn.addEventListener("mouseenter", () => {
    if (chaseMode && !isTouchDevice) {
        registerNo();
    }
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
    noScale = Math.max(0.6, noScale - 0.05);
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
    yesScale += 0.06;
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

    noBtn.classList.add("exploding");
    noBtn.textContent = "💣";

    const shakeInterval = setInterval(shake, 800);

    setTimeout(() => {
        clearInterval(shakeInterval);
        noBtn.classList.add("hidden");
        centerYesButton();
        afterExplodeMessage()
    }, 3500);
}

function afterExplodeMessage() {
    catGif.src = gifs.calm_down;
    typeText(15);

    setTimeout(() => {
        catGif.src = gifs.valentine;
        typeText(16);
    }, 5500);
    
    setTimeout(() => {
        typeText(17);
    }, 12000);
}

function centerYesButton() {
  yesBtn.style.left = "50%";
  yesBtn.style.top = "50%";
  yesBtn.style.transform = "translate(-50%, -50%) scale(1.1)";
}

function burnNoButton() {
    noBtn.classList.add("burning");
}

function clearAchievements() {
  achievementStack.innerHTML = "";
}

function showAchievement(text) {
  const el = document.createElement("div");
  el.className = "achievement";
  el.innerHTML = text;

  achievementStack.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 5000);
}

function typeText(index) {
    if (index < lastMessage)
        return;
    lastMessage = index;

    text = messages[index]
    if (typeInterval) {
        clearInterval(typeInterval);
        textEl.textContent = text;
        typeInterval = null;
    }

    textEl.textContent = "";
    let i = 0;

    typeInterval = setInterval(() => {
        textEl.textContent += text[i++];
        if (i >= text.length) {
            clearInterval(typeInterval);
            typeInterval = null;
        }
    }, 28);
}
