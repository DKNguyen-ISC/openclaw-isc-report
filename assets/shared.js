// ISC OpenClaw & AI Agent Analysis Report V2.1
// Scroll-based single-page interactions
// Features: scroll-reveal, TOC highlighting, smooth scroll, keyboard nav,
//           KPI counter animation, staggered cards, table rows, reading progress

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
  const sections  = document.querySelectorAll('.section[id]');
  const tocLinks  = document.querySelectorAll('.toc-bar a[href^="#"]');

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
        history.pushState(null, '', this.getAttribute('href'));
      }
    });
  });

  // ── Keyboard Navigation (Arrow keys for sections) ──
  function getCurrentSectionIndex() {
    let current = 0;
    sections.forEach((sec, i) => {
      if (window.scrollY >= sec.offsetTop - 200) current = i;
    });
    return current;
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && !e.repeat) {
      sections[Math.min(getCurrentSectionIndex() + 1, sections.length - 1)]
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'ArrowLeft' && !e.repeat) {
      sections[Math.max(getCurrentSectionIndex() - 1, 0)]
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ── KPI Counter Animation ──
  // Numeric KPI values count up; text values do a typewriter reveal
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCount(el, target, suffix) {
    const duration = 1400;
    const start    = performance.now();
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutQuart(progress) * target);
      el.textContent = '$' + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateTypewriter(el, text) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
  }

  const kpiObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ribbon = entry.target;
        ribbon.querySelectorAll('.kpi-value').forEach(el => {
          const type   = el.dataset.type;
          const target = el.dataset.target;
          if (type === 'currency') {
            animateCount(el, parseInt(target), el.dataset.suffix || '');
          } else if (type === 'text' && target) {
            // Small delay so it feels alive
            setTimeout(() => animateTypewriter(el, target), 200);
          }
        });
        kpiObserver.unobserve(ribbon);
      }
    });
  }, { threshold: 0.3 });

  const kpiRibbon = document.querySelector('.kpi-ribbon');
  if (kpiRibbon) kpiObserver.observe(kpiRibbon);

  // ── Staggered card reveal ──
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll(
          '.feature-card, .verdict-card, .qa-card, .gap-card, .insight-card,' +
          '.analogy-card, .step-card, .st-phase, .kpi-cell, .level-item,' +
          '.doc-card, .sf-step, .vs-item, .decision-item'
        );
        cards.forEach((card, i) => {
          card.style.opacity      = '0';
          card.style.transform    = 'translateY(16px)';
          card.style.transition   = `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity   = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        });
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section, .kpi-ribbon').forEach(sec => cardObserver.observe(sec));

  // ── Table row animation ──
  const tableObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('tbody tr').forEach((row, i) => {
          row.style.opacity    = '0';
          row.style.transform  = 'translateX(-8px)';
          row.style.transition = `opacity 0.35s ease ${i * 0.04}s, transform 0.35s ease ${i * 0.04}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              row.style.opacity   = '1';
              row.style.transform = 'translateX(0)';
            });
          });
        });
        tableObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tbl-wrap').forEach(tbl => tableObserver.observe(tbl));

  // ── Dark Office Ladder — animate level items in sequence ──
  const ladderObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.level-item').forEach((item, i) => {
          item.style.opacity   = '0';
          item.style.transform = 'translateX(-12px)';
          item.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity   = '1';
              item.style.transform = 'translateX(0)';
            });
          });
        });
        ladderObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const ladder = document.querySelector('.dark-office-ladder');
  if (ladder) ladderObserver.observe(ladder);

  // ── Reading progress bar ──
  const progressBar = document.createElement('div');
  progressBar.style.cssText = [
    'position:fixed','top:0','left:0','height:3px','width:0%',
    'background:linear-gradient(90deg,var(--gold),var(--gold-bright),var(--gold))',
    'box-shadow:0 0 8px rgba(232,160,32,0.7)',
    'z-index:9999','pointer-events:none','transition:width 0.1s linear'
  ].join(';');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ── Mobile TOC: horizontal scroll ──
  if (window.innerWidth < 768) {
    const tocBar = document.querySelector('.toc-bar');
    if (tocBar) {
      tocBar.style.overflowX  = 'auto';
      tocBar.style.flexWrap   = 'nowrap';
      tocBar.style.justifyContent = 'flex-start';
    }
  }

  // ── Accessibility: tabindex on interactive elements ──
  document.querySelectorAll('.toc-bar a, .btn-top').forEach(el => {
    el.setAttribute('tabindex', '0');
  });

  // ── Maturity Dial animation (conic-gradient via CSS custom property) ──
  const dialEl = document.querySelector('.maturity-dial');
  if (dialEl) {
    const dialObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate from 0% to 20% (L1 of 5 = 20%)
          let pct = 0;
          const target = 20;
          const duration = 900;
          const startTime = performance.now();
          function animateDial(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            pct = Math.round((1 - Math.pow(1 - progress, 3)) * target);
            entry.target.style.setProperty('--dial-pct', pct + '%');
            if (progress < 1) requestAnimationFrame(animateDial);
          }
          requestAnimationFrame(animateDial);
          dialObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    dialObserver.observe(dialEl);
  }

  // ── Reduced motion: skip all animations ──
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (dialEl) dialEl.style.setProperty('--dial-pct', '20%');
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('reveal'));
    document.querySelectorAll('.kpi-value').forEach(el => {
      // Show final value immediately
      el.textContent = el.dataset.target
        ? (el.dataset.type === 'currency' ? '$' + el.dataset.target + (el.dataset.suffix || '') : el.dataset.target)
        : el.textContent;
    });
  }

});
