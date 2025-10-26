# API Documentation - TechHub Store

## Base URL
```
https://api.techhub.com/v1
```

## Authentication
All API requests require authentication using Bearer tokens.

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-10-26T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/logout
Invalidate current session token.

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

#### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refresh_token": "new_refresh_token"
  }
}
```

---

### Products

#### GET /products
Retrieve all products.

**Query Parameters:**
- `category` (optional): Filter by category (credits, activations, hardware)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort by (price, name, created_at)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "100 Credits",
        "description": "Perfect for small projects and testing",
        "price": 10.00,
        "category": "credits",
        "in_stock": true,
        "metadata": {
          "credits_amount": 100,
          "validity": "never_expires"
        },
        "created_at": "2025-10-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### GET /products/:id
Retrieve specific product details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Professional Box v5",
    "description": "Latest generation unlocking box",
    "price": 299.00,
    "category": "hardware",
    "in_stock": true,
    "stock_count": 15,
    "specifications": {
      "model": "PB-V5",
      "warranty": "1 year",
      "shipping_weight": "500g"
    },
    "images": [
      "https://cdn.techhub.com/products/pb-v5-1.jpg",
      "https://cdn.techhub.com/products/pb-v5-2.jpg"
    ],
    "created_at": "2025-10-01T00:00:00Z"
  }
}
```

#### POST /products (Admin only)
Create new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "credits",
  "in_stock": true,
  "stock_count": 100,
  "metadata": {
    "key": "value"
  }
}
```

#### PUT /products/:id (Admin only)
Update existing product.

#### DELETE /products/:id (Admin only)
Delete product.

---

### Credits

#### GET /credits/balance
Get user's credit balance.

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "usr_abc123",
    "balance": 450,
    "pending": 50,
    "total_purchased": 1000,
    "total_used": 550
  }
}
```

#### GET /credits/transactions
Get credit transaction history.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by type (purchase, usage, refund)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_xyz789",
        "type": "purchase",
        "amount": 100,
        "balance_after": 450,
        "description": "Purchased 100 credits",
        "created_at": "2025-10-26T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

#### POST /credits/purchase
Purchase credits.

**Request Body:**
```json
{
  "product_id": "prod_123",
  "payment_method": "stripe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "txn_xyz789",
    "credits_added": 100,
    "new_balance": 450,
    "payment": {
      "id": "pay_abc123",
      "amount": 10.00,
      "status": "completed"
    }
  }
}
```

---

### Activations

#### GET /activations
Get user's activations.

**Response:**
```json
{
  "success": true,
  "data": {
    "activations": [
      {
        "id": "act_123",
        "product_name": "Tool Activation - 1 Month",
        "license_key": "XXXX-XXXX-XXXX-XXXX",
        "status": "active",
        "activated_at": "2025-10-01T00:00:00Z",
        "expires_at": "2025-11-01T00:00:00Z",
        "device_id": "dev_abc123"
      }
    ]
  }
}
```

#### POST /activations/activate
Activate a license.

**Request Body:**
```json
{
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "device_id": "unique_device_identifier",
  "device_info": {
    "os": "Windows 11",
    "hardware_id": "hw_123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activation_id": "act_123",
    "status": "active",
    "expires_at": "2025-11-01T00:00:00Z",
    "features_enabled": ["feature1", "feature2"]
  }
}
```

#### POST /activations/validate
Validate an activation.

**Request Body:**
```json
{
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "device_id": "unique_device_identifier"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "status": "active",
    "expires_at": "2025-11-01T00:00:00Z"
  }
}
```

#### POST /activations/deactivate
Deactivate a license from a device.

**Request Body:**
```json
{
  "activation_id": "act_123"
}
```

---

### Cart

#### GET /cart
Get user's cart.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_abc123",
    "items": [
      {
        "id": "item_1",
        "product_id": "prod_123",
        "name": "100 Credits",
        "price": 10.00,
        "quantity": 1,
        "subtotal": 10.00
      }
    ],
    "subtotal": 10.00,
    "tax": 0.80,
    "total": 10.80,
    "currency": "USD"
  }
}
```

#### POST /cart/add
Add item to cart.

**Request Body:**
```json
{
  "product_id": "prod_123",
  "quantity": 1
}
```

#### PUT /cart/update
Update cart item quantity.

**Request Body:**
```json
{
  "item_id": "item_1",
  "quantity": 2
}
```

#### DELETE /cart/remove/:item_id
Remove item from cart.

#### DELETE /cart/clear
Clear entire cart.

---

### Orders

#### GET /orders
Get user's orders.

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_123",
        "order_number": "ORD-1001",
        "status": "completed",
        "items": [
          {
            "product_name": "500 Credits",
            "quantity": 1,
            "price": 45.00
          }
        ],
        "subtotal": 45.00,
        "tax": 3.60,
        "shipping": 0.00,
        "total": 48.60,
        "payment_method": "stripe",
        "payment_status": "paid",
        "created_at": "2025-10-25T10:00:00Z",
        "updated_at": "2025-10-25T10:05:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

#### GET /orders/:id
Get specific order details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord_123",
    "order_number": "ORD-1001",
    "status": "completed",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "items": [
      {
        "id": "item_1",
        "product_id": "prod_123",
        "product_name": "500 Credits",
        "quantity": 1,
        "price": 45.00,
        "subtotal": 45.00
      }
    ],
    "subtotal": 45.00,
    "tax": 3.60,
    "shipping": 0.00,
    "total": 48.60,
    "payment": {
      "method": "stripe",
      "status": "paid",
      "transaction_id": "pi_abc123",
      "paid_at": "2025-10-25T10:05:00Z"
    },
    "shipping_address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "US"
    },
    "tracking": {
      "carrier": "UPS",
      "tracking_number": "1Z999AA10123456784",
      "status": "delivered"
    },
    "created_at": "2025-10-25T10:00:00Z",
    "updated_at": "2025-10-25T10:05:00Z"
  }
}
```

#### POST /orders
Create new order from cart.

**Request Body:**
```json
{
  "payment_method": "stripe",
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "billing_same_as_shipping": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "ord_123",
    "order_number": "ORD-1001",
    "payment_intent_id": "pi_abc123",
    "client_secret": "pi_abc123_secret_xyz",
    "total": 48.60
  }
}
```

#### POST /orders/:id/cancel
Cancel an order.

---

### Payments

#### POST /payments/create-intent
Create payment intent for Stripe.

**Request Body:**
```json
{
  "amount": 48.60,
  "currency": "USD",
  "order_id": "ord_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "client_secret": "pi_abc123_secret_xyz",
    "payment_intent_id": "pi_abc123"
  }
}
```

#### POST /payments/webhook/stripe
Stripe webhook endpoint for payment events.

#### POST /payments/webhook/paypal
PayPal webhook endpoint.

#### POST /payments/webhook/crypto
Cryptocurrency payment webhook.

#### GET /payments/methods
Get available payment methods.

**Response:**
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "stripe",
        "name": "Credit/Debit Card",
        "enabled": true,
        "currencies": ["USD", "EUR", "GBP"]
      },
      {
        "id": "paypal",
        "name": "PayPal",
        "enabled": true,
        "currencies": ["USD", "EUR", "GBP"]
      },
      {
        "id": "crypto",
        "name": "Cryptocurrency",
        "enabled": true,
        "currencies": ["BTC", "ETH", "USDT"]
      }
    ]
  }
}
```

---

### Support

#### POST /support/tickets
Create support ticket.

**Request Body:**
```json
{
  "subject": "Payment Issue",
  "category": "payment",
  "priority": "high",
  "message": "I'm having trouble with my payment...",
  "order_id": "ord_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticket_id": "ticket_123",
    "ticket_number": "TICK-1001",
    "status": "open",
    "created_at": "2025-10-26T10:00:00Z"
  }
}
```

#### GET /support/tickets
Get user's support tickets.

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "ticket_123",
        "ticket_number": "TICK-1001",
        "subject": "Payment Issue",
        "status": "open",
        "priority": "high",
        "created_at": "2025-10-26T10:00:00Z",
        "updated_at": "2025-10-26T10:30:00Z",
        "messages_count": 3
      }
    ]
  }
}
```

#### GET /support/tickets/:id
Get specific ticket details with messages.

#### POST /support/tickets/:id/reply
Add reply to ticket.

**Request Body:**
```json
{
  "message": "Thank you for the update...",
  "attachments": ["url1", "url2"]
}
```

#### PUT /support/tickets/:id/close
Close a ticket.

---

### User Profile

#### GET /users/profile
Get user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "credits_balance": 450,
    "total_orders": 12,
    "total_spent": 540.00,
    "created_at": "2025-01-01T00:00:00Z",
    "verified": true
  }
}
```

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

#### PUT /users/password
Change password.

**Request Body:**
```json
{
  "current_password": "oldPassword",
  "new_password": "newPassword123"
}
```

#### GET /users/addresses
Get saved addresses.

#### POST /users/addresses
Add new address.

#### DELETE /users/addresses/:id
Delete address.

---

### Admin Endpoints

#### GET /admin/dashboard
Get dashboard statistics (Admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "today": 450.00,
      "week": 2350.00,
      "month": 12450.00,
      "year": 145000.00
    },
    "orders": {
      "today": 12,
      "week": 67,
      "month": 234,
      "pending": 12,
      "processing": 23,
      "completed": 199
    },
    "users": {
      "total": 1234,
      "new_today": 5,
      "new_week": 23,
      "active": 567
    },
    "products": {
      "total": 50,
      "in_stock": 45,
      "out_of_stock": 5
    }
  }
}
```

#### GET /admin/orders
Get all orders (Admin only).

#### PUT /admin/orders/:id
Update order status (Admin only).

#### GET /admin/users
Get all users (Admin only).

#### PUT /admin/users/:id
Update user details (Admin only).

#### GET /admin/analytics
Get detailed analytics (Admin only).

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing authentication token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Invalid input data
- `SERVER_ERROR` (500): Internal server error
- `RATE_LIMIT_EXCEEDED` (429): Too many requests

---

## Rate Limiting

API requests are rate-limited:
- Authenticated users: 1000 requests per hour
- Unauthenticated: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1635724800
```

---

## Webhooks

Configure webhooks to receive real-time notifications:

### Events
- `order.created`
- `order.updated`
- `order.completed`
- `payment.succeeded`
- `payment.failed`
- `activation.created`
- `credit.purchased`
- `ticket.created`

### Webhook Payload
```json
{
  "event": "order.created",
  "timestamp": "2025-10-26T10:00:00Z",
  "data": {
    "order_id": "ord_123",
    "order_number": "ORD-1001",
    "total": 48.60
  }
}
```
