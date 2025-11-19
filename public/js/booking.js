// Booking Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Form elements
  const destinationSelect = document.getElementById("destination");
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");
  const adultsInput = document.getElementById("adults");
  const childrenInput = document.getElementById("children");
  const infantsInput = document.getElementById("infants");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  // Pre-fill destination if coming from destinations page
  const selectedDestination = sessionStorage.getItem('selectedDestination');
  if (selectedDestination && destinationSelect) {
    // Try to find matching option
    const options = Array.from(destinationSelect.options);
    const matchingOption = options.find(opt => 
      opt.text.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      opt.value.toLowerCase().includes(selectedDestination.toLowerCase().replace(/\s+/g, '-'))
    );
    
    if (matchingOption) {
      destinationSelect.value = matchingOption.value;
    } else {
      // If no exact match, map destination names to values
      const destinationNameLower = selectedDestination.toLowerCase();
      if (destinationNameLower.includes('maldives')) {
        destinationSelect.value = 'maldives';
      } else if (destinationNameLower.includes('switzerland')) {
        destinationSelect.value = 'switzerland';
      } else if (destinationNameLower.includes('france') || destinationNameLower.includes('paris')) {
        destinationSelect.value = 'paris-france';
      } else if (destinationNameLower.includes('kenya')) {
        destinationSelect.value = 'kenya';
      } else if (destinationNameLower.includes('japan') || destinationNameLower.includes('tokyo')) {
        destinationSelect.value = 'tokyo-japan';
      } else if (destinationNameLower.includes('greece') || destinationNameLower.includes('santorini')) {
        destinationSelect.value = 'santorini-greece';
      } else if (destinationNameLower.includes('indonesia') || destinationNameLower.includes('bali')) {
        destinationSelect.value = 'bali-indonesia';
      } else if (destinationNameLower.includes('uae') || destinationNameLower.includes('dubai')) {
        destinationSelect.value = 'dubai-uae';
      } else if (destinationNameLower.includes('usa') || destinationNameLower.includes('new york')) {
        destinationSelect.value = 'new-york-usa';
      } else if (destinationNameLower.includes('iceland')) {
        destinationSelect.value = 'iceland';
      } else if (destinationNameLower.includes('thailand')) {
        destinationSelect.value = 'thailand';
      } else if (destinationNameLower.includes('peru')) {
        destinationSelect.value = 'peru';
      } else if (destinationNameLower.includes('norway')) {
        destinationSelect.value = 'norway';
      } else if (destinationNameLower.includes('australia') || destinationNameLower.includes('sydney')) {
        destinationSelect.value = 'australia';
      } else if (destinationNameLower.includes('italy') || destinationNameLower.includes('rome')) {
        destinationSelect.value = 'rome-italy';
      } else if (destinationNameLower.includes('spain') || destinationNameLower.includes('barcelona')) {
        destinationSelect.value = 'barcelona-spain';
      } else if (destinationNameLower.includes('morocco')) {
        destinationSelect.value = 'morocco';
      } else if (destinationNameLower.includes('new zealand')) {
        destinationSelect.value = 'new-zealand';
      } else if (destinationNameLower.includes('egypt')) {
        destinationSelect.value = 'egypt';
      } else if (destinationNameLower.includes('portugal')) {
        destinationSelect.value = 'portugal';
      } else if (destinationNameLower.includes('vietnam')) {
        destinationSelect.value = 'vietnam';
      } else if (destinationNameLower.includes('canada')) {
        destinationSelect.value = 'canada';
      } else if (destinationNameLower.includes('singapore')) {
        destinationSelect.value = 'singapore';
      } else if (destinationNameLower.includes('south africa') || destinationNameLower.includes('cape town')) {
        destinationSelect.value = 'south-africa';
      }
    }
    
    // Clear sessionStorage after using it
    sessionStorage.removeItem('selectedDestination');
    sessionStorage.removeItem('selectedCity');
    sessionStorage.removeItem('selectedPrice');
    
    // Trigger change event to update summary
    if (destinationSelect.value) {
      destinationSelect.dispatchEvent(new Event('change'));
    }
  }

  // Add to wishlist functionality
  const addToWishlistBtn = document.getElementById("addToWishlistBtn");
  if (addToWishlistBtn) {
    addToWishlistBtn.addEventListener("click", async function() {
      if (!destinationSelect?.value) {
        alert("Please select a destination first");
        return;
      }

      const destinationText = destinationSelect.options[destinationSelect.selectedIndex].text;
      
      try {
        const result = await addToWishlist({
          destination: destinationText,
          priority: "medium"
        });

        if (result.success) {
          alert(`${destinationText} added to your wishlist!`);
          addToWishlistBtn.textContent = "✓ Added to Wishlist";
          addToWishlistBtn.disabled = true;
        }
      } catch (error) {
        if (error.message.includes("already in your wishlist")) {
          alert("This destination is already in your wishlist!");
        } else {
          alert("Please login to add to wishlist");
        }
      }
    });
  }

  // Summary elements
  const summaryDestination = document.querySelector(".summary-item-value");
  const summaryDates = document.querySelectorAll(".summary-item-value")[1];
  const summaryAdults = document.querySelector(
    ".traveler-row:nth-child(1) strong"
  );
  const summaryChildren = document.querySelector(
    ".traveler-row:nth-child(2) strong"
  );
  const summaryInfants = document.querySelector(
    ".traveler-row:nth-child(3) strong"
  );
  const summaryTotal = document.querySelector(".traveler-total strong");
  const contactName = document.querySelector(".contact-detail-value");
  const contactEmail = document.querySelectorAll(".contact-detail-value")[1];
  const contactPhone = document.querySelectorAll(".contact-detail-value")[2];

  // Update summary in real-time
  function updateSummary() {
    // Update destination
    if (destinationSelect && summaryDestination) {
      const selectedOption =
        destinationSelect.options[destinationSelect.selectedIndex];
      summaryDestination.textContent = selectedOption.text || "Not selected";
    }

    // Update dates
    if (checkInInput && checkOutInput && summaryDates) {
      const checkIn = new Date(checkInInput.value);
      const checkOut = new Date(checkOutInput.value);

      if (checkInInput.value && checkOutInput.value) {
        const options = { month: "short", day: "numeric", year: "numeric" };
        const checkInFormatted = checkIn.toLocaleDateString("en-US", options);
        const checkOutFormatted = checkOut.toLocaleDateString("en-US", options);
        summaryDates.textContent = `${checkInFormatted} - ${checkOutFormatted}`;
      }
    }

    // Update travelers
    const adults = parseInt(adultsInput?.value || 0);
    const children = parseInt(childrenInput?.value || 0);
    const infants = parseInt(infantsInput?.value || 0);
    const total = adults + children + infants;

    if (summaryAdults) summaryAdults.textContent = adults;
    if (summaryChildren) summaryChildren.textContent = children;
    if (summaryInfants) summaryInfants.textContent = infants;
    if (summaryTotal) summaryTotal.textContent = total;

    // Update contact details
    if (contactName)
      contactName.textContent = fullNameInput?.value || "Not provided";
    if (contactEmail)
      contactEmail.textContent = emailInput?.value || "Not provided";
    if (contactPhone)
      contactPhone.textContent = phoneInput?.value || "Not provided";
  }

  // Add event listeners for real-time updates
  if (destinationSelect)
    destinationSelect.addEventListener("change", updateSummary);
  if (checkInInput) checkInInput.addEventListener("change", updateSummary);
  if (checkOutInput) checkOutInput.addEventListener("change", updateSummary);
  if (adultsInput) adultsInput.addEventListener("input", updateSummary);
  if (childrenInput) childrenInput.addEventListener("input", updateSummary);
  if (infantsInput) infantsInput.addEventListener("input", updateSummary);
  if (fullNameInput) fullNameInput.addEventListener("input", updateSummary);
  if (emailInput) emailInput.addEventListener("input", validateEmail);
  if (phoneInput) phoneInput.addEventListener("input", updateSummary);

  // Email validation
  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorHint = document.querySelector(".form-hint.error");

    if (emailInput && errorHint) {
      if (emailInput.value && !emailRegex.test(emailInput.value)) {
        errorHint.style.display = "block";
        emailInput.style.borderColor = "var(--accent)";
      } else {
        errorHint.style.display = "none";
        emailInput.style.borderColor = "var(--border)";
      }
    }

    updateSummary();
  }

  // Date validation - check-out should be after check-in
  if (checkOutInput) {
    checkOutInput.addEventListener("change", function () {
      if (checkInInput.value && checkOutInput.value) {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);

        if (checkOut <= checkIn) {
          alert("Check-out date must be after check-in date");
          checkOutInput.value = "";
        }
      }
    });
  }

  // Set minimum date for check-in (today)
  if (checkInInput) {
    const today = new Date().toISOString().split("T")[0];
    checkInInput.setAttribute("min", today);
  }

  // Set minimum date for check-out (check-in date + 1 day)
  if (checkInInput) {
    checkInInput.addEventListener("change", function () {
      if (checkOutInput && checkInInput.value) {
        const checkInDate = new Date(checkInInput.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        const minCheckOut = checkInDate.toISOString().split("T")[0];
        checkOutInput.setAttribute("min", minCheckOut);
      }
    });
  }

  // Book Now button
  const bookButton = document.querySelector(".booking-card .btn-primary");
  if (bookButton) {
    bookButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Validate form
      if (!destinationSelect?.value) {
        alert("Please select a destination");
        destinationSelect?.focus();
        return;
      }

      if (!checkInInput?.value) {
        alert("Please select a check-in date");
        checkInInput?.focus();
        return;
      }

      if (!checkOutInput?.value) {
        alert("Please select a check-out date");
        checkOutInput?.focus();
        return;
      }

      const total =
        parseInt(adultsInput?.value || 0) +
        parseInt(childrenInput?.value || 0) +
        parseInt(infantsInput?.value || 0);

      if (total === 0) {
        alert("Please add at least one traveler");
        adultsInput?.focus();
        return;
      }

      if (!fullNameInput?.value) {
        alert("Please enter your full name");
        fullNameInput?.focus();
        return;
      }

      if (!emailInput?.value) {
        alert("Please enter your email address");
        emailInput?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        alert("Please enter a valid email address");
        emailInput?.focus();
        return;
      }

      if (!phoneInput?.value) {
        alert("Please enter your phone number");
        phoneInput?.focus();
        return;
      }

      // Create booking data object
      const bookingData = {
        destination:
          destinationSelect.options[destinationSelect.selectedIndex].text,
        checkIn: checkInInput.value,
        checkOut: checkOutInput.value,
        travelers: {
          adults: parseInt(adultsInput.value),
          children: parseInt(childrenInput.value),
          infants: parseInt(infantsInput.value),
          total: total,
        },
        contact: {
          name: fullNameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
        },
      };

      // Here you would send this to Supabase
      console.log("Booking data:", bookingData);

      // Show success message
      alert(
        "Thank you for your booking! This would be stored in Supabase in a production environment. We will contact you shortly to confirm your reservation."
      );

      // Optionally redirect to a confirmation page
      // window.location.href = 'booking-confirmation.html';
    });
  }

  // Initialize summary on page load
  updateSummary();

  // Hide email error hint initially
  const errorHint = document.querySelector(".form-hint.error");
  if (errorHint) {
    errorHint.style.display = "none";
  }
});

// === REPLACE YOUR EXISTING BOOKING BUTTON CODE WITH THIS ===

const bookButton = document.querySelector(".booking-card .btn-primary");
if (bookButton) {
  bookButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const destinationSelect = document.getElementById("destination");
    const checkInInput = document.getElementById("checkIn");
    const checkOutInput = document.getElementById("checkOut");
    const adultsInput = document.getElementById("adults");
    const childrenInput = document.getElementById("children");
    const infantsInput = document.getElementById("infants");
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    // Validation
    if (
      !destinationSelect?.value ||
      !checkInInput?.value ||
      !checkOutInput?.value
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const total =
      parseInt(adultsInput?.value || 0) +
      parseInt(childrenInput?.value || 0) +
      parseInt(infantsInput?.value || 0);
    if (total === 0) {
      alert("Please add at least one traveler");
      return;
    }

    // Validate and split full name into firstName and lastName
    const fullName = fullNameInput?.value?.trim() || "";
    if (!fullName) {
      alert("Please enter your full name");
      fullNameInput?.focus();
      return;
    }

    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!firstName) {
      alert("Please enter your full name");
      fullNameInput?.focus();
      return;
    }

    // Validate adults count
    const adults = parseInt(adultsInput?.value || 0);
    if (adults < 1) {
      alert("Please add at least one adult traveler");
      adultsInput?.focus();
      return;
    }

    // Validate email
    if (!emailInput?.value?.trim()) {
      alert("Please enter your email address");
      emailInput?.focus();
      return;
    }

    // Validate phone
    if (!phoneInput?.value?.trim()) {
      alert("Please enter your phone number");
      phoneInput?.focus();
      return;
    }

    // Get destination display text (capitalized) instead of value
    const destinationText = destinationSelect.options[destinationSelect.selectedIndex].text;
    
    // Format booking data to match server expectations (flat structure)
    const bookingData = {
      destination: destinationText, // Store the display text (e.g., "Switzerland") instead of value
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      adults: adults,
      children: parseInt(childrenInput?.value || 0),
      infants: parseInt(infantsInput?.value || 0),
      firstName: firstName,
      lastName: lastName || firstName, // Use firstName as fallback if no lastName
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
    };

    try {
      const result = await createBooking(bookingData);

      if (result.success) {
        alert("Booking created successfully! We will contact you shortly.");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.message.includes("Authentication required")) {
        alert("Please login to make a booking");
        window.location.href = "/auth?redirect=/booking";
      } else {
        alert(error.message || "Booking failed. Please try again.");
      }
    }
  });
}
