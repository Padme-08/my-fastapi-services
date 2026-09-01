// Use a relative path so it works both locally and on Vercel
const API_URL = "/cellphones";

document.addEventListener("DOMContentLoaded", () => {
  getAllCellphones();
});

function getAllCellphones() {
  const listContainer = document.getElementById("cellphonesList");
  listContainer.innerHTML = "<p style='color: #94a3b8; grid-column: 1/-1; text-align: center;'>Loading catalog...</p>";

  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      displayCellphones(data.cellphones);
    })
    .catch(error => {
      console.error("Error fetching cellphones:", error);
      listContainer.innerHTML = "<p style='color: #f87171; grid-column: 1/-1; text-align: center;'>Failed to fetch data from API. Please check your backend.</p>";
    });
}

function searchCellphones() {
  const query = document.getElementById("searchInput").value.trim();
  const listContainer = document.getElementById("cellphonesList");
  listContainer.innerHTML = "<p style='color: #94a3b8; grid-column: 1/-1; text-align: center;'>Searching...</p>";

  fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      displayCellphones(data.results);
    })
    .catch(error => {
      console.error("Error searching cellphones:", error);
      listContainer.innerHTML = "<p style='color: #f87171; grid-column: 1/-1; text-align: center;'>Search failed.</p>";
    });
}

function displayCellphones(cellphones) {
  const listContainer = document.getElementById("cellphonesList");
  listContainer.innerHTML = "";

  if (!cellphones || cellphones.length === 0) {
    listContainer.innerHTML = "<p style='color: #94a3b8; grid-column: 1/-1; text-align: center;'>No phones found matching your query.</p>";
    return;
  }

  cellphones.forEach(phone => {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    cardContainer.addEventListener("click", () => {
      cardContainer.classList.toggle("flipped");
    });

    cardContainer.innerHTML = `
      <div class="card-inner">
        <!-- Front: Photo + Name -->
        <div class="card-front">
          <span class="brand-badge">${phone.brand}</span>
          <img src="${phone.image}" alt="${phone.name}" onerror="this.src='https://via.placeholder.com/250x300?text=No+Image';">
          <div class="title-container">
            <h3>${phone.name}</h3>
            <span class="action-tag">Click for specs ⚡</span>
          </div>
        </div>

        <!-- Back: 14 Data Fields -->
        <div class="card-back">
          <div class="back-header">
            <h4>${phone.name}</h4>
            <span class="price-tag">${phone.price}</span>
          </div>
          
          <div class="specs-scroll">
            <div class="spec-item"><span class="spec-label">1. ID:</span><span class="spec-value">${phone.id}</span></div>
            <div class="spec-item"><span class="spec-label">2. Brand:</span><span class="spec-value">${phone.brand}</span></div>
            <div class="spec-item"><span class="spec-label">3. Model No:</span><span class="spec-value">${phone.model_number}</span></div>
            <div class="spec-item"><span class="spec-label">4. Year:</span><span class="spec-value">${phone.release_year}</span></div>
            <div class="spec-item"><span class="spec-label">5. Display:</span><span class="spec-value">${phone.display}</span></div>
            <div class="spec-item"><span class="spec-label">6. Chipset:</span><span class="spec-value">${phone.chipset}</span></div>
            <div class="spec-item"><span class="spec-label">7. RAM:</span><span class="spec-value">${phone.ram}</span></div>
            <div class="spec-item"><span class="spec-label">8. Storage:</span><span class="spec-value">${phone.storage}</span></div>
            <div class="spec-item"><span class="spec-label">9. Battery:</span><span class="spec-value">${phone.battery}</span></div>
            <div class="spec-item"><span class="spec-label">10. Price:</span><span class="spec-value">${phone.price}</span></div>
            <div class="spec-item"><span class="spec-label">11. OS:</span><span class="spec-value">${phone.os}</span></div>
            <div class="spec-item"><span class="spec-label">12. Weight:</span><span class="spec-value">${phone.weight}</span></div>
            <div class="spec-item"><span class="spec-label">13. Camera:</span><span class="spec-value">${phone.camera_setup}</span></div>
            <div class="spec-item"><span class="spec-label">14. Description:</span><span class="spec-value">${phone.description}</span></div>
          </div>

          <div class="flip-back-hint">Click card to return ↺</div>
        </div>
      </div>
    `;

    listContainer.appendChild(cardContainer);
  });
}