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

    // modal pour afficher l'image en grand
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = imageModal?.querySelector('.image-modal-close');
    const modalOverlay = imageModal?.querySelector('.image-modal-overlay');

    function openModal(imageUrl) {
      if (!imageModal || !modalImage) return;
      modalImage.src = imageUrl;
      imageModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!imageModal) return;
      imageModal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    // initialiser les event listeners du modal
    if (imageModal && modalImage) {
      // fermer le modal avec le bouton
      if (modalClose) {
        modalClose.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal();
        });
      }
      
      // fermer si on clique sur l'overlay
      if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
      }
      
      // fermer si on clique n'importe où sur le modal sauf sur l'image
      const modalContent = imageModal.querySelector('.image-modal-content');
      if (modalContent) {
        modalContent.addEventListener('click', (e) => {
          // si on clique directement sur l'image, ne pas fermer
          if (e.target === modalImage) {
            e.stopPropagation();
            return;
          }
          // sinon fermer (clic sur le conteneur vide autour de l'image)
          closeModal();
        });
      }
      
      // aussi écouter sur le modal entier comme fallback
      imageModal.addEventListener('click', (e) => {
        // si on clique directement sur l'image, ne pas fermer
        if (e.target === modalImage) {
          return;
        }
        // si on clique sur le conteneur, laisser son handler gérer
        if (e.target === modalContent || e.target.closest('.image-modal-content')) {
          return;
        }
        // pour tout le reste (overlay, etc.), fermer
        closeModal();
      });
      
      // empêcher la propagation du clic sur l'image pour qu'elle ne ferme pas
      modalImage.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      // fermer avec escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
          closeModal();
        }
      });
    }

    // clic sur l'image active (le deuxieme item)
    let activeItemClickHandler = null;
    let previousActiveItem = null;
    
    function setupImageClick() {
      const items = sliderRoot.querySelectorAll('.item');
      if (items.length > 1) {
        const activeItem = items[1];
        
        // retirer l'ancien handler de l'ancien element si il existe
        if (previousActiveItem && activeItemClickHandler) {
          previousActiveItem.removeEventListener('click', activeItemClickHandler);
          previousActiveItem.style.cursor = '';
        }
        
        // creer un nouveau handler
        activeItemClickHandler = (e) => {
          // ne pas ouvrir si on clique sur le bouton ou la navigation
          if (e.target.closest('button') || e.target.closest('.slider-nav')) return;
          
          const bgImage = window.getComputedStyle(activeItem).backgroundImage;
          const imageUrl = bgImage.replace(/url\(['"]?(.+?)['"]?\)/i, '$1');
          if (imageUrl) {
            openModal(imageUrl);
          }
        };
        
        activeItem.style.cursor = 'pointer';
        activeItem.addEventListener('click', activeItemClickHandler);
        previousActiveItem = activeItem;
      }
    }

    // observer pour detecter quand l'image active change
    const observer = new MutationObserver(() => {
      setupImageClick();
    });

    observer.observe(sliderRoot, { childList: true, subtree: false });

    // initialiser le clic sur l'image active
    setupImageClick();
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
