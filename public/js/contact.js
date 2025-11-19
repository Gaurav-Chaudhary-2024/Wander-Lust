/* ====================================
   Contact Page JavaScript
   ==================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Form Submission Handler
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Basic validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
      }

      // Simulate form submission
      console.log("Form submitted:", { name, email, subject, message });

      // Show success message
      alert(
        "Thank you for contacting us! We will get back to you within 24 hours."
      );

      // Reset form
      contactForm.reset();
    });
  }

  // Start Live Chat Button Handler
  const chatButtons = document.querySelectorAll(
    ".btn-hotline, .footer-chat button"
  );
  chatButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      alert(
        "Live chat feature coming soon! Please call us at +1 (800) 555-0199 or send us a message using the contact form."
      );
    });
  });

  // Phone Number Click Handler
  const hotlineNumber = document.querySelector(".hotline-number");
  if (hotlineNumber) {
    hotlineNumber.addEventListener("click", function (e) {
      // Allow default tel: link behavior
      console.log("Calling hotline number");
    });
  }

  // Smooth scroll animation for "Contact Now" button
  const contactNowBtn = document.querySelector(".contact-hero-content .btn");
  if (contactNowBtn) {
    contactNowBtn.addEventListener("click", function () {
      const form = document.getElementById("contactForm");
      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        // Focus on first input after scroll
        setTimeout(() => {
          document.getElementById("name").focus();
        }, 500);
      }
    });
  }

  // Add scroll animations for contact details
  const contactDetails = document.querySelectorAll(".contact-detail-item");
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  contactDetails.forEach((item) => {
    observer.observe(item);
  });
});

// === REPLACE YOUR EXISTING CONTACT FORM CODE WITH THIS ===

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Basic validation
    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const result = await submitContactForm({ name, email, subject, message });

      if (result.success) {
        alert(result.message);
        contactForm.reset();
      }
    } catch (error) {
      alert(error.message || "Failed to send message. Please try again.");
    }
  });
}
