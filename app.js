const API_KEY = 'student-api-key-123';
const BASE_URL = 'http://127.0.0.1:8000/api/v1/cellphones';
const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000';

let globalPhonesCache = [];

// Session State Management
let authState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  username: localStorage.getItem('username') || 'Guest'
};

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  updateUserUI();
  
  if (!authState.isLoggedIn && !sessionStorage.getItem('guestMode')) {
    openLoginModal();
  } else {
    closeLoginModal();
    getAllCellphones();
  }
}

// ================= AUTHENTICATION & MODAL LOGIC =================
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
}

function handleLogin(event) {
  event.preventDefault();
  const user = document.getElementById('usernameInput').value.trim() || 'Student';
  
  authState.isLoggedIn = true;
  authState.username = user;
  
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', user);
  sessionStorage.removeItem('guestMode');
  
  closeLoginModal();
  updateUserUI();
  getAllCellphones();
}

function enterGuestMode() {
  authState.isLoggedIn = false;
  authState.username = 'Guest';
  
  localStorage.setItem('isLoggedIn', 'false');
  localStorage.removeItem('username');
  sessionStorage.setItem('guestMode', 'true');
  
  closeLoginModal();
  updateUserUI();
  getAllCellphones();
}

function handleLogout() {
  authState.isLoggedIn = false;
  authState.username = 'Guest';
  
  localStorage.clear();
  sessionStorage.clear();
  
  updateUserUI();
  openLoginModal();
}

function updateUserUI() {
  const container = document.getElementById('userStatusContainer');
  const guestBanner = document.getElementById('guestBanner');
  
  if (container) {
    if (authState.isLoggedIn) {
      container.innerHTML = `
        <span class="user-badge logged-in">👤 ${authState.username}</span>
        <button class="auth-btn logout" onclick="handleLogout()">Sign Out</button>
      `;
    } else {
      container.innerHTML = `
        <span class="user-badge guest">🔒 Guest Mode</span>
        <button class="auth-btn login" onclick="openLoginModal()">Sign In</button>
      `;
    }
  }

  if (guestBanner) {
    guestBanner.style.display = authState.isLoggedIn ? 'none' : 'flex';
  }
}

// ================= NAVIGATION & TABS =================
function switchTab(tabId, btnElement) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  btnElement.classList.add('active');

  const catalogView = document.getElementById('catalogView');
  const compareView = document.getElementById('compareView');
  const budgetView = document.getElementById('budgetView');

  const compareLock = document.getElementById('compareLockOverlay');
  const compareContent = document.getElementById('compareContent');
  const budgetLock = document.getElementById('budgetLockOverlay');
  const budgetContent = document.getElementById('budgetContent');

  if (tabId === 'catalog') {
    catalogView.classList.add('active');
  } else if (tabId === 'compare') {
    compareView.classList.add('active');
    if (!authState.isLoggedIn) {
      if (compareLock) compareLock.style.display = 'flex';
      if (compareContent) compareContent.style.display = 'none';
    } else {
      if (compareLock) compareLock.style.display = 'none';
      if (compareContent) compareContent.style.display = 'block';
      populateDropdowns();
    }
  } else if (tabId === 'budget') {
    budgetView.classList.add('active');
    if (!authState.isLoggedIn) {
      if (budgetLock) budgetLock.style.display = 'flex';
      if (budgetContent) budgetContent.style.display = 'none';
    } else {
      if (budgetLock) budgetLock.style.display = 'none';
      if (budgetContent) budgetContent.style.display = 'block';
    }
  }
}

// ================= CATALOG & API FETCHING =================
async function getAllCellphones() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  renderLoading();

  // In Guest Mode, append ?limit=4 parameter to retrieve restricted set
  const fetchUrl = authState.isLoggedIn ? BASE_URL : `${BASE_URL}?limit=4`;

  try {
    const res = await fetch(fetchUrl, { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    globalPhonesCache = Array.isArray(data) ? data : (data.cellphones || []);
    renderCellphones(globalPhonesCache);
  } catch (err) {
    renderError('Failed to fetch data from API.');
  }
}

async function searchCellphones() {
  const searchInput = document.getElementById('searchInput');
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

function getImageUrl(imgPath) {
  if (!imgPath) return 'https://placehold.co/300x400/0f172a/38bdf8?text=No+Image';
  if (imgPath.startsWith('http')) return imgPath;
  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
  return isLocal ? `${LOCAL_BACKEND_URL}${imgPath}` : imgPath;
}

function toggleCard(cardElement) { cardElement.classList.toggle('flipped'); }
function renderLoading() { 
  const container = document.getElementById('cellphonesList');
  if (container) container.innerHTML = `<p class="loading">Loading cellphones...</p>`; 
}
function renderError(msg) { 
  const container = document.getElementById('cellphonesList');
  if (container) container.innerHTML = `<p class="error">${msg}</p>`; 
}

function renderCellphones(phones) {
  const container = document.getElementById('cellphonesList');
  if (!container) return;
  if (!phones.length) { container.innerHTML = `<p class="no-results">No cellphones found.</p>`; return; }

  container.innerHTML = phones.map(p => {
    const img = getImageUrl(p.image);
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

// ================= COMPARISON TOOL =================
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
      <img src="${getImageUrl(p.image)}" alt="${p.name}" class="compare-img" onerror="this.src='https://placehold.co/150x200/0f172a/38bdf8?text=No+Image';">
      <h3>${p.name}</h3>
      <p class="compare-price">${p.price}</p>
      <div class="spec-item"><span class="spec-label">Brand</span><span class="spec-value">${p.brand}</span></div>
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
      <div class="spec-item"><span class="spec-label">Water Res.</span><span class="spec-value">${p.water_resistance}</span></div>
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

// ================= BUDGET RECOMMENDER =================
function parseNum(val) { return parseFloat(String(val).replace(/[^\d.]/g, '')) || 0; }

function calculateRecommendation() {
  const budgetVal = document.getElementById('maxBudgetInput').value;
  const priority = document.getElementById('prioritySelect').value;
  const resDiv = document.getElementById('budgetResult');

  if (!budgetVal || isNaN(budgetVal)) { 
    resDiv.innerHTML = `<p class="error" style="color:#f87171;">Please enter a valid numeric budget.</p>`; 
    return; 
  }
  const maxBudget = parseFloat(budgetVal);

  const affordable = globalPhonesCache.filter(p => parseNum(p.price) <= maxBudget);
  if (!affordable.length) { 
    resDiv.innerHTML = `<p class="no-results">No smartphones found within ₱${maxBudget.toLocaleString()}. Try increasing your budget.</p>`; 
    return; 
  }

  let best = affordable[0];
  let reason = "Optimal balance fitting your price range.";

  affordable.forEach(p => {
    if (priority === 'battery') {
      if (parseNum(p.battery) > parseNum(best.battery)) {
        best = p; reason = `Highest battery capacity (${p.battery}) in your budget.`;
      }
    } else if (priority === 'storage') {
      const pStor = p.storage.includes('TB') ? parseNum(p.storage) * 1024 : parseNum(p.storage);
      const bStor = best.storage.includes('TB') ? parseNum(best.storage) * 1024 : parseNum(best.storage);
      if (pStor > bStor) {
        best = p; reason = `Largest internal storage (${p.storage}).`;
      }
    } else if (priority === 'ram') {
      if (parseNum(p.ram) > parseNum(best.ram)) {
        best = p; reason = `Highest memory for multitasking (${p.ram}).`;
      }
    } else if (priority === 'camera') {
      const pCam = Math.max(...(p.camera_setup.match(/\d+/g) || [0]).map(Number));
      const bCam = Math.max(...(best.camera_setup.match(/\d+/g) || [0]).map(Number));
      if (pCam > bCam) {
        best = p; reason = `Superior primary camera sensor resolution (${pCam} MP).`;
      }
    } else if (priority === 'refresh_rate') {
      if (parseNum(p.refresh_rate) > parseNum(best.refresh_rate)) {
        best = p; reason = `Smoothest display refresh rate (${p.refresh_rate}).`;
      }
    } else if (priority === 'water_resistance') {
      if (p.water_resistance.includes('IP68') && !best.water_resistance.includes('IP68')) {
        best = p; reason = `Highest IP68 dust and water resistance protection.`;
      }
    } else if (priority === 'charging_speed') {
      const pW = parseNum((p.charging_speed.match(/(\d+)W/) || [0,0])[1]);
      const bW = parseNum((best.charging_speed.match(/(\d+)W/) || [0,0])[1]);
      if (pW > bW) {
        best = p; reason = `Fastest charging speed capability (${pW}W).`;
      }
    } else if (priority === 'release_year') {
      if (p.release_year > best.release_year) {
        best = p; reason = `Latest release model year (${p.release_year}).`;
      }
    } else {
      // 'overall': Maximize RAM + Battery combination
      const pScore = parseNum(p.ram) + (parseNum(p.battery) / 500);
      const bScore = parseNum(best.ram) + (parseNum(best.battery) / 500);
      if (pScore > bScore) {
        best = p; reason = `Top overall spec package (${p.ram} RAM + ${p.battery} battery).`;
      }
    }
  });

  const img = getImageUrl(best.image);

  resDiv.innerHTML = `
    <div class="recommendation-card">
      <div class="rec-badge">Best Recommendation Match</div>
      <div class="rec-content">
        <img src="${img}" alt="${best.name}" onerror="this.src='https://placehold.co/200x250/0f172a/38bdf8?text=No+Image';">
        <div class="rec-details">
          <h3>${best.name}</h3>
          <p class="rec-price">Price: <span>${best.price}</span></p>
          <p class="rec-reason"><strong>Match Reason:</strong> ${reason}</p>
          <div class="spec-grid-mini">
            <div class="spec-item"><span class="spec-label">Chipset</span><span class="spec-value">${best.chipset}</span></div>
            <div class="spec-item"><span class="spec-label">RAM / Storage</span><span class="spec-value">${best.ram} / ${best.storage}</span></div>
            <div class="spec-item"><span class="spec-label">Battery</span><span class="spec-value">${best.battery}</span></div>
            <div class="spec-item"><span class="spec-label">Display</span><span class="spec-value">${best.display}</span></div>
          </div>
        </div>
      </div>
    </div>`;
}