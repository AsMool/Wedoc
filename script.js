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
  const bookContainer = document.querySelector('.articles-book-container');
  const bookWrapper = document.querySelector('.articles-book-wrapper');
  const bookSpreads = gsap.utils.toArray('.book-spread');

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      if (!bookContainer || !bookWrapper || bookSpreads.length < 2) return;

      const totalSpreads = bookSpreads.length;

      gsap.set(bookSpreads, {
        zIndex: (index) => totalSpreads - index,
        rotateY: 0,
        '--flip-progress': 0,
      });

      const flipTrigger = ScrollTrigger.create({
        trigger: bookContainer,
        start: 'top top',
        end: () => '+=' + Math.max((totalSpreads - 1) * 900, 600),
        scrub: true,
        pin: bookWrapper,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          bookSpreads.forEach((spread, index) => {
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
        flipTrigger.kill();
      };
    },

    '(max-width: 767px)': () => {
      if (!bookSpreads.length) return;
      gsap.set(bookSpreads, { clearProps: 'all' });
    },
  });

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

  //ajouter la navigation souris pour le carrousel d images
  const imageCarousel = document.getElementById('image-carousel');

  if (imageCarousel) {
    let isDragging = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;
    let storedScrollBehavior = '';
    let activePointerId = null;

    const enableInstantScroll = () => {
      storedScrollBehavior = imageCarousel.style.scrollBehavior;
      imageCarousel.style.scrollBehavior = 'auto';
    };

    const restoreScrollBehavior = () => {
      imageCarousel.style.scrollBehavior = storedScrollBehavior;
      storedScrollBehavior = '';
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      imageCarousel.classList.remove('is-dragging');
      restoreScrollBehavior();

      if (activePointerId !== null) {
        try {
          if (imageCarousel.hasPointerCapture(activePointerId)) {
            imageCarousel.releasePointerCapture(activePointerId);
          }
        } catch (error) {
          //ignore si le navigateur ne supporte pas cette verification
        }
      }

      activePointerId = null;
    };

    imageCarousel.addEventListener('pointerdown', (evt) => {
      if (evt.pointerType !== 'mouse' && evt.pointerType !== 'pen') return;
      if (evt.button !== 0) return;

      isDragging = true;
      dragStartX = evt.clientX;
      dragScrollLeft = imageCarousel.scrollLeft;
      activePointerId = evt.pointerId;
      imageCarousel.classList.add('is-dragging');
      enableInstantScroll();

      try {
        imageCarousel.setPointerCapture(activePointerId);
      } catch (error) {
        //ignore si le navigateur ne supporte pas cette operation
      }
    });

    imageCarousel.addEventListener('pointermove', (evt) => {
      if (!isDragging) return;
      if (evt.pointerId !== activePointerId) return;

      evt.preventDefault();
      const deltaX = evt.clientX - dragStartX;
      // multiplier deltaX pour rendre le glissement un peu plus long
      imageCarousel.scrollLeft = dragScrollLeft - deltaX * 1.2;
    });

    imageCarousel.addEventListener('pointerup', (evt) => {
      if (evt.pointerId !== activePointerId) return;
      endDrag();
    });

    imageCarousel.addEventListener('pointercancel', (evt) => {
      if (evt.pointerId !== activePointerId) return;
      endDrag();
    });

    imageCarousel.addEventListener('pointerleave', () => {
      endDrag();
    });

    imageCarousel.addEventListener(
      'wheel',
      (evt) => {
        const verticalScroll = Math.abs(evt.deltaY) > Math.abs(evt.deltaX);
        if (!verticalScroll) return;

        const atStart = imageCarousel.scrollLeft <= 0;
        const atEnd =
          Math.ceil(imageCarousel.scrollLeft + imageCarousel.clientWidth) >=
          imageCarousel.scrollWidth;

        if ((atStart && evt.deltaY < 0) || (atEnd && evt.deltaY > 0)) return;

        evt.preventDefault();
        // augmenter légèrement l'effet de la molette pour un défilement plus long
        imageCarousel.scrollLeft += evt.deltaY * 1.5;
      },
      { passive: false }
    );
  }
});
