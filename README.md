# GSM Technology - Complete E-Commerce Platform

A full-featured e-commerce website similar to gsmserver.com, built with modern web technologies. This platform is designed for selling professional mobile electronics, unlocking tools, repair equipment, and accessories.

![GSM Technology](assets/logos/logo.svg)

## 🌟 Features

### Frontend Features
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ✅ **Home Page** - Featured promotions, news updates, product categories
- ✅ **Product Catalog** - Complete listing with advanced filters, sorting, and pagination
- ✅ **Product Details** - Comprehensive product pages with images, specifications, reviews
- ✅ **Shopping Cart** - Add to cart functionality with quantity management
- ✅ **Multi-Currency Support** - USD, EUR, GBP, JPY, CNY with real-time conversion
- ✅ **Multi-Language Support** - English, Spanish, French, German, Chinese
- ✅ **Advanced Search** - Real-time product search with filters
- ✅ **Blog/News Section** - Articles, guides, and industry updates
- ✅ **Customer Reviews** - Testimonials and product reviews
- ✅ **Professional Theme** - Clean, tech-focused aesthetic with modern UI/UX

### Admin Dashboard
- ✅ **Product Management** - Add, edit, delete products
- ✅ **Category Management** - Organize products into categories
- ✅ **Order Management** - View and process customer orders
- ✅ **Media Library** - Upload and manage product images
- ✅ **Analytics Dashboard** - Sales statistics and key metrics

### Additional Pages
- ✅ About Us
- ✅ How to Shop Guide
- ✅ Shipping Information
- ✅ Warranty Policy
- ✅ Returns & Refunds
- ✅ Privacy Policy
- ✅ Terms & Conditions
- ✅ Support/Contact

## 📁 Project Structure

```
gsmtechnology/
├── admin/                    # Admin dashboard
│   └── index.html           # Main admin interface
├── assets/                   # Static assets
│   ├── images/              # Product and banner images
│   │   ├── banners/
│   │   ├── brands/
│   │   ├── products/
│   │   └── placeholder.svg
│   └── logos/               # Brand logos
│       └── logo.svg
├── blog/                     # Blog section
│   └── index.html           # Blog listing page
├── categories/               # Category pages
│   ├── boxes-and-dongles.html
│   ├── cables-and-adapters.html
│   ├── credits-and-activations.html
│   ├── equipment.html
│   └── spares.html
├── css/                      # Stylesheets
│   └── main.css             # Main stylesheet with responsive design
├── data/                     # Data files
│   ├── invoices.json
│   ├── orders.json
│   └── products_stock.json
├── info/                     # Information pages
│   ├── about.html
│   ├── checkout.html
│   ├── how-to-shop.html
│   ├── payment.html
│   ├── privacy.html
│   ├── returns.html
│   ├── shipping.html
│   ├── terms.html
│   └── warranty.html
├── js/                       # JavaScript files
│   ├── main.js              # Core functionality
│   ├── products.js          # Product listing logic
│   └── product-detail.js    # Product detail page
├── products/                 # Individual product pages
├── tools/                    # Development tools
│   ├── mock_checkout_server.py
│   ├── reset_stock.py
│   └── scrape_gsm*.py
├── app.js                    # Legacy app script
├── index.html               # Home page
├── products.html            # Product listing page
├── product.html             # Product detail page
├── products.json            # Product database (JSON)
├── styles.css               # Additional styles
├── support.html             # Support page
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Simple HTTP Server (Recommended for Testing)

1. **Python** (Recommended - Works on all platforms):
   ```bash
   # Python 3
   python -m http.server 8000
   # or Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open http://localhost:8000

2. **Node.js (http-server)**:
   ```bash
   npx http-server -p 8000
   ```

3. **PHP**:
   ```bash
   php -S localhost:8000
   ```

### Option 2: Open Directly
Simply open `index.html` in your web browser. Note: Some features may not work due to CORS restrictions.

## 🌐 Deployment

### Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Complete GSM Technology e-commerce website"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select branch: `main`
   - Select folder: `/ (root)`
   - Click Save
   - Your site will be live at: `https://yourusername.github.io/repositoryname/`

### Deploy to Netlify

1. **Via Git**:
   - Connect your GitHub repository
   - Build command: (leave empty)
   - Publish directory: `/`
   - Deploy

2. **Via Drag & Drop**:
   - Zip your project folder
   - Drag to Netlify drop zone
   - Instant deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Traditional Web Hosting

1. Upload all files via FTP/SFTP to your web server
2. Ensure `index.html` is in the root directory
3. Set proper file permissions (644 for files, 755 for directories)
4. Access via your domain name

## 🔧 Configuration

### Multi-Currency Settings
Edit `js/main.js` to modify currency rates:
```javascript
const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24
};
```

### Multi-Language Settings
Add translations in `js/main.js`:
```javascript
const TRANSLATIONS = {
  en: { /* English translations */ },
  es: { /* Spanish translations */ },
  // Add more languages here
};
```

### Product Data
Products are stored in `products.json`. Format:
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  "image": "url-to-image",
  "desc": "Product description",
  "stock": 100,
  "category": "category-name",
  "brand": "brand-name"
}
```

## 🎨 Customization

### Brand Colors
Edit `css/main.css`:
```css
:root {
  --primary: #0a64ff;      /* Main brand color */
  --secondary: #ff6a00;    /* Accent color */
  --text-primary: #0f172a; /* Text color */
}
```

### Logo
Replace `assets/logos/logo.svg` with your own logo (SVG or PNG recommended)

### Images
Add product images to `assets/images/products/` and update `products.json`

## 📱 Features Breakdown

### Multi-Currency Support
- Automatic conversion based on exchange rates
- Persistent selection (saved in localStorage)
- Supported: USD, EUR, GBP, JPY, CNY

### Multi-Language Support
- Translation system built-in
- Easy to add new languages
- Persistent selection (saved in localStorage)
- Currently: English, Spanish, French, German, Chinese

### Shopping Cart
- Add/remove items
- Quantity adjustment
- Persistent across sessions (localStorage)
- Real-time total calculation

### Product Filters
- Search by keyword
- Filter by category
- Filter by price range
- Filter by brand
- Sort by price/name (ascending/descending)
- Pagination support

### Admin Dashboard
Access: `/admin/index.html`
- View sales statistics
- Add new products
- Manage existing products
- Upload images
- View orders
- (Demo mode - changes not persisted)

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox & Grid
- **JavaScript (ES6+)** - Vanilla JS, no frameworks required
- **LocalStorage** - Client-side data persistence
- **SVG** - Scalable vector graphics for logos and icons

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Notes

This is a **frontend-only demonstration**. For production use:
- Implement backend API for product management
- Use secure payment gateway (Stripe, PayPal, etc.)
- Add user authentication
- Implement server-side validation
- Use HTTPS
- Add CSRF protection
- Sanitize user inputs

## 📝 Important Disclaimers

⚠️ **For Educational Purposes Only**

This website is created as a demonstration/educational project. It is inspired by gsmserver.com but is **not affiliated** with or endorsed by GSM Server.

- No real transactions are processed
- No actual payment information is collected
- Product data is for demonstration only
- Images may be placeholders

## 🤝 Contributing

This is a demonstration project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational purposes. Please ensure you have appropriate rights for any content used.

## 📞 Support

For questions or issues with this demonstration:
- Check the code comments in each file
- Review the documentation in this README
- Examine the browser console for errors

## 🎯 Future Enhancements

Potential additions for a production version:
- Backend API (Node.js/Express, Python/Flask, PHP/Laravel)
- Database (PostgreSQL, MongoDB, MySQL)
- User authentication and accounts
- Real payment processing
- Email notifications
- Advanced analytics
- Inventory management
- Order tracking system
- Live chat integration
- Reviews and ratings system
- Wishlist functionality
- Product recommendations
- SEO optimization
- Progressive Web App (PWA) features

## 📚 Learning Resources

This project demonstrates:
- Responsive web design principles
- E-commerce UX best practices
- Multi-language/multi-currency implementation
- Client-side state management
- CRUD operations
- Component-based architecture
- Modern CSS techniques
- Vanilla JavaScript patterns

---

**Built with ❤️ for educational purposes**

*Last updated: October 2, 2025*
