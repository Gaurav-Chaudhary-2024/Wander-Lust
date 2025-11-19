// ====================================
// WanderLust - Scroll Animations
// ====================================

class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Get all elements with scroll animation classes
    this.elements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in');
    
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      // Fallback: show all elements
      this.showAllElements();
    }

    // Initialize parallax effect
    this.initParallax();
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px', // Trigger 100px before entering viewport
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Optional: unobserve after animation
          // this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements
    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }

  showAllElements() {
    this.elements.forEach(element => {
      element.classList.add('animated');
    });
  }

  initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroBackground = document.querySelector('.hero-background');
    
    if (!hero || !heroContent) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.applyParallax(hero, heroContent, heroBackground);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  applyParallax(hero, heroContent, heroBackground) {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    // Only apply parallax within hero section
    if (scrolled < heroHeight) {
      const parallaxSpeed = 0.5;
      const contentSpeed = 0.3;
      
      // Move background slower than scroll
      if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
      
      // Move content with different speed
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * contentSpeed}px)`;
        
        // Fade out content as user scrolls
        const opacity = 1 - (scrolled / heroHeight) * 1.5;
        heroContent.style.opacity = Math.max(opacity, 0);
      }
    }
  }

  refresh() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.init();
  }
}

// Stagger animation for list items
function staggerAnimation(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * delay}ms`;
  });
}

// Add loading animation
class LoadingAnimation {
  constructor() {
    this.overlay = null;
    this.init();
  }

  init() {
    // Create loading overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'loadingOverlay';
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <svg class="spinner-logo" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>
    `;
    
    document.body.appendChild(this.overlay);

    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hide();
      }, 500);
    });

    // Fallback: hide after 3 seconds
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.add('fade-out');
      setTimeout(() => {
        this.overlay.remove();
      }, 500);
    }
  }

  show() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.classList.remove('fade-out');
    }
  }
}

// Page transition effect
class PageTransition {
  constructor() {
    this.init();
  }

  init() {
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    // Intercept link clicks for same-site navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.target && this.isSameSite(link.href)) {
        // Skip if it's a hash link
        if (link.getAttribute('href').startsWith('#')) return;
        
        e.preventDefault();
        this.transition(link.href);
      }
    });

    // Fade in on page load
    this.fadeIn();
  }

  isSameSite(url) {
    const currentDomain = window.location.hostname;
    try {
      const linkDomain = new URL(url, window.location.href).hostname;
      return linkDomain === currentDomain;
    } catch {
      return true; // Relative URLs
    }
  }

  transition(url) {
    const overlay = document.getElementById('pageTransitionOverlay');
    if (overlay) {
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    } else {
      window.location.href = url;
    }
  }

  fadeIn() {
    const overlay = document.getElementById('pageTransitionOverlay');
    if (overlay) {
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 100);
    }
  }
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  window.scrollAnimations = new ScrollAnimations();
  
  // Initialize loading animation
  window.loadingAnimation = new LoadingAnimation();
  
  // Initialize page transitions
  window.pageTransition = new PageTransition();
  
  // Stagger animate package features
  staggerAnimation('.package-feature', 80);
  
  // Stagger animate stat cards
  staggerAnimation('.stat-card', 100);
});

// Refresh scroll animations when new content is added
window.refreshScrollAnimations = () => {
  if (window.scrollAnimations) {
    window.scrollAnimations.refresh();
  }
};
