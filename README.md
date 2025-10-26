# TechHub Store - Professional E-commerce Platform

A comprehensive e-commerce platform for GSM tools and services, featuring Credits, Activations, Boxes & Dongles.

## 🚀 Features

### Customer Features
- **Product Catalog**
  - Credits packages (100, 500, 1000)
  - Software activations (1 month, 6 months, lifetime)
  - Hardware products (Boxes, Dongles, Tool Kits)
  - Category filtering and search
  
- **Shopping Experience**
  - Interactive shopping cart
  - Real-time cart updates
  - Multiple product categories
  - Product details and specifications

- **User Authentication**
  - Sign up / Sign in
  - User profile management
  - Order history tracking
  - Credit balance management

- **Checkout & Payment**
  - Multiple payment methods:
    - Credit/Debit Cards (Stripe)
    - PayPal
    - Cryptocurrency (Bitcoin, Ethereum, USDT)
  - Secure payment processing
  - Order confirmation
  
- **Order Management**
  - Order tracking
  - Order status updates
  - Order history
  - Digital product delivery

- **Support System**
  - 24/7 support contact options
  - WhatsApp integration
  - Email support
  - Phone support
  - Telegram support
  - Support ticket system

### Admin Features
- **Dashboard**
  - Revenue statistics
  - Order management
  - User analytics
  - Product inventory
  
- **Order Management**
  - View all orders
  - Update order status
  - Process refunds
  - Track shipping

- **User Management**
  - View all users
  - Manage user accounts
  - Credit adjustments
  - User analytics

- **Product Management**
  - Add/Edit/Delete products
  - Inventory management
  - Pricing updates
  - Category management

## 📁 Project Structure

```
/workspace/
├── index.html              # Main application (single-page app)
├── api-documentation.md    # Complete API documentation
├── database-schema.sql     # PostgreSQL database schema
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome 6.4.0** - Icons
- **Responsive Design** - Mobile-first approach

### Backend (Recommended)
- **Node.js** with Express.js
- **PostgreSQL** - Primary database
- **Redis** - Session management and caching
- **JWT** - Authentication

### Payment Integration
- **Stripe** - Credit/Debit cards
- **PayPal** - PayPal payments
- **Crypto Gateway** - Cryptocurrency payments

## 🗄️ Database Schema

The complete database schema is available in `database-schema.sql`. Key tables include:

### Core Tables
- `users` - User accounts and authentication
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `payments` - Payment transactions

### Feature-Specific Tables
- `credit_transactions` - Credit purchase and usage tracking
- `licenses` - License key management
- `activations` - Software activation tracking
- `support_tickets` - Support ticket system
- `notifications` - User notifications

### Analytics Tables
- `page_views` - Page view tracking
- `product_views` - Product view analytics
- `audit_logs` - System audit trail

## 📚 API Documentation

Complete API documentation is available in `api-documentation.md`, covering:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh

### Product Endpoints
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Credit Endpoints
- `GET /credits/balance` - Get credit balance
- `GET /credits/transactions` - Transaction history
- `POST /credits/purchase` - Purchase credits

### Activation Endpoints
- `GET /activations` - List activations
- `POST /activations/activate` - Activate license
- `POST /activations/validate` - Validate activation
- `POST /activations/deactivate` - Deactivate license

### Order Endpoints
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order
- `POST /orders/:id/cancel` - Cancel order

### Support Endpoints
- `POST /support/tickets` - Create support ticket
- `GET /support/tickets` - List support tickets
- `GET /support/tickets/:id` - Get ticket details
- `POST /support/tickets/:id/reply` - Reply to ticket

### Admin Endpoints
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/orders` - All orders
- `PUT /admin/orders/:id` - Update order
- `GET /admin/users` - All users
- `GET /admin/analytics` - Analytics data

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18+ (for backend)
- PostgreSQL 14+ (for database)
- Redis (for caching)

### Frontend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd workspace
```

2. **Open the application**
```bash
# Option 1: Direct file open
open index.html

# Option 2: Using Python server
python3 -m http.server 8000

# Option 3: Using Node.js http-server
npx http-server -p 8000
```

3. **Access the application**
```
http://localhost:8000
```

### Backend Setup

1. **Install dependencies**
```bash
npm init -y
npm install express pg redis jsonwebtoken bcrypt stripe dotenv cors helmet
```

2. **Create `.env` file**
```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/techhub_store

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@techhub.com
SMTP_PASS=your-password

# Support
SUPPORT_EMAIL=support@techhub.com
SUPPORT_PHONE=+1234567890
SUPPORT_WHATSAPP=+1234567890
```

3. **Initialize database**
```bash
psql -U postgres -d techhub_store -f database-schema.sql
```

4. **Start the server**
```bash
node server.js
```

## 📱 Features Walkthrough

### For Customers

#### 1. Browse Products
- Visit the home page
- Click "Browse Products" or navigate to Products section
- Use category tabs to filter: All, Credits, Activations, Hardware
- Click on any product to view details

#### 2. Add to Cart
- Click "Add to Cart" on any product
- Cart badge updates with item count
- Click cart icon to view cart sidebar

#### 3. Checkout
- Review items in cart
- Click "Proceed to Checkout"
- Fill in customer information
- Select payment method
- Complete payment

#### 4. Track Orders
- Sign in to your account
- Navigate to "My Orders"
- View order status and details
- Track shipments (for hardware products)

#### 5. Manage Credits
- Purchase credit packages
- View credit balance in profile
- Use credits for services
- Track credit transactions

#### 6. Software Activations
- Purchase activation licenses
- Receive license key instantly
- Activate on your device
- Manage active installations

#### 7. Get Support
- Navigate to Support section
- Choose contact method:
  - WhatsApp (instant messaging)
  - Email (detailed inquiries)
  - Phone (urgent matters)
  - Telegram (quick support)
- Submit support ticket for complex issues

### For Administrators

#### 1. Access Admin Dashboard
- Sign in with admin account
- Navigate to Admin section
- View key metrics:
  - Total revenue
  - Order counts
  - Active users
  - Pending orders

#### 2. Manage Orders
- View all orders in table
- Filter by status
- Update order status
- Process refunds
- Add tracking information

#### 3. Manage Products
- Add new products
- Update prices and inventory
- Manage product categories
- Upload product images
- Set product visibility

#### 4. User Management
- View all registered users
- Adjust credit balances
- View user order history
- Manage user status
- Handle support tickets

## 🔐 Security Features

- **Authentication**
  - JWT-based authentication
  - Secure password hashing (bcrypt)
  - Session management
  - Token refresh mechanism

- **Payment Security**
  - PCI-DSS compliant payment processing
  - Secure payment gateway integration
  - No card data stored locally
  - SSL/TLS encryption

- **Data Protection**
  - Input validation and sanitization
  - SQL injection prevention
  - XSS protection
  - CSRF protection
  - Rate limiting

- **Privacy**
  - GDPR compliant
  - User data encryption
  - Secure password storage
  - Audit logging

## 🎨 Customization

### Theme Colors
Edit CSS variables in `index.html`:
```css
:root {
    --primary: #2563eb;      /* Primary brand color */
    --secondary: #7c3aed;    /* Secondary brand color */
    --accent: #10b981;       /* Accent color */
    --dark: #1e293b;         /* Dark text */
    --light: #f8fafc;        /* Light background */
}
```

### Contact Information
Update support contacts in the Support section:
```javascript
// In the support section HTML
<div class="support-card">
    <i class="fab fa-whatsapp"></i>
    <h3>WhatsApp</h3>
    <p>+1 (555) 123-4567</p>
    <a href="https://wa.me/15551234567">Chat Now</a>
</div>
```

### Payment Methods
Add or remove payment methods in the checkout modal:
```html
<div class="payment-method" onclick="selectPayment(this, 'method_id')">
    <i class="fas fa-icon"></i>
    <div>
        <strong>Payment Method Name</strong>
        <p>Payment method description</p>
    </div>
</div>
```

### Product Catalog
Add products directly in HTML or through API:
```html
<div class="product-card" data-category="category_name">
    <div class="product-icon">
        <i class="fas fa-icon"></i>
    </div>
    <h3>Product Name</h3>
    <p>Product description</p>
    <div class="product-price">$99.00</div>
    <button class="add-to-cart" onclick="addToCart('Product', 99.00, 'category')">
        Add to Cart
    </button>
</div>
```

## 📊 Analytics & Reporting

The platform includes comprehensive analytics:

### Revenue Analytics
- Daily/weekly/monthly revenue
- Revenue by product category
- Revenue trends and forecasts
- Payment method breakdown

### User Analytics
- New user registrations
- Active users
- User retention rate
- Customer lifetime value

### Product Analytics
- Best-selling products
- Product views and conversions
- Inventory levels
- Product performance metrics

### Order Analytics
- Order volume trends
- Average order value
- Order fulfillment time
- Cancellation rates

## 🔧 Maintenance

### Database Backup
```bash
# Backup database
pg_dump -U postgres techhub_store > backup_$(date +%Y%m%d).sql

# Restore database
psql -U postgres techhub_store < backup_20251026.sql
```

### Cache Management
```bash
# Clear Redis cache
redis-cli FLUSHALL
```

### Log Management
- Monitor application logs
- Set up log rotation
- Configure error tracking
- Implement monitoring alerts

## 🤝 Support

### For Users
- **Email**: support@techhub.com
- **WhatsApp**: +1 (555) 123-4567
- **Phone**: +1 (555) 987-6543
- **Telegram**: @techhubsupport

### For Developers
- Refer to `api-documentation.md` for API details
- Check `database-schema.sql` for database structure
- Review inline code comments
- Submit issues on GitHub

## 📝 License

Copyright © 2025 TechHub Store. All rights reserved.

## 🚀 Future Enhancements

### Planned Features
- [ ] Mobile app (iOS & Android)
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Wishlist functionality
- [ ] Loyalty points program
- [ ] Referral system
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Multi-currency support
- [ ] Subscription management
- [ ] Automated email marketing
- [ ] Advanced analytics dashboard
- [ ] API rate limiting dashboard
- [ ] Two-factor authentication
- [ ] Social media integration

### Technical Improvements
- [ ] GraphQL API
- [ ] Real-time notifications (WebSocket)
- [ ] Progressive Web App (PWA)
- [ ] Server-side rendering (SSR)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] CDN integration

## 📈 Performance Optimization

### Frontend
- Lazy loading images
- Code splitting
- Minification and compression
- Browser caching
- Service worker for offline support

### Backend
- Database query optimization
- Redis caching strategy
- Connection pooling
- Load balancing
- CDN for static assets

### Database
- Proper indexing
- Query optimization
- Regular VACUUM operations
- Partitioning large tables
- Read replicas for scaling

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### API Tests
```bash
npm run test:api
```

## 📞 Contact

For business inquiries or technical support:
- **Website**: https://techhub.com
- **Email**: info@techhub.com
- **Phone**: +1 (555) 123-4567

---

**Built with ❤️ for the GSM tools community**
