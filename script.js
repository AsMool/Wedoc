// animation d'entrée et configuration des effets au scroll
document.addEventListener("DOMContentLoaded", () => {
  //enregistrer les plugins nécessaires
  gsap.registerPlugin(ScrollTrigger);

  //créer l'animation d'entrée pour le hero
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
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
  });

  //logique pour l'effet livre des articles
  const articlesBookContainer = document.querySelector('#articles .articles-book-container');
  const articlesBookWrapper = document.querySelector('#articles .articles-book-wrapper');
  const articlesBookSpreads = gsap.utils.toArray('#articles .book-spread');

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      if (!articlesBookContainer || !articlesBookWrapper || articlesBookSpreads.length < 2) return;

      const totalSpreads = articlesBookSpreads.length;

      const computeScrollDistance = () => {
        const viewportHeight = window.innerHeight;
        const distance = Math.max(
          (totalSpreads - 1) * viewportHeight * 0.55,
          viewportHeight * 0.45,
          420
        );

        articlesBookContainer.style.setProperty('--book-scroll-distance', `${distance}px`);
        return distance;
      };

      const refreshHandler = () => {
        computeScrollDistance();
      };

      gsap.set(articlesBookSpreads, {
        zIndex: (index) => totalSpreads - index,
        rotateY: 0,
        '--flip-progress': 0,
      });

      computeScrollDistance();
      ScrollTrigger.addEventListener('refreshInit', refreshHandler);

      const articlesFlipTrigger = ScrollTrigger.create({
        trigger: articlesBookContainer,
        start: 'top top',
        end: () => '+=' + computeScrollDistance(),
        scrub: true,
        pin: articlesBookWrapper,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          articlesBookSpreads.forEach((spread, index) => {
            const start = index / (totalSpreads - 1);
            const end = (index + 1) / (totalSpreads - 1);

            let localProgress;
            if (progress <= start) {
              localProgress = 0;
            } else if (progress >= end) {
              localProgress = 1;
            } else {
              localProgress = (progress - start) / (end - start);
            }

            const rotation = gsap.utils.mapRange(0, 1, 0, -180, localProgress);
            const isActive = progress > start && progress < end;
            const isPast = progress >= end;
            let zIndexValue;

            if (isActive) {
              zIndexValue = totalSpreads + index;
            } else if (isPast) {
              zIndexValue = index;
            } else {
              zIndexValue = totalSpreads - index;
            }

            gsap.set(spread, {
              rotateY: rotation,
              '--flip-progress': localProgress,
              zIndex: zIndexValue,
            });
          });
        },
      });

      return () => {
        articlesFlipTrigger.kill();
        ScrollTrigger.removeEventListener('refreshInit', refreshHandler);
        articlesBookContainer.style.removeProperty('--book-scroll-distance');
      };
    },

    '(max-width: 767px)': () => {
      if (!articlesBookSpreads.length) return;
      if (articlesBookContainer) {
        articlesBookContainer.style.removeProperty('--book-scroll-distance');
      }
      gsap.set(articlesBookSpreads, { clearProps: 'all' });
    },
  });

  // Slider functionality for the stacked image showcase
  const sliderRoot = document.querySelector('#images .slider');
  const prevButton = document.querySelector('#images .btn.prev');
  const nextButton = document.querySelector('#images .btn.next');

  if (sliderRoot && prevButton && nextButton) {
    const moveNext = () => {
      const items = sliderRoot.querySelectorAll('.item');
      if (items.length > 1) {
        sliderRoot.append(items[0]);
      }
    };

    const movePrev = () => {
      const items = sliderRoot.querySelectorAll('.item');
      if (items.length > 1) {
        sliderRoot.prepend(items[items.length - 1]);
      }
    };

    nextButton.addEventListener('click', (event) => {
      event.preventDefault();
      moveNext();
    });

    prevButton.addEventListener('click', (event) => {
      event.preventDefault();
      movePrev();
    });

    // Allow keyboard navigation when the slider has focus
    sliderRoot.setAttribute('tabindex', '0');
    sliderRoot.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePrev();
      }
    });
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
