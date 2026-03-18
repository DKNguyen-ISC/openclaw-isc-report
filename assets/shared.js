// Shared JS for OpenClaw Report - CEO Kent Version
// Features: scrollspy nav, section animations, mobile hamburger, accessibility, print

document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section-container').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Scrollspy for nav active states
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^=\"#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Initial

  // Smooth internal links
  document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Mobile hamburger menu
  const hamburger = document.createElement('button');
  hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  hamburger.className = 'mobile-menu-btn';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.style.cssText = `
    position: fixed; top: 1rem; left: 1rem; z-index: 200;
    background: var(--bg-surface); color: var(--text-main);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 0.75rem; font-size: 1.25rem; cursor: pointer;
    display: none;
  `;

  document.body.appendChild(hamburger);

  window.addEventListener('resize', toggleMobileMenu);
  toggleMobileMenu();

  function toggleMobileMenu() {
    const isMobile = window.innerWidth < 850;
    const sidebar = document.querySelector('.sidebar');
    
    if (isMobile) {
      hamburger.style.display = 'block';
      document.body.style.paddingLeft = '0';
      sidebar.style.transform = 'translateX(-100%)';
      sidebar.style.position = 'fixed';
      
      hamburger.onclick = () => {
        sidebar.classList.toggle('mobile-open');
        sidebar.style.transform = sidebar.classList.contains('mobile-open') ? 'translateX(0)' : 'translateX(-100%)';
      };
    } else {
      hamburger.style.display = 'none';
      document.body.style.paddingLeft = '280px';
      sidebar.style.transform = 'none';
      sidebar.classList.remove('mobile-open');
    }
  }

  // Keyboard accessibility
  document.querySelectorAll('nav a, .btn-primary-glow, .btn-gold').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    };
  });

  // Print styles trigger
  window.matchMedia('print').addListener((mql) => {
    if (mql.matches) {
      document.querySelector('.sidebar').style.display = 'none';
      document.body.style.paddingLeft = '0';
    }
  });

  // Reduced motion respect
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', 'none');
  }

  // Seamless Page Navigation via Keyboard (Up/Down/Left/Right) and Scroll
  const pages = [
    'index.html',
    'features.html',
    'isc_integration.html',
    'risks_costs.html',
    'roadmap.html',
    'analysis.html',
    'comparison.html',
    'conclusion.html'
  ];

  function getPageIndex() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    return pages.indexOf(pageName);
  }

  // Seamless page exit animation before navigation
  function navigateTo(direction) {
    const currentIndex = getPageIndex();
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < pages.length) {
      document.body.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = pages[nextIndex];
      }, 280); // Match CSS animation duration
    }
  }

  // Intercept sidebar link clicks to apply exit animation
  document.querySelectorAll('.sidebar nav a, .nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 280);
      }
    });
  });

  // Keyboard Navigation (Arrows)
  document.addEventListener('keydown', (e) => {
    // Prevent navigation if user is typing in an input/textarea (though not present here, good practice)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      navigateTo(1); // Next page
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      navigateTo(-1); // Previous page
    }
  });

  // Scroll to Transition (Bottom of page to next)
  let wheelTimeout;
  window.addEventListener('wheel', (e) => {
    // Only trigger if scrolling down
    if (e.deltaY > 0) {
      // Check if we hit the very bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        // Debounce to prevent rapid transitions
        if (!wheelTimeout) {
          wheelTimeout = setTimeout(() => {
            navigateTo(1);
            wheelTimeout = null;
          }, 800);
        }
      }
    } else if (e.deltaY < 0) {
      // Check if we hit the very top
      if (window.scrollY === 0) {
        if (!wheelTimeout) {
          wheelTimeout = setTimeout(() => {
            navigateTo(-1);
            wheelTimeout = null;
          }, 800);
        }
      }
    }
  });
});

