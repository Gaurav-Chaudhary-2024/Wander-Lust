document.addEventListener("DOMContentLoaded", () => {
  loadTestimonialsPage();
});

async function loadTestimonialsPage() {
  const loadingContainer = document.getElementById("loadingContainer");
  const featuredSection = document.getElementById("featuredSection");
  const storiesSection = document.getElementById("storiesSection");

  if (!loadingContainer) return;

  const renderData = (testimonials) => {
    if (!testimonials.length) {
      showError("No testimonials available yet. Be the first to share your journey!");
      return;
    }

    const featured = testimonials.slice(0, 2);
    const stories = testimonials.slice(2);

    renderFeaturedTestimonials(featured);
    renderTravelerStories(stories.length ? stories : featured);

    loadingContainer.style.display = "none";
    featuredSection.style.display = "block";
    storiesSection.style.display = "block";
  };

  try {
    const result = await getTestimonials();
    if (result.success && result.testimonials) {
      renderData(result.testimonials);
      return;
    }
    throw new Error("No testimonials received");
  } catch (error) {
    console.error("Error loading testimonials:", error);
    // Fallback sample data
    const fallback = [
      {
        name: "Eleanor Rigby",
        avatar: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        review:
          "WanderLust made our honeymoon trip to the Maldives absolutely magical! Every detail was perfect.",
        destination: "Maldives",
        createdAt: new Date(),
      },
      {
        name: "Arthur Penhaligon",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 5,
        review:
          "Their Patagonia trekking expedition was meticulously planned and utterly breathtaking.",
        destination: "Patagonia",
        createdAt: new Date(),
      },
      {
        name: "Sophia Chen",
        avatar: "https://i.pravatar.cc/150?img=5",
        rating: 5,
        review:
          "My solo journey through Southeast Asia felt safe and immersive thanks to WanderLust.",
        destination: "Southeast Asia",
        createdAt: new Date(),
      },
      {
        name: "Marcus Thorne",
        avatar: "https://i.pravatar.cc/150?img=13",
        rating: 4,
        review:
          "The family vacation to Disney World was flawless. The kids still talk about it every day.",
        destination: "Orlando, USA",
        createdAt: new Date(),
      },
    ];
    renderData(fallback);
  }
}

function renderStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? "⭐" : "☆";
  }
  return stars;
}

function formatRelativeDate(date) {
  if (!date) return "Recently";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderFeaturedTestimonials(featured) {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return;
  featuredGrid.innerHTML = "";

  featured.forEach((testimonial, index) => {
    const card = document.createElement("div");
    card.className = "testimonial-card feature-card scroll-slide-up";
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <img src="${testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name || "Traveler")}`}" alt="${testimonial.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid var(--secondary);">
        <div>
          <h3 style="font-size: 1.25rem; color: var(--primary); margin-bottom: 0.25rem;">${testimonial.name}</h3>
          <div style="color: var(--secondary); font-size: 1rem;">${renderStars(testimonial.rating)}</div>
        </div>
      </div>
      <p style="font-style: italic; color: var(--muted-foreground); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1rem;">"${testimonial.review}"</p>
      <button class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 0.5rem;" disabled>
        ${testimonial.destination || "Worldwide traveler"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;

    featuredGrid.appendChild(card);
  });
}

function renderTravelerStories(stories) {
  const storiesGrid = document.getElementById("storiesGrid");
  if (!storiesGrid) return;
  storiesGrid.innerHTML = "";

  stories.forEach((story, index) => {
    const card = document.createElement("div");
    card.className = "destination-card";
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <div style="padding: 1.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <img src="${story.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name || "Traveler")}`}" alt="${story.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--secondary);">
          <div>
            <h4 style="font-size: 1rem; color: var(--primary); margin-bottom: 0.25rem;">${story.name}</h4>
            <div style="color: var(--secondary); font-size: 0.875rem;">${renderStars(story.rating)}</div>
          </div>
        </div>
        <p style="color: var(--muted-foreground); line-height: 1.6; margin-bottom: 1rem; font-size: 0.9rem;">"${story.review}"</p>
        <p style="color: var(--muted-foreground); font-size: 0.8rem;">${formatRelativeDate(story.createdAt)}</p>
      </div>
    `;

    storiesGrid.appendChild(card);
  });
}

function showError(message) {
  const loading = document.getElementById("loadingContainer");
  const errorContainer = document.getElementById("errorContainer");
  const messageEl = document.getElementById("errorMessage");

  if (loading) loading.style.display = "none";
  if (errorContainer) errorContainer.style.display = "block";
  if (messageEl) messageEl.textContent = message;
}

