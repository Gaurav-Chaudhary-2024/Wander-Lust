// ====================================
// Payment Page JavaScript
// ====================================

document.addEventListener("DOMContentLoaded", async function () {
  // Get booking ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");

  if (!bookingId) {
    alert("No booking ID provided. Redirecting to dashboard...");
    window.location.href = "/dashboard";
    return;
  }

  // Load booking details
  await loadBookingDetails(bookingId);

  // Show/hide card details based on payment method
  const paymentMethodSelect = document.getElementById("paymentMethod");
  const cardDetails = document.getElementById("cardDetails");

  paymentMethodSelect.addEventListener("change", function () {
    if (this.value === "credit_card" || this.value === "debit_card") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  });

  // Format card number
  const cardNumberInput = document.getElementById("cardNumber");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\s/g, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      e.target.value = formattedValue;
    });
  }

  // Format expiry date
  const cardExpiryInput = document.getElementById("cardExpiry");
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Handle form submission
  const paymentForm = document.getElementById("paymentForm");
  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    await submitPayment(bookingId);
  });
});

// Load booking details
async function loadBookingDetails(bookingId) {
  try {
    const result = await getBooking(bookingId);
    if (!result.success || !result.booking) {
      alert("Failed to load booking details");
      window.location.href = "/dashboard";
      return;
    }

    const booking = result.booking;
    const bookingDetails = document.getElementById("bookingDetails");
    
    // Calculate default amount (you can customize this)
    const defaultAmount = 500; // Default amount, you can calculate based on booking
    
    // Set default amount in form
    const amountInput = document.getElementById("amount");
    if (amountInput) {
      amountInput.value = defaultAmount;
    }

    bookingDetails.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="color: var(--muted-foreground);">Destination:</span>
        <strong>${booking.destination || "N/A"}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="color: var(--muted-foreground);">Check-in:</span>
        <strong>${new Date(booking.checkIn).toLocaleDateString()}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="color: var(--muted-foreground);">Check-out:</span>
        <strong>${new Date(booking.checkOut).toLocaleDateString()}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="color: var(--muted-foreground);">Travelers:</span>
        <strong>${booking.adults || 0} Adults${booking.children > 0 ? `, ${booking.children} Children` : ""}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
        <span style="color: var(--muted-foreground); font-size: 1.1rem;">Estimated Amount:</span>
        <strong style="font-size: 1.25rem; color: var(--primary);">$${defaultAmount.toFixed(2)}</strong>
      </div>
    `;
  } catch (error) {
    console.error("Failed to load booking:", error);
    alert("Failed to load booking details");
    window.location.href = "/dashboard";
  }
}

// Submit payment
async function submitPayment(bookingId) {
  try {
    const amount = parseFloat(document.getElementById("amount").value);
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Collect payment details
    const paymentDetails = {};

    // If credit/debit card, collect card info
    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
      const cardExpiry = document.getElementById("cardExpiry").value;
      const cardCVV = document.getElementById("cardCVV").value;
      const cardName = document.getElementById("cardName").value;

      if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
        alert("Please fill in all card details");
        return;
      }

      paymentDetails.cardLast4 = cardNumber.slice(-4);
      paymentDetails.cardBrand = cardNumber.startsWith("4") ? "Visa" : 
                                 cardNumber.startsWith("5") ? "Mastercard" : 
                                 cardNumber.startsWith("3") ? "Amex" : "Other";
    }

    // Collect billing address
    const billingStreet = document.getElementById("billingStreet").value;
    const billingCity = document.getElementById("billingCity").value;
    const billingState = document.getElementById("billingState").value;
    const billingZip = document.getElementById("billingZip").value;
    const billingCountry = document.getElementById("billingCountry").value || "USA";

    if (billingStreet || billingCity || billingState || billingZip) {
      paymentDetails.billingAddress = {
        street: billingStreet,
        city: billingCity,
        state: billingState,
        zipCode: billingZip,
        country: billingCountry,
      };
    }

    // Show loading
    const submitButton = document.querySelector("#paymentForm button[type='submit']");
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    // Submit payment
    const result = await createPayment({
      bookingId,
      amount,
      paymentMethod,
      paymentDetails,
    });

    if (result.success) {
      alert("Payment submitted successfully! It is now pending admin approval. You will be notified once it's approved.");
      window.location.href = "/dashboard";
    } else {
      alert(result.message || "Failed to submit payment. Please try again.");
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  } catch (error) {
    console.error("Payment submission error:", error);
    alert(error.message || "Failed to submit payment. Please try again.");
    const submitButton = document.querySelector("#paymentForm button[type='submit']");
    submitButton.disabled = false;
    submitButton.textContent = "Submit Payment";
  }
}

