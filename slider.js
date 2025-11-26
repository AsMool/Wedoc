function initArticleSlider() {
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
}

document.addEventListener("DOMContentLoaded", initArticleSlider);
