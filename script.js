// animation d'entrée et configuration des effets au scroll
document.addEventListener('DOMContentLoaded', () => {
  //enregistrer les plugins nécessaires
  gsap.registerPlugin(ScrollTrigger);

  //créer l'animation d'entrée pour le hero
  const heroTimeline = gsap.timeline();
  heroTimeline.from('.hero-title', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out' });
  heroTimeline.from('#cta-visiter', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

  //ajouter le scroll smooth pour le bouton "Visiter"
  const cta = document.getElementById('cta-visiter');
  if (cta) {
    cta.addEventListener('click', () => {
      const target = document.getElementById('histoire');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  //créer les animations au scroll pour chaque élément marqué
  gsap.utils.toArray('[data-animate]').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });

  //initialiser le carousel des articles
  setupArticlesCarousel();

  //initialiser la galerie d'images auto-défilante
  setupImageTrack();
});

//mettre en place le carousel des articles avec un effet "pile" et auto-play
function setupArticlesCarousel() {
  //récupérer le conteneur du carousel
  const container = document.getElementById('articles-carousel');
  if (!container) return;

  //récupérer et ordonner les cartes
  const cards = Array.from(container.querySelectorAll('.article-card'));
  if (cards.length === 0) return;

  //fonction de mise en page des cartes (pile)
  function layout(animate = false) {
    const config = {
      y: (i) => i * 30,
      scale: (i) => Math.max(0.86, 1 - i * 0.06),
      opacity: (i) => (i < 4 ? 1 : 0),
      zIndex: (i) => cards.length - i,
      filter: (i) => (i === 0 ? 'none' : 'blur(1px)'),
      duration: 0.6,
      ease: 'power2.out'
    };

    if (animate) {
      gsap.to(cards, config);
    } else {
      gsap.set(cards, config);
    }
  }

  //appliquer la mise en page initiale
  layout(false);

  //définir l'action d'avance/recul
  function advance(dir = 1) {
    if (dir > 0) {
      cards.push(cards.shift());
    } else {
      cards.unshift(cards.pop());
    }
    layout(true);
  }

  //ajouter les boutons de navigation
  const nextBtn = document.getElementById('articles-next');
  const prevBtn = document.getElementById('articles-prev');
  const nextBtnMobile = document.getElementById('articles-next-mobile');
  const prevBtnMobile = document.getElementById('articles-prev-mobile');
  
  if (nextBtn) nextBtn.addEventListener('click', () => advance(1));
  if (prevBtn) prevBtn.addEventListener('click', () => advance(-1));
  if (nextBtnMobile) nextBtnMobile.addEventListener('click', () => advance(1));
  if (prevBtnMobile) prevBtnMobile.addEventListener('click', () => advance(-1));

  //définir l'auto-play contrôlé par la visibilité de la section
  let autoId = null;
  function startAuto() {
    if (autoId) return;
    autoId = setInterval(() => advance(1), 2500);
  }
  function stopAuto() {
    if (!autoId) return;
    clearInterval(autoId);
    autoId = null;
  }

  //configurer ScrollTrigger pour lancer/arrêter l'auto-play
  ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    end: 'bottom top',
    onEnter: startAuto,
    onEnterBack: startAuto,
    onLeave: stopAuto,
    onLeaveBack: stopAuto
  });

  //permettre d'avancer en cliquant sur la pile
  container.addEventListener('click', (e) => {
    const node = e.target;
    if (node.closest && node.closest('.article-card')) advance(1);
  });
}

//mettre en place la galerie d'images en défilement horizontal continu
function setupImageTrack() {
  //récupérer le "rail" d'images
  const track = document.getElementById('image-track');
  if (!track) return;

  //dupliquer les images pour boucler proprement
  const items = Array.from(track.children);
  items.forEach((node) => {
    const clone = node.cloneNode(true);
    track.appendChild(clone);
  });

  //calculer la largeur totale du contenu
  const total = track.scrollWidth;

  //animer le déplacement horizontal en boucle
  const tween = gsap.to(track, {
    x: -total / 2,
    duration: 40,
    ease: 'none',
    repeat: -1
  });

  //mettre en pause/reprendre au survol
  track.addEventListener('mouseenter', () => tween.pause());
  track.addEventListener('mouseleave', () => tween.play());
}


