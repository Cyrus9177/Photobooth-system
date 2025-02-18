const video = document.getElementById("video");
const countdownEl = document.getElementById("countdown");
const counterEl = document.getElementById("counter");

const shutterSound = new Audio("shutter.mp3");
const countdownSound = new Audio("countdown.mp3");

const romanticMessages = [
    "Say Cheese!","Say Cheese!","Say Cheese!","Say Cheese!"
    
];

const capturedPhotos = [];
let capturedCount = 0;

// Adjust constraints for mobile
const isMobile = window.innerWidth <= 600;
const videoConstraints = {
    video: {
        facingMode: "user",
        width: isMobile ? { ideal: 480 } : { ideal: 640 },
        height: isMobile ? { ideal: 640 } : { ideal: 480 }
    }
};

// Initialize camera
navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(stream => {
        video.srcObject = stream;
        video.play();
        startCaptureProcess();
    })
    .catch(err => {
        console.error("Camera access denied", err);
        countdownEl.textContent = "Please allow camera access ♥";
    });

function startCaptureProcess() {
    capturePhotoWithCountdown();
}

function capturePhotoWithCountdown() {
    if (capturedCount >= 4) {
        redirectToDownload();
        return;
    }

    let timeLeft = 5;
    const romanticMessage = romanticMessages[capturedCount];
    countdownEl.innerHTML = `${romanticMessage}<br>${timeLeft} ♥`;
    countdownEl.style.opacity = 1;
    
    // Add sparkle effect
    addSparkleEffect();
    
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.innerHTML = `${romanticMessage}<br>${timeLeft} ♥`;
        
        if (timeLeft === 0) {
            countdownEl.innerHTML = "Smile! ♥";
            setTimeout(() => {
                countdownEl.style.opacity = 0;
            }, 500);
        }

        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            capturePhoto();
        }
    }, 1000);
}

function addSparkleEffect() {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle-effect";
    document.querySelector(".romantic-frame").appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

function capturePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // Flip horizontally for selfie view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    // Add romantic overlay effect
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(255, 209, 220, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle vignette effect
    const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, canvas.height/3,
        canvas.width/2, canvas.height/2, canvas.height
    );
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(1, "rgba(183, 110, 121, 0.2)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    capturedPhotos.push(canvas.toDataURL("image/png"));
    capturedCount++;
    counterEl.textContent = `${capturedCount}/4 ♥`;

    // Play shutter sound
    shutterSound.play();

    // Add flash effect with hearts
    const flash = document.createElement("div");
    flash.className = "flash-effect";
    document.body.appendChild(flash);

    // Add floating hearts
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.innerHTML = "♥";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        flash.appendChild(heart);
    }

    setTimeout(() => {
        flash.remove();
        setTimeout(capturePhotoWithCountdown, 1000);
    }, 100);
}

function redirectToDownload() {
    sessionStorage.setItem("capturedPhotos", JSON.stringify(capturedPhotos));
    window.location.href = "download.html";
}

// Add CSS for dynamic effects
const style = document.createElement("style");
style.textContent = `
    .flash-effect {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        opacity: 0.8;
        z-index: 1000;
        pointer-events: none;
        animation: flash 0.5s ease-out;
    }

    .floating-heart {
        position: absolute;
        color: #B76E79;
        font-size: 24px;
        animation: float-up 1s ease-out forwards;
    }

    .sparkle-effect {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%);
        mix-blend-mode: overlay;
        animation: sparkle 1s ease-out;
    }

    @keyframes flash {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
    }

    @keyframes float-up {
        0% {
            transform: translateY(0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
        }
    }

    @keyframes sparkle {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(style);