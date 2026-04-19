document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    if (!videoPlayer) {
        console.error("Video element not found!");
        return;
    }

    const videoSources = [
        'vid/sec1/bear_bounce_16.mp4',
        'vid/sec1/car_collide_16.mp4',
        'vid/sec1/bunny_fluid_16.mp4',
    ];

    let currentIndex = 0;

    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    videoSources.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => currentVideo(index);
        dotsContainer.appendChild(dot);
    });

    function updateVideo() {
        const src = videoSources[currentIndex];
        console.log("Switching to video:", src);

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        videoPlayer.style.opacity = '0';
        videoPlayer.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            videoPlayer.src = src;
            videoPlayer.load();

            videoPlayer.onerror = () => {
                console.error("Failed to load video:", src);
                alert("loading error 'vid/' dir：\n" + src);
            };

            videoPlayer.play().catch(err => {
                console.warn("Play was prevented:", err.message);
                alert("stop.");
            });

            setTimeout(() => {
                videoPlayer.style.opacity = '1';
            }, 100);
        }, 300);
    }

    window.prevVideo = () => {
        currentIndex = (currentIndex - 1 + videoSources.length) % videoSources.length;
        updateVideo();
    };

    window.nextVideo = () => {
        currentIndex = (currentIndex + 1) % videoSources.length;
        updateVideo();
    };

    window.currentVideo = (index) => {
        currentIndex = index;
        updateVideo();
    };

    updateVideo();
});

document.addEventListener('DOMContentLoaded', () => {
    const matVideo = document.getElementById('material-video-player');
    if (!matVideo) return;

    const matButtons = document.querySelectorAll('.mat-btn');
    let currentMatButton = matButtons[0];

    const videoMap = {
        'rigid': 'vid/sec2/bunny_rigid_16.mp4',
        'elastic': 'vid/sec2/bunny_elastic_16.mp4',
        'plastic': 'vid/sec2/bunny_plastic_16.mp4',
        'fluid': 'vid/sec2/bunny_fluid_16.mp4',
        'sand': 'vid/sec2/bunny_sand_16.mp4',
        'lava': 'vid/sec2/bunny_lava_16.mp4',
    };

    matVideo.src = videoMap['rigid'];
    currentMatButton.classList.add('active');

    matButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.vid;

            if (currentMatButton) {
                currentMatButton.classList.remove('active');
            }
            this.classList.add('active');
            currentMatButton = this;

            const src = videoMap[key];
            matVideo.src = src;
            matVideo.load();
            matVideo.play().catch(e => console.warn("Play interrupted:", e));
        });
    });
});

// Speed Intensity Control
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('intensity-slider');
    const speedVideoPlayer = document.getElementById('speed-video-player');
    const intensityValueDisplay = document.getElementById('intensity-value');

    if (!speedSlider || !speedVideoPlayer) return;

    intensityValueDisplay.textContent = "Speed Level-" + speedSlider.value;

    speedSlider.addEventListener('input', () => {
        const intensity = speedSlider.value;
        intensityValueDisplay.textContent = "Speed Level-" + intensity;

        const newSrc = `vid/sec4/speed_${intensity}_16.mp4`;
        speedVideoPlayer.src = newSrc;
        speedVideoPlayer.load();

        speedVideoPlayer.play().catch(e => {
            console.warn("Auto-play prevented:", e);
        });
    });
});

/// Direction Control with Canvas + Background Image
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('direction-canvas');
    const ctx = canvas.getContext('2d');
    const directionVideoPlayer = document.getElementById('direction-video-player');

    if (!canvas || !ctx || !directionVideoPlayer) return;

    directionVideoPlayer.addEventListener('ended', () => {
        directionVideoPlayer.style.display = 'none';
        canvas.style.display = 'block';
        draw(currentAngleDeg);
    });

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    let currentAngleDeg = 0;
    let isDragging = false;

    const backgroundImage = new Image();
    backgroundImage.src = 'img/bear_bounce.jpg';

    const angleToVideo = {
        0: 'vid/sec3/bear_0_16.mp4',
        45: 'vid/sec3/bear_45_16.mp4',
        90: 'vid/sec3/bear_90_16.mp4',
        135: 'vid/sec3/bear_135_16.mp4',
        180: 'vid/sec3/bear_180_16.mp4',
        225: 'vid/sec3/bear_225_16.mp4',
        270: 'vid/sec3/bear_270_16.mp4',
        315: 'vid/sec3/bear_315_16.mp4'
    };

    function draw(angleDeg) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundImage.complete && backgroundImage.naturalHeight > 0) {
            const imgW = backgroundImage.naturalWidth;
            const imgH = backgroundImage.naturalHeight;
            const x = (canvas.width - imgW) / 2;
            const y = (canvas.height - imgH) / 2;
            ctx.drawImage(backgroundImage, x, y, imgW, imgH);
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();

        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const endX = centerX + radius * Math.cos(angleRad);
        const endY = centerY + radius * Math.sin(angleRad);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 4;
        ctx.stroke();

        const headLen = 16;
        const headAngle1 = angleRad - Math.PI / 6;
        const headAngle2 = angleRad + Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLen * Math.cos(headAngle1),
            endY - headLen * Math.sin(headAngle1)
        );
        ctx.lineTo(
            endX - headLen * Math.cos(headAngle2),
            endY - headLen * Math.sin(headAngle2)
        );
        ctx.closePath();
        ctx.fillStyle = '#007bff';
        ctx.fill();
    }

    function quantizeAngle(angle) {
        let a = angle % 360;
        if (a < 0) a += 360;
        return Math.round(a / 45) * 45 % 360;
    }

    function playVideoByAngle(angle) {
        const qAngle = quantizeAngle(angle);
        const src = angleToVideo[qAngle];
        if (!src) return;

        canvas.style.display = 'none';
        directionVideoPlayer.style.display = 'block';

        directionVideoPlayer.src = src;
        directionVideoPlayer.load();
        directionVideoPlayer.play().catch(e => console.warn("Auto-play prevented:", e));
    }

    if (backgroundImage.complete) {
        draw(currentAngleDeg);
    } else {
        backgroundImage.onload = () => {
            draw(currentAngleDeg);
        };
        backgroundImage.onerror = () => {
            console.warn("Failed to load background image: img/bear_background.png");
            draw(currentAngleDeg);
        };
    }

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = x - centerX;
        const dy = y - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        currentAngleDeg = angle;
        draw(currentAngleDeg);
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'grab';
            playVideoByAngle(currentAngleDeg);
        }
    });
});

// Demo Section Logic with Fixed Names
document.addEventListener('DOMContentLoaded', () => {
    const demoVideoPlayer = document.getElementById('demo-video-player');
    const captionElement = document.getElementById('demo-caption');
    const textElement = document.getElementById('demo-text-caption');
    if (!demoVideoPlayer) return;

    const demoButtonGroup = document.querySelector('.demo-button-group');
    const compItems = [
        {
            name: 'open_laptop',
            text: '',
            caption: "Text: Raise the clamshell laptop with flat screen using the left arm firmly."
        },
        {
            name: 'place_bread_skillet',
            text: '',
            caption: "Text: Lift the bread with split top and drop it into the round skillet with open handle end."
        },
    ];

    let currentDemoBtn = null;

    demoVideoPlayer.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play().catch(e => console.warn("Auto-replay prevented:", e));
    });

    compItems.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.classList.add('demo-btn');
        const displayName = item.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        btn.textContent = displayName;
        btn.dataset.demo = item.name;

        if (index === 0) {
            btn.classList.add('active');
            currentDemoBtn = btn;
        }

        btn.addEventListener('click', function () {
            const demoName = this.dataset.demo;
            const src = `vid/sec5/${demoName}_website.mp4`;

            if (currentDemoBtn) currentDemoBtn.classList.remove('active');
            this.classList.add('active');
            currentDemoBtn = this;

            demoVideoPlayer.src = src;
            demoVideoPlayer.load();

            textElement.innerHTML = item.text.replace(/\n/g, '<br>');
            captionElement.innerHTML = item.caption.replace(/\n/g, '<br>');

            demoVideoPlayer.play().catch(e => console.warn("Auto-play prevented in demo:", e));
        });

        demoButtonGroup.appendChild(btn);
    });

    const firstSrc = `vid/sec5/open_laptop_website.mp4`;
    demoVideoPlayer.src = firstSrc;
    demoVideoPlayer.load();
    demoVideoPlayer.play().catch(e => console.warn("Initial auto-play prevented:", e));
});

// PGBench vs DAVIS Comparison Section
document.addEventListener('DOMContentLoaded', () => {
    const compVideoPlayer = document.getElementById('comparison-video-player');
    const captionElement = document.getElementById('comparison-caption');
    if (!compVideoPlayer) return;

    const compButtonGroup = document.querySelector('.comparison-button-group');
    const compItems = [
        {
            name: 'shelf-domino',
            file: 'shelf_domino_website.mp4',
            caption: "Text: Four cabinets are on the ground, and the first cabinet on the left falls to the right, causing the others to fall as well."
        },
        {
            name: 'bear-bounce',
            file: 'bear_bounce_website.mp4',
            caption: "Text: A teddy bear bounces upward toward the right direction, then falls naturally due to gravity, with the entire motion being smooth and natural."
        },
        {
            name: 'bunny-fluid',
            file: 'bunny_fluid_website.mp4',
            caption: "Text: A rabbit-shaped water cluster falls due to gravity and splashes. The entire process is smooth."
        },
    ];

    let currentCompBtn = null;

    compItems.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.classList.add('comparison-btn');
        btn.textContent = item.name;
        btn.dataset.file = item.file;

        if (index === 0) {
            btn.classList.add('active');
            currentCompBtn = btn;
        }

        btn.addEventListener('click', function () {
            if (currentCompBtn) currentCompBtn.classList.remove('active');
            this.classList.add('active');
            currentCompBtn = this;

            const src = `vid/sec9/${item.file}`;
            compVideoPlayer.src = src;
            compVideoPlayer.load();

            captionElement.innerHTML = item.caption.replace(/\n/g, '<br>');

            compVideoPlayer.play().catch(e => console.warn("Auto-play prevented in comparison:", e));
        });

        compButtonGroup.appendChild(btn);
    });

    compVideoPlayer.src = `vid/sec9/${compItems[0].file}`;
    compVideoPlayer.load();
    compVideoPlayer.play().catch(e => console.warn("Initial auto-play prevented in comparison:", e));
});

// Limitation Cases Section Logic
document.addEventListener('DOMContentLoaded', () => {
    const failureVideoPlayer = document.getElementById('failure-video-player');
    const failureButtons = document.querySelectorAll('.failure-btn');

    if (!failureVideoPlayer || failureButtons.length === 0) return;

    let currentFailureBtn = failureButtons[0];

    failureButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const file = this.dataset.file;

            if (currentFailureBtn) currentFailureBtn.classList.remove('active');
            this.classList.add('active');
            currentFailureBtn = this;

            const src = `vid/sec11/${file}`;
            failureVideoPlayer.src = src;
            failureVideoPlayer.load();
            failureVideoPlayer.play().catch(e => console.warn("Auto-play prevented in failure case:", e));

        });
    });
});