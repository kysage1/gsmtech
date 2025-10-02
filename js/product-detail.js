// Product Detail Page JavaScript

let currentProduct = null;
let quantity = 1;

async function initProductDetailPage() {
  // Load cart
  if (window.GSM) {
    window.GSM.STATE.cart = JSON.parse(localStorage.getItem('cart') || '{}');
    updateCartDisplay();
  }
  
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  
  if (!productId) {
    showError('Product not found');
    return;
  }
  
  // Load products
  await window.GSM.loadProducts();
  
  // Find product
  currentProduct = window.GSM.STATE.products.find(p => p.id === productId);
  
  if (!currentProduct) {
    showError('Product not found');
    return;
  }
  
  // Render product details
  renderProductDetails();
  
  // Load related products
  renderRelatedProducts();
  
  // Setup currency selector
  setupCurrencySelector();
}

function renderProductDetails() {
  if (!currentProduct) return;
  
  // Title
  document.getElementById('product-title').textContent = currentProduct.name;
  document.getElementById('breadcrumb-product').textContent = currentProduct.name;
  document.title = `${currentProduct.name} - GSM Technology`;
  
  // Price
  const priceEl = document.getElementById('product-price');
  if (priceEl) {
    priceEl.textContent = window.GSM.formatPrice(currentProduct.price);
  }
  
  // Stock status
  const stockEl = document.getElementById('stock-status');
  if (stockEl) {
    const inStock = currentProduct.stock > 0;
    stockEl.innerHTML = inStock ? 
      '<span style="color: #10b981;">✓ In Stock</span>' : 
      '<span style="color: #ef4444;">Out of Stock</span>';
  }
  
  // SKU
  const skuEl = document.getElementById('product-sku');
  if (skuEl) {
    skuEl.textContent = currentProduct.id;
  }
  
  // Description
  const descEl = document.getElementById('product-description');
  if (descEl) {
    descEl.innerHTML = `<p>${currentProduct.desc || 'No description available.'}</p>`;
  }
  
  // Full description
  const fullDescEl = document.getElementById('full-description');
  if (fullDescEl) {
    fullDescEl.innerHTML = `
      <p>${currentProduct.desc || 'No description available.'}</p>
      <p>This is a high-quality product from GSM Technology, designed for professional use. 
      We ensure all our products meet the highest standards of quality and reliability.</p>
      <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">Features:</h3>
      <ul style="margin-left: 1.5rem; line-height: 1.8;">
        <li>Professional grade quality</li>
        <li>Fast and reliable performance</li>
        <li>Compatible with industry standards</li>
        <li>Comprehensive warranty coverage</li>
        <li>Technical support included</li>
      </ul>
    `;
  }
  
  // Main image
  const mainImageEl = document.getElementById('main-image');
  if (mainImageEl) {
    mainImageEl.src = currentProduct.image || 'assets/images/placeholder.svg';
    mainImageEl.alt = currentProduct.name;
    mainImageEl.onerror = function() {
      this.src = 'assets/images/placeholder.svg';
    };
  }
  
  // Thumbnail gallery (use same image multiple times for demo)
  const thumbnailGallery = document.getElementById('thumbnail-gallery');
  if (thumbnailGallery) {
    const imageUrl = currentProduct.image || 'assets/images/placeholder.svg';
    thumbnailGallery.innerHTML = `
      <img src="${imageUrl}" alt="View 1" class="thumbnail active" onclick="switchMainImage('${imageUrl}', this)">
      <img src="${imageUrl}" alt="View 2" class="thumbnail" onclick="switchMainImage('${imageUrl}', this)">
      <img src="${imageUrl}" alt="View 3" class="thumbnail" onclick="switchMainImage('${imageUrl}', this)">
      <img src="${imageUrl}" alt="View 4" class="thumbnail" onclick="switchMainImage('${imageUrl}', this)">
    `;
  }
  
  // Specifications
  renderSpecifications();
}

function renderSpecifications() {
  const specsTable = document.getElementById('specifications-table');
  if (!specsTable) return;
  
  const specs = {
    'Product ID': currentProduct.id,
    'Price': window.GSM.formatPrice(currentProduct.price),
    'Availability': currentProduct.stock > 0 ? `In Stock (${currentProduct.stock} units)` : 'Out of Stock',
    'Category': currentProduct.category || 'General',
    'Brand': currentProduct.brand || 'GSM Technology',
    'Warranty': '1 Year Manufacturer Warranty',
    'Shipping': 'Free shipping on orders over $100',
    'Return Policy': '30-day money-back guarantee'
  };
  
  let html = '';
  for (const [key, value] of Object.entries(specs)) {
    html += `
      <tr>
        <td>${key}</td>
        <td>${value}</td>
      </tr>
    `;
  }
  
  specsTable.innerHTML = html;
}

function renderRelatedProducts() {
  const relatedProducts = window.GSM.STATE.products
    .filter(p => p.id !== currentProduct.id && p.price)
    .slice(0, 4);
  
  window.GSM.renderProducts(relatedProducts, 'related-products');
}

function switchMainImage(imageUrl, thumbnail) {
  const mainImage = document.getElementById('main-image');
  if (mainImage) {
    mainImage.src = imageUrl;
  }
  
  // Update active thumbnail
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.classList.remove('active');
  });
  if (thumbnail) {
    thumbnail.classList.add('active');
  }
}

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

function incrementQuantity() {
  const input = document.getElementById('quantity');
  const max = currentProduct.stock || 999;
  if (parseInt(input.value) < max) {
    input.value = parseInt(input.value) + 1;
  }
}

function decrementQuantity() {
  const input = document.getElementById('quantity');
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

function addToCartFromDetail() {
  const quantityInput = document.getElementById('quantity');
  const qty = parseInt(quantityInput.value) || 1;
  
  if (!currentProduct.stock || currentProduct.stock <= 0) {
    window.GSM.showNotification('This product is out of stock', 'error');
    return;
  }
  
  window.GSM.addToCart(currentProduct.id, qty);
  window.GSM.showNotification(`Added ${qty} item(s) to cart!`, 'success');
  
  // Update cart display
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const total = Object.values(cart).reduce((s, n) => s + Number(n), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
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
    
    // Re-render prices
    renderProductDetails();
    renderRelatedProducts();
  });
}

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const total = Object.values(cart).reduce((s, n) => s + Number(n), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

function showError(message) {
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <div style="text-align: center; padding: 4rem; background: white; border-radius: 12px; margin: 2rem 0;">
        <h2 style="color: #ef4444; margin-bottom: 1rem;">⚠️ ${message}</h2>
        <p style="color: #64748b; margin-bottom: 2rem;">The product you're looking for could not be found.</p>
        <a href="products.html" class="btn btn-primary">Browse All Products</a>
      </div>
    `;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProductDetailPage);
