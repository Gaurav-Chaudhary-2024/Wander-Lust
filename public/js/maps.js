// ====================================
// Google Maps Integration
// ====================================

let map;
let markers = [];

// Initialize map
function initMap(containerId, center = { lat: 0, lng: 0 }, zoom = 2) {
  if (typeof google === "undefined" || !google.maps) {
    console.warn("Google Maps API not loaded");
    return null;
  }

  map = new google.maps.Map(document.getElementById(containerId), {
    center: center,
    zoom: zoom,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: false,
  });

  return map;
}

// Add marker to map
function addMarker(lat, lng, title, infoWindowContent = null) {
  if (!map) return null;

  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: title,
    animation: google.maps.Animation.DROP,
  });

  if (infoWindowContent) {
    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  }

  markers.push(marker);
  return marker;
}

// Add destination markers
function addDestinationMarkers(destinations) {
  if (!map || !destinations) return;

  destinations.forEach((dest) => {
    if (dest.lat && dest.lng) {
      const content = `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 5px 0; color: #1B263B;">${dest.name}</h3>
          <p style="margin: 0; color: #666;">${dest.city || dest.country || ""}</p>
          <p style="margin: 5px 0 0 0; color: #D4AF37; font-weight: bold;">$${dest.price || "N/A"}</p>
          <button onclick="window.location.href='/booking?destination=${encodeURIComponent(dest.name)}'" 
                  style="margin-top: 10px; padding: 5px 15px; background: #1B263B; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Book Now
          </button>
        </div>
      `;
      addMarker(dest.lat, dest.lng, dest.name, content);
    }
  });
}

// Geocode address to coordinates
function geocodeAddress(address, callback) {
  if (typeof google === "undefined" || !google.maps) {
    callback(null);
    return;
  }

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      callback({
        lat: location.lat(),
        lng: location.lng(),
      });
    } else {
      callback(null);
    }
  });
}

// Fit map bounds to show all markers
function fitMapToMarkers() {
  if (!map || markers.length === 0) return;

  const bounds = new google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });
  map.fitBounds(bounds);
}

// Clear all markers
function clearMarkers() {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];
}

