# Quick Start Guide

Get TechHub Store up and running in 5 minutes!

## 🚀 Frontend-Only Quick Start

### Option 1: Direct File Open (Fastest)

1. **Download the project**
   ```bash
   # If you have git
   git clone <your-repo-url>
   cd workspace
   
   # Or just download and extract the ZIP
   ```

2. **Open in browser**
   - Simply double-click `index.html`
   - OR right-click → Open with → Your browser

3. **Start exploring!**
   - Browse products
   - Add items to cart
   - Test the checkout flow
   - Try the support forms

### Option 2: Local Server (Recommended)

**Using Python:**
```bash
cd workspace
python3 -m http.server 8000
# Open http://localhost:8000
```

**Using Node.js:**
```bash
cd workspace
npx http-server -p 8000
# Open http://localhost:8000
```

**Using PHP:**
```bash
cd workspace
php -S localhost:8000
# Open http://localhost:8000
```

## 🎮 Try These Features

### 1. Browse Products
- Click "Browse Products" button
- Use category tabs: All | Credits | Activations | Hardware
- View different product types

### 2. Shopping Cart
- Click "Add to Cart" on any product
- Cart badge shows item count
- Click cart icon to review items
- Remove items or proceed to checkout

### 3. Checkout Flow
- Click "Proceed to Checkout"
- Fill in customer information
- Select payment method
- Click "Complete Payment"

### 4. User Account
- Click user icon in navigation
- Try sign in/sign up forms
- View profile section

### 5. Order Tracking
- Navigate to "My Orders"
- View sample orders (after making a purchase)

### 6. Support
- Click "Support" in navigation
- Try different contact methods
- Fill out support form

### 7. Admin Dashboard
- Manual access: Add `onclick="showSection('admin')"` to any button
- View statistics and order management

## 📊 Sample Data

The application includes sample products:

**Credits:**
- 100 Credits - $10.00
- 500 Credits - $45.00
- 1000 Credits - $80.00

**Activations:**
- 1 Month - $25.00
- 6 Months - $120.00
- Lifetime - $350.00

**Hardware:**
- Professional Box v5 - $299.00
- USB Dongle Pro - $189.00
- Complete Tool Kit - $499.00

## 🛠️ Full Stack Setup

### Prerequisites
```bash
# Check if you have these installed
node --version    # Should be 18+
npm --version
psql --version    # Should be 14+
redis-cli --version
```

### Backend Setup (5 Steps)

1. **Clone & Install**
   ```bash
   git clone <your-repo-url>
   cd workspace
   mkdir backend && cd backend
   npm init -y
   npm install express pg redis ioredis jsonwebtoken bcryptjs \
     stripe dotenv cors helmet express-rate-limit
   ```

2. **Create Database**
   ```bash
   # Create database
   createdb techhub_store
   
   # Run schema
   psql -d techhub_store -f ../database-schema.sql
   ```

3. **Configure Environment**
   ```bash
   # Copy and edit .env
   cp .env.example .env
   nano .env  # Add your credentials
   ```

4. **Create Basic Server**
   Create `server.js`:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   
   const app = express();
   
   app.use(cors());
   app.use(express.json());
   
   app.get('/api/health', (req, res) => {
     res.json({ status: 'ok' });
   });
   
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

5. **Start Server**
   ```bash
   node server.js
   # Server running on http://localhost:3000
   ```

### Connect Frontend to Backend

Update `index.html` to use API:
```javascript
// Add at the top of the script section
const API_URL = 'http://localhost:3000/api';

// Example: Fetch products from API
async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    // Display products
}
```

## 🔧 Customization Quick Tips

### Change Colors
Find this in `<style>` section:
```css
:root {
    --primary: #2563eb;      /* Change this */
    --secondary: #7c3aed;    /* And this */
}
```

### Update Contact Info
Search for "Support" section and update:
```html
<p>+1 (555) 123-4567</p>  <!-- Your number -->
<a href="https://wa.me/...">Chat Now</a>  <!-- Your WhatsApp -->
```

### Add Products
Copy this block and modify:
```html
<div class="product-card" data-category="credits">
    <div class="product-icon">
        <i class="fas fa-coins"></i>
    </div>
    <h3>Your Product Name</h3>
    <p>Your description</p>
    <div class="product-price">$99.00</div>
    <button class="add-to-cart" 
            onclick="addToCart('Product', 99.00, 'credits')">
        Add to Cart
    </button>
</div>
```

### Change Site Name
Search and replace "TechHub Store" with your name:
```html
<div class="logo">
    <i class="fas fa-mobile-alt"></i> Your Store Name
</div>
```

## 🔐 Payment Integration

### Stripe Setup (5 minutes)

1. **Get Stripe Keys**
   - Sign up at https://stripe.com
   - Go to Developers → API keys
   - Copy Test keys

2. **Add to Frontend**
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   <script>
   const stripe = Stripe('pk_test_YOUR_KEY');
   </script>
   ```

3. **Handle Payment**
   ```javascript
   async function processStripePayment(amount) {
       const response = await fetch(`${API_URL}/create-payment-intent`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ amount })
       });
       const { clientSecret } = await response.json();
       
       const result = await stripe.confirmCardPayment(clientSecret);
       if (result.error) {
           alert(result.error.message);
       } else {
           alert('Payment successful!');
       }
   }
   ```

### PayPal Setup (5 minutes)

1. **Get PayPal Client ID**
   - Sign up at https://developer.paypal.com
   - Create app
   - Copy Client ID

2. **Add PayPal SDK**
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
   ```

3. **Render Button**
   ```javascript
   paypal.Buttons({
       createOrder: function(data, actions) {
           return actions.order.create({
               purchase_units: [{
                   amount: { value: '99.99' }
               }]
           });
       },
       onApprove: function(data, actions) {
           return actions.order.capture().then(function(details) {
               alert('Payment successful!');
           });
       }
   }).render('#paypal-button-container');
   ```

## 📱 Mobile Testing

Test on mobile:
1. **Get your local IP**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **Access from phone**
   ```
   http://YOUR_IP:8000
   Example: http://192.168.1.100:8000
   ```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9

# Or use different port
python3 -m http.server 8080
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Restart if needed
sudo service postgresql restart
```

### CORS Error
Add CORS headers in your backend:
```javascript
app.use(cors({
    origin: 'http://localhost:8000'
}));
```

## 📚 Next Steps

1. **Read Full Documentation**
   - `README.md` - Complete overview
   - `api-documentation.md` - API reference
   - `backend-implementation-guide.md` - Backend setup

2. **Implement Backend**
   - Follow backend-implementation-guide.md
   - Set up database
   - Configure payment gateways

3. **Deploy**
   - Follow deployment-checklist.md
   - Set up production server
   - Configure domain and SSL

## 💡 Tips

- **Development**: Use browser DevTools (F12) to debug
- **Testing**: Use Stripe test cards for payments
- **Mobile**: Test on real devices, not just emulators
- **Performance**: Use Lighthouse to check performance
- **Security**: Never commit API keys to git

## 🆘 Get Help

- **Issues**: Check `README.md` for detailed docs
- **API**: See `api-documentation.md`
- **Deployment**: See `deployment-checklist.md`

## 🎉 You're Ready!

Your e-commerce platform is now running. Start customizing and building your business!

**Pro Tip**: Make small changes, test often, and commit frequently!
