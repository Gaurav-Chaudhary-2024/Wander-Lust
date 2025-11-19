// ====================================
// API Client - Backend Communication
// ====================================

const API_BASE = "/api";

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: 'same-origin', // Include cookies for session
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Response is not JSON (likely HTML error page)
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      
      if (response.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. You don't have permission to access this resource.");
      } else if (response.status === 404) {
        throw new Error("API endpoint not found.");
      } else {
        throw new Error(`Server error (${response.status}). Please try again.`);
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    // Re-throw with a more user-friendly message if it's a parsing error
    if (error.message.includes("Unexpected token") || error.message.includes("JSON")) {
      throw new Error("Server returned an invalid response. Please check your connection and try again.");
    }
    throw error;
  }
}

// Authentication API
async function register(userData) {
  return await apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

async function login(credentials) {
  return await apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

async function logout() {
  return await apiCall("/auth/logout", {
    method: "POST",
  });
}

async function getCurrentUser() {
  return await apiCall("/auth/me");
}

// Destinations API
async function getDestinations(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiCall(`/destinations${queryString ? "?" + queryString : ""}`);
}

async function getDestination(id) {
  return await apiCall(`/destinations/${id}`);
}

// Bookings API
async function createBooking(bookingData) {
  return await apiCall("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
}

async function getMyBookings() {
  return await apiCall("/bookings");
}

async function getBooking(id) {
  return await apiCall(`/bookings/${id}`);
}

async function updateBooking(id, updateData) {
  return await apiCall(`/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}

async function cancelBooking(id) {
  return await apiCall(`/bookings/${id}`, {
    method: "DELETE",
  });
}

// Reviews API
async function createReview(reviewData) {
  return await apiCall("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

async function getDestinationReviews(destinationId) {
  return await apiCall(`/reviews/destination/${destinationId}`);
}

async function updateReview(id, updateData) {
  return await apiCall(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}

async function deleteReview(id) {
  return await apiCall(`/reviews/${id}`, {
    method: "DELETE",
  });
}

// Contact API
async function submitContactForm(formData) {
  return await apiCall("/contact", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

// Wishlist API
async function addToWishlist(data) {
  return await apiCall("/wishlist", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function getWishlist() {
  return await apiCall("/wishlist");
}

async function removeFromWishlist(id) {
  return await apiCall(`/wishlist/${id}`, { method: "DELETE" });
}

// Notifications API
async function getNotifications(unreadOnly = false) {
  return await apiCall(`/notifications${unreadOnly ? "?unreadOnly=true" : ""}`);
}

async function markNotificationRead(id) {
  return await apiCall(`/notifications/${id}/read`, { method: "PUT" });
}

async function markAllNotificationsRead() {
  return await apiCall("/notifications/mark-all-read", { method: "POST" });
}

// User Profile API
async function getProfile() {
  return await apiCall("/profile");
}

async function updateProfile(data) {
  return await apiCall("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Payments API
async function createPayment(data) {
  return await apiCall("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function getPayments() {
  return await apiCall("/payments");
}

async function getPaymentByBooking(bookingId) {
  return await apiCall(`/payments/booking/${bookingId}`);
}

// Travel Packages API
async function getPackages(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiCall(`/packages${queryString ? "?" + queryString : ""}`);
}

async function getPackage(id) {
  return await apiCall(`/packages/${id}`);
}

// Admin API
async function getAdminBookings(status = "") {
  const queryString = status ? `?status=${status}` : "";
  return await apiCall(`/admin/bookings${queryString}`);
}

async function approveAdminBooking(bookingId) {
  return await apiCall(`/admin/bookings/${bookingId}/approve`, {
    method: "POST",
  });
}

async function rejectAdminBooking(bookingId, reason = "") {
  return await apiCall(`/admin/bookings/${bookingId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

async function getAdminStats() {
  return await apiCall("/admin/stats");
}

async function getAdminPayments(status = "") {
  const queryString = status ? `?status=${status}` : "";
  return await apiCall(`/admin/payments${queryString}`);
}

async function approveAdminPayment(paymentId) {
  return await apiCall(`/admin/payments/${paymentId}/approve`, {
    method: "POST",
  });
}

// Account Switching API
async function getAvailableAccounts() {
  return await apiCall("/auth/accounts");
}

async function switchAccount(accountId) {
  return await apiCall(`/auth/switch/${accountId}`, {
    method: "POST",
  });
}

// Testimonials API
async function getTestimonials() {
  return await apiCall("/testimonials");
}

async function submitTestimonial(data) {
  return await apiCall("/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Admin Testimonials API
async function getAdminTestimonials(status = "") {
  const queryString = status ? `?status=${status}` : "";
  return await apiCall(`/admin/testimonials${queryString}`);
}

async function updateAdminTestimonial(id, data) {
  return await apiCall(`/admin/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function deleteAdminTestimonial(id) {
  return await apiCall(`/admin/testimonials/${id}`, {
    method: "DELETE",
  });
}

async function approveAdminTestimonial(id) {
  return await apiCall(`/admin/testimonials/${id}/approve`, {
    method: "POST",
  });
}

async function rejectAdminTestimonial(id) {
  return await apiCall(`/admin/testimonials/${id}/reject`, {
    method: "POST",
  });
}

// File Upload API
async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePicture", file);
  
  return await fetch("/api/upload/profile-picture", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  }).then(res => res.json());
}

async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("document", file);
  
  return await fetch("/api/upload/document", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  }).then(res => res.json());
}

// Personalization API
async function getRecommendations() {
  return await apiCall("/recommendations");
}

async function savePreferences(preferences) {
  return await apiCall("/preferences", {
    method: "POST",
    body: JSON.stringify(preferences),
  });
}