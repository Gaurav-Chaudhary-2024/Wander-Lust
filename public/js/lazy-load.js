// ====================================
// WanderLust - Lazy Loading for Images
// ====================================

class LazyLoader {
  constructor() {
    this.images = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Get all images with data-src attribute
    this.images = document.querySelectorAll('img[data-src]');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      // Fallback: load all images immediately
      this.loadAllImages();
    }
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: '50px', // Start loading 50px before image enters viewport
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all images
    this.images.forEach(img => {
      this.observer.observe(img);
    });
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // Create a new image to preload
    const tempImage = new Image();
    
    // Show loading state
    img.classList.add('lazy-loading');
    
    // Optimize image URL (WebP with fallback)
    let optimizedSrc = src;
    if (src.includes('unsplash.com')) {
      // Add WebP format if supported
      if (this.supportsWebP()) {
        optimizedSrc = src.includes('?') ? `${src}&fm=webp&q=80` : `${src}?fm=webp&q=80`;
      } else {
        optimizedSrc = src.includes('?') ? `${src}&fm=jpg&q=80` : `${src}?fm=jpg&q=80`;
      }
    }
    
    tempImage.onload = () => {
      // Set the actual source
      img.src = optimizedSrc;
      img.removeAttribute('data-src');
      
      // Remove loading state and add loaded state
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      // Fade in animation
      setTimeout(() => {
        img.style.opacity = '1';
      }, 50);
    };

    tempImage.onerror = () => {
      // Fallback to original if WebP fails
      if (optimizedSrc !== src) {
        tempImage.src = src;
        return;
      }
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      console.error('Failed to load image:', src);
    };

    tempImage.src = optimizedSrc;
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }

  // Method to refresh lazy loading for dynamically added images
  refresh() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.init();
  }
}

// Preload critical carousel images (only on home page)
function preloadCarouselImages() {
  // Only preload on home page where carousel is actually used
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/index';
  
  if (!isHomePage) {
    return; // Don't preload on other pages
  }
  
  const carouselImages = [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&h=1080&fit=crop'
  ];

  carouselImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Preload carousel images for better performance
  preloadCarouselImages();
  
  // Initialize lazy loader
  window.lazyLoader = new LazyLoader();
});

// Refresh lazy loading when new content is added
window.refreshLazyLoad = () => {
  if (window.lazyLoader) {
    window.lazyLoader.refresh();
  }
};
