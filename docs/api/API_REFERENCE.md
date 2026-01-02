# API Documentation

## Overview

The BYCHEFIZA platform exposes RESTful APIs through a centralized API Gateway. All client requests should be made to the API Gateway which routes them to the appropriate microservices.

**Base URL**: `http://localhost:3000/api`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": true,
  "message": "Error description"
}
```

## API Endpoints

### Authentication Service

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Verify Token
```http
POST /api/auth/verify
```

**Headers:**
```
Authorization: Bearer <token>
```

---

### User Service

#### Get All Users
```http
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@bychefiza.com",
      "role": "admin"
    }
  ]
}
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "customer"
}
```

#### Update User
```http
PUT /api/users/:id
```

#### Delete User
```http
DELETE /api/users/:id
```

---

### Product Service

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search term

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "64abc123...",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "electronics",
      "stock": 50,
      "rating": 4.5,
      "reviews": 120,
      "images": ["url1", "url2"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "stock": 100,
  "images": ["image-url"]
}
```

#### Update Product
```http
PUT /api/products/:id
```

#### Delete Product
```http
DELETE /api/products/:id
```

---

### Order Service

#### Get All Orders
```http
GET /api/orders
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "1",
      "userId": "123",
      "items": [...],
      "totalAmount": 299.99,
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Order by ID
```http
GET /api/orders/:id
```

#### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "userId": "123",
  "items": [
    {
      "productId": "64abc123...",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalAmount": 199.98
}
```

#### Update Order Status
```http
PUT /api/orders/:id
```

**Request Body:**
```json
{
  "status": "completed"
}
```

---

### Payment Service

#### Process Payment
```http
POST /api/payments/process
```

**Request Body:**
```json
{
  "orderId": "123",
  "amount": 199.98,
  "method": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "1",
    "orderId": "123",
    "amount": 199.98,
    "method": "credit_card",
    "status": "completed",
    "transactionId": "txn_1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Payment Status
```http
GET /api/payments/:id
```

#### Refund Payment
```http
POST /api/payments/refund
```

**Request Body:**
```json
{
  "paymentId": "1"
}
```

---

## Health Check Endpoints

Each service provides a health check endpoint:

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "service-name",
  "version": "1.0.0"
}
```

## Rate Limiting

The API Gateway implements rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Response on limit exceeded**: 429 Too Many Requests

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Example Usage

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Get Products:**
```bash
curl http://localhost:3000/api/products?page=1&limit=10
```

**Create Order (with auth):**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":"123","items":[...],"totalAmount":199.98}'
```

### JavaScript Examples

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const data = await response.json();

// Get products with authentication
const products = await fetch('http://localhost:3000/api/products', {
  headers: {
    'Authorization': `Bearer ${data.token}`
  }
});
```

## WebSocket Support (Future)

WebSocket endpoints will be available for real-time features:
- Order status updates
- Live inventory updates
- Chat support

## Versioning

API versioning will be implemented in future releases:
- `v1`: Current version
- Future: `/api/v2/...`

## Support

For API support and questions:
- Email: api-support@bychefiza.com
- Documentation: https://docs.bychefiza.com
- Issues: https://github.com/securemy-labs/BYCHEFIZA-ARCHITECHURE/issues
