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
          (totalSpreads - 1) * viewportHeight * 0.45,
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
        start: 'top top+=80',
        end: () => '+=' + computeScrollDistance(),
        scrub: true,
        pin: articlesBookWrapper,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalSpreads = articlesBookSpreads.length;

          articlesBookSpreads.forEach((spread, index) => {
            const spreadStartProgress = index / totalSpreads;
            const spreadEndProgress = (index + 1) / totalSpreads;

            const isCurrent = progress >= spreadStartProgress && progress < spreadEndProgress;
            const isPast = progress >= spreadEndProgress;

            let zIndexValue = totalSpreads - index;
            if (isCurrent) {
              zIndexValue = totalSpreads + 1;
            } else if (isPast) {
              zIndexValue = index;
            }

            const page = spread.querySelector('.book-page-right');
            if (!page) return;

            // Prevent the last page from flipping
            if (index === totalSpreads - 1) {
              gsap.set(spread, {
                zIndex: zIndexValue,
                '--flip-progress': 0,
              });
              gsap.set(page, {
                rotationY: 0,
                z: 0,
              });
              return;
            }

            const pageProgress = (progress - spreadStartProgress) / (spreadEndProgress - spreadStartProgress);
            const rotation = Math.max(0, Math.min(180, 180 * pageProgress));
            
            // Add some z movement to make it look like the page is lifting
            const z = pageProgress < 0.5 ? pageProgress * 40 : (1 - pageProgress) * 40;

            gsap.set(spread, {
              zIndex: zIndexValue,
              '--flip-progress': pageProgress,
            });

            gsap.set(page, {
              rotationY: -rotation,
              z: z,
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
        rootMargin: '-45% 0px -45% 0px',
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
