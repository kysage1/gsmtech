// Products Page JavaScript

let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [];
let gridView = 'grid';

// Initialize products page
async function initProductsPage() {
  // Load cart
  if (window.GSM) {
    window.GSM.STATE.cart = JSON.parse(localStorage.getItem('cart') || '{}');
    updateCartDisplay();
  }
  
  // Load products
  await window.GSM.loadProducts();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const category = urlParams.get('category');
  
  if (searchQuery) {
    document.getElementById('filter-search').value = searchQuery;
    window.GSM.STATE.filters.search = searchQuery;
  }
  
  if (category) {
    document.getElementById('filter-category').value = category;
    window.GSM.STATE.filters.category = category;
  }
  
  // Populate brand filter
  populateBrandFilter();
  
  // Setup filter listeners
  setupFilterListeners();
  
  // Setup language and currency
  setupLanguageSelector();
  setupCurrencySelector();
  
  // Initial render
  applyFilters();
}

function populateBrandFilter() {
  const brands = [...new Set(window.GSM.STATE.products.map(p => p.brand).filter(Boolean))];
  const brandSelect = document.getElementById('filter-brand');
  
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

function setupFilterListeners() {
  // Search filter
  document.getElementById('filter-search').addEventListener('input', debounce(() => {
    window.GSM.STATE.filters.search = document.getElementById('filter-search').value;
    applyFilters();
  }, 300));
  
  // Category filter
  document.getElementById('filter-category').addEventListener('change', () => {
    window.GSM.STATE.filters.category = document.getElementById('filter-category').value;
    applyFilters();
  });
  
  // Price filters
  document.getElementById('filter-price-min').addEventListener('input', debounce(() => {
    const value = parseFloat(document.getElementById('filter-price-min').value);
    window.GSM.STATE.filters.priceMin = isNaN(value) ? 0 : value;
    applyFilters();
  }, 500));
  
  document.getElementById('filter-price-max').addEventListener('input', debounce(() => {
    const value = parseFloat(document.getElementById('filter-price-max').value);
    window.GSM.STATE.filters.priceMax = isNaN(value) ? Infinity : value;
    applyFilters();
  }, 500));
  
  // Brand filter
  document.getElementById('filter-brand').addEventListener('change', () => {
    window.GSM.STATE.filters.brand = document.getElementById('filter-brand').value;
    applyFilters();
  });
  
  // Sort filter
  document.getElementById('filter-sort').addEventListener('change', () => {
    window.GSM.STATE.filters.sort = document.getElementById('filter-sort').value;
    applyFilters();
  });
}

function applyFilters() {
  filteredProducts = window.GSM.filterProducts();
  currentPage = 1;
  updateResultsCount();
  renderCurrentPage();
  renderPagination();
}

function resetFilters() {
  document.getElementById('filter-search').value = '';
  document.getElementById('filter-category').value = '';
  document.getElementById('filter-price-min').value = '';
  document.getElementById('filter-price-max').value = '';
  document.getElementById('filter-brand').value = '';
  document.getElementById('filter-sort').value = 'default';
  
  window.GSM.STATE.filters = {
    category: '',
    priceMin: 0,
    priceMax: Infinity,
    search: '',
    brand: '',
    sort: 'default'
  };
  
  applyFilters();
}

function updateResultsCount() {
  const count = filteredProducts.length;
  const total = window.GSM.STATE.products.length;
  const resultsEl = document.getElementById('results-count');
  
  if (resultsEl) {
    resultsEl.textContent = `Showing ${count} of ${total} products`;
  }
}

function renderCurrentPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageProducts = filteredProducts.slice(start, end);
  
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  if (pageProducts.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">No products found matching your filters.</p>';
    return;
  }
  
  // Update grid class based on view mode
  container.className = gridView === 'grid' ? 'product-grid' : 'product-list';
  
  window.GSM.renderProducts(pageProducts, 'products-grid');
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginationEl = document.getElementById('pagination');
  
  if (!paginationEl || totalPages <= 1) {
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  html += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Previous</button>`;
  
  // Page numbers
  const maxVisible = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      html += `<span style="padding: 0.5rem;">...</span>`;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<span style="padding: 0.5rem;">...</span>`;
    }
    html += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
  
  // Next button
  html += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
  
  paginationEl.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderCurrentPage();
  renderPagination();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setGridView(view) {
  gridView = view;
  renderCurrentPage();
}

function setupLanguageSelector() {
  const select = document.getElementById('language-select');
  if (!select) return;
  
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    select.value = savedLang;
  }
  
  select.addEventListener('change', (e) => {
    localStorage.setItem('language', e.target.value);
    location.reload();
  });
}

function setupCurrencySelector() {
  const select = document.getElementById('currency-select');
  if (!select) return;
  
  const savedCurrency = localStorage.getItem('currency');
  if (savedCurrency) {
    window.GSM.STATE.currency = savedCurrency;
    select.value = savedCurrency;
  }
  
  select.addEventListener('change', (e) => {
    window.GSM.STATE.currency = e.target.value;
    localStorage.setItem('currency', e.target.value);
    renderCurrentPage();
  });
}

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const total = Object.values(cart).reduce((s, n) => s + Number(n), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProductsPage);
