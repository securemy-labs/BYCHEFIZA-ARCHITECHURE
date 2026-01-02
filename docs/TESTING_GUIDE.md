# Testing Guide

## Overview

This guide covers testing strategies and practices for the BYCHEFIZA platform.

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\
     /      \    Integration Tests (Some)
    /________\
   /          \  Unit Tests (Many)
  /____________\
```

---

## Unit Testing

### Running Unit Tests

```bash
# Test all services
npm run test:services

# Test specific service
cd services/api-gateway
npm test

# With coverage
npm test -- --coverage
```

### Example Unit Test (Auth Service)

```javascript
// services/auth-service/src/__tests__/authController.test.js
const authController = require('../controllers/authController');

describe('AuthController', () => {
  describe('login', () => {
    it('should return token on valid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: expect.any(String)
        })
      );
    });

    it('should return 401 on invalid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
```

---

## Integration Testing

### Testing with Docker Compose

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration

# Cleanup
docker-compose -f docker-compose.test.yml down
```

### Example Integration Test

```javascript
// tests/integration/api-gateway.test.js
const axios = require('axios');

describe('API Gateway Integration', () => {
  const baseURL = 'http://localhost:3000/api';

  it('should route to auth service', async () => {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
  });

  it('should route to product service', async () => {
    const response = await axios.get(`${baseURL}/products`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('products');
  });
});
```

---

## End-to-End Testing

### Setup

```bash
# Install dependencies
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

### Example E2E Test

```javascript
// tests/e2e/user-flow.spec.js
const { test, expect } = require('@playwright/test');

test('complete user purchase flow', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3001');
  
  // Login
  await page.click('text=Login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Browse products
  await page.click('text=Products');
  await expect(page).toHaveURL(/.*products/);
  
  // Add to cart
  await page.click('.product-card:first-child');
  await page.click('text=Add to Cart');
  
  // Checkout
  await page.click('text=Cart');
  await page.click('text=Checkout');
  
  // Verify order confirmation
  await expect(page.locator('text=Order Confirmed')).toBeVisible();
});
```

---

## API Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products with auth
TOKEN="your-jwt-token"
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import collection from `tests/postman/BYCHEFIZA.postman_collection.json`
2. Set environment variables
3. Run collection

### Using REST Client (VS Code)

```http
### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Products
GET http://localhost:3000/api/products
Authorization: Bearer {{token}}
```

---

## Load Testing

### Using Apache Bench (ab)

```bash
# Test API Gateway
ab -n 1000 -c 10 http://localhost:3000/health

# Test with POST
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/auth/login
```

### Using k6

```javascript
// tests/load/spike-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Spike to 200
    { duration: '5m', target: 200 }, // Stay at 200
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/api/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

Run the test:
```bash
k6 run tests/load/spike-test.js
```

---

## Security Testing

### OWASP ZAP

```bash
# Pull ZAP Docker image
docker pull owasp/zap2docker-stable

# Run baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000

# Full scan
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t http://localhost:3000
```

### Dependency Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check specific service
cd services/api-gateway
npm audit
```

### Trivy (Container Scanning)

```bash
# Scan Docker image
trivy image bychefiza/api-gateway:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL bychefiza/api-gateway:latest
```

---

## Performance Testing

### Response Time Testing

```javascript
// tests/performance/response-time.test.js
const axios = require('axios');

describe('Performance Tests', () => {
  it('should respond within 200ms for health check', async () => {
    const start = Date.now();
    await axios.get('http://localhost:3000/health');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(200);
  });

  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() => 
      axios.get('http://localhost:3000/api/products')
    );
    
    const start = Date.now();
    await Promise.all(requests);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(5000); // 5 seconds for 100 requests
  });
});
```

---

## Database Testing

### PostgreSQL

```bash
# Connect to test database
docker exec -it bychefiza-postgres psql -U admin -d bychefiza_test

# Run test migrations
npm run migrate:test

# Seed test data
npm run seed:test
```

### MongoDB

```bash
# Connect to test database
docker exec -it bychefiza-mongodb mongosh bychefiza_test

# Seed test data
npm run seed:mongo:test
```

---

## Continuous Testing

### Pre-commit Hooks

```bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

### CI Pipeline Testing

See `.github/workflows/ci-cd.yml` for automated testing in CI.

---

## Test Coverage

### Generate Coverage Report

```bash
# All services
npm run test:coverage

# Specific service
cd services/api-gateway
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Coverage Goals

- **Unit Tests**: > 80% coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user flows covered

---

## Mocking and Stubbing

### Database Mocking

```javascript
const mockDatabase = {
  users: [
    { id: 1, email: 'test@example.com' }
  ],
  findUser: jest.fn((email) => {
    return mockDatabase.users.find(u => u.email === email);
  })
};
```

### External Service Mocking

```javascript
jest.mock('axios');
axios.post.mockResolvedValue({
  data: { success: true }
});
```

---

## Test Data Management

### Test Fixtures

```javascript
// tests/fixtures/users.js
module.exports = {
  validUser: {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'admin123',
    username: 'admin',
    role: 'admin'
  }
};
```

### Using Factories

```javascript
const Factory = require('factory-girl').factory;

Factory.define('user', User, {
  email: Factory.seq('User.email', (n) => `user${n}@example.com`),
  username: Factory.seq('User.username', (n) => `user${n}`),
  password: 'password123'
});

// Usage
const user = await Factory.create('user');
```

---

## Best Practices

1. **Write tests first** (TDD approach)
2. **Keep tests independent** and isolated
3. **Use descriptive test names**
4. **Follow AAA pattern**: Arrange, Act, Assert
5. **Mock external dependencies**
6. **Clean up after tests**
7. **Test edge cases** and error conditions
8. **Maintain test data** separately
9. **Run tests in CI/CD** pipeline
10. **Review test coverage** regularly

---

## Debugging Tests

### Debug in VS Code

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [k6 Documentation](https://k6.io/docs/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

## Support

For testing support:
- Email: qa@securemy-labs.com
- Issues: https://github.com/securemy-labs/BYCHEFIZA-ARCHITECHURE/issues
