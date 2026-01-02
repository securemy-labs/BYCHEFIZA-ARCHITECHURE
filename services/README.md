# Backend Services

This directory contains the backend microservices for BYCHEFIZA, implementing the API layer, business logic, and service orchestration.

## Architecture

The backend follows a microservices architecture with the following services:

- **api-gateway** — API Gateway, routes requests to appropriate services
- **auth-service** — Authentication and authorization (JWT, OAuth, etc.)
- **user-service** — User management and profiles
- **product-service** — Product catalog and inventory
- **order-service** — Order processing and management
- **payment-service** — Payment processing and transactions

Each service is independently deployable and maintains its own data store where appropriate.

## Technology Stack

**Expected runtime** (update based on actual implementation):
- Runtime: Node.js / Python / Go / Java / .NET
- Framework: Express / NestJS / FastAPI / Flask / Gin / Spring Boot
- Database: PostgreSQL / MongoDB / MySQL
- Cache: Redis
- Message Queue: RabbitMQ / Kafka
- Testing: Jest / Mocha / pytest / Go test

## Local Development

### Prerequisites
- Node.js 16+ (for Node.js services) or appropriate runtime for your stack
- Docker and Docker Compose (recommended)
- PostgreSQL, MongoDB, Redis (or use Docker containers)

### Setup All Services

```bash
# From repository root
cd services

# Install dependencies for all services (Node.js example)
for service in */; do
  cd "$service"
  npm install
  cd ..
done
```

### Start Individual Service

Example for auth-service (adjust for your specific service):

```bash
# Navigate to service directory
cd services/auth-service

# Install dependencies
npm install

# Run database migrations
npm run migrate
# or
npm run db:migrate
# or for TypeORM
npm run typeorm migration:run

# Start the service
npm start
# or in development mode with hot reload
npm run dev
```

### Run Tests

```bash
# Run all tests for a service
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Common Environment Variables

Each service should have its own `.env` file. Common variables include:

```bash
# Service Configuration
NODE_ENV=development
PORT=3001
SERVICE_NAME=auth-service

# Database (adjust per service)
DATABASE_URL=postgresql://admin:changeme@localhost:5432/bychefiza_auth
# Or separate variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bychefiza_auth
DB_USER=admin
DB_PASSWORD=changeme

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Message Queue (RabbitMQ/Kafka)
RABBITMQ_URL=amqp://guest:guest@localhost:5672
# or
KAFKA_BROKERS=localhost:9092

# JWT (for auth-service)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h

# Service Discovery (if using)
CONSUL_HOST=localhost
CONSUL_PORT=8500

# Logging
LOG_LEVEL=info

# External Services
SENTRY_DSN=https://your-sentry-dsn
```

**Note**: Copy `.env.example` to `.env` in each service directory and update values.

## Docker

### Build Service Image

```bash
# From repository root
docker build -f services/auth-service/Dockerfile -t bychefiza-auth-service:latest .

# Or from service directory
cd services/auth-service
docker build -t bychefiza-auth-service:latest .
```

### Run with Docker Compose

```bash
# From repository root
docker-compose up -d

# Run specific services
docker-compose up -d api-gateway auth-service user-service

# View logs
docker-compose logs -f auth-service
```

## Database Migrations

### Running Migrations

Each service manages its own database migrations. Example commands:

```bash
# Node.js with Sequelize
npm run migrate
npm run migrate:undo

# Node.js with TypeORM
npm run typeorm migration:run
npm run typeorm migration:revert

# Node.js with Prisma
npx prisma migrate deploy
npx prisma migrate dev

# Python with Alembic
alembic upgrade head
alembic downgrade -1

# Go with golang-migrate
migrate -path ./migrations -database "${DATABASE_URL}" up
migrate -path ./migrations -database "${DATABASE_URL}" down 1
```

### Creating Migrations

```bash
# Sequelize
npm run migrate:generate -- --name add-user-table

# TypeORM
npm run typeorm migration:generate -- -n AddUserTable

# Prisma
npx prisma migrate dev --name add-user-table

# Alembic
alembic revision --autogenerate -m "Add user table"
```

**Note**: Always review auto-generated migrations before running them.

## Service Ports

Default ports for each service (configurable via environment variables):

- **api-gateway**: 3000
- **auth-service**: 3001
- **user-service**: 3002
- **product-service**: 3003
- **order-service**: 3004
- **payment-service**: 3005

## API Documentation

Each service should document its API endpoints:

- Swagger/OpenAPI: Usually available at `http://localhost:<port>/api-docs`
- Postman collections: Check `docs/api/` directory
- Service-specific docs: See individual service READMEs

## Common Commands (per service)

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start service (production mode)
npm start

# Start service (development mode with hot reload)
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build (for TypeScript services)
npm run build

# Generate API documentation
npm run docs:generate
```

## Service Structure (Example)

```
services/auth-service/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration
│   └── index.js        # Entry point
├── tests/
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── migrations/        # Database migrations
├── Dockerfile        # Docker configuration
├── package.json      # Dependencies
├── .env.example      # Environment variables template
└── README.md         # Service-specific documentation
```

## Inter-Service Communication

Services communicate via:
- **REST API**: HTTP requests between services
- **Message Queue**: Asynchronous events via RabbitMQ/Kafka
- **gRPC**: (If implemented) For high-performance service-to-service calls

## Monitoring and Logging

- **Logging**: Structured JSON logs to stdout (captured by container orchestration)
- **Metrics**: Prometheus metrics exposed at `/metrics` endpoint
- **Health checks**: `/health` and `/ready` endpoints for Kubernetes probes
- **Tracing**: Distributed tracing with OpenTelemetry (if implemented)

## Notes

- **Update commands**: Replace placeholder commands with your actual toolchain (npm/yarn/pnpm, Python/Go commands, etc.)
- **Migration tools**: Update migration commands to match your ORM/migration framework
- **Service-specific READMEs**: Each service can have its own README with detailed setup instructions
- **Database per service**: Follow microservices best practices - each service should own its data

## Troubleshooting

- **Port conflicts**: Check if another service is using the same port
- **Database connection errors**: Verify database is running and credentials are correct
- **Migration failures**: Ensure database exists and user has proper permissions
- **Service won't start**: Check logs with `docker-compose logs <service-name>`
- **Module not found**: Run `npm install` or delete `node_modules` and reinstall

## Contributing

Follow the main repository's contributing guidelines. Ensure:
- All tests pass (`npm test`)
- Code is linted (`npm run lint`)
- Migrations are tested and reversible
- API changes are documented

---

**Update this README with actual runtime, frameworks, and commands used in your backend services.**
