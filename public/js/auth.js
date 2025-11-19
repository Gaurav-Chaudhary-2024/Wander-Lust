// Auth Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Tab switching
  const tabs = document.querySelectorAll(".auth-tab");
  const tabContents = document.querySelectorAll(".auth-tab-content");
  const imageSection = document.getElementById("authImageSection");
  const imageTitle = document.getElementById("authImageTitle");
  const imageSubtitle = document.getElementById("authImageSubtitle");
  const stat1 = document.getElementById("authStat1");
  const stat2 = document.getElementById("authStat2");
  const stat3 = document.getElementById("authStat3");

  // Content for each tab
  const tabData = {
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to your account to continue your journey",
      background:
        "https://images.unsplash.com/photo-1733333521007-1e1d0e281465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      stats: [
        { number: "50K+", label: "Happy Travelers" },
        { number: "200+", label: "Destinations" },
        { number: "15+", label: "Years Experience" },
      ],
    },
    register: {
      title: "Start Your Journey",
      subtitle:
        "Discover amazing destinations and create unforgettable memories",
      background:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      stats: [
        { number: "24/7", label: "Support" },
        { number: "150+", label: "Countries" },
        { number: "4.9★", label: "Rating" },
      ],
    },
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.tab;

      // Update tab active states
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Update content active states
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === targetTab) {
          content.classList.add("active");
        }
      });

      // Update image section
      const data = tabData[targetTab];
      if (imageSection && data) {
        imageSection.style.backgroundImage = `url('${data.background}')`;
        if (imageTitle) imageTitle.textContent = data.title;
        if (imageSubtitle) imageSubtitle.textContent = data.subtitle;

        // Update stats
        if (stat1 && data.stats[0]) {
          stat1.querySelector(".auth-stat-number").textContent =
            data.stats[0].number;
          stat1.querySelector(".auth-stat-label").textContent =
            data.stats[0].label;
        }
        if (stat2 && data.stats[1]) {
          stat2.querySelector(".auth-stat-number").textContent =
            data.stats[1].number;
          stat2.querySelector(".auth-stat-label").textContent =
            data.stats[1].label;
        }
        if (stat3 && data.stats[2]) {
          stat3.querySelector(".auth-stat-number").textContent =
            data.stats[2].number;
          stat3.querySelector(".auth-stat-label").textContent =
            data.stats[2].label;
        }
      }
    });
  });

  // Password toggle functionality
  const passwordToggles = document.querySelectorAll(".password-toggle");

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      const passwordInput = document.getElementById(targetId);

      if (passwordInput) {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;

        // Update icon (optional - you can enhance this)
        const icon = toggle.querySelector(".eye-icon");
        if (icon) {
          if (type === "text") {
            icon.innerHTML = `
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
          } else {
            icon.innerHTML = `
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            `;
          }
        }
      }
    });
  });

  // Login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // Here you would typically send this to your backend/Supabase
      console.log("Login attempt:", { email, password });

      // For demo purposes, show success message
      alert(
        "Login functionality would be connected to Supabase here. For demo: Login successful!"
      );

      // Redirect to home page
      // window.location.href = 'index.html';
    });
  }

  // Register form submission
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Validate password match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Here you would typically send this to your backend/Supabase
      console.log("Register attempt:", { name, email, password });

      // For demo purposes, show success message
      alert(
        "Registration functionality would be connected to Supabase here. For demo: Account created successfully!"
      );

      // Switch to login tab or redirect
      // tabs[0].click();
    });
  }

  // Social auth buttons (Google & Facebook)
  document.querySelectorAll(".social-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.textContent.trim();
      console.log(`Social auth with ${provider}`);
      alert(
        `${provider} authentication would be integrated with Supabase here.`
      );
    });
  });
});

// === ADD THIS CODE AT THE END OF YOUR auth.js FILE ===

// UPDATE: Replace form submission with API calls
document.addEventListener("DOMContentLoaded", function () {
  // Your existing tab switching code stays...
  // Your existing password toggle code stays...

  // LOGIN FORM - REPLACE the existing loginForm submit handler with this:
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const result = await login({ email, password });

        if (result.success) {
          alert("Login successful!");
          const redirect =
            new URLSearchParams(window.location.search).get("redirect") || "/";
          window.location.href = redirect;
        }
      } catch (error) {
        alert(error.message || "Login failed. Please check your credentials.");
      }
    });
  }

  // REGISTER FORM - REPLACE the existing registerForm submit handler with this:
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const result = await register({ name, email, password });

        if (result.success) {
          alert("Registration successful!");
          window.location.href = "/";
        }
      } catch (error) {
        alert(error.message || "Registration failed. Please try again.");
      }
    });
  }
});
