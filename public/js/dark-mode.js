// ====================================
// WanderLust - Dark Mode Toggle
// ====================================

class DarkMode {
  constructor() {
    this.darkModeKey = 'wanderlust-dark-mode';
    this.isDark = false;
    this.init();
  }

  init() {
    // Check for saved preference or default to light mode
    const savedMode = localStorage.getItem(this.darkModeKey);
    
    if (savedMode === 'dark') {
      this.isDark = true;
      document.documentElement.classList.add('dark-mode');
    } else if (savedMode === null) {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.isDark = true;
        document.documentElement.classList.add('dark-mode');
      }
    }

    this.createToggleButton();
    this.setupListeners();
  }

  createToggleButton() {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'darkModeToggle';
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    toggleBtn.innerHTML = `
      <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;

    // Add to header actions or create a fixed button
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      headerActions.insertBefore(toggleBtn, headerActions.firstChild);
    } else {
      // If no header actions, create a fixed button
      toggleBtn.classList.add('dark-mode-toggle-fixed');
      document.body.appendChild(toggleBtn);
    }

    // Set initial icon state
    this.updateToggleIcon();
  }

  setupListeners() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(this.darkModeKey) === null) {
        this.isDark = e.matches;
        this.applyTheme();
      }
    });
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.savePreference();
    this.updateToggleIcon();
    
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }

  applyTheme() {
    if (this.isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  savePreference() {
    localStorage.setItem(this.darkModeKey, this.isDark ? 'dark' : 'light');
  }

  updateToggleIcon() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      const sunIcon = toggleBtn.querySelector('.sun-icon');
      const moonIcon = toggleBtn.querySelector('.moon-icon');
      
      if (this.isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }
}

// Initialize dark mode when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.darkMode = new DarkMode();
});
