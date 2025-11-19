// ====================================
// WanderLust Travel Agency - Main JavaScript
// ====================================

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      
      if (mobileMenu.classList.contains('active')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
      } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  }
  
  // Close mobile menu when clicking on a link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    });
  });
});

// Handle hero search button click
function handleHeroSearch() {
  const destinationInput = document.querySelector('.hero-search input[type="text"]');
  const checkInInput = document.querySelector('.hero-search input[type="date"]');
  const guestsInput = document.querySelector('.hero-search input[placeholder*="guests"]');
  
  // Get values
  const destination = destinationInput?.value || '';
  const checkIn = checkInInput?.value || '';
  const guests = guestsInput?.value || '';
  
  // Store in sessionStorage for booking page
  if (destination) {
    sessionStorage.setItem('selectedDestination', destination);
  }
  if (checkIn) {
    sessionStorage.setItem('selectedCheckIn', checkIn);
  }
  if (guests) {
    sessionStorage.setItem('selectedGuests', guests);
  }
  
  // Redirect to booking page
  window.location.href = '/booking';
}

// Header Animation on Load
function animateHeader() {
  const header = document.getElementById('header');
  const logoImage = document.getElementById('logoImage');
  const logoText = document.getElementById('logoText');
  
  if (header) {
    // Animate header slide down
    setTimeout(() => {
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
      header.style.transition = 'all 0.6s ease-out';
    }, 100);
  }
  
  // Animate logo
  if (logoImage) {
    setTimeout(() => {
      logoImage.style.transform = 'scale(1) rotate(0deg)';
    }, 400);
  }
  
  if (logoText) {
    setTimeout(() => {
      logoText.style.opacity = '1';
      logoText.style.transform = 'translateX(0)';
      logoText.style.transition = 'all 0.6s ease-out 0.4s';
    }, 400);
  }
}

// Run animation on both DOMContentLoaded and load
document.addEventListener('DOMContentLoaded', animateHeader);
window.addEventListener('load', animateHeader);

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const destination = document.getElementById('destination').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!firstName || !lastName || !email) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Simulate form submission
    alert(`Thank you for contacting us, ${firstName}! We'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
  });
}

// Create and Animate Floating Particles in Hero
function createHeroParticles() {
  const particlesContainer = document.getElementById('heroParticles');
  if (!particlesContainer) return;
  
  const particlePositions = [
    { left: '20%', top: '30%', animation: 'particle1' },
    { left: '35%', top: '50%', animation: 'particle2' },
    { left: '50%', top: '30%', animation: 'particle3' },
    { left: '65%', top: '55%', animation: 'particle4' },
    { left: '80%', top: '35%', animation: 'particle5' },
    { left: '25%', top: '70%', animation: 'particle6' }
  ];
  
  particlePositions.forEach((pos, index) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = pos.left;
    particle.style.top = pos.top;
    particle.style.animation = `${pos.animation} ${4 + index}s ease-in-out infinite`;
    particle.style.animationDelay = `${index * 0.5}s`;
    particlesContainer.appendChild(particle);
  });
}

// Create Contact Section Particles
function createContactParticles() {
  const particlesContainer = document.getElementById('contactParticles');
  if (!particlesContainer) return;
  
  const particlePositions = [
    { left: '15%', top: '25%', animation: 'contactParticle1' },
    { left: '27%', top: '50%', animation: 'contactParticle2' },
    { left: '39%', top: '30%', animation: 'contactParticle3' },
    { left: '51%', top: '55%', animation: 'contactParticle4' },
    { left: '63%', top: '35%', animation: 'contactParticle5' },
    { left: '75%', top: '60%', animation: 'contactParticle6' },
    { left: '87%', top: '40%', animation: 'contactParticle7' },
    { left: '20%', top: '75%', animation: 'contactParticle8' }
  ];
  
  particlePositions.forEach((pos, index) => {
    const particle = document.createElement('div');
    particle.className = 'contact-particle';
    particle.style.left = pos.left;
    particle.style.top = pos.top;
    particle.style.animation = `${pos.animation} ${4 + index * 0.5}s ease-in-out infinite`;
    particle.style.animationDelay = `${index * 0.3}s`;
    particlesContainer.appendChild(particle);
  });
}

// Create Background Blobs for Packages Section
function createPackageBlobs() {
  const blobsContainer = document.getElementById('packagesBg');
  if (!blobsContainer) return;
  
  const blobPositions = [
    { left: '10%', top: '20%', animation: 'blob1', duration: '8s' },
    { left: '30%', top: '60%', animation: 'blob2', duration: '10s' },
    { left: '50%', top: '30%', animation: 'blob3', duration: '12s' },
    { left: '70%', top: '70%', animation: 'blob4', duration: '9s' },
    { left: '90%', top: '40%', animation: 'blob5', duration: '11s' }
  ];
  
  blobPositions.forEach((blob, index) => {
    const blobEl = document.createElement('div');
    blobEl.className = 'bg-blob';
    blobEl.style.left = blob.left;
    blobEl.style.top = blob.top;
    blobEl.style.animation = `${blob.animation} ${blob.duration} ease-in-out infinite`;
    blobEl.style.animationDelay = `${index * 1.5}s`;
    blobsContainer.appendChild(blobEl);
  });
}

// Initialize particles and blobs on page load
window.addEventListener('load', function() {
  createHeroParticles();
  createContactParticles();
  createPackageBlobs();
});

// Add active class to current nav item
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href)) {
      link.style.color = 'var(--primary)';
    }
  });
}

window.addEventListener('load', setActiveNavItem);
