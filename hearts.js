(function() {
    let moons = [];
    let stars = [];
    const canvas = document.getElementById('heartCanvas');
    const context = canvas.getContext('2d');

    window.onresize = resizeCanvas;
    resizeCanvas();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add random stars in background
        addRandomStars();
        
        // Render moons
        for (let i = 0; i < moons.length; i++) {
            const moon = moons[i];
            context.save();
            context.globalAlpha = moon.alpha;
            context.fillStyle = moon.color;
            context.translate(moon.x, moon.y);
            context.rotate(moon.angle);
            context.scale(moon.size, moon.size);
            drawMoon(context);
            context.restore();

            moon.y -= moon.speed;
            moon.alpha -= moon.alphaDecay;
            moon.angle += moon.rotateSpeed;
            if (moon.alpha <= 0) {
                moons.splice(i, 1);
                i--;
            }
        }
        
        // Render stars
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            context.save();
            context.globalAlpha = star.alpha;
            context.fillStyle = star.color;
            context.translate(star.x, star.y);
            context.scale(star.size, star.size);
            drawStar(context);
            context.restore();

            star.y -= star.speed;
            star.alpha -= star.alphaDecay;
            if (star.alpha <= 0) {
                stars.splice(i, 1);
                i--;
            }
        }
        
        requestAnimationFrame(render);
    }

    function drawMoon(ctx) {
        // Draw crescent moon with silvery white color (even smaller size)
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0.2 * Math.PI, 1.8 * Math.PI, false);
        ctx.arc(6, 0, 13, 1.8 * Math.PI, 0.2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
        
        // Add silvery white outline for better visibility
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add subtle glow effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 5;
    }

    function drawStar(ctx) {
        // Draw star with glow effect
        const spikes = 5;
        const outerRadius = 8;
        const innerRadius = 4;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        let step = Math.PI / spikes;

        // Add glow
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(0, -outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }

    // Create stars as mouse trail
    window.onmousemove = function(event) {
        if (Math.random() < 0.3) {
            createStar(event.clientX, event.clientY);
        }
        if (Math.random() < 0.003) {
            createMoon(event.clientX, event.clientY);
        }
    }

    // Create crescent moon on click
    window.onclick = function(event) {
        // Create fewer moons on click for better performance
        for (let i = 0; i < 1; i++) {
            createMoon(event.clientX + (Math.random() - 0.5) * 50, event.clientY + (Math.random() - 0.5) * 50);
        }
    }
    
    // Add random stars background
    function addRandomStars() {
        if (Math.random() < 0.2) {
            // Generate multiple stars at once for denser effect
            for (let i = 0; i < 2; i++) {
                createStar(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            }
        }
    }

    function createMoon(x, y) {
        moons.push({
            x: x,
            y: y,
            size: Math.random() * 1.2 + 1,
            alpha: 1,
            angle: Math.random() * 2 * Math.PI,
            rotateSpeed: (Math.random() - 0.5) * 0.1,
            color: 'rgba(220, 220, 255, 0.95)',
            speed: Math.random() * 1.5 + 0.5,
            alphaDecay: 0.005
        });
    }

    function createStar(x, y) {
        stars.push({
            x: x,
            y: y,
            size: Math.random() * 0.8 + 0.4,
            alpha: Math.random() * 0.8 + 0.7,
            color: `rgba(240, 240, 255, ${Math.random() * 0.3 + 0.7})`,
            speed: Math.random() * 2.5 + 1.5,
            alphaDecay: Math.random() * 0.015 + 0.003
        });
    }

    render();
})();
