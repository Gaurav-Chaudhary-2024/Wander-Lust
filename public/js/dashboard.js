// ====================================
// Dashboard Page JavaScript
// ====================================

document.addEventListener("DOMContentLoaded", async function () {
  // Prevent infinite reload loops - check if we've already attempted a reload
  if (sessionStorage.getItem('dashboardReloadAttempted') === 'true') {
    sessionStorage.removeItem('dashboardReloadAttempted');
    return; // Don't reload again
  }
  
  // Refresh session to ensure role is up to date
  try {
    const response = await fetch('/api/auth/refresh', { method: 'GET' });
    const data = await response.json();
    if (data.success && data.user.role === 'admin') {
      // Reload page if user is admin to show admin features
      if (!window.location.href.includes('/admin')) {
        // Check if admin banner is visible - use correct selector matching the actual banner
        const adminBanner = document.querySelector('[style*="background: linear-gradient(135deg, #1B263B"]') || 
                           document.querySelector('a[href="/admin"]');
        if (!adminBanner) {
          console.log('Admin role detected, refreshing page...');
          sessionStorage.setItem('dashboardReloadAttempted', 'true');
          window.location.reload();
          return; // Exit early to prevent further execution
        }
      }
    }
  } catch (error) {
    console.error('Failed to refresh session:', error);
  }
  
  // Load notifications
  async function loadNotifications() {
    try {
      const result = await getNotifications(false); // Get recent notifications
      if (result.success) {
        renderNotifications(result.notifications.slice(0, 5)); // Show latest 5
        updateNotificationBadge(result.unreadCount);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }

  // Render notifications
  function renderNotifications(notifications) {
    const container = document.getElementById("notificationsList");
    if (!container) return;

    if (notifications.length === 0) {
      container.innerHTML = '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No notifications</p>';
      return;
    }

    container.innerHTML = notifications.map(notif => `
      <div class="notification-item" style="
        padding: 1rem;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: ${notif.isRead ? 'var(--card)' : 'var(--primary)/5'};
        cursor: pointer;
      " onclick="handleNotificationClick('${notif._id}', '${notif.link || ''}')">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 0.25rem 0; color: var(--foreground);">${notif.title}</h4>
            <p style="margin: 0; color: var(--muted-foreground); font-size: 0.9rem;">${notif.message}</p>
            <p style="margin: 0.5rem 0 0 0; color: var(--muted-foreground); font-size: 0.8rem;">
              ${new Date(notif.createdAt).toLocaleDateString()}
            </p>
          </div>
          ${!notif.isRead ? '<span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; display: inline-block; margin-left: 0.5rem;"></span>' : ''}
        </div>
      </div>
    `).join('');
  }

  // Update notification badge
  function updateNotificationBadge(count) {
    const badge = document.getElementById("notificationBadge");
    if (badge) {
      badge.textContent = count > 0 ? count : "";
      badge.style.display = count > 0 ? "block" : "none";
    }
  }

  // Load payments
  async function loadPayments() {
    try {
      const result = await getPayments();
      if (result.success) {
        renderPayments(result.payments || []);
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
      const container = document.getElementById("paymentsContainer");
      if (container) {
        container.innerHTML = '<p style="color: var(--muted-foreground);">Failed to load payments</p>';
      }
    }
  }

  // Render payments
  function renderPayments(payments) {
    const container = document.getElementById("paymentsContainer");
    if (!container) return;

    if (payments.length === 0) {
      container.innerHTML = '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No payment history</p>';
      return;
    }

    container.innerHTML = payments.slice(0, 5).map(payment => `
      <div style="
        padding: 1rem;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--card);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0; font-weight: 500;">${payment.booking?.destination || 'Unknown'}</p>
            <p style="margin: 0.25rem 0 0 0; color: var(--muted-foreground); font-size: 0.9rem;">
              ${payment.transactionId} • ${new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--primary);">
              $${payment.amount?.toLocaleString() || '0'}
            </p>
            <p style="margin: 0.25rem 0 0 0; color: var(--muted-foreground); font-size: 0.85rem; text-transform: capitalize;">
              ${payment.paymentStatus || 'completed'}
            </p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load user's bookings
  async function loadBookings() {
    try {
      const result = await getMyBookings();

      if (result.success) {
        renderBookings(result.bookings || []);
      } else {
        // Handle case where API returns success: false
        const container = document.getElementById("bookingsContainer");
        if (container) {
          container.innerHTML =
            `<p style="color: var(--muted-foreground);">${result.message || "Failed to load bookings. Please try again."}</p>`;
        }
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      const container = document.getElementById("bookingsContainer");
      if (container) {
        const errorMessage = error.message || "Failed to load bookings. Please try again.";
        container.innerHTML =
          `<p style="color: var(--muted-foreground);">${errorMessage}</p>`;
      }
    }
  }

  // Helper function to capitalize destination name
  function capitalizeDestination(dest) {
    if (!dest) return "Unknown Destination";
    // If already capitalized (has uppercase), return as is
    if (dest[0] === dest[0].toUpperCase()) return dest;
    // Capitalize first letter
    return dest.charAt(0).toUpperCase() + dest.slice(1);
  }

  // Render bookings
  function renderBookings(bookings) {
    // Try to find bookingsList first (inside bookingsContainer), fallback to bookingsContainer
    let container = document.getElementById("bookingsList");
    if (!container) {
      container = document.getElementById("bookingsContainer");
    }

    if (!container) {
      console.error("Bookings container not found!");
      return;
    }

    if (bookings.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; padding: 2rem; color: var(--muted-foreground);">No bookings yet. <a href="/booking" style="color: var(--primary);">Book your first trip!</a></p>';
      return;
    }

    container.innerHTML = bookings
      .map(
        (booking) => {
          // Format dates
          const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          
          // Capitalize destination
          const destination = capitalizeDestination(booking.destination);
          
          // Calculate total travelers
          const totalTravelers = (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0);
          
          // Status color
          const statusColor = 
            booking.status === "approved" ? "#10b981" :
            booking.status === "confirmed" ? "green" :
            booking.status === "cancelled" ? "red" : "orange";
          
          const bookingId = booking._id || booking.id;
          const isApproved = booking.status === "approved";
          
          // Check if payment exists for this booking (will be loaded separately)
          const paymentButton = isApproved ? `
            <button onclick="window.location.href='/payment?bookingId=${bookingId}'" class="btn btn-primary" style="flex: 1; background: #10b981; border-color: #10b981;">
              💳 Make Payment
            </button>
          ` : "";
          
          return `
      <div class="booking-card" data-booking-id="${bookingId}" style="
        border: 1px solid var(--border); 
        padding: 1.5rem; 
        margin-bottom: 1.5rem; 
        border-radius: var(--radius-lg);
        background: var(--card);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease;
      " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
        <h3 style="color: var(--primary); margin-bottom: 1rem;">${destination}</h3>
        <p style="margin: 0.5rem 0;"><strong>Check-in:</strong> ${checkInDate}</p>
        <p style="margin: 0.5rem 0;"><strong>Check-out:</strong> ${checkOutDate}</p>
        <p style="margin: 0.5rem 0;"><strong>Travelers:</strong> ${booking.adults || 0} Adults${booking.children > 0 ? `, ${booking.children} Children` : ""}${booking.infants > 0 ? `, ${booking.infants} Infants` : ""}</p>
        <p style="margin: 0.5rem 0;"><strong>Contact:</strong> ${booking.firstName} ${booking.lastName} (${booking.email})</p>
        <p style="margin: 0.5rem 0;"><strong>Status:</strong> <span style="
          color: ${statusColor};
          font-weight: bold;
          text-transform: uppercase;
        ">${booking.status || "pending"}</span></p>
        <div id="paymentStatus-${bookingId}" style="margin: 0.5rem 0; font-size: 0.9rem;">
          <!-- Payment status will be loaded here -->
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${paymentButton}
        ${
          booking.status === "pending" || booking.status === "confirmed"
            ? `
          <button onclick="handleEditBooking('${bookingId}')" class="btn btn-outline" style="flex: 1;">
            Edit Booking
          </button>
          <button onclick="handleCancelBooking('${bookingId}')" class="btn btn-outline" style="flex: 1;">
            Cancel Booking
          </button>
        `
            : ""
        }
        </div>
      </div>
    `;
        }
      )
      .join("");
  }

  // Load bookings, notifications, and payments on page load
  await Promise.all([loadBookings(), loadNotifications(), loadPayments()]);
  
  // Load payment status for each approved booking
  await loadPaymentStatuses();
  await initTestimonialsSection();
});

// Load payment status for approved bookings
async function loadPaymentStatuses() {
  try {
    const result = await getPayments();
    if (result.success && result.payments) {
      result.payments.forEach(payment => {
        const bookingId = payment.booking?._id || payment.booking;
        if (bookingId) {
          const statusDiv = document.getElementById(`paymentStatus-${bookingId}`);
          const bookingCard = document.querySelector(`[data-booking-id="${bookingId}"]`);
          
          if (statusDiv) {
            const status = payment.paymentStatus || "pending";
            const statusColors = {
              pending: "#f59e0b",
              approved: "#10b981",
              completed: "#10b981",
              failed: "#ef4444",
            };
            const statusTexts = {
              pending: "Payment Pending Approval",
              approved: "Payment Approved ✓",
              completed: "Payment Completed ✓",
              failed: "Payment Failed",
            };
            statusDiv.innerHTML = `
              <span style="color: ${statusColors[status] || "#6b7280"}; font-weight: 500;">
                💳 ${statusTexts[status] || status}
              </span>
              ${payment.transactionId ? `<span style="color: var(--muted-foreground); font-size: 0.85rem; margin-left: 0.5rem;">(${payment.transactionId})</span>` : ""}
            `;
          }
          
          // Hide payment button if payment exists
          if (bookingCard) {
            const paymentButton = bookingCard.querySelector('button[onclick*="payment"]');
            if (paymentButton && payment.paymentStatus !== "failed") {
              paymentButton.style.display = "none";
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Failed to load payment statuses:", error);
  }
}

// Handle notification click
async function handleNotificationClick(notificationId, link) {
  try {
    await markNotificationRead(notificationId);
    if (link) {
      window.location.href = link;
    } else {
      location.reload();
    }
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    if (link) window.location.href = link;
  }
}

// Show all notifications
async function showAllNotifications() {
  try {
    const result = await getNotifications();
    if (result.success) {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); z-index: 1000;
        display: flex; align-items: center; justify-content: center;
      `;
      modal.innerHTML = `
        <div style="background: var(--card); padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="margin: 0;">All Notifications</h2>
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
          </div>
          <div id="allNotificationsList"></div>
          <button onclick="markAllAsRead()" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">
            Mark All as Read
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      
      const listContainer = document.getElementById('allNotificationsList');
      if (result.notifications.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--muted-foreground);">No notifications</p>';
      } else {
        listContainer.innerHTML = result.notifications.map(notif => `
          <div style="
            padding: 1rem;
            margin-bottom: 0.5rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: ${notif.isRead ? 'var(--card)' : 'var(--primary)/5'};
            cursor: pointer;
          " onclick="handleNotificationClick('${notif._id}', '${notif.link || ''}')">
            <h4 style="margin: 0 0 0.25rem 0;">${notif.title}</h4>
            <p style="margin: 0; color: var(--muted-foreground); font-size: 0.9rem;">${notif.message}</p>
            <p style="margin: 0.5rem 0 0 0; color: var(--muted-foreground); font-size: 0.8rem;">
              ${new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    alert("Failed to load notifications");
  }
}

async function initTestimonialsSection() {
  const form = document.getElementById("testimonialForm");
  const preview = document.getElementById("testimonialPreview");
  if (!form || !preview) return;

  await loadTestimonialsPreview();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const rating = parseInt(document.getElementById("testimonialRating")?.value, 10);
    const review = document.getElementById("testimonialMessage")?.value.trim();
    const destination = document.getElementById("testimonialDestination")?.value.trim();
    const successMessage = document.getElementById("testimonialSuccess");
    const submitButton = form.querySelector('button[type="submit"]');

    if (!rating || !review) {
      alert("Please select a rating and share a few details about your trip.");
      return;
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      await submitTestimonial({ rating, review, destination });
      form.reset();

      if (successMessage) {
        successMessage.style.display = "block";
        setTimeout(() => (successMessage.style.display = "none"), 4000);
      }

      await loadTestimonialsPreview();
    } catch (error) {
      alert(error.message || "Failed to submit testimonial. Please try again.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Testimonial";
      }
    }
  });
}

async function loadTestimonialsPreview() {
  const container = document.getElementById("testimonialPreview");
  if (!container) return;

  container.innerHTML =
    '<p style="color: var(--muted-foreground);">Loading recent testimonials...</p>';

  try {
    const result = await getTestimonials();
    if (!result.success || !result.testimonials?.length) {
      container.innerHTML =
        '<p style="color: var(--muted-foreground);">No testimonials yet. Be the first to share your story!</p>';
      return;
    }

    const items = result.testimonials.slice(0, 3).map((testimonial) => `
      <div class="testimonial-preview-item">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <img src="${testimonial.avatar}" alt="${testimonial.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
          <div>
            <p style="margin:0; font-weight:600;">${testimonial.name}</p>
            <p style="margin:0; color:var(--secondary); font-size:0.85rem;">${"⭐".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)}</p>
          </div>
        </div>
        <p style="margin:0.75rem 0; color: var(--muted-foreground); font-size:0.9rem;">“${testimonial.review}”</p>
        <p style="margin:0; font-size:0.8rem; color: var(--muted-foreground);">${testimonial.destination || "Worldwide Traveler"}</p>
      </div>
    `).join("");

    container.innerHTML = items;
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    container.innerHTML =
      '<p style="color: var(--muted-foreground);">Unable to load testimonials at the moment.</p>';
  }
}

// Mark all as read
async function markAllAsRead() {
  try {
    await markAllNotificationsRead();
    location.reload();
  } catch (error) {
    alert("Failed to mark all as read");
  }
}

// Edit booking handler
async function handleEditBooking(bookingId) {
  try {
    // Get booking details
    const result = await getBooking(bookingId);
    if (!result.success || !result.booking) {
      alert("Failed to load booking details");
      return;
    }

    const booking = result.booking;
    
    // Create and show edit modal
    showEditModal(booking);
  } catch (error) {
    alert(error.message || "Failed to load booking details");
  }
}

// Show edit modal
function showEditModal(booking) {
  // Format dates for input fields (YYYY-MM-DD)
  const checkInDate = new Date(booking.checkIn).toISOString().split('T')[0];
  const checkOutDate = new Date(booking.checkOut).toISOString().split('T')[0];
  
  // Normalize destination for matching (case-insensitive)
  const currentDest = (booking.destination || '').toLowerCase().trim();
  
  // Helper function to check if destination matches
  function isSelected(destName) {
    const destLower = destName.toLowerCase();
    return currentDest === destLower || 
           currentDest.includes(destLower) ||
           destLower.includes(currentDest);
  }
  
  // Determine selected destination
  const destinations = [
    { value: 'paris-france', name: 'Paris', text: 'Paris, France' },
    { value: 'maldives', name: 'Maldives', text: 'Maldives' },
    { value: 'switzerland', name: 'Switzerland', text: 'Switzerland' },
    { value: 'kenya', name: 'Kenya', text: 'Kenya' },
    { value: 'tokyo-japan', name: 'Tokyo', text: 'Tokyo, Japan' },
    { value: 'santorini-greece', name: 'Santorini', text: 'Santorini, Greece' },
    { value: 'bali-indonesia', name: 'Bali', text: 'Bali, Indonesia' },
    { value: 'dubai-uae', name: 'Dubai', text: 'Dubai, UAE' },
    { value: 'new-york-usa', name: 'New York', text: 'New York, USA' },
    { value: 'iceland', name: 'Iceland', text: 'Iceland' }
  ];
  
  // Build options HTML
  const optionsHTML = destinations.map(dest => 
    `<option value="${dest.value}" ${isSelected(dest.name) ? 'selected' : ''}>${dest.text}</option>`
  ).join('');
  
  // Create modal HTML
  const modalHTML = `
    <div id="editBookingModal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    ">
      <div style="
        background: var(--card, #fff);
        padding: 2rem;
        border-radius: var(--radius-lg, 8px);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      ">
        <h2 style="margin-bottom: 1.5rem; color: var(--primary, #2563eb);">Edit Booking</h2>
        
        <form id="editBookingForm">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Destination</label>
            <select id="editDestination" class="form-select" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px;">
              ${optionsHTML}
            </select>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Check-in Date</label>
            <input type="date" id="editCheckIn" value="${checkInDate}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px;" required>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Check-out Date</label>
            <input type="date" id="editCheckOut" value="${checkOutDate}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px;" required>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Adults</label>
            <input type="number" id="editAdults" value="${booking.adults || 1}" min="1" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px;" required>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Children</label>
            <input type="number" id="editChildren" value="${booking.children || 0}" min="0" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px;">
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Infants</label>
            <input type="number" id="editInfants" value="${booking.infants || 0}" min="0" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px;">
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" onclick="closeEditModal()" class="btn btn-outline" style="flex: 1; padding: 0.75rem; border: 1px solid var(--border, #ddd); background: transparent; border-radius: 4px; cursor: pointer;">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" style="flex: 1; padding: 0.75rem; background: var(--primary, #2563eb); color: white; border: none; border-radius: 4px; cursor: pointer;">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Remove existing modal if any
  const existingModal = document.getElementById('editBookingModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  const checkInInput = document.getElementById('editCheckIn');
  const checkOutInput = document.getElementById('editCheckOut');
  
  if (checkInInput) {
    checkInInput.setAttribute('min', today);
    checkInInput.addEventListener('change', function() {
      if (checkOutInput && checkInInput.value) {
        const checkInDate = new Date(checkInInput.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkOutInput.setAttribute('min', checkInDate.toISOString().split('T')[0]);
      }
    });
  }
  
  // Handle form submission
  const form = document.getElementById('editBookingForm');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await submitEditBooking(booking._id || booking.id);
  });
  
  // Close on background click
  document.getElementById('editBookingModal').addEventListener('click', function(e) {
    if (e.target.id === 'editBookingModal') {
      closeEditModal();
    }
  });
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById('editBookingModal');
  if (modal) {
    modal.remove();
  }
}

// Submit edited booking
async function submitEditBooking(bookingId) {
  try {
    const destinationSelect = document.getElementById('editDestination');
    const destinationText = destinationSelect.options[destinationSelect.selectedIndex].text;
    
    const updateData = {
      destination: destinationText,
      checkIn: document.getElementById('editCheckIn').value,
      checkOut: document.getElementById('editCheckOut').value,
      adults: parseInt(document.getElementById('editAdults').value) || 1,
      children: parseInt(document.getElementById('editChildren').value) || 0,
      infants: parseInt(document.getElementById('editInfants').value) || 0,
    };
    
    // Validate
    if (updateData.adults < 1) {
      alert("At least one adult is required");
      return;
    }
    
    const result = await updateBooking(bookingId, updateData);
    
    if (result.success) {
      alert("Booking updated successfully!");
      closeEditModal();
      location.reload();
    } else {
      alert(result.message || "Failed to update booking");
    }
  } catch (error) {
    alert(error.message || "Failed to update booking");
  }
}

// Cancel booking handler
async function handleCancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) {
    return;
  }

  try {
    const result = await cancelBooking(bookingId);

    if (result.success) {
      alert("Booking cancelled successfully");
      location.reload();
    }
  } catch (error) {
    alert(error.message || "Failed to cancel booking");
  }
}
