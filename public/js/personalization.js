// ====================================
// Personalization & Recommendations
// ====================================

// Load personalized recommendations
async function loadRecommendations() {
  try {
    const response = await fetch("/api/recommendations", {
      credentials: "same-origin",
    });
    const data = await response.json();

    if (data.success) {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Failed to load recommendations:", error);
    return null;
  }
}

// Render recommendations
function renderRecommendations(recommendations, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !recommendations || recommendations.length === 0) {
    return;
  }

  const html = recommendations
    .map((rec) => {
      return `
        <div class="recommendation-card" style="background: var(--card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--primary);">${rec.destination || rec.name || "Destination"}</h3>
          <p style="color: var(--muted-foreground); margin: 0 0 1rem 0;">${rec.description || ""}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 1.25rem; font-weight: bold; color: var(--primary);">$${rec.price || "N/A"}</span>
            <button onclick="window.location.href='/booking?destination=${encodeURIComponent(rec.destination || rec.name)}'" 
                    class="btn btn-primary" style="padding: 0.5rem 1rem;">
              Book Now
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = html;
}

// Save user preferences
async function savePreferences(preferences) {
  try {
    const response = await fetch("/api/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(preferences),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to save preferences:", error);
    return { success: false, error: error.message };
  }
}

// Load user preferences
async function loadPreferences() {
  try {
    const response = await fetch("/api/profile", {
      credentials: "same-origin",
    });
    const data = await response.json();

    if (data.success && data.profile) {
      return {
        travelStyle: data.profile.travelStyle,
        budgetRange: data.profile.budgetRange,
        preferredDestinations: data.profile.preferredDestinations,
        interests: data.profile.interests,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return null;
  }
}

// Show preferences modal
function showPreferencesModal() {
  const modal = document.createElement("div");
  modal.id = "preferencesModal";
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: var(--card); padding: 2rem; border-radius: var(--radius-lg); max-width: 500px; width: 90%;">
      <h2 style="margin: 0 0 1.5rem 0;">Travel Preferences</h2>
      <form id="preferencesForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Travel Style</label>
          <select name="travelStyle" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px;">
            <option value="">Select...</option>
            <option value="budget">Budget</option>
            <option value="mid-range">Mid-Range</option>
            <option value="luxury">Luxury</option>
            <option value="adventure">Adventure</option>
            <option value="relaxation">Relaxation</option>
          </select>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Budget Range</label>
          <select name="budgetRange" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px;">
            <option value="">Select...</option>
            <option value="under-1000">Under $1,000</option>
            <option value="1000-3000">$1,000 - $3,000</option>
            <option value="3000-5000">$3,000 - $5,000</option>
            <option value="5000-plus">$5,000+</option>
          </select>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button type="button" onclick="document.getElementById('preferencesModal').remove()" 
                  class="btn btn-outline" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex: 1;">Save Preferences</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Load existing preferences
  loadPreferences().then((prefs) => {
    if (prefs) {
      const form = document.getElementById("preferencesForm");
      if (form.travelStyle) form.travelStyle.value = prefs.travelStyle || "";
      if (form.budgetRange) form.budgetRange.value = prefs.budgetRange || "";
    }
  });

  // Handle form submission
  document.getElementById("preferencesForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const preferences = {
      travelStyle: formData.get("travelStyle"),
      budgetRange: formData.get("budgetRange"),
    };

    const result = await savePreferences(preferences);
    if (result.success) {
      alert("Preferences saved successfully!");
      modal.remove();
    } else {
      alert("Failed to save preferences");
    }
  });

  // Close on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

