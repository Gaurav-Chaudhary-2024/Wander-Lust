// ====================================
// Admin Dashboard JavaScript
// ====================================

document.addEventListener("DOMContentLoaded", async function () {
  // Refresh session first to ensure role is up to date
  try {
    const refreshResponse = await fetch('/api/auth/refresh', { 
      method: 'GET',
      credentials: 'same-origin'
    });
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log("Session refreshed - Role:", refreshData.user?.role);
    }
  } catch (error) {
    console.warn("Failed to refresh session:", error);
  }
  
  await loadStats();
  await loadBookings();
  
  // Add filter change listeners
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", loadBookings);
  }
  
  const paymentStatusFilter = document.getElementById("paymentStatusFilter");
  if (paymentStatusFilter) {
    paymentStatusFilter.addEventListener("change", loadPayments);
  }

  const testimonialStatusFilter = document.getElementById("testimonialStatusFilter");
  if (testimonialStatusFilter) {
    testimonialStatusFilter.addEventListener("change", loadTestimonials);
  }
});

// Load admin stats
async function loadStats() {
  try {
    const result = await getAdminStats();
    if (result.success) {
      updateStats(result.stats);
    }
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
}

// Update stats display
function updateStats(stats) {
  const elements = {
    statTotalBookings: stats.totalBookings || 0,
    statPendingBookings: stats.pendingBookings || 0,
    statApprovedBookings: stats.approvedBookings || 0,
    statRejectedBookings: stats.rejectedBookings || 0,
    statTotalUsers: stats.totalUsers || 0,
    statPendingPayments: stats.pendingPayments || 0,
  };

  Object.keys(elements).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = elements[id];
    }
  });
}

// Load bookings
async function loadBookings() {
  try {
    const container = document.getElementById("bookingsTable");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="width: 50px; height: 50px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 1rem; color: var(--muted-foreground);">Loading bookings...</p>
        </div>
      `;
    }

    const statusFilter = document.getElementById("statusFilter");
    const status = statusFilter ? statusFilter.value : "";
    
    const result = await getAdminBookings(status);
    
    if (result.success) {
      renderBookings(result.bookings || []);
    } else {
      if (container) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <p style="color: #ef4444; margin-bottom: 0.5rem;">${result.message || "Failed to load bookings"}</p>
            <button onclick="loadBookings()" class="btn btn-primary" style="margin-top: 1rem;">Retry</button>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error("Failed to load bookings:", error);
    console.error("Error details:", error.message);
    const container = document.getElementById("bookingsTable");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="color: #ef4444; margin-bottom: 0.5rem;">Failed to load bookings. Please try again.</p>
          <p style="color: var(--muted-foreground); font-size: 0.9rem; margin-bottom: 1rem;">${error.message || "Unknown error"}</p>
          <button onclick="loadBookings()" class="btn btn-primary" style="margin-top: 1rem;">Retry</button>
        </div>
      `;
    }
  }
}

// Render bookings table
function renderBookings(bookings) {
  const container = document.getElementById("bookingsTable");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No bookings found</p>';
    return;
  }

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Destination</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Travelers</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${bookings.map(booking => {
          const status = booking.status || "pending";
          const statusClass = `status-${status}`;
          const statusText = status.charAt(0).toUpperCase() + status.slice(1);
          const canApprove = status === "pending";
          const canReject = status === "pending";
          const customerName = booking.firstName && booking.lastName 
            ? `${booking.firstName} ${booking.lastName}` 
            : booking.user?.name || "Unknown";
          const customerEmail = booking.email || booking.user?.email || "N/A";
          const totalTravelers = (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0);
          
          return `
            <tr>
              <td style="font-family: monospace; font-size: 0.85rem;">${booking._id.toString().substring(0, 8)}</td>
              <td>
                <div>${customerName}</div>
                <div style="font-size: 0.85rem; color: var(--muted-foreground);">${customerEmail}</div>
              </td>
              <td>${booking.destination || "N/A"}</td>
              <td style="font-size: 0.85rem;">${new Date(booking.checkIn).toLocaleDateString()}</td>
              <td style="font-size: 0.85rem;">${new Date(booking.checkOut).toLocaleDateString()}</td>
              <td>${totalTravelers} (${booking.adults || 0}A, ${booking.children || 0}C, ${booking.infants || 0}I)</td>
              <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${booking.approvedBy ? `<div style="font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.25rem;">By: ${booking.approvedBy.name || "Admin"}</div>` : ""}
              </td>
              <td style="font-size: 0.85rem; color: var(--muted-foreground);">${new Date(booking.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="btn-group">
                  ${canApprove ? `<button class="btn-small btn-approve" onclick="approveBooking('${booking._id}')">Approve</button>` : ""}
                  ${canReject ? `<button class="btn-small btn-reject" onclick="rejectBooking('${booking._id}')">Reject</button>` : ""}
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// Approve booking
async function approveBooking(bookingId) {
  if (!confirm("Are you sure you want to approve this booking?")) {
    return;
  }

  try {
    const result = await approveAdminBooking(bookingId);
    
    if (result.success) {
      alert("Booking approved successfully!");
      await loadStats();
      await loadBookings();
    } else {
      alert(result.message || "Failed to approve booking");
    }
  } catch (error) {
    alert(error.message || "Failed to approve booking");
  }
}

// Reject booking
async function rejectBooking(bookingId) {
  const reason = prompt("Please provide a reason for rejection (optional):");
  if (reason === null) {
    return; // User cancelled
  }

  if (!confirm("Are you sure you want to reject this booking?")) {
    return;
  }

  try {
    const result = await rejectAdminBooking(bookingId, reason);
    
    if (result.success) {
      alert("Booking rejected successfully!");
      await loadStats();
      await loadBookings();
    } else {
      alert(result.message || "Failed to reject booking");
    }
  } catch (error) {
    alert(error.message || "Failed to reject booking");
  }
}

// Load payments (admin)
async function loadPayments() {
  try {
    const container = document.getElementById("paymentsTable");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="width: 50px; height: 50px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 1rem; color: var(--muted-foreground);">Loading payments...</p>
        </div>
      `;
    }

    const statusFilter = document.getElementById("paymentStatusFilter");
    const status = statusFilter ? statusFilter.value : "";
    
    const result = await getAdminPayments(status);
    
    if (result.success) {
      renderPayments(result.payments || []);
    } else {
      if (container) {
        container.innerHTML = `<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">${result.message || "Failed to load payments"}</p>`;
      }
    }
  } catch (error) {
    console.error("Failed to load payments:", error);
    const container = document.getElementById("paymentsTable");
    if (container) {
      container.innerHTML = `<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">Failed to load payments. Please try again.</p>`;
    }
  }
}

// Render payments table
function renderPayments(payments) {
  const container = document.getElementById("paymentsTable");
  if (!container) return;

  if (payments.length === 0) {
    container.innerHTML = '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No payments found</p>';
    return;
  }

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Customer</th>
          <th>Booking</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map(payment => {
          const status = payment.paymentStatus || "pending";
          const statusClass = `status-${status}`;
          const statusText = status.charAt(0).toUpperCase() + status.slice(1);
          const canApprove = status === "pending";
          const customerName = payment.user?.name || "Unknown";
          const customerEmail = payment.user?.email || "N/A";
          const bookingDest = payment.booking?.destination || "N/A";
          
          return `
            <tr>
              <td style="font-family: monospace; font-size: 0.85rem;">${payment.transactionId || payment._id.toString().substring(0, 8)}</td>
              <td>
                <div>${customerName}</div>
                <div style="font-size: 0.85rem; color: var(--muted-foreground);">${customerEmail}</div>
              </td>
              <td>${bookingDest}</td>
              <td style="font-weight: 600; color: var(--primary);">$${payment.amount?.toLocaleString() || '0'}</td>
              <td style="text-transform: capitalize;">${(payment.paymentMethod || '').replace('_', ' ')}</td>
              <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${payment.approvedBy ? `<div style="font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.25rem;">By: ${payment.approvedBy.name || "Admin"}</div>` : ""}
              </td>
              <td style="font-size: 0.85rem; color: var(--muted-foreground);">${new Date(payment.createdAt).toLocaleDateString()}</td>
              <td>
                ${canApprove ? `<button class="btn-small btn-approve" onclick="approvePayment('${payment._id}')">Approve</button>` : ""}
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// Approve payment
async function approvePayment(paymentId) {
  if (!confirm("Are you sure you want to approve this payment?")) {
    return;
  }

  try {
    const result = await approveAdminPayment(paymentId);
    
    if (result.success) {
      alert("Payment approved successfully!");
      await loadStats();
      await loadPayments();
    } else {
      alert(result.message || "Failed to approve payment");
    }
  } catch (error) {
    alert(error.message || "Failed to approve payment");
  }
}

// Tab switching functions
function showBookingsTab() {
  document.getElementById("bookingsTab").style.display = "block";
  document.getElementById("paymentsTab").style.display = "none";
  document.getElementById("testimonialsTab").style.display = "none";
  document.getElementById("bookingsTabBtn").style.background = "var(--primary)";
  document.getElementById("bookingsTabBtn").style.color = "white";
  document.getElementById("paymentsTabBtn").style.background = "transparent";
  document.getElementById("paymentsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("testimonialsTabBtn").style.background = "transparent";
  document.getElementById("testimonialsTabBtn").style.color = "var(--muted-foreground)";
}

function showPaymentsTab() {
  document.getElementById("bookingsTab").style.display = "none";
  document.getElementById("paymentsTab").style.display = "block";
  document.getElementById("testimonialsTab").style.display = "none";
  document.getElementById("bookingsTabBtn").style.background = "transparent";
  document.getElementById("bookingsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("paymentsTabBtn").style.background = "var(--primary)";
  document.getElementById("paymentsTabBtn").style.color = "white";
  document.getElementById("testimonialsTabBtn").style.background = "transparent";
  document.getElementById("testimonialsTabBtn").style.color = "var(--muted-foreground)";
  loadPayments();
}

function showTestimonialsTab() {
  document.getElementById("bookingsTab").style.display = "none";
  document.getElementById("paymentsTab").style.display = "none";
  document.getElementById("testimonialsTab").style.display = "block";
  document.getElementById("bookingsTabBtn").style.background = "transparent";
  document.getElementById("bookingsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("paymentsTabBtn").style.background = "transparent";
  document.getElementById("paymentsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("testimonialsTabBtn").style.background = "var(--primary)";
  document.getElementById("testimonialsTabBtn").style.color = "white";
  loadTestimonials();
}

// Load testimonials (admin)
async function loadTestimonials() {
  try {
    const container = document.getElementById("testimonialsTable");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="width: 50px; height: 50px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 1rem; color: var(--muted-foreground);">Loading testimonials...</p>
        </div>
      `;
    }

    const statusFilter = document.getElementById("testimonialStatusFilter");
    const status = statusFilter ? statusFilter.value : "";
    
    const result = await getAdminTestimonials(status);
    
    if (result.success) {
      renderTestimonials(result.testimonials || []);
    } else {
      if (container) {
        container.innerHTML = `<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">${result.message || "Failed to load testimonials"}</p>`;
      }
    }
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    const container = document.getElementById("testimonialsTable");
    if (container) {
      container.innerHTML = `<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">Failed to load testimonials. Please try again.</p>`;
    }
  }
}

// Render testimonials table
function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonialsTable");
  if (!container) return;

  if (testimonials.length === 0) {
    container.innerHTML = '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No testimonials found</p>';
    return;
  }

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Destination</th>
          <th>Rating</th>
          <th>Review</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${testimonials.map(testimonial => {
          const status = testimonial.status || "pending";
          const statusClass = `status-${status}`;
          const statusText = status.charAt(0).toUpperCase() + status.slice(1);
          const canApprove = status === "pending";
          const canReject = status !== "rejected";
          const stars = "⭐".repeat(testimonial.rating || 5) + "☆".repeat(5 - (testimonial.rating || 5));
          
          return `
            <tr>
              <td>${testimonial.name || "Unknown"}</td>
              <td>${testimonial.destination || "N/A"}</td>
              <td style="font-size: 1.1rem;">${stars}</td>
              <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${testimonial.review || ''}">${testimonial.review || "N/A"}</td>
              <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
              </td>
              <td style="font-size: 0.85rem; color: var(--muted-foreground);">${new Date(testimonial.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="btn-group">
                  ${canApprove ? `<button class="btn-small btn-approve" onclick="approveTestimonial('${testimonial._id}')">Approve</button>` : ""}
                  ${canReject ? `<button class="btn-small btn-reject" onclick="rejectTestimonial('${testimonial._id}')">Reject</button>` : ""}
                  <button class="btn-small" style="background: #6b7280; color: white;" onclick="editTestimonial('${testimonial._id}')">Edit</button>
                  <button class="btn-small btn-reject" onclick="deleteTestimonial('${testimonial._id}')">Delete</button>
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// Approve testimonial
async function approveTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to approve this testimonial?")) {
    return;
  }

  try {
    const result = await approveAdminTestimonial(testimonialId);
    
    if (result.success) {
      alert("Testimonial approved successfully!");
      await loadTestimonials();
    } else {
      alert(result.message || "Failed to approve testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to approve testimonial");
  }
}

// Reject testimonial
async function rejectTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to reject this testimonial?")) {
    return;
  }

  try {
    const result = await rejectAdminTestimonial(testimonialId);
    
    if (result.success) {
      alert("Testimonial rejected successfully!");
      await loadTestimonials();
    } else {
      alert(result.message || "Failed to reject testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to reject testimonial");
  }
}

// Edit testimonial
async function editTestimonial(testimonialId) {
  try {
    const result = await getAdminTestimonials();
    if (!result.success) {
      alert("Failed to load testimonial details");
      return;
    }

    const testimonial = result.testimonials.find(t => t._id === testimonialId);
    if (!testimonial) {
      alert("Testimonial not found");
      return;
    }

    const name = prompt("Edit name:", testimonial.name || "");
    if (name === null) return;

    const destination = prompt("Edit destination:", testimonial.destination || "");
    if (destination === null) return;

    const rating = prompt("Edit rating (1-5):", testimonial.rating || 5);
    if (rating === null) return;
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    const review = prompt("Edit review:", testimonial.review || "");
    if (review === null) return;

    const updateResult = await updateAdminTestimonial(testimonialId, {
      name: name.trim(),
      destination: destination.trim(),
      rating: ratingNum,
      review: review.trim(),
    });

    if (updateResult.success) {
      alert("Testimonial updated successfully!");
      await loadTestimonials();
    } else {
      alert(updateResult.message || "Failed to update testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to edit testimonial");
  }
}

// Delete testimonial
async function deleteTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
    return;
  }

  try {
    const result = await deleteAdminTestimonial(testimonialId);
    
    if (result.success) {
      alert("Testimonial deleted successfully!");
      await loadTestimonials();
    } else {
      alert(result.message || "Failed to delete testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to delete testimonial");
  }
}

// Tab switching functions
function showBookingsTab() {
  document.getElementById("bookingsTab").style.display = "block";
  document.getElementById("paymentsTab").style.display = "none";
  document.getElementById("testimonialsTab").style.display = "none";
  document.getElementById("bookingsTabBtn").style.background = "var(--primary)";
  document.getElementById("bookingsTabBtn").style.color = "white";
  document.getElementById("paymentsTabBtn").style.background = "transparent";
  document.getElementById("paymentsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("testimonialsTabBtn").style.background = "transparent";
  document.getElementById("testimonialsTabBtn").style.color = "var(--muted-foreground)";
}

function showPaymentsTab() {
  document.getElementById("bookingsTab").style.display = "none";
  document.getElementById("paymentsTab").style.display = "block";
  document.getElementById("testimonialsTab").style.display = "none";
  document.getElementById("bookingsTabBtn").style.background = "transparent";
  document.getElementById("bookingsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("paymentsTabBtn").style.background = "var(--primary)";
  document.getElementById("paymentsTabBtn").style.color = "white";
  document.getElementById("testimonialsTabBtn").style.background = "transparent";
  document.getElementById("testimonialsTabBtn").style.color = "var(--muted-foreground)";
  loadPayments();
}

function showTestimonialsTab() {
  document.getElementById("bookingsTab").style.display = "none";
  document.getElementById("paymentsTab").style.display = "none";
  document.getElementById("testimonialsTab").style.display = "block";
  document.getElementById("bookingsTabBtn").style.background = "transparent";
  document.getElementById("bookingsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("paymentsTabBtn").style.background = "transparent";
  document.getElementById("paymentsTabBtn").style.color = "var(--muted-foreground)";
  document.getElementById("testimonialsTabBtn").style.background = "var(--primary)";
  document.getElementById("testimonialsTabBtn").style.color = "white";
  loadTestimonials();
}

// Load testimonials (admin)
async function loadTestimonials() {
  try {
    const container = document.getElementById("testimonialsTable");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="width: 50px; height: 50px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 1rem; color: var(--muted-foreground);">Loading testimonials...</p>
        </div>
      `;
    }

    const statusFilter = document.getElementById("testimonialStatusFilter");
    const status = statusFilter ? statusFilter.value : "";
    
    const result = await getAdminTestimonials(status);
    
    if (result.success) {
      renderTestimonials(result.testimonials || []);
    } else {
      if (container) {
        container.innerHTML = `<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">${result.message || "Failed to load testimonials"}</p>`;
      }
    }
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    const container = document.getElementById("testimonialsTable");
    if (container) {
      container.innerHTML = `<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">Failed to load testimonials. Please try again.</p>`;
    }
  }
}

// Render testimonials table
function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonialsTable");
  if (!container) return;

  if (testimonials.length === 0) {
    container.innerHTML = '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No testimonials found</p>';
    return;
  }

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Destination</th>
          <th>Rating</th>
          <th>Review</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${testimonials.map(testimonial => {
          const status = testimonial.status || "pending";
          const statusClass = `status-${status}`;
          const statusText = status.charAt(0).toUpperCase() + status.slice(1);
          const canApprove = status === "pending";
          const canReject = status !== "rejected";
          const stars = "⭐".repeat(testimonial.rating || 5) + "☆".repeat(5 - (testimonial.rating || 5));
          
          return `
            <tr>
              <td>${testimonial.name || "Unknown"}</td>
              <td>${testimonial.destination || "N/A"}</td>
              <td style="font-size: 1.1rem;">${stars}</td>
              <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${testimonial.review || ''}">${testimonial.review || "N/A"}</td>
              <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
              </td>
              <td style="font-size: 0.85rem; color: var(--muted-foreground);">${new Date(testimonial.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="btn-group">
                  ${canApprove ? `<button class="btn-small btn-approve" onclick="approveTestimonial('${testimonial._id}')">Approve</button>` : ""}
                  ${canReject ? `<button class="btn-small btn-reject" onclick="rejectTestimonial('${testimonial._id}')">Reject</button>` : ""}
                  <button class="btn-small" style="background: #6b7280; color: white;" onclick="editTestimonial('${testimonial._id}')">Edit</button>
                  <button class="btn-small btn-reject" onclick="deleteTestimonial('${testimonial._id}')">Delete</button>
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// Approve testimonial
async function approveTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to approve this testimonial?")) {
    return;
  }

  try {
    const result = await approveAdminTestimonial(testimonialId);
    
    if (result.success) {
      alert("Testimonial approved successfully!");
      await loadTestimonials();
    } else {
      alert(result.message || "Failed to approve testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to approve testimonial");
  }
}

// Reject testimonial
async function rejectTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to reject this testimonial?")) {
    return;
  }

  try {
    const result = await rejectAdminTestimonial(testimonialId);
    
    if (result.success) {
      alert("Testimonial rejected successfully!");
      await loadTestimonials();
    } else {
      alert(result.message || "Failed to reject testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to reject testimonial");
  }
}

// Edit testimonial
async function editTestimonial(testimonialId) {
  try {
    const result = await getAdminTestimonials();
    if (!result.success) {
      alert("Failed to load testimonial details");
      return;
    }

    const testimonial = result.testimonials.find(t => t._id === testimonialId);
    if (!testimonial) {
      alert("Testimonial not found");
      return;
    }

    const name = prompt("Edit name:", testimonial.name || "");
    if (name === null) return;

    const destination = prompt("Edit destination:", testimonial.destination || "");
    if (destination === null) return;

    const rating = prompt("Edit rating (1-5):", testimonial.rating || 5);
    if (rating === null) return;
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    const review = prompt("Edit review:", testimonial.review || "");
    if (review === null) return;

    const updateResult = await updateAdminTestimonial(testimonialId, {
      name: name.trim(),
      destination: destination.trim(),
      rating: ratingNum,
      review: review.trim(),
    });

    if (updateResult.success) {
      alert("Testimonial updated successfully!");
      await loadTestimonials();
    } else {
      alert(updateResult.message || "Failed to update testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to edit testimonial");
  }
}

// Delete testimonial
async function deleteTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
    return;
  }

  try {
    const result = await deleteAdminTestimonial(testimonialId);
    
    if (result.success) {
      alert("Testimonial deleted successfully!");
      await loadTestimonials();
    } else {
      alert(result.message || "Failed to delete testimonial");
    }
  } catch (error) {
    alert(error.message || "Failed to delete testimonial");
  }
}
