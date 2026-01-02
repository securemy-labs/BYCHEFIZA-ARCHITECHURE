# Quick Start Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- kubectl (for Kubernetes deployment)

## Local Development

### 1. Setup

```bash
# Run setup script
npm run setup

# Or manually copy environment file
cp .env.example .env
```

### 2. Start Services

```bash
# Start all services with Docker Compose
npm run dev

# Or start in detached mode
npm run dev:detached
```

### 3. Access Services

- **API Gateway**: http://localhost:3000
- **Web App**: http://localhost:3001 (after starting separately)
- **Grafana**: http://localhost:3006 (user: admin, pass: admin)
- **Prometheus**: http://localhost:9090

### 4. Health Checks

```bash
# Check API Gateway
curl http://localhost:3000/health

# Check Auth Service
curl http://localhost:3001/health

# Check Product Service
curl http://localhost:3003/health
```

## Development Workflow

### Run Individual Service

```bash
cd services/api-gateway
npm install
npm run dev
```

### View Logs

```bash
npm run logs

# Or for specific service
docker-compose logs -f api-gateway
```

### Stop Services

```bash
npm run stop
```

## Testing

```bash
# Test specific service
cd services/api-gateway
npm test
```

## Deployment

### Kubernetes

```bash
# Deploy to Kubernetes
npm run deploy:k8s

# Check deployment status
kubectl get pods -n bychefiza
```

## Project Structure

```
.
├── apps/                    # Frontend applications
│   └── web/                # React/Next.js web app
├── services/               # Microservices
│   ├── api-gateway/       # API Gateway
│   ├── auth-service/      # Authentication
│   ├── user-service/      # User management
│   ├── product-service/   # Product catalog
│   ├── order-service/     # Order processing
│   └── payment-service/   # Payment handling
├── infrastructure/         # IaC configurations
│   ├── kubernetes/        # K8s manifests
│   └── terraform/         # Terraform configs
└── scripts/               # Utility scripts
```

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, modify the ports in `.env` file.

### Database Connection Issues

Ensure databases are running:
```bash
docker-compose ps
```

### Reset Everything

```bash
npm run clean
npm run setup
npm run dev
```

## Support

See main [README.md](README.md) for detailed documentation.
