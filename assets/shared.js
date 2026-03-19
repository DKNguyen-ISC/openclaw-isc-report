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

  // Desktop Sidebar Collapse Toggle
  function initSidebarCollapse() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Restore saved state
    if (localStorage.getItem('isc_sidebar_collapsed') === 'true') {
      sidebar.classList.add('collapsed');
      document.body.classList.add('sidebar-collapsed');
    }

    // Create toggle button
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'sidebar-collapse-btn';
    collapseBtn.setAttribute('aria-label', 'Toggle sidebar');
    collapseBtn.title = 'Collapse sidebar';
    collapseBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    sidebar.style.position = 'fixed'; // ensure relative for button
    sidebar.appendChild(collapseBtn);

    collapseBtn.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed', isCollapsed);
      localStorage.setItem('isc_sidebar_collapsed', isCollapsed);
    });
  }

  // Only run on desktop
  if (window.innerWidth >= 850) {
    initSidebarCollapse();
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
  window.matchMedia('print').addEventListener('change', (mql) => {
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

  // Create progress bar element
  const progressBar = document.createElement('div');
  progressBar.id = 'page-transition-bar';
  document.body.appendChild(progressBar);

  function showProgress() {
    progressBar.style.width = '70%';
    progressBar.style.opacity = '1';
  }
  function completeProgress() {
    progressBar.style.width = '100%';
    setTimeout(() => { progressBar.style.opacity = '0'; progressBar.style.width = '0%'; }, 200);
  }

  // On page enter: complete the bar
  window.addEventListener('load', completeProgress);

  function navigateTo(direction) {
    const currentIndex = getPageIndex();
    if (currentIndex === -1) return;
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < pages.length) {
      showProgress();
      document.body.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = pages[nextIndex];
      }, 180);
    }
  }

  // Intercept sidebar link clicks — apply exit animation + progress bar
  document.querySelectorAll('.sidebar nav a, .nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        showProgress();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 180);
      }
    });
  });

  // Prefetch adjacent pages for faster navigation
  function prefetchAdjacentPages() {
    const currentIndex = getPageIndex();
    if (currentIndex === -1) return;

    const toPrefetch = [];
    if (currentIndex + 1 < pages.length) toPrefetch.push(pages[currentIndex + 1]);
    if (currentIndex - 1 >= 0) toPrefetch.push(pages[currentIndex - 1]);

    toPrefetch.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }
  prefetchAdjacentPages();

  let arrowNavTimeout;
  let arrowNavReady = false;

  // Keyboard Navigation (Arrows)
  document.addEventListener('keydown', (e) => {
    // Prevent navigation if user is typing in an input/textarea (though not present here, good practice)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      if (!e.repeat) navigateTo(1);
    } else if (e.key === 'ArrowLeft') {
      if (!e.repeat) navigateTo(-1);
    } else if (e.key === 'ArrowDown') {
      const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;
      
      if (!isAtBottom) {
        // Let the browser handle standard smooth scrolling naturally.
        arrowNavReady = false;
      } else {
        // At the bottom boundary
        e.preventDefault(); // Stop native behavior to avoid jumping
        
        // Require a firm, distinct key press to navigate (ignore if key is held down)
        if (!e.repeat) {
          if (arrowNavReady) {
            navigateTo(1);
            arrowNavReady = false;
          } else {
            arrowNavReady = true;
            clearTimeout(arrowNavTimeout);
            arrowNavTimeout = setTimeout(() => { arrowNavReady = false; }, 2000);
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      const isAtTop = window.scrollY <= 5;
      
      if (!isAtTop) {
        // Let the browser handle standard smooth scrolling naturally.
        arrowNavReady = false;
      } else {
        // At the top boundary
        e.preventDefault(); // Stop native behavior
        
        if (!e.repeat) {
          if (arrowNavReady) {
            navigateTo(-1);
            arrowNavReady = false;
          } else {
            arrowNavReady = true;
            clearTimeout(arrowNavTimeout);
            arrowNavTimeout = setTimeout(() => { arrowNavReady = false; }, 2000);
          }
        }
      }
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

