const API_KEY = 'student-api-key-123';
const BASE_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
  ? 'http://127.0.0.1:8000/api/v1/cellphones'
  : '/api/v1/cellphones';

let globalPhonesCache = [];
const searchInput = document.getElementById('searchInput');
const container = document.getElementById('cellphonesList');

document.addEventListener('DOMContentLoaded', () => getAllCellphones());

if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCellphones();
  });
}

// ================= MODULE 1: NAVIGATION & TABS =================
function switchTab(tabId, btnElement) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  if (tabId === 'catalog') document.getElementById('catalogView').classList.add('active');
  else if (tabId === 'compare') {
    document.getElementById('compareView').classList.add('active');
    populateDropdowns();
  } else if (tabId === 'budget') document.getElementById('budgetView').classList.add('active');
  
  btnElement.classList.add('active');
}

// ================= MODULE 2: CATALOG & API FETCHING =================
async function getAllCellphones() {
  if (searchInput) searchInput.value = '';
  renderLoading();
  try {
    const res = await fetch(BASE_URL, { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    globalPhonesCache = Array.isArray(data) ? data : (data.cellphones || []);
    renderCellphones(globalPhonesCache);
  } catch (err) {
    renderError('Failed to fetch data from API.');
  }
}

async function searchCellphones() {
  const query = searchInput ? searchInput.value.trim() : '';
  if (!query) { getAllCellphones(); return; }
  renderLoading();
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    renderCellphones(Array.isArray(data) ? data : (data.results || []));
  } catch (err) {
    renderError('Search failed.');
  }
}

function toggleCard(cardElement) { cardElement.classList.toggle('flipped'); }
function renderLoading() { if (container) container.innerHTML = `<p class="loading">Loading cellphones...</p>`; }
function renderError(msg) { if (container) container.innerHTML = `<p class="error">${msg}</p>`; }

function renderCellphones(phones) {
  if (!container) return;
  if (!phones.length) { container.innerHTML = `<p class="no-results">No cellphones found.</p>`; return; }

  container.innerHTML = phones.map(p => {
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const img = p.image?.startsWith('http') ? p.image : (isLocal ? `http://127.0.0.1:8000${p.image}` : p.image);
    return `
      <div class="card-container" onclick="toggleCard(this)">
        <div class="card-inner">
          <div class="card-front">
            <span class="brand-badge">${p.brand || ''}</span>
            <img src="${img}" alt="${p.name}" onerror="this.src='https://placehold.co/300x400/0f172a/38bdf8?text=No+Image';">
            <div class="title-container">
              <h3>${p.name || ''}</h3>
              <div class="action-tag">Click to view all 20 specs →</div>
            </div>
          </div>
          <div class="card-back">
            <div class="back-header">
              <h4>${p.name || ''}</h4>
              <span class="price-tag">${p.price || 'N/A'}</span>
            </div>
            <div class="specs-scroll">
              <div class="spec-item"><span class="spec-label">Model No.</span><span class="spec-value">${p.model_number}</span></div>
              <div class="spec-item"><span class="spec-label">Year</span><span class="spec-value">${p.release_year}</span></div>
              <div class="spec-item"><span class="spec-label">Display</span><span class="spec-value">${p.display}</span></div>
              <div class="spec-item"><span class="spec-label">Refresh Rate</span><span class="spec-value">${p.refresh_rate}</span></div>
              <div class="spec-item"><span class="spec-label">Chipset</span><span class="spec-value">${p.chipset}</span></div>
              <div class="spec-item"><span class="spec-label">GPU</span><span class="spec-value">${p.gpu}</span></div>
              <div class="spec-item"><span class="spec-label">RAM</span><span class="spec-value">${p.ram}</span></div>
              <div class="spec-item"><span class="spec-label">Storage</span><span class="spec-value">${p.storage}</span></div>
              <div class="spec-item"><span class="spec-label">Battery</span><span class="spec-value">${p.battery}</span></div>
              <div class="spec-item"><span class="spec-label">Charging</span><span class="spec-value">${p.charging_speed}</span></div>
              <div class="spec-item"><span class="spec-label">Camera</span><span class="spec-value">${p.camera_setup}</span></div>
              <div class="spec-item"><span class="spec-label">OS</span><span class="spec-value">${p.os}</span></div>
              <div class="spec-item"><span class="spec-label">Water Resistance</span><span class="spec-value">${p.water_resistance}</span></div>
              <div class="spec-item"><span class="spec-label">Audio</span><span class="spec-value">${p.audio_speakers}</span></div>
              <div class="spec-item"><span class="spec-label">Biometrics</span><span class="spec-value">${p.biometrics}</span></div>
              <div class="spec-item"><span class="spec-label">Connectivity</span><span class="spec-value">${p.connectivity}</span></div>
              <div class="spec-item"><span class="spec-label">Build</span><span class="spec-value">${p.build_material}</span></div>
              <div class="spec-item"><span class="spec-label">SIM</span><span class="spec-value">${p.sim_support}</span></div>
              <div class="spec-item"><span class="spec-label">Expandable</span><span class="spec-value">${p.expandable_storage}</span></div>
              <div class="spec-item"><span class="spec-label">Weight</span><span class="spec-value">${p.weight}</span></div>
            </div>
            <div class="flip-back-hint">← Click to flip back</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ================= MODULE 3: COMPARISON TOOL =================
function populateDropdowns() {
  const selA = document.getElementById('phoneASelect');
  const selB = document.getElementById('phoneBSelect');
  if (!selA || !selB) return;
  const opts = `<option value="">Select device...</option>` + globalPhonesCache.map((p, i) => `<option value="${i}">${p.name} (${p.price})</option>`).join('');
  selA.innerHTML = opts;
  selB.innerHTML = opts;
}

function updateComparison() {
  const idxA = document.getElementById('phoneASelect').value;
  const idxB = document.getElementById('phoneBSelect').value;
  const resDiv = document.getElementById('comparisonResult');
  if (idxA === "" || idxB === "") { resDiv.innerHTML = `<p class="no-results">Select two devices above to compare.</p>`; return; }

  const pA = globalPhonesCache[idxA], pB = globalPhonesCache[idxB];
  const buildCol = (p) => `
    <div class="compare-column">
      <h3>${p.name}</h3>
      <p class="compare-price">${p.price}</p>
      <div class="spec-item"><span class="spec-label">Model No.</span><span class="spec-value">${p.model_number}</span></div>
      <div class="spec-item"><span class="spec-label">Year</span><span class="spec-value">${p.release_year}</span></div>
      <div class="spec-item"><span class="spec-label">Display</span><span class="spec-value">${p.display}</span></div>
      <div class="spec-item"><span class="spec-label">Refresh Rate</span><span class="spec-value">${p.refresh_rate}</span></div>
      <div class="spec-item"><span class="spec-label">Chipset</span><span class="spec-value">${p.chipset}</span></div>
      <div class="spec-item"><span class="spec-label">GPU</span><span class="spec-value">${p.gpu}</span></div>
      <div class="spec-item"><span class="spec-label">RAM</span><span class="spec-value">${p.ram}</span></div>
      <div class="spec-item"><span class="spec-label">Storage</span><span class="spec-value">${p.storage}</span></div>
      <div class="spec-item"><span class="spec-label">Battery</span><span class="spec-value">${p.battery}</span></div>
      <div class="spec-item"><span class="spec-label">Charging</span><span class="spec-value">${p.charging_speed}</span></div>
      <div class="spec-item"><span class="spec-label">Camera</span><span class="spec-value">${p.camera_setup}</span></div>
      <div class="spec-item"><span class="spec-label">OS</span><span class="spec-value">${p.os}</span></div>
      <div class="spec-item"><span class="spec-label">Water Resistance</span><span class="spec-value">${p.water_resistance}</span></div>
      <div class="spec-item"><span class="spec-label">Audio</span><span class="spec-value">${p.audio_speakers}</span></div>
      <div class="spec-item"><span class="spec-label">Biometrics</span><span class="spec-value">${p.biometrics}</span></div>
      <div class="spec-item"><span class="spec-label">Connectivity</span><span class="spec-value">${p.connectivity}</span></div>
      <div class="spec-item"><span class="spec-label">Build</span><span class="spec-value">${p.build_material}</span></div>
      <div class="spec-item"><span class="spec-label">SIM</span><span class="spec-value">${p.sim_support}</span></div>
      <div class="spec-item"><span class="spec-label">Expandable</span><span class="spec-value">${p.expandable_storage}</span></div>
      <div class="spec-item"><span class="spec-label">Weight</span><span class="spec-value">${p.weight}</span></div>
    </div>`;

  resDiv.innerHTML = `<div class="comparison-grid">${buildCol(pA)}${buildCol(pB)}</div>`;
}

// ================= MODULE 4: BUDGET RECOMMENDER =================
function calculateRecommendation() {
  const budgetVal = document.getElementById('maxBudgetInput').value;
  const priority = document.getElementById('prioritySelect').value;
  const resDiv = document.getElementById('budgetResult');

  if (!budgetVal || isNaN(budgetVal)) { resDiv.innerHTML = `<p class="error" style="color:#f87171;">Enter a valid budget.</p>`; return; }
  const maxBudget = parseFloat(budgetVal);

  const affordable = globalPhonesCache.filter(p => parseFloat(p.price.replace(/[₱,]/g, '')) <= maxBudget);
  if (!affordable.length) { resDiv.innerHTML = `<p class="no-results">No devices found within ₱${maxBudget.toLocaleString()}.</p>`; return; }

  let best = affordable[0], reason = "Fits your budget cleanly.";
  affordable.forEach(p => {
    if (priority === 'battery' && parseInt(p.battery) > parseInt(best.battery)) { best = p; reason = `High battery (${p.battery}).`; }
    else if (priority === 'storage' && parseInt(p.storage) > parseInt(best.storage)) { best = p; reason = `Large storage (${p.storage}).`; }
    else if (priority === 'ram' && parseInt(p.ram) > parseInt(best.ram)) { best = p; reason = `High RAM (${p.ram}).`; }
    else if (priority === 'camera' && (p.camera_setup.includes('200 MP') || p.camera_setup.includes('50 MP'))) { best = p; reason = `Advanced cameras.`; }
    else if (priority === 'refresh_rate' && p.refresh_rate.includes('Hz')) { best = p; reason = `Smooth display (${p.refresh_rate}).`; }
    else if (priority === 'water_resistance' && p.water_resistance.includes('IP68')) { best = p; reason = `Waterproof rating (${p.water_resistance}).`; }
    else if (priority === 'charging_speed' && (p.charging_speed.includes('100W') || p.charging_speed.includes('120W'))) { best = p; reason = `Fast charging (${p.charging_speed}).`; }
  });

  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
  const img = best.image?.startsWith('http') ? best.image : (isLocal ? `http://127.0.0.1:8000${best.image}` : best.image);

  resDiv.innerHTML = `
    <div class="recommendation-card">
      <div class="rec-badge">Recommended Match</div>
      <div class="rec-content">
        <img src="${img}" alt="${best.name}" onerror="this.src='https://placehold.co/200x250/0f172a/38bdf8?text=No+Image';">
        <div class="rec-details">
          <h3>${best.name}</h3>
          <p class="rec-price">Price: <span>${best.price}</span></p>
          <p class="rec-reason"><strong>Why:</strong> ${reason}</p>
          <div class="spec-item"><span class="spec-label">Chipset</span><span class="spec-value">${best.chipset}</span></div>
          <div class="spec-item"><span class="spec-label">RAM / Storage</span><span class="spec-value">${best.ram} / ${best.storage}</span></div>
        </div>
      </div>
    </div>`;
}