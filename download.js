const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");

let selectedFrame = "nude";
const frameColors = {
    "nude": "#E6CCBE",
    "pink": "#FFB6C1",
    "baby-blue": "#ADD8E6",
    "burgundy": "#800020",
    "navy": "#2B2D42",
    "mint": "#98FF98",
    "red": "#FF0000",
    "polkadot": "#FFFFFF",
    "coral": "#FF7F50"
};

const capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos")) || [];

// Canvas dimensions
const canvasWidth = 300;
const canvasHeight = 800;
const photoWidth = 260;
const photoHeight = 160;
const spacing = 10;
const frameWidth = 20;
const logoHeight = 60;

finalCanvas.width = canvasWidth;
finalCanvas.height = canvasHeight;

function drawFrame() {
    // Clear canvas
    ctx.fillStyle = frameColors[selectedFrame];
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (selectedFrame === "polkadot") {
        drawPolkaDots();
    }

    // Draw romantic border with hearts
    drawHeartsBorder();

    // Draw photos
    capturedPhotos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;
        
        img.onload = () => {
            const y = frameWidth + index * (photoHeight + spacing);
            
            // Draw photo with subtle shadow
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 10;
            ctx.drawImage(img, frameWidth, y, photoWidth, photoHeight);
            ctx.restore();

            // Add romantic overlay
            const gradient = ctx.createLinearGradient(frameWidth, y, frameWidth + photoWidth, y);
            gradient.addColorStop(0, 'rgba(255, 209, 220, 0.1)');
            gradient.addColorStop(1, 'rgba(183, 110, 121, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(frameWidth, y, photoWidth, photoHeight);
        };
    });

    // Draw decorative elements
    drawDecorativeElements();
    
    // Draw logo and footer
    drawLogoAndFooter();
}

function drawPolkaDots() {
    ctx.fillStyle = "#FF69B4";
    const dotSize = 2;
    const spacing = 15;
    
    for (let x = 0; x < canvasWidth; x += spacing) {
        for (let y = 0; y < canvasHeight; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawHeartsBorder() {
    const heartSize = 10;
    const spacing = 30;
    
    // Create gradient for hearts
    const heartGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    heartGradient.addColorStop(0, '#FF69B4');
    heartGradient.addColorStop(0.5, '#B76E79');
    heartGradient.addColorStop(1, '#FF69B4');
    ctx.fillStyle = heartGradient;
    
    // Draw hearts on all sides
    for (let pos = 0; pos < canvasWidth; pos += spacing) {
        drawHeart(pos, 5, heartSize); // Top
        drawHeart(pos, canvasHeight - 15, heartSize); // Bottom
    }
    
    for (let pos = 0; pos < canvasHeight; pos += spacing) {
        drawHeart(5, pos, heartSize); // Left
        drawHeart(canvasWidth - 15, pos, heartSize); // Right
    }
}

function drawHeart(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x + size / 4, y);
    ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
    ctx.quadraticCurveTo(x + size / 2, y, x + size * 3/4, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
    ctx.quadraticCurveTo(x + size, y + size / 2, x + size / 2, y + size * 3/4);
    ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
    ctx.fill();
    ctx.restore();
}

function drawDecorativeElements() {
    // Add sparkles
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        drawSparkle(x, y);
    }
}

function drawSparkle(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(4, 0);
    ctx.moveTo(0, -4);
    ctx.lineTo(0, 4);
    ctx.stroke();
    
    ctx.restore();
}

function drawLogoAndFooter() {
    const gradient = ctx.createLinearGradient(0, canvasHeight - logoHeight, 0, canvasHeight);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvasHeight - logoHeight, canvasWidth, logoHeight);
    
    ctx.fillStyle = '#B76E79';
    ctx.font = 'bold 24px "Great Vibes"';
    ctx.textAlign = 'center';
    ctx.fillText('The Bea-utiful Collection', canvasWidth / 2, canvasHeight - 20);
}

// Event Listeners
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedFrame = button.getAttribute("data-color");
        colorButtons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        drawFrame();
    });
});

downloadBtn.addEventListener("click", () => {
    // Add download animation
    downloadBtn.classList.add("downloading");
    downloadBtn.innerHTML = "Saving... ♥";
    
    setTimeout(() => {
        const link = document.createElement("a");
        link.download = "love-lens-photos.png";
        link.href = finalCanvas.toDataURL("image/png");
        link.click();
        
        downloadBtn.classList.remove("downloading");
        downloadBtn.innerHTML = "Save Your Memory ♥";
        
        // Show floating hearts animation
        showDownloadAnimation();
    }, 500);
});

function showDownloadAnimation() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "1000";
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "♥";
        heart.style.position = "absolute";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = "100%";
        heart.style.color = "#B76E79";
        heart.style.fontSize = "24px";
        heart.style.animation = `float-up 1.5s ease-out forwards ${Math.random() * 0.5}s`;
        container.appendChild(heart);
    }

    setTimeout(() => container.remove(), 2000);
}

// Initial render
drawFrame();