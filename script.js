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

  //logique pour l'effet d'articles empilés avec scroll
  const stackedArticles = gsap.utils.toArray('.stacked-article');
  const articlesContainer = document.querySelector('.articles-stack-container');

  if (stackedArticles.length > 0 && articlesContainer) {
    //définir les positions initiales pour chaque article
    stackedArticles.forEach((article, index) => {
      gsap.set(article, {
        zIndex: stackedArticles.length - index,
        scale: 1 - (index * 0.05),
        opacity: 0.3 + ((stackedArticles.length - index) * 0.15),
        
        //faire venir chaque carte par le bas
        y: 120
      });
    });

    //créer une animation pour chaque article
    stackedArticles.forEach((article, index) => {
      //calculer le début et la fin du scroll pour chaque article
      const startProgress = index / stackedArticles.length;
      const endProgress = (index + 1) / stackedArticles.length;

      gsap.to(article, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: articlesContainer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            //calculer l'opacité et le scale basés sur la progression
            if (progress < startProgress) {
              //avant que cet article soit actif
              gsap.set(article, {
                scale: 1 - ((stackedArticles.length - index) * 0.05),
                opacity: 0.3,
                zIndex: stackedArticles.length - index,
                
                //position au repos en bas
                y: 120
              });
            } else if (progress >= startProgress && progress < endProgress) {
              //pendant que cet article est actif
              const localProgress = (progress - startProgress) / (endProgress - startProgress);
              gsap.set(article, {
                scale: 1,
                opacity: 1,
                zIndex: stackedArticles.length + index,
                
                //interpolation de y: de 120 (bas) à 0 (centre)
                y: 120 * (1 - localProgress)
              });
            } else {
              //après que cet article soit actif
              const fadeProgress = Math.min((progress - endProgress) / 0.15, 1);
              gsap.set(article, {
                scale: 1 - (fadeProgress * 0.1),
                opacity: Math.max(1 - (fadeProgress * 1.5), 0),
                zIndex: index,
                
                //sortie vers le haut
                y: -120 * fadeProgress
              });
            }
          }
        }
      });
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
