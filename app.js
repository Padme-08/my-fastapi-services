const API_URL = "http://127.0.0.1:8000";

// Run initial fetch when DOM content is loaded
document.addEventListener("DOMContentLoaded", getAllSports);

async function getAllSports() {
  try {
    const response = await fetch(`${API_URL}/sports`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("All sports response:", data);
    
    displaySports(data.sports || data.results || []);
  } catch (error) {
    console.error("Error fetching sports:", error);
    showError("Failed to load sports from API.");
  }
}

async function searchSports() {
  const searchInput = document.getElementById("searchInput") || document.querySelector('input[type="text"]');
  const query = searchInput ? searchInput.value.trim() : "";

  if (!query) {
    getAllSports();
    return;
  }

  try {
    // Try primary search endpoint using 'q'
    let response = await fetch(`${API_URL}/sports/search?q=${encodeURIComponent(query)}`);

    // Fallback if backend expects 'query' instead of 'q'
    if (response.status === 422 || response.status === 400) {
      response = await fetch(`${API_URL}/sports/search?query=${encodeURIComponent(query)}`);
    }

    // Fallback if route is /search instead of /sports/search
    if (response.status === 404) {
      response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Search response payload:", data);

    // Parse array response regardless of key structure
    const resultsList = Array.isArray(data) 
      ? data 
      : (data.results || data.sports || []);

    displaySports(resultsList);
  } catch (error) {
    console.error("Error searching sports:", error);
    showError("Failed to search sports. Check browser console (F12) for response details.");
  }
}

function displaySports(sportsList) {
  const container = document.getElementById("carList") || document.getElementById("sportsList");
  
  if (!container) {
    console.error("Display container element not found in DOM.");
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(sportsList) || sportsList.length === 0) {
    container.innerHTML = "<p>No sports found.</p>";
    return;
  }

  sportsList.forEach(sport => {
    const card = document.createElement("div");
    card.className = "sport-card";
    card.innerHTML = `
      <h3>${sport.name || "N/A"}</h3>
      <p><strong>Category:</strong> ${sport.category || "N/A"}</p>
      <p><strong>Players per Team:</strong> ${sport.players_per_team ?? "N/A"}</p>
      <p><strong>Duration:</strong> ${sport.duration || "N/A"}</p>
      <p>${sport.description || ""}</p>
      <hr>
    `;
    container.appendChild(card);
  });
}

function showError(message) {
  const container = document.getElementById("carList") || document.getElementById("sportsList");
  if (container) {
    container.innerHTML = `<p style="color: red;">${message}</p>`;
  }
}