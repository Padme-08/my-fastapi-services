const API_KEY = 'student-api-key-123';

// Automatically choose local endpoint or Vercel relative path
const BASE_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
  ? 'http://127.0.0.1:8000/api/v1/cellphones'
  : '/api/v1/cellphones';

// Get DOM Elements
const searchInput = document.getElementById('searchInput');
const container = document.getElementById('cellphonesList');

// Fetch and render all cellphones on load
document.addEventListener('DOMContentLoaded', () => {
  getAllCellphones();
});

// Search input enter key
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCellphones();
  });
}

// Fetch all cellphones
async function getAllCellphones() {
  if (searchInput) searchInput.value = '';
  renderLoading();

  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const cellphones = Array.isArray(data) ? data : (data.cellphones || []);
    renderCellphones(cellphones);
  } catch (error) {
    console.error('Error fetching cellphones:', error);
    renderError('Failed to fetch data from API. Please check backend connection.');
  }
}

// Search cellphones
async function searchCellphones() {
  const query = searchInput ? searchInput.value.trim() : '';
  if (!query) {
    getAllCellphones();
    return;
  }

  renderLoading();

  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const cellphones = Array.isArray(data) ? data : (data.results || []);
    renderCellphones(cellphones);
  } catch (error) {
    console.error('Error searching cellphones:', error);
    renderError('Failed to search cellphones. Please try again.');
  }
}

// Card flip toggle handler
function toggleCard(cardElement) {
  cardElement.classList.toggle('flipped');
}

// Helper: Render loading state
function renderLoading() {
  if (container) {
    container.innerHTML = `<p class="loading">Loading cellphones...</p>`;
  }
}

// Helper: Render error message
function renderError(message) {
  if (container) {
    container.innerHTML = `<p class="error">${message}</p>`;
  }
}

// Helper: Render 3D flip cards
function renderCellphones(cellphones) {
  if (!container) return;

  if (!cellphones || cellphones.length === 0) {
    container.innerHTML = `<p class="no-results">No cellphones found.</p>`;
    return;
  }

  container.innerHTML = cellphones.map(phone => {
    // Resolve relative backend image path for local vs production
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const imageSrc = phone.image && phone.image.startsWith('http')
      ? phone.image
      : isLocal
        ? `http://127.0.0.1:8000${phone.image}`
        : phone.image;

    return `
      <div class="card-container" onclick="toggleCard(this)">
        <div class="card-inner">
          <!-- FRONT FACE -->
          <div class="card-front">
            <span class="brand-badge">${phone.brand || ''}</span>
            <img src="${imageSrc}" alt="${phone.name || 'Cellphone'}" onerror="this.src='https://placehold.co/300x400/0f172a/38bdf8?text=No+Image';">
            <div class="title-container">
              <h3>${phone.name || ''}</h3>
              <div class="action-tag">Click to view specs →</div>
            </div>
          </div>

          <!-- BACK FACE -->
          <div class="card-back">
            <div class="back-header">
              <h4>${phone.name || ''}</h4>
              <span class="price-tag">${phone.price || 'N/A'}</span>
            </div>

            <div class="specs-scroll">
              <div class="spec-item"><span class="spec-label">Model No.</span><span class="spec-value">${phone.model_number || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Release Year</span><span class="spec-value">${phone.release_year || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Display</span><span class="spec-value">${phone.display || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Chipset</span><span class="spec-value">${phone.chipset || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">RAM / Storage</span><span class="spec-value">${phone.ram || 'N/A'} / ${phone.storage || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Battery</span><span class="spec-value">${phone.battery || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">OS</span><span class="spec-value">${phone.os || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Weight</span><span class="spec-value">${phone.weight || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Camera</span><span class="spec-value">${phone.camera_setup || 'N/A'}</span></div>
              <div class="spec-item"><span class="spec-label">Overview</span><span class="spec-value">${phone.description || ''}</span></div>
            </div>

            <div class="flip-back-hint">← Click to flip back</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}