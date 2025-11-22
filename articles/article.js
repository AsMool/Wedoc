// Progress navigation active state
      document.addEventListener('DOMContentLoaded', () => {
        const progressItems = document.querySelectorAll('.progress-item');
        const sections = document.querySelectorAll('.article-section');

        // Intersection Observer for scroll-based activation
        const observerOptions = {
          root: null,
          rootMargin: '200px 0px -20% 0px',
          threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionId = entry.target.id;
              progressItems.forEach((item) => {
                if (item.dataset.section === sectionId) {
                  progressItems.forEach((i) => i.classList.remove('active'));
                  item.classList.add('active');
                }
              });
            }
          });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));

        // Smooth scroll on click
        progressItems.forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        });
      });