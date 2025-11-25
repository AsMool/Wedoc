function initGlitch() {
    // Random fonts for the glitch effect
    const glitchFonts = [
        'Impact, sans-serif',
        'Georgia, serif',
        'Courier New, monospace',
        'Arial Black, sans-serif',
        'Times New Roman, serif',
        'Trebuchet MS, sans-serif',
        'Verdana, sans-serif',
        'Comic Sans MS, cursive',
        'Lucida Console, monospace',
        'Palatino Linotype, serif',
        'system-ui, sans-serif',
        'monospace',
        'serif',
        'sans-serif'
    ];

    //créer l'animation d'entrée pour le hero avec effet glitch
    const heroTitle = document.querySelector(".hero-title.glitch");
    const heroSubtitle = document.querySelector(".hero-subtitle");

    if (heroTitle) {
        // Split the text into individual characters for animation
        const glitchText = heroTitle.querySelector('.glitch-text');
        const split = new SplitText(glitchText, {
            type: "chars,words",
            charsClass: "char"
        });

        // Set random glitch offsets, fonts and sizes for each character
        split.chars.forEach((char, i) => {
            char.style.setProperty('--char-index', i);
            char.style.setProperty('--glitch-x', `${(Math.random() - 0.5) * 20}px`);
            char.style.setProperty('--glitch-y', `${(Math.random() - 0.5) * 15}px`);
            char.style.setProperty('--glitch-r', `${(Math.random() - 0.5) * 8}deg`);

            // Store original styles for later
            char.dataset.originalFont = 'inherit';
            char.dataset.originalSize = '1em';

            // Random font and size for initial chaotic state
            const randomFont = glitchFonts[Math.floor(Math.random() * glitchFonts.length)];
            const randomSize = 0.5 + Math.random() * 1.2; // 0.5em to 1.7em
            const randomWeight = Math.random() > 0.5 ? 'bold' : 'normal';
            const randomStyle = Math.random() > 0.8 ? 'italic' : 'normal';

            char.style.fontFamily = randomFont;
            char.style.fontSize = `${randomSize}em`;
            char.style.fontWeight = randomWeight;
            char.style.fontStyle = randomStyle;
            char.style.verticalAlign = 'middle';
            char.style.display = 'inline-block';
        });

        // Create the entrance timeline
        const heroTimeline = gsap.timeline();

        // Initial state - scattered and glitched
        gsap.set(split.chars, {
            opacity: 0,
            y: () => gsap.utils.random(-100, 100),
            x: () => gsap.utils.random(-50, 50),
            rotation: () => gsap.utils.random(-30, 30),
            scale: () => gsap.utils.random(0.5, 1.5),
            filter: "blur(10px)"
        });

        // Make title visible
        heroTimeline.set(heroTitle, { opacity: 1 });

        // Glitch flash effect before text appears
        heroTimeline.fromTo(heroTitle,
            {
                clipPath: "inset(0 100% 0 0)"
            },
            {
                clipPath: "inset(0 0% 0 0)",
                duration: 0.4,
                ease: "steps(8)"
            }
        );

        // Characters fly in with stagger
        heroTimeline.to(split.chars, {
            opacity: 1,
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: {
                each: 0.03,
                from: "random"
            },
            ease: "back.out(1.2)"
        }, "-=0.2");

        // Normalize fonts after flying in - transition to uniform look
        heroTimeline.to(split.chars, {
            fontSize: '1em',
            fontWeight: '600',
            fontStyle: 'normal',
            duration: 0.6,
            stagger: {
                each: 0.02,
                from: "random"
            },
            ease: "power2.inOut",
            onComplete: () => {
                // Reset all fonts to inherit after animation
                split.chars.forEach(char => {
                    char.style.fontFamily = 'inherit';
                });
            }
        }, "-=0.4");

        // Glitch flicker effect
        heroTimeline.to(heroTitle, {
            x: () => gsap.utils.random(-3, 3),
            duration: 0.05,
            repeat: 10,
            yoyo: true,
            ease: "none",
            onComplete: () => gsap.set(heroTitle, { x: 0 })
        }, "-=0.3");

        // Final glitch burst
        heroTimeline.to(heroTitle, {
            keyframes: [
                { x: 5, duration: 0.05 },
                { x: -5, duration: 0.05 },
                { x: 3, duration: 0.05 },
                { x: -2, duration: 0.05 },
                { x: 0, duration: 0.05 }
            ]
        });

        // Fade in subtitle
        if (heroSubtitle) {
            heroTimeline.to(heroSubtitle, {
                opacity: 0.8,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3");

            heroTimeline.from(heroSubtitle, {
                y: 20,
                duration: 0.6,
                ease: "power3.out"
            }, "<");
        }

        // CTA button entrance
        heroTimeline.from(
            "#cta-visiter",
            { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        );
    } else {
        // Fallback if glitch title not found
        const heroTimeline = gsap.timeline();
        heroTimeline.from(".hero-title", {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
        });
        heroTimeline.from(
            "#cta-visiter",
            { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        );
    }
}
