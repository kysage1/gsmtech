# 🚀 Quick Start Guide - GSM Technology

## View Your Site Locally (Right Now!)

### Method 1: Python (Recommended - Works Everywhere)
```bash
# In the project directory, run:
python -m http.server 8000

# Then open: http://localhost:8000
```

### Method 2: Node.js
```bash
npx http-server -p 8000
# Then open: http://localhost:8000
```

### Method 3: Just Open It
Double-click `index.html` (some features may not work due to CORS)

---

## Deploy to the Internet (5 Minutes!)

### 🌟 EASIEST: Netlify Drop (No Account Needed)
1. Go to: https://app.netlify.com/drop
2. Drag your project folder onto the page
3. **Done!** You get a live URL instantly

### ⭐ RECOMMENDED: GitHub Pages (Free Forever)
1. Go to: https://github.com/kysage1/gsmtech/settings/pages
2. Source → Select branch: `cursor/build-gsmserver-like-e-commerce-website-and-deploy-b0e4`
3. Click "Save"
4. Wait 2-3 minutes
5. Your site is live at: `https://kysage1.github.io/gsmtech/`

### 🚀 FASTEST: Vercel (One Command)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Access Admin Dashboard

**URL:** `/admin/index.html`  
**Example:** `http://localhost:8000/admin/index.html`

Features:
- View dashboard statistics
- Add new products
- Manage existing products
- Upload images
- View orders

---

## Key Features to Try

### 1. Multi-Currency
- Top right corner → Currency selector
- Choose: USD, EUR, GBP, JPY, or CNY
- Watch all prices update instantly!

### 2. Multi-Language
- Top right corner → Language selector
- Choose: English, Spanish, French, German, or Chinese
- Site translates automatically!

### 3. Shopping Cart
- Click "Add to Cart" on any product
- Cart count updates in header
- Items saved even after refresh!

### 4. Product Filters
- Go to "Products" page
- Filter by: Category, Price, Brand
- Sort by: Price or Name
- Results update instantly!

### 5. Search
- Use search bar in header
- Type any product name
- Get instant results!

---

## File You Can Edit

### Add Products
**File:** `products.json`
```json
{
  "id": 999,
  "name": "New Product",
  "price": 99.99,
  "image": "url-to-image",
  "desc": "Product description",
  "stock": 100,
  "category": "boxes"
}
```

### Change Colors
**File:** `css/main.css` (lines 3-8)
```css
--primary: #0a64ff;    /* Change main color */
--secondary: #ff6a00;  /* Change accent color */
```

### Update Logo
Replace: `assets/logos/logo.svg` with your logo

---

## Troubleshooting

**Q: Products not showing?**  
A: Make sure you're running a web server (not just opening the file)

**Q: Images broken?**  
A: Check that image URLs in `products.json` are valid

**Q: JavaScript errors?**  
A: Open browser console (F12) to see detailed errors

**Q: Cart not saving?**  
A: Make sure localStorage is enabled in your browser

---

## What's Included

✅ 25+ complete pages  
✅ Responsive design (mobile, tablet, desktop)  
✅ Shopping cart functionality  
✅ Product search and filters  
✅ Multi-currency (5 currencies)  
✅ Multi-language (5 languages)  
✅ Admin dashboard  
✅ Blog section  
✅ Customer reviews  
✅ Complete documentation  

---

## Need More Help?

📖 **Full Documentation:** See `README.md`  
🚀 **Deployment Guide:** See `DEPLOYMENT.md`  
📊 **Project Summary:** See `PROJECT_SUMMARY.md`  

---

## Your Site is Ready! 🎉

**Repository:** https://github.com/kysage1/gsmtech  

Choose any deployment method above and your site will be live in minutes!

**Good luck! 🚀**
