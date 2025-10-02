// GSM Technology - Main JavaScript

// ==========================================
// CONFIGURATION & STATE
// ==========================================

const CONFIG = {
  productsFile: 'products.json',
  blogFile: 'blog/articles.json',
  defaultCurrency: 'USD',
  defaultLanguage: 'en',
  itemsPerPage: 12
};

const STATE = {
  products: [],
  cart: {},
  currency: CONFIG.defaultCurrency,
  language: CONFIG.defaultLanguage,
  currentPage: 1,
  filters: {
    category: '',
    priceMin: 0,
    priceMax: Infinity,
    search: '',
    brand: '',
    sort: 'default'
  }
};

const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24
};

const TRANSLATIONS = {
  en: {
    'hero.title': 'Professional Mobile Electronics & Unlocking Solutions',
    'hero.subtitle': 'Industry-leading tools, equipment, and accessories for mobile repair professionals worldwide. Fast shipping, competitive pricing, expert support.',
    'hero.cta1': 'Shop All Products',
    'hero.cta2': 'Latest News',
    'featured.title': 'Featured Promotions',
    'featured.subtitle': 'Special offers and deals on top products',
    'categories.title': 'Shop by Category',
    'categories.subtitle': 'Browse our extensive range of professional tools and accessories',
    'categories.boxes': 'Boxes & Dongles',
    'categories.boxes_desc': 'Professional unlocking and flashing tools',
    'categories.cables': 'Cables & Adapters',
    'categories.cables_desc': 'High-quality connection solutions',
    'categories.parts': 'Parts & Accessories',
    'categories.parts_desc': 'Replacement parts and components',
    'categories.equipment': 'Repair Equipment',
    'categories.equipment_desc': 'Professional repair station tools',
    'news.title': 'Latest News & Updates',
    'news.subtitle': 'Stay informed about industry trends and product releases',
    'news.view_all': 'View All Articles',
    'testimonials.title': 'What Our Customers Say',
    'testimonials.subtitle': 'Trusted by thousands of professionals worldwide',
    'features.shipping': 'Fast Global Shipping',
    'features.shipping_desc': 'Express delivery available',
    'features.secure': 'Secure Payments',
    'features.secure_desc': 'SSL encrypted transactions',
    'features.support': '24/7 Support',
    'features.support_desc': 'Expert technical assistance',
    'features.warranty': 'Warranty Protection',
    'features.warranty_desc': 'Quality guarantee on all items',
    'footer.about': 'About GSM Technology',
    'footer.about_text': 'Leading provider of professional mobile electronics, unlocking solutions, and repair equipment since 2010. Trusted by thousands of professionals worldwide.',
    'footer.shop': 'Shop',
    'footer.all_products': 'All Products',
    'footer.info': 'Customer Service',
    'footer.how_to_shop': 'How to Shop',
    'footer.payment': 'Payment Methods',
    'footer.shipping': 'Shipping Information',
    'footer.warranty': 'Warranty Policy',
    'footer.returns': 'Returns & Refunds',
    'footer.legal': 'Legal & Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.contact': 'Contact Us',
    'footer.blog': 'Blog & News',
    'footer.about_us': 'About Us',
    'footer.disclaimer': 'For educational and demonstration purposes only.',
    'add_to_cart': 'Add to Cart',
    'view_details': 'View Details',
    'in_stock': 'In Stock',
    'out_of_stock': 'Out of Stock',
    'new': 'New',
    'sale': 'Sale'
  },
  es: {
    'hero.title': 'Soluciones Profesionales de Electrónica Móvil y Desbloqueo',
    'hero.subtitle': 'Herramientas, equipos y accesorios líderes en la industria para profesionales de reparación móvil en todo el mundo.',
    'hero.cta1': 'Ver Todos los Productos',
    'hero.cta2': 'Últimas Noticias',
    'add_to_cart': 'Añadir al Carrito',
    'view_details': 'Ver Detalles'
  },
  fr: {
    'hero.title': 'Solutions Professionnelles d\'Électronique Mobile et Déverrouillage',
    'hero.subtitle': 'Outils, équipements et accessoires de pointe pour les professionnels de la réparation mobile dans le monde entier.',
    'hero.cta1': 'Voir Tous les Produits',
    'hero.cta2': 'Dernières Nouvelles',
    'add_to_cart': 'Ajouter au Panier',
    'view_details': 'Voir les Détails'
  },
  de: {
    'hero.title': 'Professionelle Mobilelektronik & Entsperrlösungen',
    'hero.subtitle': 'Branchenführende Werkzeuge, Geräte und Zubehör für mobile Reparaturprofis weltweit.',
    'hero.cta1': 'Alle Produkte',
    'hero.cta2': 'Neueste Nachrichten',
    'add_to_cart': 'In den Warenkorb',
    'view_details': 'Details Anzeigen'
  },
  zh: {
    'hero.title': '专业移动电子和解锁解决方案',
    'hero.subtitle': '为全球移动维修专业人士提供行业领先的工具、设备和配件。',
    'hero.cta1': '查看所有产品',
    'hero.cta2': '最新消息',
    'add_to_cart': '加入购物车',
    'view_details': '查看详情'
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatPrice(price, currency = STATE.currency) {
  if (!price && price !== 0) return '';
  
  const convertedPrice = price * CURRENCY_RATES[currency];
  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥' };
  const decimals = currency === 'JPY' || currency === 'CNY' ? 0 : 2;
  
  return `${symbols[currency]}${convertedPrice.toFixed(decimals)}`;
}

function translate(key, lang = STATE.language) {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return translations[key] || TRANSLATIONS.en[key] || key;
}

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = translate(key);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

// ==========================================
// CART MANAGEMENT
// ==========================================

function loadCart() {
  const cartData = localStorage.getItem('cart');
  STATE.cart = cartData ? JSON.parse(cartData) : {};
  updateCartDisplay();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(STATE.cart));
  updateCartDisplay();
}

function addToCart(productId, quantity = 1) {
  if (!STATE.cart[productId]) {
    STATE.cart[productId] = 0;
  }
  STATE.cart[productId] += quantity;
  saveCart();
  
  // Show feedback
  showNotification('Product added to cart!');
}

function removeFromCart(productId) {
  delete STATE.cart[productId];
  saveCart();
}

function updateCartQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    STATE.cart[productId] = quantity;
    saveCart();
  }
}

function updateCartDisplay() {
  const cartCount = Object.values(STATE.cart).reduce((sum, qty) => sum + qty, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

function getCartTotal() {
  let total = 0;
  for (const [productId, quantity] of Object.entries(STATE.cart)) {
    const product = STATE.products.find(p => p.id === parseInt(productId));
    if (product && product.price) {
      total += product.price * quantity;
    }
  }
  return total;
}

// ==========================================
// PRODUCT LOADING & RENDERING
// ==========================================

async function loadProducts() {
  try {
    const response = await fetch(CONFIG.productsFile);
    const data = await response.json();
    STATE.products = data.filter(p => p.name && p.price); // Filter valid products
    return STATE.products;
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

function filterProducts() {
  let filtered = [...STATE.products];
  
  // Search filter
  if (STATE.filters.search) {
    const searchLower = STATE.filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      (p.name && p.name.toLowerCase().includes(searchLower)) ||
      (p.desc && p.desc.toLowerCase().includes(searchLower))
    );
  }
  
  // Category filter
  if (STATE.filters.category) {
    filtered = filtered.filter(p => 
      p.category === STATE.filters.category
    );
  }
  
  // Price filter
  filtered = filtered.filter(p => 
    p.price >= STATE.filters.priceMin && 
    p.price <= STATE.filters.priceMax
  );
  
  // Brand filter
  if (STATE.filters.brand) {
    filtered = filtered.filter(p => 
      p.brand === STATE.filters.brand
    );
  }
  
  // Sorting
  switch (STATE.filters.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  
  return filtered;
}

function renderProductCard(product) {
  const inStock = product.stock > 0;
  const badge = product.featured ? 'NEW' : (product.sale ? 'SALE' : '');
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card-image">
        <img src="${product.image || 'assets/images/placeholder.svg'}" 
             alt="${escapeHtml(product.name)}" 
             onerror="this.src='assets/images/placeholder.svg'">
        ${badge ? `<div class="product-badge">${badge}</div>` : ''}
      </div>
      <div class="product-card-content">
        <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
        <p class="product-card-desc">${escapeHtml(product.desc || '')}</p>
        <div class="product-card-footer">
          <div>
            <div class="product-price">${formatPrice(product.price)}</div>
            ${inStock ? `<small style="color: #10b981;">${translate('in_stock')}</small>` : 
                        `<small style="color: #ef4444;">${translate('out_of_stock')}</small>`}
          </div>
          <button 
            class="add-to-cart-btn" 
            onclick="addToCart(${product.id})"
            ${!inStock ? 'disabled' : ''}>
            ${translate('add_to_cart')}
          </button>
        </div>
        <div style="margin-top: 0.5rem;">
          <a href="product.html?id=${product.id}" class="btn btn-small btn-secondary" style="width: 100%; text-align: center;">
            ${translate('view_details')}
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(products, containerId = 'products-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
    return;
  }
  
  container.innerHTML = products.map(product => renderProductCard(product)).join('');
}

function renderFeaturedProducts() {
  const featured = STATE.products.slice(0, 6);
  renderProducts(featured, 'featured-products');
}

// ==========================================
// BLOG/NEWS FUNCTIONS
// ==========================================

async function loadBlogPosts() {
  // Sample blog posts (in production, load from JSON)
  return [
    {
      id: 1,
      title: 'New iPhone 15 Unlocking Solutions Available',
      excerpt: 'We are excited to announce support for the latest iPhone 15 series unlocking tools. Learn more about compatibility and features...',
      date: '2025-09-28',
      image: 'assets/images/placeholder.svg',
      category: 'Product Updates'
    },
    {
      id: 2,
      title: 'Guide: Choosing the Right Repair Equipment',
      excerpt: 'A comprehensive guide to selecting professional repair equipment for your workshop. Compare features, prices, and capabilities...',
      date: '2025-09-25',
      image: 'assets/images/placeholder.svg',
      category: 'Guides'
    },
    {
      id: 3,
      title: 'Industry News: Mobile Repair Market Trends 2025',
      excerpt: 'Analysis of current market trends in mobile device repair and unlocking services. What professionals need to know...',
      date: '2025-09-20',
      image: 'assets/images/placeholder.svg',
      category: 'Industry News'
    }
  ];
}

function renderBlogPosts(posts, containerId = 'latest-news') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const html = posts.map(post => `
    <article class="blog-card">
      <img src="${post.image}" alt="${escapeHtml(post.title)}" class="blog-card-image" onerror="this.src='assets/images/placeholder.svg'">
      <div class="blog-card-content">
        <div class="blog-card-date">${new Date(post.date).toLocaleDateString()}</div>
        <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
        <p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>
        <a href="blog/article.html?id=${post.id}" class="read-more">
          Read More →
        </a>
      </div>
    </article>
  `).join('');
  
  container.innerHTML = html;
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================

function setupSearch() {
  const searchInput = document.getElementById('main-search');
  if (!searchInput) return;
  
  const handleSearch = debounce(() => {
    const query = searchInput.value.trim();
    if (query) {
      // Redirect to products page with search query
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
  }, 500);
  
  searchInput.addEventListener('input', handleSearch);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
}

// ==========================================
// LANGUAGE & CURRENCY
// ==========================================

function setupLanguageSelector() {
  const select = document.getElementById('language-select');
  if (!select) return;
  
  // Load saved language
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    STATE.language = savedLang;
    select.value = savedLang;
  }
  
  select.addEventListener('change', (e) => {
    STATE.language = e.target.value;
    localStorage.setItem('language', STATE.language);
    updateTranslations();
    
    // Re-render products if on products page
    if (document.getElementById('products-grid')) {
      const filtered = filterProducts();
      renderProducts(filtered);
    }
  });
  
  updateTranslations();
}

function setupCurrencySelector() {
  const select = document.getElementById('currency-select');
  if (!select) return;
  
  // Load saved currency
  const savedCurrency = localStorage.getItem('currency');
  if (savedCurrency) {
    STATE.currency = savedCurrency;
    select.value = savedCurrency;
  }
  
  select.addEventListener('change', (e) => {
    STATE.currency = e.target.value;
    localStorage.setItem('currency', STATE.currency);
    
    // Re-render products to show new currency
    if (document.getElementById('products-grid')) {
      const filtered = filterProducts();
      renderProducts(filtered);
    }
    
    if (document.getElementById('featured-products')) {
      renderFeaturedProducts();
    }
  });
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==========================================
// INITIALIZATION
// ==========================================

async function initHomePage() {
  // Load cart
  loadCart();
  
  // Load products
  await loadProducts();
  
  // Render featured products
  if (document.getElementById('featured-products')) {
    renderFeaturedProducts();
  }
  
  // Load and render blog posts
  const posts = await loadBlogPosts();
  if (document.getElementById('latest-news')) {
    renderBlogPosts(posts);
  }
  
  // Setup search
  setupSearch();
  
  // Setup language and currency selectors
  setupLanguageSelector();
  setupCurrencySelector();
}

// ==========================================
// GLOBAL EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize based on current page
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    initHomePage();
  }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.GSM = {
    STATE,
    CONFIG,
    loadProducts,
    filterProducts,
    renderProducts,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    formatPrice,
    translate,
    showNotification
  };
}
