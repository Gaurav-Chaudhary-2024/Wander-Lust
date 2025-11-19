// ====================================
// Image Optimization Helper
// ====================================

// Convert image URLs to WebP format with fallback
function getOptimizedImageUrl(originalUrl, width = null, quality = 80) {
  if (!originalUrl) return "";
  
  // If it's an Unsplash URL, optimize it
  if (originalUrl.includes("unsplash.com")) {
    const params = new URLSearchParams();
    if (width) params.append("w", width);
    params.append("q", quality);
    params.append("fm", "webp");
    
    // Check if WebP is supported
    if (supportsWebP()) {
      return `${originalUrl}&${params.toString()}`;
    } else {
      // Fallback to JPEG
      params.delete("fm");
      params.append("fm", "jpg");
      return `${originalUrl}&${params.toString()}`;
    }
  }
  
  // For local images, return as-is (server will handle optimization)
  return originalUrl;
}

// Check if browser supports WebP
function supportsWebP() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

// Lazy load with WebP support
function createOptimizedImage(src, alt, className = "") {
  const img = document.createElement("img");
  img.className = className;
  img.alt = alt || "";
  img.loading = "lazy";
  
  // Use WebP if supported
  if (supportsWebP()) {
    img.src = getOptimizedImageUrl(src);
  } else {
    img.src = src;
  }
  
  // Fallback for older browsers
  img.onerror = function() {
    this.src = src; // Fallback to original
  };
  
  return img;
}

// Preload critical images
function preloadImage(src) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = getOptimizedImageUrl(src);
  document.head.appendChild(link);
}

