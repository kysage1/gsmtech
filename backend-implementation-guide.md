# Backend Implementation Guide

This guide provides a complete implementation roadmap for the TechHub Store backend.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Implementation Steps](#implementation-steps)
5. [API Implementation](#api-implementation)
6. [Payment Integration](#payment-integration)
7. [Security Implementation](#security-implementation)
8. [Deployment](#deployment)

## Architecture Overview

```
┌─────────────┐
│   Frontend  │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────┐
│   Nginx     │
│ (Reverse    │
│   Proxy)    │
└──────┬──────┘
       │
       │
┌──────▼──────────────────┐
│   Node.js/Express API   │
│   ┌──────────────────┐  │
│   │ Authentication   │  │
│   │ Middleware       │  │
│   └──────────────────┘  │
│   ┌──────────────────┐  │
│   │ Route Handlers   │  │
│   └──────────────────┘  │
│   ┌──────────────────┐  │
│   │ Business Logic   │  │
│   └──────────────────┘  │
└────┬──────────┬─────────┘
     │          │
     │          │
┌────▼──────┐  ┌▼─────────┐
│PostgreSQL │  │  Redis   │
│ Database  │  │  Cache   │
└───────────┘  └──────────┘
```

## Technology Stack

### Core Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL 14+** - Primary database
- **Redis** - Caching and session storage

### Authentication & Security
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **cors** - CORS handling

### Payment Processing
- **stripe** - Credit card processing
- **@paypal/checkout-server-sdk** - PayPal integration
- **crypto payment APIs** - Cryptocurrency payments

### Email & Notifications
- **nodemailer** - Email sending
- **twilio** - SMS notifications
- **socket.io** - Real-time notifications

### Testing & Quality
- **jest** - Testing framework
- **supertest** - API testing
- **eslint** - Code linting
- **prettier** - Code formatting

### DevOps
- **pm2** - Process management
- **winston** - Logging
- **morgan** - HTTP logging
- **dotenv** - Environment configuration

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── passport.ts
│   │   └── stripe.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimit.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Credit.ts
│   │   ├── License.ts
│   │   └── Ticket.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── credits.ts
│   │   ├── activations.ts
│   │   ├── payments.ts
│   │   ├── support.ts
│   │   └── admin.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── creditController.ts
│   │   ├── activationController.ts
│   │   ├── paymentController.ts
│   │   └── supportController.ts
│   ├── services/
│   │   ├── emailService.ts
│   │   ├── stripeService.ts
│   │   ├── paypalService.ts
│   │   ├── licenseService.ts
│   │   └── notificationService.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── migrations/
├── seeds/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation Steps

### Step 1: Initialize Project

```bash
# Create project directory
mkdir backend && cd backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express pg redis ioredis jsonwebtoken bcryptjs \
  stripe dotenv cors helmet express-rate-limit morgan \
  winston nodemailer socket.io

# Install dev dependencies
npm install -D typescript @types/node @types/express \
  @types/jsonwebtoken @types/bcryptjs @types/cors \
  ts-node nodemon eslint prettier jest supertest

# Initialize TypeScript
npx tsc --init
```

### Step 2: Configure TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3: Create Environment Configuration

```bash
# .env.example
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/techhub_store
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techhub_store
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@techhub.com
SMTP_PASS=your-email-password

# Support
SUPPORT_EMAIL=support@techhub.com
SUPPORT_PHONE=+1234567890
SUPPORT_WHATSAPP=+1234567890

# Frontend URL
FRONTEND_URL=http://localhost:8000

# API
API_VERSION=v1
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

## API Implementation

### Authentication Controller

```typescript
// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user exists
      const userExists = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists'
          }
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, phone)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, created_at`,
        [name, email, passwordHash, phone]
      );

      const user = result.rows[0];

      // Generate tokens
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
      );

      // Store session
      await pool.query(
        `INSERT INTO user_sessions (user_id, token_hash, refresh_token_hash, expires_at, ip_address, user_agent)
         VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', $4, $5)`,
        [
          user.id,
          await bcrypt.hash(token, 10),
          await bcrypt.hash(refreshToken, 10),
          req.ip,
          req.get('user-agent')
        ]
      );

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Get user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND status = $2',
        [email, 'active']
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      // Generate tokens
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Update last login
      await pool.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      // Invalidate session
      await pool.query(
        'DELETE FROM user_sessions WHERE user_id = $1',
        [userId]
      );

      res.json({
        success: true,
        message: 'Successfully logged out'
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Product Controller

```typescript
// src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

export class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category,
        page = 1,
        limit = 20,
        sort = 'created_at',
        order = 'desc'
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let query = `
        SELECT p.*, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
      `;

      const params: any[] = [];

      if (category) {
        params.push(category);
        query += ` AND c.slug = $${params.length}`;
      }

      query += ` ORDER BY ${sort} ${order}`;
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      // Get total count
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM products WHERE is_active = true'
      );

      const total = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        data: {
          products: result.rows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT p.*, c.name as category_name,
         (SELECT json_agg(json_build_object('url', url, 'alt_text', alt_text))
          FROM product_images WHERE product_id = p.id) as images
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.id = $1 AND p.is_active = true`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found'
          }
        });
      }

      // Track product view
      await pool.query(
        `INSERT INTO product_views (product_id, user_id, session_id, ip_address)
         VALUES ($1, $2, $3, $4)`,
        [id, req.user?.id, req.sessionID, req.ip]
      );

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Order Controller

```typescript
// src/controllers/orderController.ts
import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';
import { StripeService } from '../services/stripeService';

export class OrderController {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const userId = req.user?.id;
      const { payment_method, shipping_address } = req.body;

      // Get cart items
      const cartResult = await client.query(
        `SELECT ci.*, p.name, p.price, p.product_type
         FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         JOIN products p ON ci.product_id = p.id
         WHERE c.user_id = $1`,
        [userId]
      );

      if (cartResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'EMPTY_CART', message: 'Cart is empty' }
        });
      }

      // Calculate totals
      const subtotal = cartResult.rows.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (
          user_id, customer_name, customer_email, customer_phone,
          subtotal, tax, total, payment_method, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
        RETURNING *`,
        [
          userId,
          req.user?.name,
          req.user?.email,
          req.user?.phone,
          subtotal,
          tax,
          total,
          payment_method
        ]
      );

      const order = orderResult.rows[0];

      // Create order items
      for (const item of cartResult.rows) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, product_name, product_type,
            sku, price, quantity, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            order.id,
            item.product_id,
            item.name,
            item.product_type,
            item.sku,
            item.price,
            item.quantity,
            parseFloat(item.price) * item.quantity
          ]
        );
      }

      // Clear cart
      await client.query(
        'DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = $1)',
        [userId]
      );

      // Create payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent(
        total,
        'usd',
        order.id
      );

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: {
          order_id: order.id,
          order_number: order.order_number,
          payment_intent_id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          total
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  }
}
```

## Payment Integration

### Stripe Service

```typescript
// src/services/stripeService.ts
import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    orderId: string
  ) {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { order_id: orderId }
    });
  }

  async handleWebhook(body: any, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
    }
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    const orderId = paymentIntent.metadata.order_id;
    // Update order status, send confirmation email, etc.
  }

  private async handlePaymentFailure(paymentIntent: any) {
    const orderId = paymentIntent.metadata.order_id;
    // Handle payment failure
  }
}
```

## Security Implementation

### Authentication Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
};
```

## Deployment

### PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'techhub-api',
    script: './dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.techhub.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: techhub_store
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Next Steps

1. Implement all controllers
2. Add comprehensive error handling
3. Set up testing framework
4. Configure CI/CD pipeline
5. Implement monitoring and logging
6. Set up backup strategy
7. Configure SSL certificates
8. Implement rate limiting
9. Add API documentation (Swagger)
10. Load testing and optimization
