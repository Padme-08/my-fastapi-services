const API_KEY = 'student-api-key-123';
const BASE_URL = '/api/v1/cellphones';

// Get DOM Elements matching index.html IDs
const searchInput = document.getElementById('searchInput');
const container = document.getElementById('cellphonesList');

// Fetch and render all cellphones when page loads
document.addEventListener('DOMContentLoaded', () => {
  getAllCellphones();
});

// Add Enter key listener for the search input
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCellphones();
  });
}

// Fetch all cellphones from API (called by "Show All" button)
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
    
    // Safely extract array whether backend returns [...] or {"cellphones": [...]}
    const cellphones = Array.isArray(data) ? data : (data.cellphones || []);
    renderCellphones(cellphones);
  } catch (error) {
    console.error('Error fetching cellphones:', error);
    renderError('Failed to fetch data from API. Please check your backend.');
  }
}

// Search cellphones from API (called by "Search" button)
async function searchCellphones() {
  const query = searchInput ? searchInput.value.trim() : '';
  if (!query) {
    getAllCellphones();
    return;
  }

  renderLoading();

  try {
    const response = await fetch(`\({BASE_URL}/search?q=\){encodeURIComponent(query)}`, {
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

    // Safely extract array whether backend returns [...] or {"results": [...]}
    const cellphones = Array.isArray(data) ? data : (data.results || []);
    renderCellphones(cellphones);
  } catch (error) {
    console.error('Error searching cellphones:', error);
    renderError('Failed to search cellphones. Please try again.');
  }
}

// Helper: Render loading state
function renderLoading() {
  if (container) {
    container.innerHTML = `
Loading cellphones...`;}}// Helper: Render error messagefunction renderError(message) {if (container) {container.innerHTML = `${message}`;}}// Helper: Render cards into HTMLfunction renderCellphones(cellphones) {if (!container) return;if (!cellphones || cellphones.length === 0) {container.innerHTML = `No cellphones found.`;return;}container.innerHTML = cellphones.map(phone => `${phone.name}Brand: ${phone.brand}Price: ${phone.price}Chipset: ${phone.chipset}Storage / RAM: ${phone.storage} /${phone.ram}${phone.description}`).join('');}