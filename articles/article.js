// fonction de scroll personnalisee avec easing
function smoothScrollTo(element, offset = 100) {
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const baseDuration = 250;
  const distanceFactor = Math.abs(distance) * 0.1;
  const duration = Math.min(300, Math.max(baseDuration, distanceFactor));
  let start = null;
  let isScrolling = true;

  // desactiver temporairement la mise a jour de progression
  window.tocProgressDisabled = true;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    window.scrollTo(0, startPosition + distance * ease);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      isScrolling = false;
      setTimeout(() => {
        window.tocProgressDisabled = false;
      }, 100);
    }
  }

  requestAnimationFrame(animation);
}

function setupArticleLayout() {
  const article = document.querySelector('article');
  if (!article) return null;

  const layoutWrapper = document.createElement('div');
  layoutWrapper.className = 'article-layout container mx-auto px-6 py-24 max-w-6xl';

  article.parentNode.insertBefore(layoutWrapper, article);
  layoutWrapper.appendChild(article);

  article.classList.add('article-content');
  article.classList.remove('container', 'mx-auto', 'px-6', 'py-24', 'max-w-4xl');

  return layoutWrapper;
}

// generation de la table des matieres et navigation
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.article-section');
  const progressItems = document.querySelectorAll('.progress-item');
  const articleLayout = setupArticleLayout();

  // creation de la table des matieres desktop
  function createDesktopTOC() {
    if (!articleLayout) return;

    const tocSidebar = document.createElement('nav');
    tocSidebar.className = 'toc-sidebar';
    tocSidebar.setAttribute('aria-label', 'Table des matieres');

    const tocTitle = document.createElement('div');
    tocTitle.className = 'toc-title';
    tocTitle.textContent = 'Table des matieres';
    tocSidebar.appendChild(tocTitle);

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    sections.forEach((section) => {
      const sectionId = section.id;
      const sectionTitle = section.querySelector('h2');
      if (sectionTitle) {
        const tocItem = document.createElement('li');
        tocItem.className = 'toc-item';

        const tocLink = document.createElement('a');
        tocLink.className = 'toc-link';
        tocLink.href = `#${sectionId}`;
        tocLink.textContent = sectionTitle.textContent.trim();
        tocLink.dataset.section = sectionId;

        const tocProgressBar = document.createElement('div');
        tocProgressBar.className = 'toc-link-progress';
        tocLink.appendChild(tocProgressBar);

        tocLink.addEventListener('click', (e) => {
          e.preventDefault();
          smoothScrollTo(section, 100);
        });

        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
      }
    });

    tocSidebar.appendChild(tocList);
    document.body.appendChild(tocSidebar);
  }

  // creation de la table des matieres mobile
  function createMobileTOC() {
    const articleHeader = document.querySelector('article header');
    if (!articleHeader) return;

    let dateDiv = articleHeader.querySelector('div.mt-6, div.text-sm.opacity-60');
    if (!dateDiv) {
      const allDivs = articleHeader.querySelectorAll('div');
      const dateDivCandidate = Array.from(allDivs).find(div =>
        div.textContent.includes('Publié') || div.textContent.includes('publié')
      );
      if (!dateDivCandidate) return;
      dateDiv = dateDivCandidate;
    }

    const mobileTocContainer = document.createElement('nav');
    mobileTocContainer.className = 'mobile-toc-container';
    mobileTocContainer.setAttribute('aria-label', 'Table des matieres mobile');

    const mobileTocTitle = document.createElement('div');
    mobileTocTitle.className = 'mobile-toc-title';
    mobileTocTitle.textContent = 'Table des matieres';
    mobileTocContainer.appendChild(mobileTocTitle);

    const mobileTocList = document.createElement('ul');
    mobileTocList.className = 'mobile-toc-list';

    sections.forEach((section) => {
      const sectionId = section.id;
      const sectionTitle = section.querySelector('h2');
      if (sectionTitle) {
        const mobileTocItem = document.createElement('li');
        mobileTocItem.className = 'mobile-toc-item';

        const mobileTocLink = document.createElement('a');
        mobileTocLink.className = 'mobile-toc-link';
        mobileTocLink.href = `#${sectionId}`;
        mobileTocLink.textContent = sectionTitle.textContent.trim();
        mobileTocLink.dataset.section = sectionId;

        mobileTocLink.addEventListener('click', (e) => {
          e.preventDefault();
          smoothScrollTo(section, 100);
        });

        mobileTocItem.appendChild(mobileTocLink);
        mobileTocList.appendChild(mobileTocItem);
      }
    });

    mobileTocContainer.appendChild(mobileTocList);
    dateDiv.insertAdjacentElement('afterend', mobileTocContainer);
  }

  // intersection observer pour activer les sections
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };

  // mise a jour de l'etat actif des progress items (dots)
  function updateProgressItems() {
    if (window.tocProgressDisabled) return;
    if (progressItems.length === 0) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const offset = 150;

    let activeSectionId = null;
    let bestScore = -Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionId = section.id;
      const sectionTop = scrollTop + rect.top;
      const sectionBottom = sectionTop + rect.height;

      const viewportTop = scrollTop + offset;
      const viewportBottom = scrollTop + windowHeight - offset;

      if (sectionTop <= viewportBottom && sectionBottom >= viewportTop) {
        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const sectionHeight = rect.height;
        const visibilityRatio = visibleHeight / Math.max(sectionHeight, 1);
        const centerDistance = Math.abs((sectionTop + sectionBottom) / 2 - (viewportTop + viewportBottom) / 2);
        const score = visibilityRatio * 1000 - centerDistance;

        if (score > bestScore) {
          bestScore = score;
          activeSectionId = sectionId;
        }
      }
    });

    if (!activeSectionId && sections.length > 0) {
      const firstSection = sections[0];
      const rect = firstSection.getBoundingClientRect();
      if (scrollTop + windowHeight < rect.top + scrollTop + offset) {
        activeSectionId = firstSection.id;
      }
    }

    if (activeSectionId) {
      progressItems.forEach((item) => {
        const itemSectionId = item.getAttribute('data-section') || item.getAttribute('href')?.substring(1);
        if (itemSectionId === activeSectionId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // mise a jour des barres de progression pour chaque section
  function updateSectionProgress() {
    if (window.tocProgressDisabled) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const offset = 100; // Match the smooth scroll offset

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      // rect.top is relative to viewport. sectionTop absolute is scrollTop + rect.top
      const sectionTop = scrollTop + rect.top;
      const sectionHeight = rect.height;
      const sectionBottom = sectionTop + sectionHeight;

      const sectionId = section.id;
      const tocLink = document.querySelector(`.toc-link[data-section="${sectionId}"]`);
      const progressBar = tocLink ? tocLink.querySelector('.toc-link-progress') : null;

      if (progressBar) {
        let progress = 0;

        const startPoint = sectionTop - offset;
        const endPoint = sectionBottom - windowHeight;

        if (sectionHeight < windowHeight) {
          // If section is shorter than window, fill it when the bottom is visible
          if (scrollTop + windowHeight >= sectionBottom) {
            progress = 1;
          } else if (scrollTop >= startPoint) {
            progress = (scrollTop + windowHeight - sectionTop) / sectionHeight;
          }
        } else {
          // Long section
          const scrollRange = endPoint - startPoint;
          if (scrollRange <= 0) {
            progress = 1;
          } else {
            progress = (scrollTop - startPoint) / scrollRange;
          }
        }

        // Clamp
        progress = Math.max(0, Math.min(1, progress));

        progressBar.style.width = `${progress * 100}%`;
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    updateSectionProgress();
    updateProgressItems();
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateSectionProgress();
      updateProgressItems();
    }, 10);
  }, { passive: true });
  window.addEventListener('resize', () => {
    updateSectionProgress();
    updateProgressItems();
  });
  updateSectionProgress();
  updateProgressItems();

  // smooth scroll sur les progress items
  progressItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        smoothScrollTo(target, 120);
      }
    });
  });

  // creation des elements
  createDesktopTOC();
  createMobileTOC();
});