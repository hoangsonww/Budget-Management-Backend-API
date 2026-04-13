/**
 * Budget Management API - Overview Page JavaScript
 * Handles interactive features, animations, and dynamic content
 */

(function () {
  'use strict';

  // ==========================================
  // Smooth Scrolling for Navigation Links
  // ==========================================
  function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // ==========================================
  // Scroll to Top Button
  // ==========================================
  function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      this.querySelector('i').classList.toggle('fa-bars');
      this.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
      }
    });
  }

  // ==========================================
  // Navbar Background on Scroll
  // ==========================================
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
      } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
      }
    });
  }

  // ==========================================
  // Scroll Progress Bar
  // ==========================================
  function initScrollProgressBar() {
    const progressBar = document.querySelector('.scroll-progress-bar');

    if (!progressBar) return;

    let ticking = false;

    function updateProgressBar() {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = windowHeight > 0 ? window.pageYOffset / windowHeight : 0;
      progressBar.style.transform = `scaleX(${scrolled})`;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateProgressBar);
        ticking = true;
      }
    });

    updateProgressBar();
  }

  // ==========================================
  // Copy Code Snippets
  // ==========================================
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(block => {
      const pre = block.parentElement;

      if (!pre.parentElement.classList.contains('code-block-wrapper')) {
        const lang = block.className.match(/language-(\w+)/) ? block.className.match(/language-(\w+)/)[1] : 'code';

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        const header = document.createElement('div');
        header.className = 'code-header';

        // macOS traffic light dots
        const dots = document.createElement('div');
        dots.className = 'macos-dots';
        dots.innerHTML = '<span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>';

        const langLabel = document.createElement('span');
        langLabel.className = 'code-lang';
        langLabel.textContent = lang;

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<i class="fas fa-copy"></i><span>Copy</span>';
        button.title = 'Copy code';

        button.addEventListener('click', function () {
          const code = block.textContent;
          navigator.clipboard.writeText(code).then(() => {
            button.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            button.classList.add('copied');

            setTimeout(() => {
              button.innerHTML = '<i class="fas fa-copy"></i><span>Copy</span>';
              button.classList.remove('copied');
            }, 2000);
          });
        });

        header.appendChild(dots);
        header.appendChild(langLabel);
        header.appendChild(button);

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      }
    });
  }

  // ==========================================
  // Active Navigation Highlighting
  // ==========================================
  function initActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    window.addEventListener('scroll', function () {
      let current = '';
      const navbarHeight = 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ==========================================
  // Dynamic Statistics Counter
  // ==========================================
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-card h3');

    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + (target === 40 ? '+' : '');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + (target === 40 ? '+' : '');
        }
      }, 30);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const target = parseInt(entry.target.textContent);
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target, target);
        }
      });
    });

    statNumbers.forEach(num => observer.observe(num));
  }

  // ==========================================
  // External Link Handler
  // ==========================================
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');

    externalLinks.forEach(link => {
      if (link.closest('.social-links')) return;
      if (link.classList.contains('live-demo-btn') || link.classList.contains('no-external-icon')) return;

      if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('rel', 'noopener noreferrer');

        // Add external link indicator
        if (!link.querySelector('.fa-external-link-alt')) {
          const icon = document.createElement('i');
          icon.className = 'fas fa-external-link-alt';
          icon.style.fontSize = '0.75em';
          icon.style.marginLeft = '0.25em';
          link.appendChild(icon);
        }
      }
    });
  }

  // ==========================================
  // Keyboard Navigation
  // ==========================================
  function initKeyboardNavigation() {
    document.addEventListener('keydown', function (e) {
      // Ctrl/Cmd + K for quick search (if implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Could implement search functionality here
        console.log('Quick search triggered');
      }

      // Escape to close mobile menu
      if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.querySelector('i').classList.remove('fa-times');
          menuToggle.querySelector('i').classList.add('fa-bars');
        }
      }
    });
  }

  // ==========================================
  // Lazy Loading Images
  // ==========================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ==========================================
  // Theme Toggle (Optional - for future enhancement)
  // ==========================================
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function () {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ==========================================
  // Search Functionality (Basic)
  // ==========================================
  function initSearch() {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const sections = document.querySelectorAll('.section');

      sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });
    });
  }

  // ==========================================
  // Performance Monitoring
  // ==========================================
  function logPerformance() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', function () {
        setTimeout(() => {
          const timing = window.performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          console.log(`Page loaded in ${loadTime}ms`);
        }, 0);
      });
    }
  }

  // ==========================================
  // Add Copy Button Styles
  // ==========================================
  function addCopyButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
            .code-block-wrapper {
                background: #1a1a2e;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                margin: 1rem 0;
                overflow: hidden;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }
            
            .code-header {
                display: flex;
                align-items: center;
                padding: 0.7rem 1rem;
                background: linear-gradient(180deg, #2d2d3f 0%, #252538 100%);
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                gap: 1rem;
            }
            
            .macos-dots {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }
            
            .macos-dots .dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
            }
            
            .macos-dots .dot-red {
                background: #ff5f57;
                box-shadow: 0 0 4px rgba(255, 95, 87, 0.4);
            }
            
            .macos-dots .dot-yellow {
                background: #febc2e;
                box-shadow: 0 0 4px rgba(254, 188, 46, 0.4);
            }
            
            .macos-dots .dot-green {
                background: #28c840;
                box-shadow: 0 0 4px rgba(40, 200, 64, 0.4);
            }
            
            .code-lang {
                color: rgba(255, 255, 255, 0.4);
                font-size: 0.8rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                flex: 1;
                text-align: center;
            }
            
            .copy-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.5);
                padding: 0.35rem 0.85rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.25s ease;
                font-size: 0.8rem;
                font-family: inherit;
                flex-shrink: 0;
            }
            
            .copy-btn:hover {
                background: rgba(76, 175, 80, 0.15);
                border-color: rgba(76, 175, 80, 0.4);
                color: #4CAF50;
            }
            
            .copy-btn.copied {
                background: rgba(76, 175, 80, 0.2);
                border-color: rgba(76, 175, 80, 0.5);
                color: #4CAF50;
            }
            
            .copy-btn i {
                font-size: 0.75rem;
            }
            
            .code-block-wrapper pre {
                width: 100%;
                max-width: 100%;
                margin: 0;
                border: none;
                border-radius: 0;
                max-height: 400px;
                overflow-y: auto;
                overflow-x: auto;
                box-sizing: border-box;
                background: #1a1a2e;
                border-top: none;
            }
            
            .code-block-wrapper pre code {
                display: block;
                width: 100%;
                max-width: 100%;
                white-space: pre;
                overflow-x: auto;
            }
            
            .dir-item, .env-example li {
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            
            .nav-menu a:not(.live-demo-btn).active {
                color: #4CAF50;
            }
            
            @media (max-width: 768px) {                
                .copy-btn span {
                    display: none;
                }
            }
        `;
    document.head.appendChild(style);
  }

  // ==========================================
  // Parallax Effect for Hero Section
  // ==========================================
  function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (!hero) return;

    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      if (scrolled < heroHeight) {
        const opacity = 1 - (scrolled / heroHeight) * 0.6;
        if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (heroContent) heroContent.style.opacity = opacity;
        if (heroVisual) heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    });
  }

  // ==========================================
  // Toast Notifications (for future use)
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================
  // Initialize All Features
  // ==========================================
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeFeatures);
    } else {
      initializeFeatures();
    }
  }

  function initializeFeatures() {
    console.log('Initializing Budget Management API Overview Page...');

    // Add styles first
    addCopyButtonStyles();

    // Initialize all features
    initSmoothScrolling();
    initScrollToTop();
    initMobileMenu();
    initNavbarScroll();
    initScrollProgressBar();
    initCodeCopy();
    initActiveNavigation();
    initStatCounters();
    initExternalLinks();
    initKeyboardNavigation();
    initLazyLoading();
    initThemeToggle();
    initSearch();
    initParallax();
    logPerformance();

    console.log('✅ All features initialized successfully!');

    // Optional: Show welcome message
    // showToast('Welcome to Budget Management API Documentation!', 'success');
  }

  // Start initialization
  init();

  // ==========================================
  // Expose utility functions globally
  // ==========================================
  window.BudgetAPIUtils = {
    showToast,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  };
})();

// ==========================================
// Additional Mermaid Configuration
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  // Ensure Mermaid diagrams are rendered with proper styling
  const mermaidDiagrams = document.querySelectorAll('.mermaid');

  mermaidDiagrams.forEach(diagram => {
    diagram.style.minHeight = '300px';
    diagram.style.display = 'flex';
    diagram.style.justifyContent = 'center';
    diagram.style.alignItems = 'center';
  });

  // Add loading state
  if (typeof mermaid !== 'undefined') {
    mermaidDiagrams.forEach(diagram => {
      diagram.innerHTML = '<div style="color: #4CAF50;">Loading diagram...</div>';
    });
  }
});

// ==========================================
// Service Worker Registration (Optional)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
  });
}

// ==========================================
// Analytics (Optional - add your tracking code)
// ==========================================
function trackPageView() {
  // Add Google Analytics or other tracking here
  console.log('Page view tracked');
}

trackPageView();

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c🚀 Budget Management API', 'color: #4CAF50; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with ❤️ by Son Nguyen', 'color: #2196F3; font-size: 14px;');
console.log('%cGitHub: https://github.com/hoangsonww/Budget-Management-Backend-API', 'color: #FF9800; font-size: 12px;');
console.log('%c\nInterested in the code? Check out the repository!', 'color: #FFC107; font-size: 12px;');
