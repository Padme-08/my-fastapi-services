const API_KEY = 'student-api-key-123'
const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000'
const BASE_URL = isLocal ? `${LOCAL_BACKEND_URL}/api/v1/cellphones` : '/api/v1/cellphones'

let globalPhonesCache = []

let authState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  username: localStorage.getItem('username') || 'Guest'
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput')
  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        searchCellphones()
      }
    })
  }

  initApp()
})

function initApp() {
  updateUserUI()

  if (!authState.isLoggedIn && !sessionStorage.getItem('guestMode')) {
    openLoginModal()
  } else {
    closeLoginModal()
    getAllCellphones()
  }
}

function openLoginModal() {
  closeGuestLockModal()
  const modal = document.getElementById('loginModal')
  const appContainer = document.getElementById('appContainer')
  if (modal) modal.style.display = 'grid'
  if (appContainer) appContainer.style.display = 'none'
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal')
  const appContainer = document.getElementById('appContainer')
  if (modal) modal.style.display = 'none'
  if (appContainer) appContainer.style.display = 'block'
}

function handleLogin(event) {
  event.preventDefault()
  const user = document.getElementById('usernameInput').value.trim() || 'Student'

  authState.isLoggedIn = true
  authState.username = user

  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('username', user)
  sessionStorage.removeItem('guestMode')

  closeLoginModal()
  updateUserUI()
  getAllCellphones()
}

function enterGuestMode() {
  authState.isLoggedIn = false
  authState.username = 'Guest'

  localStorage.setItem('isLoggedIn', 'false')
  localStorage.removeItem('username')
  sessionStorage.setItem('guestMode', 'true')

  closeLoginModal()
  switchTab('catalog', document.getElementById('tabCatalog'))
  updateUserUI()
  getAllCellphones()
}

function handleLogout() {
  authState.isLoggedIn = false
  authState.username = 'Guest'

  localStorage.clear()
  sessionStorage.clear()

  switchTab('catalog', document.getElementById('tabCatalog'))
  updateUserUI()
  openLoginModal()
}

function updateUserUI() {
  const container = document.getElementById('userStatusContainer')
  const guestBanner = document.getElementById('guestBanner')

  if (container) {
    if (authState.isLoggedIn) {
      container.innerHTML = `
        <span class="user-badge logged-in">👤 ${authState.username}</span>
        <button type="button" class="auth-btn logout" onclick="handleLogout()">Sign Out</button>
      `
    } else {
      container.innerHTML = `
        <span class="user-badge guest">🔒 Guest Mode</span>
        <button type="button" class="auth-btn login" onclick="openLoginModal()">Sign In</button>
      `
    }
  }

  if (guestBanner) {
    guestBanner.style.display = authState.isLoggedIn ? 'none' : 'flex'
  }
}

function openGuestLockModal(feature) {
  const modal = document.getElementById('guestLockModal')
  const title = document.getElementById('lockModalTitle')
  const message = document.getElementById('lockModalMessage')

  let featureName = 'Smart Budget Recommender'
  if (feature === 'compare') featureName = 'Side-by-Side Comparison'
  if (feature === 'search') featureName = 'Catalog Search'

  if (title) title.textContent = `${featureName} Locked`
  if (message) {
    message.textContent = `You are currently browsing in Guest Mode (4 sample phones). Please sign in first to unlock ${featureName} and the full 20+ device catalog.`
  }
  if (modal) modal.style.display = 'flex'
}

function closeGuestLockModal() {
  const modal = document.getElementById('guestLockModal')
  if (modal) modal.style.display = 'none'
}

function handleLockBackdropClick(event) {
  if (event.target && event.target.id === 'guestLockModal') {
    closeGuestLockModal()
  }
}

function proceedToLoginFromLock() {
  closeGuestLockModal()
  openLoginModal()
}

function switchTab(tabId, btnElement) {
  if (!authState.isLoggedIn && (tabId === 'compare' || tabId === 'budget')) {
    openGuestLockModal(tabId)
    return
  }

  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'))
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'))

  if (btnElement) btnElement.classList.add('active')

  if (tabId === 'catalog') {
    document.getElementById('catalogView').classList.add('active')
  } else if (tabId === 'compare') {
    document.getElementById('compareView').classList.add('active')
    populateDropdowns()
  } else if (tabId === 'budget') {
    document.getElementById('budgetView').classList.add('active')
  }
}

async function getAllCellphones() {
  const searchInput = document.getElementById('searchInput')
  if (searchInput) searchInput.value = ''
  renderLoading()

  try {
    const res = await fetch(BASE_URL, {
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
    const data = await res.json()
    const allRecords = Array.isArray(data) ? data : (data.cellphones || [])

    globalPhonesCache = authState.isLoggedIn ? allRecords : allRecords.slice(0, 4)
    renderCellphones(globalPhonesCache)
  } catch (err) {
    renderError('Failed to fetch data from API.')
  }
}

async function searchCellphones() {
  if (!authState.isLoggedIn) {
    openGuestLockModal('search')
    return
  }

  const searchInput = document.getElementById('searchInput')
  const query = searchInput ? searchInput.value.trim() : ''
  if (!query) {
    getAllCellphones()
    return
  }
  renderLoading()
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
    const data = await res.json()
    const results = Array.isArray(data) ? data : (data.results || [])
    renderCellphones(results)
  } catch (err) {
    renderError('Search failed.')
  }
}

function getImageUrl(imgPath) {
  if (!imgPath) return 'https://placehold.co/300x400/0f172a/38bdf8?text=No+Image'
  if (imgPath.startsWith('http')) return imgPath
  return isLocal ? `${LOCAL_BACKEND_URL}${imgPath}` : imgPath
}

function toggleCard(cardElement) {
  cardElement.classList.toggle('flipped')
}

function renderLoading() {
  const container = document.getElementById('cellphonesList')
  if (container) container.innerHTML = `<p class="loading">Loading cellphones...</p>`
}

function renderError(msg) {
  const container = document.getElementById('cellphonesList')
  if (container) container.innerHTML = `<p class="error">${msg}</p>`
}

function buildAllSpecsHtml(p) {
  return `
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
  `
}

function renderCellphones(phones) {
  const container = document.getElementById('cellphonesList')
  if (!container) return
  if (!phones.length) {
    container.innerHTML = `<p class="no-results">No cellphones found.</p>`
    return
  }

  container.innerHTML = phones.map(p => {
    const img = getImageUrl(p.image)
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
              ${buildAllSpecsHtml(p)}
            </div>
            <div class="flip-back-hint">← Click to flip back</div>
          </div>
        </div>
      </div>`
  }).join('')
}

function populateDropdowns() {
  const selA = document.getElementById('phoneASelect')
  const selB = document.getElementById('phoneBSelect')
  if (!selA || !selB) return
  const opts = `<option value="">Select device...</option>` +
    globalPhonesCache.map((p, i) => `<option value="${i}">${p.name} (${p.price})</option>`).join('')
  selA.innerHTML = opts
  selB.innerHTML = opts
}

function updateComparison() {
  const idxA = document.getElementById('phoneASelect').value
  const idxB = document.getElementById('phoneBSelect').value
  const resDiv = document.getElementById('comparisonResult')
  if (idxA === '' || idxB === '') {
    resDiv.innerHTML = `<p class="no-results">Select two devices above to compare.</p>`
    return
  }

  const pA = globalPhonesCache[idxA]
  const pB = globalPhonesCache[idxB]

  const buildCol = (p) => `
    <div class="compare-column">
      <img src="${getImageUrl(p.image)}" alt="${p.name}" class="compare-img" onerror="this.src='https://placehold.co/150x200/0f172a/38bdf8?text=No+Image';">
      <h3>${p.name}</h3>
      <p class="compare-price">${p.price}</p>
      ${buildAllSpecsHtml(p)}
    </div>`

  resDiv.innerHTML = `<div class="comparison-grid">${buildCol(pA)}${buildCol(pB)}</div>`
}

function parseNum(val) {
  return parseFloat(String(val || '0').replace(/[^\d.]/g, '')) || 0
}

function parseStorageGb(storageStr) {
  const s = String(storageStr || '')
  const nums = (s.match(/[\d.]+/g) || [0]).map(Number)
  const maxVal = Math.max(...nums)
  return s.toUpperCase().includes('TB') ? maxVal * 1024 : maxVal
}

function parseRamGb(ramStr) {
  const nums = (String(ramStr || '').match(/[\d.]+/g) || [0]).map(Number)
  return Math.max(...nums)
}

function parseCameraMp(camStr) {
  const nums = (String(camStr || '').match(/\d+/g) || [0]).map(Number)
  return Math.max(...nums)
}

function parseChargingWatts(chargeStr) {
  const matches = [...String(chargeStr || '').matchAll(/(\d+)\s*W/gi)].map(m => Number(m[1]))
  return matches.length ? Math.max(...matches) : 0
}

function parseWaterScore(waterStr) {
  const w = String(waterStr || '').toUpperCase()
  if (w.includes('IP69')) return 4
  if (w.includes('IP68')) return 3
  if (w.includes('IP67')) return 2
  if (w.includes('IP65') || w.includes('IP54') || w.includes('IP53')) return 1
  return 0
}

function evaluatePhoneMetrics(p, priority) {
  const ram = parseRamGb(p.ram)
  const storage = parseStorageGb(p.storage)
  const battery = parseNum(p.battery)
  const charging = parseChargingWatts(p.charging_speed)
  const camera = parseCameraMp(p.camera_setup)
  const refresh = parseNum(p.refresh_rate)
  const water = parseWaterScore(p.water_resistance)
  const year = Number(p.release_year) || 2020
  const weight = parseNum(p.weight) || 200
  const expandable = String(p.expandable_storage || '').toLowerCase().startsWith('yes') ? 1 : 0

  const baseOverallScore =
    ram * 4 +
    (storage / 64) * 3 +
    (battery / 500) * 3 +
    (charging / 15) * 2 +
    (camera / 12) * 2 +
    (refresh / 30) * 2 +
    water * 4 +
    (year - 2020) * 3 +
    expandable * 2 -
    (weight / 100)

  let score = baseOverallScore
  let reason = `Balanced 20-spec score: ${p.ram} RAM, ${p.storage} storage, ${p.chipset}, ${p.battery} battery (${p.charging_speed}), and ${p.camera_setup}.`

  if (priority === 'battery') {
    score = battery * 10 + charging + baseOverallScore
    reason = `Battery & endurance match: ${p.battery} capacity with ${p.charging_speed}, powered by ${p.chipset}.`
  } else if (priority === 'charging_speed') {
    score = charging * 50 + battery * 0.1 + baseOverallScore
    reason = `Charging speed match: ${p.charging_speed} paired with a ${p.battery} battery.`
  } else if (priority === 'ram') {
    score = ram * 100 + storage * 0.5 + baseOverallScore
    reason = `Memory & multitasking match: ${p.ram} RAM, ${p.storage} storage, and ${p.chipset} (${p.gpu}).`
  } else if (priority === 'storage') {
    score = storage * 10 + expandable * 200 + baseOverallScore
    reason = `Storage capacity match: ${p.storage} internal storage (Expandable: ${p.expandable_storage}).`
  } else if (priority === 'camera') {
    score = camera * 25 + baseOverallScore
    reason = `Camera system match: ${p.camera_setup} with ${p.display}.`
  } else if (priority === 'refresh_rate') {
    score = refresh * 25 + baseOverallScore
    reason = `Display smoothness match: ${p.refresh_rate} on ${p.display}.`
  } else if (priority === 'water_resistance') {
    score = water * 500 + baseOverallScore
    reason = `Durability match: ${p.water_resistance} rating with ${p.build_material}.`
  } else if (priority === 'release_year') {
    score = year * 500 + baseOverallScore
    reason = `Latest model release (${p.release_year}) running ${p.os} on ${p.chipset}.`
  } else if (priority === 'weight') {
    score = (400 - weight) * 20 + baseOverallScore
    reason = `Lightweight ergonomics match: ${p.weight} (${p.build_material}) with ${p.display}.`
  }

  return { phone: p, score, reason }
}

function calculateRecommendation() {
  const budgetVal = document.getElementById('maxBudgetInput').value
  const priority = document.getElementById('prioritySelect').value
  const resDiv = document.getElementById('budgetResult')

  if (!budgetVal || isNaN(budgetVal) || Number(budgetVal) <= 0) {
    resDiv.innerHTML = `<p class="error" style="color:#f87171;">Please enter a valid numeric budget.</p>`
    return
  }

  const maxBudget = parseFloat(budgetVal)
  const affordable = globalPhonesCache.filter(p => parseNum(p.price) <= maxBudget)

  if (!affordable.length) {
    resDiv.innerHTML = `<p class="no-results">No smartphones found within ₱${maxBudget.toLocaleString()}. Try increasing your budget.</p>`
    return
  }

  const rankedMatches = affordable
    .map(p => evaluatePhoneMetrics(p, priority))
    .sort((a, b) => b.score - a.score)

  const cardsHtml = rankedMatches.map((item, idx) => {
    const p = item.phone
    const img = getImageUrl(p.image)
    const isTop = idx === 0
    const badgeLabel = isTop ? `#1 Best Match in Budget` : `#${idx + 1} Recommended Option`

    return `
      <div class="recommendation-card ${isTop ? 'top-match' : ''}">
        <div class="rec-badge">${badgeLabel}</div>
        <div class="rec-content">
          <div class="rec-media">
            <img src="${img}" alt="${p.name}" onerror="this.src='https://placehold.co/200x250/0f172a/38bdf8?text=No+Image';">
            <span class="brand-badge">${p.brand}</span>
          </div>
          <div class="rec-details">
            <h3>${p.name}</h3>
            <p class="rec-price">Price: <span>${p.price}</span> · Remaining Budget: <span>₱${(maxBudget - parseNum(p.price)).toLocaleString()}</span></p>
            <p class="rec-reason"><strong>All-Spec Evaluation:</strong> ${item.reason}</p>
            <div class="spec-grid-full">
              ${buildAllSpecsHtml(p)}
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')

  resDiv.innerHTML = `
    <div class="budget-summary-bar">
      <span>Found <strong>${rankedMatches.length}</strong> smartphone${rankedMatches.length === 1 ? '' : 's'} within <strong>₱${maxBudget.toLocaleString()}</strong></span>
      <span>Evaluated across all 20 specifications</span>
    </div>
    <div class="budget-results-list">${cardsHtml}</div>
  `
}