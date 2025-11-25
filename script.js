// animation d'entrée et configuration des effets au scroll
document.addEventListener("DOMContentLoaded", () => {
  //enregistrer les plugins nécessaires
  gsap.registerPlugin(ScrollTrigger, SplitText);

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

  //ajouter le scroll smooth pour le bouton "Visiter"
  const cta = document.getElementById("cta-visiter");
  if (cta) {
    cta.addEventListener("click", () => {
      const target = document.getElementById("histoire");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  //créer les animations au scroll pour chaque élément marqué
  gsap.utils.toArray("[data-animate]").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 95%" },
    });
  });

  // logique du carrousel des articles
  const track = document.getElementById("articles-track");
  if (track) {
    const wrap = track.parentElement;
    const cards = Array.from(track.children);
    const dotsBox = document.getElementById("articles-dots");
    const isMobile = () => matchMedia("(max-width:767px)").matches;

    // creer les points de navigation
    if (dotsBox) {
      dotsBox.innerHTML = ''; // nettoyer au cas ou
      cards.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.onclick = () => activate(i, true);
        dotsBox.appendChild(dot);
      });
    }

    const dots = dotsBox ? Array.from(dotsBox.children) : [];
    let current = 0;

    function center(i) {
      const card = cards[i];
      if (!card) return;
      const axis = isMobile() ? "top" : "left";
      const size = isMobile() ? "clientHeight" : "clientWidth";
      const start = isMobile() ? card.offsetTop : card.offsetLeft;

      wrap.scrollTo({
        [axis]: start - (wrap[size] / 2 - card[size] / 2),
        behavior: "smooth"
      });
    }

    function toggleUI(i) {
      cards.forEach((c, k) => c.toggleAttribute("active", k === i));
      dots.forEach((d, k) => d.classList.toggle("active", k === i));
    }

    function activate(i, scroll) {
      // on permet la re-activation pour recentrer si besoin
      current = i;
      toggleUI(i);
      if (scroll) center(i);
    }

    function go(step) {
      activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
    }

    // navigation au clavier
    window.addEventListener(
      "keydown",
      (e) => {
        // seulement si la section est visible ou active pour eviter de scroll ailleurs ?
        // pour l'instant global comme demande
        if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
        if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
      },
      { passive: true }
    );

    // clic sur les cartes
    cards.forEach((card, i) => {
      const link = card.querySelector("a.project-card__btn");
      const cardLink = link ? link.getAttribute("href") : null;

      card.addEventListener(
        "mouseenter",
        () => matchMedia("(hover:hover)").matches && activate(i, true)
      );
      card.addEventListener("click", (e) => {
        // si on clique sur un lien, on laisse le lien faire son travail
        if (e.target.closest("a")) return;

        // si la carte est deja active, naviguer vers l'article
        if (card.hasAttribute("active") && cardLink) {
          e.preventDefault();
          window.location.href = cardLink;
          return;
        }

        // sinon on active la carte
        activate(i, true);
      });
    });

    // gestion du tactile
    let sx = 0,
      sy = 0;
    let touchStartTime = 0;
    let touchTarget = null;

    track.addEventListener(
      "touchstart",
      (e) => {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
        touchStartTime = Date.now();
        touchTarget = e.target;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        // si on touche un lien, on laisse le navigateur gerer
        if (e.target.closest("a")) return;

        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        const distance = isMobile() ? Math.abs(dy) : Math.abs(dx);
        const touchDuration = Date.now() - touchStartTime;

        // si c'est un vrai swipe (distance > 60px)
        if (distance > 60) {
          e.preventDefault();
          go((isMobile() ? dy : dx) > 0 ? -1 : 1);
          return;
        }

        // si c'est un tap rapide sur mobile (< 500ms et distance < 30px)
        if (isMobile() && touchDuration < 500 && distance < 30) {
          const card = touchTarget?.closest(".project-card");
          if (card) {
            const cardIndex = cards.indexOf(card);
            if (cardIndex !== -1) {
              const link = card.querySelector("a.project-card__btn");
              const cardLink = link ? link.getAttribute("href") : null;

              // si la carte est deja active, naviguer vers l'article
              if (card.hasAttribute("active") && cardLink) {
                e.preventDefault();
                window.location.href = cardLink;
                return;
              }

              // sinon activer la carte (premier tap)
              e.preventDefault();
              activate(cardIndex, true);
              return;
            }
          }
        }
      },
      { passive: false }
    );

    window.addEventListener("resize", () => center(current));

    // update dots on scroll
    wrap.addEventListener('scroll', () => {
      const axis = isMobile() ? "scrollTop" : "scrollLeft";
      const size = isMobile() ? "clientHeight" : "clientWidth";
      const centerPos = wrap[axis] + wrap[size] / 2;

      let bestIndex = current;
      let minDiff = Infinity;

      cards.forEach((card, i) => {
        const cardStart = isMobile() ? card.offsetTop : card.offsetLeft;
        const cardSize = isMobile() ? card.offsetHeight : card.offsetWidth;
        const cardCenter = cardStart + cardSize / 2;
        const diff = Math.abs(centerPos - cardCenter);

        if (diff < minDiff) {
          minDiff = diff;
          bestIndex = i;
        }
      });

      if (current !== bestIndex) {
        activate(bestIndex, false);
      }
    }, { passive: true });

    // initialisation
    // attendre un peu que le layout soit stable
    setTimeout(() => {
      toggleUI(0);
      center(0);
    }, 100);
  }

  //progression dans les articles détaillés
  const articleProgressNav = document.querySelector('.article-progress');
  if (articleProgressNav) {
    const progressLinks = Array.from(articleProgressNav.querySelectorAll('a[href^="#"]'));
    const sections = progressLinks
      .map((link) => {
        const targetId = link.getAttribute('href').slice(1);
        return document.getElementById(targetId);
      })
      .filter(Boolean);

    if (progressLinks.length && sections.length) {
      const sectionPositions = new Map();
      const visibleSections = new Set();
      let activeId = null;

      const updateSectionPositions = () => {
        sections.forEach((section) => {
          sectionPositions.set(section.id, section.getBoundingClientRect().top + window.scrollY);
        });
      };

      const setActiveLink = (id) => {
        if (activeId === id) return;
        activeId = id;
        progressLinks.forEach((link) => {
          const hrefId = link.getAttribute('href').slice(1);
          const isActive = hrefId === id;
          link.classList.toggle('is-active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      };

      const updateFromVisibleSections = () => {
        if (!visibleSections.size) return;
        const ordered = Array.from(visibleSections).sort((a, b) => {
          return (sectionPositions.get(a) || 0) - (sectionPositions.get(b) || 0);
        });
        const lastId = ordered[ordered.length - 1];
        if (lastId) setActiveLink(lastId);
      };

      updateSectionPositions();

      const observerOptions = {
        root: null,
        rootMargin: '200px 0px -20% 0px',
        threshold: [0, 0.15, 0.35],
      };

      const intersectionObserver = new IntersectionObserver((entries) => {
        let changed = false;
        entries.forEach((entry) => {
          const { id } = entry.target;
          if (entry.isIntersecting) {
            if (!visibleSections.has(id)) {
              visibleSections.add(id);
              changed = true;
            }
          } else if (visibleSections.has(id)) {
            visibleSections.delete(id);
            changed = true;
          }
        });

        if (changed) updateFromVisibleSections();
      }, observerOptions);

      sections.forEach((section) => intersectionObserver.observe(section));

      const handleScrollEnd = () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          const lastSection = sections[sections.length - 1];
          if (lastSection) setActiveLink(lastSection.id);
        }
      };

      const handleResize = () => {
        updateSectionPositions();
        updateFromVisibleSections();
      };

      window.addEventListener('scroll', handleScrollEnd, { passive: true });
      window.addEventListener('resize', handleResize);

      const scrollToSection = (targetSection) => {
        const desktopOffset = 120;
        const mobileOffset = 80;
        const offset = window.innerWidth >= 1024 ? desktopOffset : mobileOffset;
        const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
      };

      progressLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const targetId = link.getAttribute('href').slice(1);
          const targetSection = sections.find((section) => section.id === targetId);
          if (!targetSection) return;
          scrollToSection(targetSection);
          setActiveLink(targetId);
        });
      });

      const initialHash = window.location.hash.replace('#', '');
      if (initialHash && sections.some((section) => section.id === initialHash)) {
        setActiveLink(initialHash);
      } else {
        setActiveLink(sections[0].id);
      }

      window.addEventListener('pagehide', () => {
        intersectionObserver.disconnect();
        window.removeEventListener('scroll', handleScrollEnd);
        window.removeEventListener('resize', handleResize);
      });
    }
  }

  //ajouter la logique du menu mobile (hamburger)
  const menuToggleButton = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  //fonction utilitaire pour ouvrir/fermer
  function setMenuOpen(isOpen) {
    //mettre à jour l'état ARIA
    if (menuToggleButton) menuToggleButton.setAttribute('aria-expanded', String(isOpen));

    //afficher/cacher le menu
    if (mobileMenu) {
      if (isOpen) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('block');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('block');
      }
    }

    //échanger les icônes
    if (iconOpen && iconClose) {
      if (isOpen) {
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
      } else {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    }
  }

  //initialiser fermé
  setMenuOpen(false);

  //gestionnaire du bouton
  if (menuToggleButton) {
    menuToggleButton.addEventListener('click', () => {
      const isOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
      setMenuOpen(!isOpen);
    });
  }

  //fermer en cliquant un lien du menu
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }

  //fermer en cliquant à l'extérieur
  document.addEventListener('click', (evt) => {
    const target = evt.target;
    const clickedInsideMenu = mobileMenu && mobileMenu.contains(target);
    const clickedToggle = menuToggleButton && menuToggleButton.contains(target);
    const isOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
    if (isOpen && !clickedInsideMenu && !clickedToggle) {
      setMenuOpen(false);
    }
  });

  //fermer avec la touche Echap
  document.addEventListener('keydown', (evt) => {
    const isOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
    if (isOpen && evt.key === 'Escape') setMenuOpen(false);
  });


});
