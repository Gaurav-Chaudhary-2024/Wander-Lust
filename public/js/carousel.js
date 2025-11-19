// ====================================
// Hero Image Carousel
// ====================================

// Background images data
const heroBackgroundImages = [
  {
    src: "https://images.unsplash.com/photo-1657989597462-f00f631042d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG92ZXJ3YXRlciUyMGJ1bmdhbG93cyUyMGNyeXN0YWwlMjBjbGVhciUyMHdhdGVyfGVufDF8fHx8MTc1Nzg4NDIxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Maldives overwater bungalows",
    location: "Maldives"
  },
  {
    src: "https://images.unsplash.com/photo-1505550514181-6c2e3d1f0e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2l0emVybGFuZCUyMG1vdW50YWlucyUyMHNub3clMjBwZWFrcyUyMGRyYW1hdGljJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1Nzg4NDIyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Switzerland mountain peaks",
    location: "Switzerland"
  },
  {
    src: "https://images.unsplash.com/photo-1727211391235-ed3ebbb5c769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBzdW5zZXQlMjB3aGl0ZSUyMGJ1aWxkaW5ncyUyMGJsdWUlMjBkb21lc3xlbnwxfHx8fDE3NTc4ODQyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Santorini sunset",
    location: "Greece"
  },
  {
    src: "https://images.unsplash.com/photo-1682768029347-0425b90fa196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMG1vdW50JTIwZnVqaSUyMGNoZXJyeSUyMGJsb3Nzb21zJTIwc3ByaW5nfGVufDF8fHx8MTc1Nzg4NDIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Japan Mount Fuji with cherry blossoms",
    location: "Japan"
  },
  {
    src: "https://images.unsplash.com/photo-1591192626617-f9c691fa8df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwcmljZSUyMHRlcnJhY2VzJTIwZ3JlZW4lMjBsYW5kc2NhcGUlMjBzdW5yaXNlfGVufDF8fHx8MTc1Nzg4NDIzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Bali rice terraces",
    location: "Indonesia"
  },
  {
    src: "https://images.unsplash.com/photo-1723390351482-21253e158c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J3YXklMjBmam9yZHMlMjBkcmFtYXRpYyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTc4ODY1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Norway fjords",
    location: "Norway"
  },
  {
    src: "https://images.unsplash.com/photo-1671274503532-563633e07688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VsYW5kJTIwbm9ydGhlcm4lMjBsaWdodHMlMjBhdXJvcmF8ZW58MXx8fHwxNzU3ODg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Iceland northern lights",
    location: "Iceland"
  },
  {
    src: "https://images.unsplash.com/photo-1738189301620-5c238ffbe9ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JvY2NhbiUyMGRlc2VydCUyMHNhaGFyYSUyMHN1bnNldHxlbnwxfHx8fDE3NTc4ODY1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Morocco desert",
    location: "Morocco"
  },
  {
    src: "https://images.unsplash.com/photo-1698362696286-c1557f477e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB6ZWFsYW5kJTIwbW91bnRhaW4lMjBsYWtlJTIwcmVmbGVjdGlvbnxlbnwxfHx8fDE3NTc4ODY1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "New Zealand mountains",
    location: "New Zealand"
  },
  {
    src: "https://images.unsplash.com/photo-1589228769717-605083eb3c9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJ1JTIwbWFjaHUlMjBwaWNjaHUlMjBhbmNpZW50JTIwcnVpbnN8ZW58MXx8fHwxNzU3ODg2NTc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Peru Machu Picchu",
    location: "Peru"
  }
];

let currentImageIndex = 0;
let carouselInterval;

// Initialize Hero Carousel
function initializeHeroCarousel() {
  const imagesContainer = document.getElementById('heroImages');
  const indicatorsContainer = document.getElementById('heroIndicators');
  const locationText = document.getElementById('locationText');
  const locationBadge = document.getElementById('locationBadge');
  
  if (!imagesContainer || !indicatorsContainer) return;
  
  // Create image elements
  heroBackgroundImages.forEach((image, index) => {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.className = 'hero-image';
    if (index === 0) {
      img.classList.add('active');
    }
    imagesContainer.appendChild(img);
  });
  
  // Create indicators
  heroBackgroundImages.forEach((image, index) => {
    const indicator = document.createElement('button');
    indicator.className = 'indicator';
    indicator.setAttribute('aria-label', `Go to ${image.location}`);
    if (index === 0) {
      indicator.classList.add('active');
    }
    indicator.addEventListener('click', () => goToImage(index));
    indicatorsContainer.appendChild(indicator);
  });
  
  // Update location badge initially
  if (locationText) {
    locationText.textContent = heroBackgroundImages[0].location;
  }
  if (locationBadge) {
    locationBadge.classList.add('active');
  }
  
  // Start auto-rotation
  startCarousel();
}

// Go to specific image
function goToImage(index) {
  const images = document.querySelectorAll('.hero-image');
  const indicators = document.querySelectorAll('.indicator');
  const locationText = document.getElementById('locationText');
  const locationBadge = document.getElementById('locationBadge');
  
  // Remove active class from all
  images.forEach(img => img.classList.remove('active'));
  indicators.forEach(ind => ind.classList.remove('active'));
  
  // Remove location badge active class for transition
  if (locationBadge) {
    locationBadge.classList.remove('active');
  }
  
  // Update current index
  currentImageIndex = index;
  
  // Add active class to current
  images[currentImageIndex].classList.add('active');
  indicators[currentImageIndex].classList.add('active');
  
  // Update location text with fade animation
  setTimeout(() => {
    if (locationText) {
      locationText.textContent = heroBackgroundImages[currentImageIndex].location;
    }
    if (locationBadge) {
      locationBadge.classList.add('active');
    }
  }, 100);
  
  // Reset carousel timer
  resetCarousel();
}

// Next image
function nextImage() {
  const nextIndex = (currentImageIndex + 1) % heroBackgroundImages.length;
  goToImage(nextIndex);
}

// Start carousel auto-rotation
function startCarousel() {
  carouselInterval = setInterval(nextImage, 5000); // Change every 5 seconds
}

// Reset carousel timer
function resetCarousel() {
  clearInterval(carouselInterval);
  startCarousel();
}

// Initialize on page load
window.addEventListener('load', function() {
  initializeHeroCarousel();
});

// Pause carousel on hover (optional)
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
  });
  
  heroSection.addEventListener('mouseleave', () => {
    startCarousel();
  });
}
