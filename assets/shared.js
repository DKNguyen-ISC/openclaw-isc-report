// ISC OpenClaw & AI Agent Analysis Report V2
// Scroll-based single-page interactions
// Features: scroll-reveal, TOC highlighting, smooth scroll, keyboard nav, print

document.addEventListener('DOMContentLoaded', function () {

  // ── Section Reveal Animation (IntersectionObserver) ──
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.section').forEach(sec => revealObserver.observe(sec));

  // ── Active TOC highlighting on scroll ──
  const sections = document.querySelectorAll('.section[id]');
  const tocLinks = document.querySelectorAll('.toc-bar a[href^="#"]');

  const tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  sections.forEach(sec => tocObserver.observe(sec));

  // ── Smooth scroll for TOC links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without scroll jump
        history.pushState(null, '', this.getAttribute('href'));
      }
    });
  });

  // ── Keyboard Navigation (Arrow keys for sections) ──
  const sectionIds = Array.from(sections).map(s => s.id);

  function getCurrentSectionIndex() {
    let current = 0;
    sections.forEach((sec, i) => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = i;
      }
    });
    return current;
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' && !e.repeat) {
      const next = Math.min(getCurrentSectionIndex() + 1, sections.length - 1);
      sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'ArrowLeft' && !e.repeat) {
      const prev = Math.max(getCurrentSectionIndex() - 1, 0);
      sections[prev].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ── Staggered card reveal ──
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll(
          '.feature-card, .verdict-card, .qa-card, .gap-card, .insight-card, .analogy-card, .step-card, .st-phase, .kpi-cell'
        );
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          card.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
          // Trigger reflow then animate in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        });
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section, .kpi-ribbon').forEach(sec => cardObserver.observe(sec));

  // ── Table row animation ──
  const tableObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rows = entry.target.querySelectorAll('tbody tr');
        rows.forEach((row, i) => {
          row.style.opacity = '0';
          row.style.transform = 'translateX(-8px)';
          row.style.transition = `opacity 0.35s ease ${i * 0.04}s, transform 0.35s ease ${i * 0.04}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              row.style.opacity = '1';
              row.style.transform = 'translateX(0)';
            });
          });
        });
        tableObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tbl-wrap').forEach(tbl => tableObserver.observe(tbl));

  // ── Reading progress bar ──
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, var(--gold), var(--gold-bright), var(--gold));
    z-index: 9999; pointer-events: none;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ── Mobile hamburger for TOC ──
  if (window.innerWidth < 768) {
    const tocBar = document.querySelector('.toc-bar');
    if (tocBar) {
      tocBar.style.overflowX = 'auto';
      tocBar.style.flexWrap = 'nowrap';
      tocBar.style.borderRadius = '12px';
      tocBar.style.justifyContent = 'flex-start';
    }
  }

  // ── Print button ──
  document.querySelectorAll('[onclick*="print"]').forEach(btn => {
    // Already handled via inline onclick, but ensure no double-bind
  });

  // ── Reduced motion respect ──
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.section').forEach(sec => {
      sec.classList.add('reveal');
    });
  }

  // ── Keyboard accessibility ──
  document.querySelectorAll('.toc-bar a, .btn-top').forEach(el => {
    el.setAttribute('tabindex', '0');
  });

});
