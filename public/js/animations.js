// ====================================
// Scroll-triggered Animations using Intersection Observer
// ====================================

// Create Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: '-100px',
  threshold: 0.1
};

// Callback function for intersection
function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Trigger specific animations based on element class
      if (entry.target.classList.contains('stat-card')) {
        animateStatCard(entry.target);
      } else if (entry.target.classList.contains('section-header')) {
        animateSectionHeader(entry.target);
      } else if (entry.target.classList.contains('feature-card')) {
        animateFeatureCard(entry.target);
      } else if (entry.target.classList.contains('package-card')) {
        animatePackageCard(entry.target);
      } else if (entry.target.classList.contains('contact-form-wrapper')) {
        animateContactForm(entry.target);
      } else if (entry.target.classList.contains('contact-info')) {
        animateContactInfo(entry.target);
      } else if (entry.target.classList.contains('footer')) {
        animateFooter(entry.target);
      } else if (entry.target.classList.contains('cta-section')) {
        animateCTA(entry.target);
      } else if (entry.target.classList.contains('hero-content')) {
        animateHeroContent(entry.target);
      } else if (entry.target.classList.contains('hero-search')) {
        animateHeroSearch(entry.target);
      } else if (entry.target.classList.contains('contact-content')) {
        animateContactContent(entry.target);
      }
      
      // Unobserve after animation (optional - for one-time animations)
      // observer.unobserve(entry.target);
    }
  });
}

// Create observer instance
const observer = new IntersectionObserver(handleIntersect, observerOptions);

// Animate stat cards
function animateStatCard(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0) scale(1)';
  element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

// Animate section header
function animateSectionHeader(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
  element.style.transition = 'all 0.6s ease-out';
}

// Animate feature cards
function animateFeatureCard(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0) scale(1)';
  element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

// Animate package cards
function animatePackageCard(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0) rotateY(0) scale(1)';
  element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  
  // Animate stars in sequence
  const stars = element.querySelectorAll('.star');
  stars.forEach((star, index) => {
    setTimeout(() => {
      star.style.opacity = star.style.opacity === '0.3' ? '0.3' : '1';
      star.style.transform = 'scale(1.2)';
      setTimeout(() => {
        star.style.transform = 'scale(1)';
      }, 200);
    }, index * 100);
  });
}

// Animate contact form
function animateContactForm(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateX(0)';
  element.style.transition = 'all 0.6s ease-out';
}

// Animate contact info
function animateContactInfo(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateX(0)';
  element.style.transition = 'all 0.6s ease-out 0.2s';
}

// Animate footer
function animateFooter(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
  element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

// Animate CTA section
function animateCTA(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
  element.style.transition = 'all 0.6s ease-out';
}

// Animate hero content
function animateHeroContent(element) {
  element.style.opacity = '1';
  element.style.transition = 'opacity 0.8s ease-out 0.2s';
  
  const title = element.querySelector('.hero-title');
  const subtitle = element.querySelector('.hero-subtitle');
  
  if (title) {
    title.style.opacity = '1';
    title.style.transform = 'translateY(0)';
    title.style.transition = 'all 0.8s ease-out 0.2s';
  }
  
  if (subtitle) {
    subtitle.style.opacity = '1';
    subtitle.style.transform = 'translateY(0)';
    subtitle.style.transition = 'all 0.8s ease-out 0.4s';
  }
}

// Animate hero search
function animateHeroSearch(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0) scale(1)';
  element.style.transition = 'all 0.8s ease-out 0.6s';
}

// Animate contact content
function animateContactContent(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
  element.style.transition = 'all 0.6s ease-out';
}

// Initialize observers on page load
window.addEventListener('load', function() {
  // Observe stat cards
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Observe section headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    observer.observe(header);
  });
  
  // Observe feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.transitionDelay = `${0.6 + index * 0.2}s`;
    observer.observe(card);
  });
  
  // Observe package cards
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.2}s`;
    observer.observe(card);
  });
  
  // Observe contact elements
  const contactForm = document.querySelector('.contact-form-wrapper');
  const contactInfo = document.querySelector('.contact-info');
  const contactContent = document.querySelector('.contact-content');
  
  if (contactForm) observer.observe(contactForm);
  if (contactInfo) observer.observe(contactInfo);
  if (contactContent) observer.observe(contactContent);
  
  // Observe footer
  const footer = document.querySelector('.footer');
  if (footer) observer.observe(footer);
  
  // Observe CTA section
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection) observer.observe(ctaSection);
  
  // Observe hero content
  const heroContent = document.querySelector('.hero-content');
  const heroSearch = document.querySelector('.hero-search');
  if (heroContent) observer.observe(heroContent);
  if (heroSearch) observer.observe(heroSearch);
});

// Add parallax effect on scroll (optional enhancement)
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-background');
  
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add number counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Initialize counter animations when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const numberElement = entry.target.querySelector('.stat-number');
      if (numberElement) {
        const text = numberElement.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        
        if (!isNaN(number)) {
          numberElement.textContent = '0';
          animateCounter(numberElement, number, 2000);
          // Add back the suffix if it exists
          if (text.includes('+')) {
            setTimeout(() => {
              numberElement.textContent += '+';
            }, 2000);
          }
          if (text.includes('K')) {
            setTimeout(() => {
              const current = numberElement.textContent;
              numberElement.textContent = current + 'K+';
            }, 2000);
          }
          if (text.includes('/')) {
            numberElement.textContent = text;
          }
        }
        
        entry.target.dataset.animated = 'true';
      }
    }
  });
}, { threshold: 0.5 });

// Observe stat cards for counter animation
window.addEventListener('load', function() {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => statsObserver.observe(card));
});
