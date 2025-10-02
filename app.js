// Minimal site JS: load products, search, cart, and chat widget
const PRODUCTS_JSON = 'products.json'
let products = []

async function loadProducts(){
  try{
    const res = await fetch(PRODUCTS_JSON)
    products = await res.json()
    renderProducts(products.slice(0,6))
  }catch(e){
    console.error('Failed to load products',e)
  }
}

function renderProducts(list){
  const grid = document.getElementById('products-grid')
  if(!grid) return
  grid.innerHTML = ''
  list.forEach(p=>{
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <p>${p.desc}</p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button data-id="${p.id}" class="btn add-to-cart">Add</button>
        <a class="btn" href="product.html?id=${p.id}">Details</a>
      </div>
    `
    grid.appendChild(card)
  })
}

function setupSearch(){
  const input = document.getElementById('search')
  if(!input) return
  input.addEventListener('input', e=>{
    const q = e.target.value.toLowerCase()
    const filtered = products.filter(p=>p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    renderProducts(filtered)
  })
}

function setupCart(){
  const cartCount = document.getElementById('cart-count')
  document.addEventListener('click', e=>{
    if(e.target.matches('.add-to-cart')){
      const id = e.target.dataset.id
      const cart = JSON.parse(localStorage.getItem('cart')||'{}')
      cart[id] = (cart[id]||0)+1
      localStorage.setItem('cart',JSON.stringify(cart))
      updateCartCount()
    }
  })
  updateCartCount()
}
function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart')||'{}')
  const total = Object.values(cart).reduce((s,n)=>s+Number(n),0)
  const el = document.getElementById('cart-count')
  if(el) el.textContent = total
}

// product detail page helper
async function renderProductDetail(){
  if(!location.pathname.endsWith('product.html')) return
  const params = new URLSearchParams(location.search)
  const id = Number(params.get('id'))
  if(!id) return
  if(!products.length) await loadProducts()
  const p = products.find(x=>x.id===id)
  const root = document.createElement('div')
  root.className='container'
  root.innerHTML = `
    <div style="display:flex;gap:20px">
      <img src="${p.image}" style="width:360px;height:260px;object-fit:cover" />
      <div>
        <h1>${p.name}</h1>
        <div class="price">$${p.price.toFixed(2)}</div>
        <p>${p.desc}</p>
        <p>Stock: ${p.stock}</p>
        <button data-id="${p.id}" class="btn add-to-cart">Add to cart</button>
      </div>
    </div>
  `
  document.body.insertBefore(root, document.querySelector('footer'))
}

// chat widget
function setupChat(){
  const widget = document.getElementById('chat-widget')
  const header = widget.querySelector('.chat-header')
  const messages = document.getElementById('chat-messages')
  const input = document.getElementById('chat-input')
  const send = document.getElementById('chat-send')
  let open = false
  header.addEventListener('click', ()=>{
    open = !open
    widget.className = open? 'chat-open':'chat-closed'
  })
  send.addEventListener('click', ()=>{
    const v = input.value.trim()
    if(!v) return
    appendChat('You', v)
    input.value = ''
    // simulated bot reply
    setTimeout(()=>appendChat('Support', 'Thanks, we will message you shortly. For fast answers check Support page.'),800)
  })
  function appendChat(sender, text){
    const el = document.createElement('div')
    el.style.marginBottom='8px'
    el.innerHTML = `<strong>${sender}:</strong> ${escapeHtml(text)}`
    messages.appendChild(el)
    messages.scrollTop = messages.scrollHeight
    saveTranscript()
  }
  function saveTranscript(){
    localStorage.setItem('chat_transcript', messages.innerHTML)
  }
  // load previous
  const prev = localStorage.getItem('chat_transcript')
  if(prev) messages.innerHTML = prev
}

function escapeHtml(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}

// init
window.addEventListener('load', async ()=>{
  await loadProducts()
  setupSearch()
  setupCart()
  setupChat()
  await renderProductDetail()
})
