# Deployment Guide

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployment (AWS)](#cloud-deployment-aws)
- [Monitoring Setup](#monitoring-setup)

---

## Local Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/securemy-labs/BYCHEFIZA-ARCHITECHURE.git
cd BYCHEFIZA-ARCHITECHURE
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Services**
```bash
npm run setup
npm run dev
```

4. **Verify Services**
```bash
# Check API Gateway
curl http://localhost:3000/health

# Check all services
docker-compose ps
```

---

## Docker Deployment

### Build Images

```bash
# Build all services
npm run build:all

# Or build individually
docker build -t bychefiza/api-gateway services/api-gateway
docker build -t bychefiza/auth-service services/auth-service
```

### Run with Docker Compose

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Compose Configuration

The `docker-compose.yml` includes:
- All microservices
- PostgreSQL database
- MongoDB database
- Redis cache
- Prometheus monitoring
- Grafana dashboards

---

## Kubernetes Deployment

### Prerequisites
- kubectl configured
- Kubernetes cluster (local or cloud)
- Docker images pushed to registry

### Deploy to Kubernetes

1. **Create Namespace**
```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
```

2. **Deploy Services**
```bash
kubectl apply -f infrastructure/kubernetes/
```

3. **Verify Deployment**
```bash
# Check pods
kubectl get pods -n bychefiza

# Check services
kubectl get svc -n bychefiza

# Check deployments
kubectl get deployments -n bychefiza
```

4. **Access Services**
```bash
# Port forward API Gateway
kubectl port-forward -n bychefiza service/api-gateway 3000:80

# Or use LoadBalancer IP
kubectl get svc api-gateway -n bychefiza
```

### Scaling

```bash
# Scale deployment
kubectl scale deployment api-gateway --replicas=3 -n bychefiza

# Auto-scaling (HPA)
kubectl autoscale deployment api-gateway \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n bychefiza
```

### Update Deployment

```bash
# Update image
kubectl set image deployment/api-gateway \
  api-gateway=bychefiza/api-gateway:v2.0.0 \
  -n bychefiza

# Rollout status
kubectl rollout status deployment/api-gateway -n bychefiza

# Rollback if needed
kubectl rollout undo deployment/api-gateway -n bychefiza
```

---

## Cloud Deployment (AWS)

### Infrastructure Setup with Terraform

1. **Initialize Terraform**
```bash
cd infrastructure/terraform
terraform init
```

2. **Review Plan**
```bash
terraform plan
```

3. **Apply Configuration**
```bash
terraform apply
```

### EKS Cluster Setup

```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create EKS cluster
eksctl create cluster \
  --name bychefiza-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4
```

### Database Setup (RDS)

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier bychefiza-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <secure-password> \
  --allocated-storage 20
```

### Deploy to EKS

```bash
# Update kubeconfig
aws eks update-kubeconfig --name bychefiza-cluster --region us-east-1

# Deploy application
kubectl apply -f infrastructure/kubernetes/

# Install AWS Load Balancer Controller
helm install aws-load-balancer-controller \
  eks/aws-load-balancer-controller \
  -n kube-system
```

---

## Monitoring Setup

### Prometheus & Grafana

Already included in Docker Compose:

```bash
# Access Prometheus
http://localhost:9090

# Access Grafana
http://localhost:3006
# Default credentials: admin/admin
```

### Configure Grafana Dashboards

1. Login to Grafana
2. Add Prometheus as data source
3. Import dashboards from `infrastructure/monitoring/dashboards/`

### ELK Stack (Optional)

```bash
# Add ELK to docker-compose.yml
docker-compose -f docker-compose.yml -f docker-compose.elk.yml up -d
```

---

## CI/CD Pipeline

### GitHub Actions

The repository includes a CI/CD pipeline that:
1. Runs tests on PR
2. Builds Docker images
3. Scans for vulnerabilities
4. Deploys to Kubernetes

### Configure Secrets

Add to GitHub repository secrets:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `KUBE_CONFIG` (base64 encoded)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

---

## Environment Variables

### Required Variables

```env
# Database
POSTGRES_HOST=
POSTGRES_PORT=5432
POSTGRES_DB=bychefiza
POSTGRES_USER=
POSTGRES_PASSWORD=

# Redis
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=
JWT_EXPIRATION=24h

# AWS (Production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## Backup & Recovery

### Database Backup

```bash
# PostgreSQL backup
docker exec bychefiza-postgres pg_dump -U admin bychefiza > backup.sql

# MongoDB backup
docker exec bychefiza-mongodb mongodump --out /backup
```

### Restore

```bash
# PostgreSQL restore
docker exec -i bychefiza-postgres psql -U admin bychefiza < backup.sql

# MongoDB restore
docker exec bychefiza-mongodb mongorestore /backup
```

---

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Database Connection Failed**
```bash
# Check database logs
docker-compose logs postgres

# Verify connection
docker exec -it bychefiza-postgres psql -U admin -d bychefiza
```

**Service Not Starting**
```bash
# Check logs
docker-compose logs <service-name>

# Restart service
docker-compose restart <service-name>
```

### Health Checks

```bash
# API Gateway
curl http://localhost:3000/health

# All services
for port in 3000 3001 3002 3003 3004 3005; do
  echo "Port $port:"
  curl http://localhost:$port/health
  echo ""
done
```

---

## Security Considerations

1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Update dependencies** regularly
5. **Implement rate limiting**
6. **Use security headers** (Helmet.js)
7. **Regular security audits**

---

## Performance Optimization

1. **Enable Redis caching**
2. **Use connection pooling** for databases
3. **Implement CDN** for static assets
4. **Enable compression**
5. **Optimize database queries**
6. **Horizontal scaling** for high traffic

---

## Support

For deployment assistance:
- Documentation: [README.md](../../README.md)
- Issues: https://github.com/securemy-labs/BYCHEFIZA-ARCHITECHURE/issues
- Email: devops@securemy-labs.com
