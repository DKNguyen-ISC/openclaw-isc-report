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
});

