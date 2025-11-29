// animation d'entrée et configuration des effets au scroll
document.addEventListener("DOMContentLoaded", () => {
  //enregistrer les plugins nécessaires
  gsap.registerPlugin(ScrollTrigger);

  // Gestion des vidéos d'intro
  const introVideo = document.getElementById("intro-video");
  const loopVideo = document.getElementById("loop-video");
  const heroSection = document.getElementById("hero");

  function playIntroSequence() {
    if (!introVideo || !loopVideo) return;

    // Réinitialiser les vidéos
    introVideo.currentTime = 0;
    loopVideo.currentTime = 0;
    introVideo.classList.remove("hidden");
    loopVideo.classList.add("hidden");

    // Jouer l'intro
    introVideo.play();

    // Quand l'intro se termine, passer au loop
    introVideo.onended = () => {
      introVideo.classList.add("hidden");
      loopVideo.classList.remove("hidden");
      loopVideo.play();
    };
  }

  // Lancer la séquence au chargement
  playIntroSequence();

  // Observer quand on revient à la section hero
  if (heroSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            playIntroSequence();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(heroSection);
  }

  //créer l'animation d'entrée pour le hero
  const heroTimeline = gsap.timeline();
  heroTimeline.from(".hero-title", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
  });


  //créer les animations au scroll pour chaque élément marqué
  gsap.utils.toArray("[data-animate]").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 110%" },
    });
  });




});
