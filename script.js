
document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);

    // ==========================================
    // GLOBAL VARIABLES
    // ==========================================

    let yourName = "Someone Special";
    let partnerName = "Cutie";

    let currentQuestion = 0;
    let completedDiyas = 0;
    let candleDragging = false;
    let wishReleased = false;
    let giftOpened = false;
    let letterOpened = false;
    let scratchComplete = false;
    let scratchInitialized = false;

    let fireworksInterval = null;
    let sparkInterval = null;

    let music = $("bgMusic");

    // ==========================================
    // SCREEN NAVIGATION
    // ==========================================

    function showScreen(id) {

        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });

        const screen = $(id);

        if (!screen) {
            console.error("Screen missing:", id);
            return;
        }

        screen.classList.add("active");
        screen.scrollTop = 0;

        window.scrollTo(0, 0);

        // Canvas needs a visible screen to initialize correctly.
        if (id === "scratchPage") {
            requestAnimationFrame(setupScratchCanvas);
        }
    }

    // ==========================================
    // PERSONALIZATION
    // ==========================================

    $("enterBtn").addEventListener("click", () => {

        yourName = $("yourName").value.trim() || "Someone Special";
        partnerName = $("partnerName").value.trim() || "Cutie";

        $("letterName").textContent = partnerName;
        $("finalPartner").textContent = partnerName;

        showScreen("lighting");

        // Start music from a real user interaction.
        playMusic();
    });

    // ==========================================
    // MUSIC PLAYER
    // ==========================================

    async function playMusic() {

        try {
            await music.play();
            $("musicToggle").textContent = "♫";
        } catch (error) {
            console.error("Music could not play:", error);
            $("musicToggle").textContent = "▶";
        }
    }

    function pauseMusic() {
        music.pause();
        $("musicToggle").textContent = "▶";
    }

    $("musicToggle").addEventListener("click", () => {

        if (music.paused) {
            playMusic();
        } else {
            pauseMusic();
        }

    });

    $("volume").addEventListener("input", event => {
        music.volume = Number(event.target.value);
    });

    music.volume = 0.7;

    // ==========================================
    // BACKGROUND STARS
    // ==========================================

    for (let i = 0; i < 75; i++) {

        const star = document.createElement("div");

        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";

        $("stars").appendChild(star);
    }

    // ==========================================
    // FALLING PETALS
    // ==========================================

    function createPetal() {

        const petal = document.createElement("div");

        petal.className = "petal";
        petal.textContent = Math.random() > 0.5 ? "🌸" : "🌼";

        petal.style.left = Math.random() * 100 + "vw";
        petal.style.animationDuration = 5 + Math.random() * 6 + "s";

        $("petals").appendChild(petal);

        setTimeout(() => petal.remove(), 12000);
    }

    setInterval(createPetal, 1100);

    // ==========================================
    // DIYA LIGHTING GAME
    // ==========================================

    const candle = $("candle");
    const diyaArea = $("diyaArea");

    const diyas = [...document.querySelectorAll(".diya")];

    diyas.forEach(diya => {
        diya.dataset.lit = "false";
    });

    function updateDiyaProgress() {

        $("progressText").textContent =
            `${completedDiyas} / ${diyas.length} Diyas Lit`;

        $("progressFill").style.width =
            (completedDiyas / diyas.length * 100) + "%";
    }

    function lightDiya(diya) {

        if (diya.dataset.lit === "true") return;

        diya.dataset.lit = "true";
        diya.classList.add("lit");

        completedDiyas++;

        updateDiyaProgress();

        if (completedDiyas === diyas.length) {

            candle.style.display = "none";

            $("lightInstruction").textContent =
                "✨ Amazing! Every diya is glowing! ❤️";

            $("continueBtn").classList.remove("hidden");

            createFireworksBurst(50, 35);
            createFireworksBurst(25, 40);
            createFireworksBurst(75, 40);
        }
    }

    function checkCandleCollision() {

        const flame = candle.querySelector(".candle-flame");
        const flameRect = flame.getBoundingClientRect();

        diyas.forEach(diya => {

            if (diya.dataset.lit === "true") return;

            const rect = diya.getBoundingClientRect();

            const collision =
                flameRect.left < rect.right &&
                flameRect.right > rect.left &&
                flameRect.top < rect.bottom &&
                flameRect.bottom > rect.top;

            if (collision) lightDiya(diya);

        });
    }

    candle.addEventListener("pointerdown", event => {

        if (completedDiyas === diyas.length) return;

        event.preventDefault();

        candleDragging = true;
        candle.setPointerCapture(event.pointerId);
    });

    candle.addEventListener("pointermove", event => {

        if (!candleDragging) return;

        const rect = diyaArea.getBoundingClientRect();

        let x = event.clientX - rect.left - candle.offsetWidth / 2;
        let y = event.clientY - rect.top - 25;

        x = Math.max(0, Math.min(x, rect.width - candle.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - candle.offsetHeight));

        candle.style.left = x + "px";
        candle.style.top = y + "px";
        candle.style.bottom = "auto";
        candle.style.transform = "none";

        checkCandleCollision();
    });

    candle.addEventListener("pointerup", () => {
        candleDragging = false;
    });

    candle.addEventListener("pointercancel", () => {
        candleDragging = false;
    });

    $("continueBtn").addEventListener("click", () => {
        showScreen("flirtIntro");
    });

    // ==========================================
    // FOUR ROMANTIC QUESTIONS
    // ==========================================

    const questions = [

        {
            emoji: "🥺",
            question: "Do you think someone is secretly crushing on you?",
            response: "Maybe that someone is right behind this screen! 😉"
        },

        {
            emoji: "🌹",
            question: "Would you go on a romantic date under the stars?",
            response: "Already imagining our beautiful evening! ❤️"
        },

        {
            emoji: "🍫",
            question: "Would you share your favourite chocolate with me?",
            response: "Okay, that's real love! 😂"
        },

        {
            emoji: "💑",
            question: "Would you choose a long drive with me?",
            response: "Just you, me and our favourite playlist! 🚗"
        }

    ];

    function resetNoButton(button) {

        button.textContent = "NO 🙈";

        button.style.position = "relative";
        button.style.left = "auto";
        button.style.top = "auto";
        button.style.right = "auto";
        button.style.bottom = "auto";
        button.style.margin = "";
        button.style.zIndex = "5";
    }

    function showQuestion() {

        const question = questions[currentQuestion];

        $("questionNumber").textContent =
            `QUESTION 0${currentQuestion + 1}`;

        $("questionEmoji").textContent = question.emoji;
        $("questionText").textContent = question.question;

        $("questionProgress").textContent =
            `${currentQuestion + 1} of 4`;

        $("response").textContent = "";

        resetNoButton($("noBtn"));
    }

    $("startQuestions").addEventListener("click", () => {

        currentQuestion = 0;

        showQuestion();
        showScreen("questions");

    });

    $("yesBtn").addEventListener("click", () => {

        if (currentQuestion >= questions.length) return;

        $("yesBtn").disabled = true;

        $("response").textContent =
            questions[currentQuestion].response;

        createHearts();

        setTimeout(() => {

            $("yesBtn").disabled = false;

            currentQuestion++;

            if (currentQuestion < questions.length) {

                showQuestion();

            } else {

                showScreen("wishPage");

            }

        }, 1400);

    });

    // ==========================================
    // FLOATING NO BUTTON
    // ==========================================

    const funnyMessages = [
        "You can't catch me! 😂",
        "You're too slow! 🏃",
        "Nice try! 😜",
        "Hehe, missed me!",
        "Just press YES! ❤️",
        "Almost got me!",
        "Catch me if you can!",
        "Not so fast! 😎",
        "Why are you chasing me? 😂",
        "YES is waiting! 💖"
    ];

    function moveNoButton(button) {

        const margin = 12;

        const maxX = Math.max(
            margin,
            window.innerWidth - button.offsetWidth - margin
        );

        const maxY = Math.max(
            margin,
            window.innerHeight - button.offsetHeight - margin
        );

        button.style.position = "fixed";

        button.style.left =
            margin + Math.random() * (maxX - margin) + "px";

        button.style.top =
            margin + Math.random() * (maxY - margin) + "px";

        button.style.right = "auto";
        button.style.bottom = "auto";
        button.style.margin = "0";
        button.style.zIndex = "6000";

        button.textContent =
            funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    }

    const noBtn = $("noBtn");

    noBtn.addEventListener("pointerenter", event => {

        if (event.pointerType === "mouse") {
            moveNoButton(noBtn);
        }

    });

    noBtn.addEventListener("pointerdown", event => {

        event.preventDefault();
        moveNoButton(noBtn);

    });

    noBtn.addEventListener("click", event => {

        event.preventDefault();
        moveNoButton(noBtn);

    });

    // ==========================================
    // MAKE A WISH IN THE SKY
    // ==========================================

    $("releaseWish").addEventListener("click", () => {

        const wish = $("wishInput").value.trim();

        if (!wish) {

            $("wishResponse").textContent =
                "Write your little wish first! ✨";

            return;
        }

        if (wishReleased) return;

        wishReleased = true;

        const lantern = $("wishLantern");

        lantern.classList.remove("released");

        // Restart the animation.
        void lantern.offsetWidth;

        lantern.classList.add("released");

        $("releaseWish").disabled = true;

        $("wishResponse").textContent =
            "Your wish is flying into the sky! 🌟";

        setTimeout(() => {

            $("wishNext").classList.remove("hidden");

        }, 3500);

    });

    $("wishNext").addEventListener("click", () => {
        showScreen("scratchPage");
    });

    // ==========================================
    // SCRATCH CARD
    // ==========================================

    const scratchCanvas = $("scratchCanvas");
    const ctx = scratchCanvas.getContext("2d");

    let scratching = false;
    let scratchLastCheck = 0;

    function setupScratchCanvas() {

        const rect = scratchCanvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        scratchCanvas.width = Math.round(rect.width * ratio);
        scratchCanvas.height = Math.round(rect.height * ratio);

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        ctx.globalCompositeOperation = "source-over";

        const gradient = ctx.createLinearGradient(
            0, 0, rect.width, rect.height
        );

        gradient.addColorStop(0, "#ffe69a");
        gradient.addColorStop(0.5, "#b77923");
        gradient.addColorStop(1, "#f9d77c");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);

        ctx.fillStyle = "#5b220d";
        ctx.font = "bold 18px Poppins";
        ctx.textAlign = "center";

        ctx.fillText(
            "SCRATCH HERE ✨",
            rect.width / 2,
            rect.height / 2
        );

        ctx.globalCompositeOperation = "destination-out";

        scratchComplete = false;
        scratching = false;
        scratchInitialized = true;

        $("scratchStatus").textContent =
            "Scratch at least 45% to unlock the message.";

        $("scratchNext").classList.add("hidden");
    }

    function scratchAt(event) {

        const rect = scratchCanvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 23, 0, Math.PI * 2);
        ctx.fill();
    }

    function checkScratchProgress() {

        if (scratchComplete || !scratchInitialized) return;

        const width = scratchCanvas.width;
        const height = scratchCanvas.height;

        // Sample a smaller area for better mobile performance.
        const sample = ctx.getImageData(
            0, 0, width, height
        );

        const pixels = sample.data;

        let transparent = 0;
        let total = 0;

        for (let i = 3; i < pixels.length; i += 32) {

            total++;

            if (pixels[i] < 100) {
                transparent++;
            }
        }

        const percentage = transparent / total;

        if (percentage >= 0.45) {

            scratchComplete = true;

            $("scratchStatus").textContent =
                "You discovered the secret! ❤️";

            $("scratchNext").classList.remove("hidden");

            // Clear the remaining cover.
            ctx.clearRect(
                0, 0,
                scratchCanvas.width,
                scratchCanvas.height
            );
        }
    }

    scratchCanvas.addEventListener("pointerdown", event => {

        if (scratchComplete) return;

        scratching = true;

        scratchCanvas.setPointerCapture(event.pointerId);

        scratchAt(event);
    });

    scratchCanvas.addEventListener("pointermove", event => {

        if (!scratching || scratchComplete) return;

        scratchAt(event);

        if (Date.now() - scratchLastCheck > 250) {

            scratchLastCheck = Date.now();

            checkScratchProgress();
        }
    });

    scratchCanvas.addEventListener("pointerup", () => {

        scratching = false;

        checkScratchProgress();
    });

    scratchCanvas.addEventListener("pointercancel", () => {
        scratching = false;
    });

    $("scratchNext").addEventListener("click", () => {

        if (scratchComplete) {
            showScreen("giftPage");
        }

    });

    // ==========================================
    // 3D MYSTERY GIFT BOX
    // ==========================================

    $("giftBox").addEventListener("click", () => {

        if (giftOpened) return;

        giftOpened = true;

        $("giftBox").classList.add("opened");

        createHearts();

        setTimeout(() => {

            $("giftResult").classList.remove("hidden");

            $("giftNext").classList.remove("hidden");

        }, 850);

    });

    $("giftNext").addEventListener("click", () => {
        showScreen("letterPage");
    });

    // ==========================================
    // SECRET LOVE LETTER
    // ==========================================

    $("envelope").addEventListener("click", () => {

        if (letterOpened) return;

        letterOpened = true;

        $("envelope").classList.add("opened");

        setTimeout(() => {

            $("letterResult").classList.remove("hidden");

            $("letterNext").classList.remove("hidden");

            createHearts();

        }, 500);

    });

    $("letterNext").addEventListener("click", () => {

        showScreen("finalPage");

        startFireworks();

        createHearts();

    });

    // ==========================================
    // FLOATING HEARTS
    // ==========================================

    function createHearts() {

        const emojis = ["❤️", "💖", "💕", "💗", "✨"];

        for (let i = 0; i < 20; i++) {

            const heart = document.createElement("div");

            heart.textContent =
                emojis[Math.floor(Math.random() * emojis.length)];

            heart.className = "floating-particle";

            heart.style.position = "fixed";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.top = Math.random() * 100 + "vh";
            heart.style.fontSize = 18 + Math.random() * 24 + "px";
            heart.style.pointerEvents = "none";
            heart.style.zIndex = "9000";
            heart.style.transition = "all 2s ease";

            document.body.appendChild(heart);

            requestAnimationFrame(() => {

                heart.style.transform =
                    "translateY(-150px) rotate(40deg)";

                heart.style.opacity = "0";

            });

            setTimeout(() => heart.remove(), 2200);
        }
    }

    // ==========================================
    // HEART-SHAPED FIREWORKS
    // ==========================================

    const fireworkHues = [
        42, 0, 28, 320, 190, 55, 280
    ];

    function createFireworksBurst(x, y, heartShape = false) {

        const container = $("fireworks");

        if (!container) return;

        const burst = document.createElement("div");

        burst.className = "firework-burst";
        burst.style.left = x + "%";
        burst.style.top = y + "%";

        const hue = fireworkHues[
            Math.floor(Math.random() * fireworkHues.length)
        ];

        const particleCount = heartShape ? 65 : 40;

        for (let i = 0; i < particleCount; i++) {

            const particle = document.createElement("i");

            let dx;
            let dy;

            if (heartShape) {

                // Parametric heart curve.
                const t = (Math.PI * 2 * i) / particleCount;

                const heartX = 16 * Math.pow(Math.sin(t), 3);

                const heartY =
                    13 * Math.cos(t)
                    - 5 * Math.cos(2 * t)
                    - 2 * Math.cos(3 * t)
                    - Math.cos(4 * t);

                dx = heartX * 5;
                dy = -heartY * 5;

            } else {

                const angle = Math.random() * Math.PI * 2;
                const distance = 65 + Math.random() * 110;

                dx = Math.cos(angle) * distance;
                dy = Math.sin(angle) * distance;

            }

            particle.style.setProperty("--dx", dx + "px");
            particle.style.setProperty("--dy", dy + "px");

            particle.style.setProperty(
                "--hue",
                hue + Math.random() * 20
            );

            particle.style.setProperty(
                "--duration",
                (1.1 + Math.random() * 0.8) + "s"
            );

            burst.appendChild(particle);
        }

        container.appendChild(burst);

        setTimeout(() => burst.remove(), 2300);
    }

    // ==========================================
    // ROCKET LAUNCH
    // ==========================================

    function launchRocket() {

        const container = $("fireworks");

        const x = 8 + Math.random() * 84;
        const y = 10 + Math.random() * 48;

        const rocket = document.createElement("div");

        rocket.className = "firework-rocket";

        rocket.style.left = x + "%";
        rocket.style.bottom = "0";

        rocket.style.setProperty(
            "--height",
            "-" + (window.innerHeight * (1 - y / 100)) + "px"
        );

        container.appendChild(rocket);

        setTimeout(() => {

            rocket.remove();

            // Some rockets explode into hearts.
            const heartShape = Math.random() > 0.35;

            createFireworksBurst(x, y, heartShape);

        }, 850);
    }

    // ==========================================
    // GOLDEN SPARK RAIN
    // ==========================================

    function createSpark() {

        const spark = document.createElement("div");

        spark.className = "spark-rain";

        spark.style.left = Math.random() * 100 + "%";
        spark.style.top = "-5px";

        spark.style.setProperty(
            "--duration",
            (2 + Math.random() * 3) + "s"
        );

        $("fireworks").appendChild(spark);

        setTimeout(() => spark.remove(), 5500);
    }

    // ==========================================
    // START GRAND FIREWORKS SHOW
    // ==========================================

    function startFireworks() {

        stopFireworks();

        // Grand opening burst.
        for (let i = 0; i < 10; i++) {

            setTimeout(() => {

                createFireworksBurst(
                    5 + Math.random() * 90,
                    8 + Math.random() * 50,
                    i % 2 === 0
                );

            }, i * 180);
        }

        // Continuous rockets.
        fireworksInterval = setInterval(() => {

            launchRocket();

            if (Math.random() > 0.4) {
                launchRocket();
            }

        }, 800);

        // Golden spark rain.
        sparkInterval = setInterval(() => {

            for (let i = 0; i < 4; i++) {
                createSpark();
            }

        }, 250);
    }

    function stopFireworks() {

        if (fireworksInterval) {
            clearInterval(fireworksInterval);
            fireworksInterval = null;
        }

        if (sparkInterval) {
            clearInterval(sparkInterval);
            sparkInterval = null;
        }

        // Remove leftover visual effects.
        $("fireworks").innerHTML = "";
    }

    // ==========================================
    // SHAREABLE DIWALI MEMORY CARD
    // ==========================================

    function createMemoryCard() {

        const canvas = document.createElement("canvas");

        canvas.width = 1000;
        canvas.height = 1300;

        const c = canvas.getContext("2d");

        // Background.
        const bg = c.createLinearGradient(
            0, 0, 1000, 1300
        );

        bg.addColorStop(0, "#24080e");
        bg.addColorStop(0.5, "#67221c");
        bg.addColorStop(1, "#170609");

        c.fillStyle = bg;
        c.fillRect(0, 0, 1000, 1300);

        // Golden border.
        c.strokeStyle = "#e8b84e";
        c.lineWidth = 12;
        c.strokeRect(35, 35, 930, 1230);

        c.strokeStyle = "#ffd36a";
        c.lineWidth = 2;
        c.strokeRect(55, 55, 890, 1190);

        // Decorative diya.
        c.textAlign = "center";

        c.font = "75px serif";
        c.fillText("🪔", 500, 230);

        // Heading.
        c.fillStyle = "#ffd36a";
        c.font = "bold 54px Georgia";
        c.fillText("HAPPY DIWALI", 500, 350);

        // Main title.
        c.font = "italic 75px Georgia";
        c.fillText("You Light Up", 500, 480);
        c.fillText("My Diwali!", 500, 575);

        // Names.
        c.fillStyle = "#fff0cf";
        c.font = "36px Georgia";
        c.fillText(
            yourName + "  ❤️  " + partnerName,
            500,
            710
        );

        // Message.
        c.font = "30px Georgia";
        c.fillText(
            "May your life always shine",
            500,
            840
        );

        c.fillText(
            "brighter than a thousand diyas.",
            500,
            895
        );

        c.font = "70px serif";
        c.fillText("✨ 💖 ✨", 500, 1050);

        c.font = "28px Georgia";
        c.fillText(
            "A little surprise made with love.",
            500,
            1160
        );

        return canvas;
    }

    // DOWNLOAD CARD.
    $("downloadCard").addEventListener("click", () => {

        const canvas = createMemoryCard();

        canvas.toBlob(blob => {

            if (!blob) return;

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "You-Light-Up-My-Diwali.png";

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 1000);

        }, "image/png");

    });

    // SHARE CARD.
    $("shareCard").addEventListener("click", async () => {

        const canvas = createMemoryCard();

        canvas.toBlob(async blob => {

            if (!blob) return;

            const file = new File(
                [blob],
                "You-Light-Up-My-Diwali.png",
                { type: "image/png" }
            );

            try {

                if (
                    navigator.share &&
                    navigator.canShare &&
                    navigator.canShare({ files: [file] })
                ) {

                    await navigator.share({
                        title: "You Light Up My Diwali ❤️",
                        text: "A little Diwali surprise made with love!",
                        files: [file]
                    });

                } else {

                    const url = URL.createObjectURL(blob);

                    const link = document.createElement("a");

                    link.href = url;
                    link.download = "You-Light-Up-My-Diwali.png";

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    setTimeout(() => URL.revokeObjectURL(url), 1000);

                    alert("Your memory card has been saved. You can now share it!");

                }

            } catch (error) {

                if (error.name !== "AbortError") {
                    console.error("Sharing failed:", error);
                }

            }

        }, "image/png");

    });

    // ==========================================
    // REPLAY THE ENTIRE WEBSITE
    // ==========================================

    function resetWebsite() {

        stopFireworks();

        // Reset names remain available in welcome fields.
        // User can edit them before starting again.

        // Reset music player.
        if (music.paused) {
            $("musicToggle").textContent = "▶";
        }

        // Reset diyas.
        completedDiyas = 0;
        candleDragging = false;

        diyas.forEach(diya => {

            diya.dataset.lit = "false";
            diya.classList.remove("lit");

        });

        updateDiyaProgress();

        candle.style.display = "flex";
        candle.style.left = "50%";
        candle.style.top = "auto";
        candle.style.bottom = "-20px";
        candle.style.transform = "translateX(-50%)";

        $("lightInstruction").textContent =
            "🕯️ Light all 10 diyas!";

        $("continueBtn").classList.add("hidden");

        // Reset questions.
        currentQuestion = 0;
        $("yesBtn").disabled = false;
        $("response").textContent = "";

        resetNoButton($("noBtn"));

        // Reset wish.
        wishReleased = false;

        $("wishInput").value = "";
        $("wishResponse").textContent = "";
        $("wishLantern").classList.remove("released");
        $("wishLantern").style.opacity = "1";

        $("releaseWish").disabled = false;
        $("wishNext").classList.add("hidden");

        // Reset scratch card.
        scratchComplete = false;
        scratching = false;
        scratchInitialized = false;

        $("scratchNext").classList.add("hidden");

        // Reset gift.
        giftOpened = false;

        $("giftBox").classList.remove("opened");
        $("giftResult").classList.add("hidden");
        $("giftNext").classList.add("hidden");

        // Reset letter.
        letterOpened = false;

        $("envelope").classList.remove("opened");
        $("letterResult").classList.add("hidden");
        $("letterNext").classList.add("hidden");

        // Return to welcome.
        showScreen("welcome");
    }

    $("replayBtn").addEventListener("click", resetWebsite);

    // ==========================================
    // INITIAL SETUP
    // ==========================================

    updateDiyaProgress();

    console.log(
        "🪔 You Light Up My Diwali loaded successfully!"
    );

});
