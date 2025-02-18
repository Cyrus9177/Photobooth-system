function redirectWithTransition(url) {
    // Create heart-shaped transition overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "#FFF5F7";
    overlay.style.opacity = "0";
    overlay.style.transition = "all 0.8s ease-in-out";
    overlay.style.zIndex = "9999";

    // Add floating hearts
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "♥";
        heart.style.position = "absolute";
        heart.style.fontSize = "24px";
        heart.style.color = "#B76E79";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.opacity = "0";
        heart.style.transform = "scale(0)";
        heart.style.transition = "all 0.8s ease-in-out";
        overlay.appendChild(heart);
    }
    
    document.body.appendChild(overlay);
    
    // Trigger animations
    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        Array.from(overlay.children).forEach((heart, index) => {
            setTimeout(() => {
                heart.style.opacity = "1";
                heart.style.transform = "scale(1) translate(0, -100px)";
            }, index * 50);
        });
    });
    
    // Redirect after transition
    setTimeout(() => {
        window.location.href = url;
    }, 1000);
}