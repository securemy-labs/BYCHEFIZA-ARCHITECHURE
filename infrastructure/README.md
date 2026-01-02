# Infrastructure

This directory contains Infrastructure as Code (IaC), deployment configurations, and orchestration manifests for BYCHEFIZA.

## Overview

The infrastructure is organized into:
- **Docker** — Container configurations and Docker Compose setups
- **Kubernetes** — K8s manifests, Helm charts, and deployment configurations
- **Terraform** — Cloud infrastructure provisioning (AWS/GCP/Azure)

## Directory Structure

```
infrastructure/
├── docker/              # Docker configurations
│   ├── Dockerfile       # Container build files
│   └── docker-compose/  # Compose configurations
├── kubernetes/          # Kubernetes manifests
│   ├── deployments/     # Deployment configurations
│   ├── services/        # Service definitions
│   ├── configmaps/      # ConfigMaps
│   ├── secrets/         # Secret templates (NOT actual secrets)
│   └── ingress/         # Ingress rules
└── terraform/           # Terraform IaC
    ├── modules/         # Reusable Terraform modules
    ├── environments/    # Environment-specific configs
    │   ├── dev/
    │   ├── staging/
    │   └── production/
    └── main.tf          # Main Terraform configuration
```

## Prerequisites

- **Docker**: Docker 20+ and Docker Compose v2
- **Kubernetes**: kubectl, Helm 3+ (for K8s deployments)
- **Terraform**: Terraform 1.0+ (for cloud provisioning)
- **Cloud CLI**: AWS CLI, gcloud, or Azure CLI (depending on provider)

## Docker

### Local Development with Docker Compose

```bash
# From repository root
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis api-gateway

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Remove volumes (WARNING: destroys data)
docker-compose down -v
```

### Building Docker Images

```bash
# Build all service images
docker-compose build

# Build specific service
docker build -f services/auth-service/Dockerfile -t bychefiza/auth-service:latest .

# Multi-platform build (for ARM/AMD64)
docker buildx build --platform linux/amd64,linux/arm64 -t bychefiza/auth-service:latest .
```

### Docker Best Practices

- Use multi-stage builds to reduce image size
- Don't include secrets in images (use environment variables or secrets management)
- Tag images with version numbers, not just `latest`
- Scan images for vulnerabilities: `docker scan bychefiza/auth-service:latest`

## Kubernetes

### Prerequisites

```bash
# Install kubectl
# macOS: brew install kubectl
# Linux: snap install kubectl --classic

# Install Helm
# macOS: brew install helm
# Linux: snap install helm --classic

# Verify installations
kubectl version --client
helm version
```

### Deploying to Kubernetes

```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/

# Apply specific resources
kubectl apply -f infrastructure/kubernetes/deployments/
kubectl apply -f infrastructure/kubernetes/services/

# Deploy with Helm (if using Helm charts)
helm install bychefiza ./infrastructure/helm/bychefiza-chart \
  --namespace bychefiza \
  --create-namespace

# Upgrade Helm release
helm upgrade bychefiza ./infrastructure/helm/bychefiza-chart \
  --namespace bychefiza
```

### Managing Kubernetes Resources

```bash
# View deployments
kubectl get deployments -n bychefiza

# View pods
kubectl get pods -n bychefiza

# View services
kubectl get services -n bychefiza

# View logs
kubectl logs -f deployment/auth-service -n bychefiza

# Port forward for local testing
kubectl port-forward service/api-gateway 3000:3000 -n bychefiza

# Describe resource
kubectl describe pod <pod-name> -n bychefiza

# Delete resources
kubectl delete -f infrastructure/kubernetes/
```

### Kubernetes Secrets Management

**IMPORTANT**: Never commit actual secrets to Git!

```bash
# Create secret from literals
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=supersecret \
  -n bychefiza

# Create secret from file
kubectl create secret generic app-config \
  --from-file=.env \
  -n bychefiza

# View secrets (base64 encoded)
kubectl get secret db-credentials -o yaml -n bychefiza

# Use external secret managers
# - AWS Secrets Manager with External Secrets Operator
# - HashiCorp Vault
# - Azure Key Vault
# - Google Secret Manager
```

### ConfigMaps

```bash
# Create ConfigMap
kubectl create configmap app-config \
  --from-file=config.yaml \
  -n bychefiza

# Apply from manifest
kubectl apply -f infrastructure/kubernetes/configmaps/
```

## Terraform

### Infrastructure Provisioning

```bash
# Navigate to Terraform directory
cd infrastructure/terraform/environments/dev

# Initialize Terraform (first time)
terraform init

# Format and validate
terraform fmt
terraform validate

# Plan infrastructure changes
terraform plan

# Apply changes (provision infrastructure)
terraform apply

# Destroy infrastructure (WARNING: deletes resources)
terraform destroy
```

### Terraform Best Practices

- **Remote state**: Store state in S3/GCS/Azure Blob with state locking
- **Workspaces**: Use workspaces or separate directories for environments
- **Modules**: Use modules for reusable infrastructure components
- **Variables**: Use `.tfvars` files for environment-specific variables
- **Secrets**: Never commit secrets; use environment variables or secret managers

### Example Terraform State Configuration

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "bychefiza-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

### Terraform Modules

```bash
# Use modules for reusable components
cd infrastructure/terraform/modules/

# Example: VPC module
terraform init
terraform plan -var-file=../../environments/dev/vpc.tfvars
terraform apply -var-file=../../environments/dev/vpc.tfvars
```

## Secrets Management

**CRITICAL**: Never commit secrets to source control!

### Options for Secret Management:

1. **Environment Variables**
   - Set in CI/CD pipeline
   - Injected at runtime

2. **Kubernetes Secrets**
   - `kubectl create secret`
   - External Secrets Operator

3. **Cloud Secret Managers**
   - AWS Secrets Manager / Parameter Store
   - Google Cloud Secret Manager
   - Azure Key Vault

4. **HashiCorp Vault**
   - Centralized secrets management
   - Dynamic secrets
   - Encryption as a service

### Example: Using AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name bychefiza/db/password \
  --secret-string "supersecret"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id bychefiza/db/password
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure kubectl
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f infrastructure/kubernetes/
```

### Terraform in CI/CD

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  pull_request:
    paths:
      - 'infrastructure/terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      
      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure/terraform/environments/dev
      
      - name: Terraform Plan
        run: terraform plan
        working-directory: infrastructure/terraform/environments/dev
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Common Deployment Commands

### Development

```bash
# Start local environment
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build
```

### Staging/Production (Kubernetes)

```bash
# Apply configurations
kubectl apply -f infrastructure/kubernetes/ -n staging

# Verify deployment
kubectl get pods -n staging
kubectl rollout status deployment/api-gateway -n staging

# Rollback if needed
kubectl rollout undo deployment/api-gateway -n staging

# Scale deployment
kubectl scale deployment/api-gateway --replicas=3 -n staging
```

## Monitoring and Observability

- **Logs**: Centralized logging with ELK stack or cloud provider solutions
- **Metrics**: Prometheus for metrics collection, Grafana for visualization
- **Tracing**: Jaeger or Zipkin for distributed tracing
- **Alerts**: AlertManager or cloud provider alerting

### Example: Deploy Prometheus

```bash
# Using Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring \
  --create-namespace
```

## Rollback Strategy

### Docker Compose

```bash
# Use tagged versions in docker-compose.yml
services:
  api-gateway:
    image: bychefiza/api-gateway:v1.2.3

# To rollback, update to previous tag and restart
docker-compose up -d
```

### Kubernetes

```bash
# View rollout history
kubectl rollout history deployment/api-gateway -n production

# Rollback to previous version
kubectl rollout undo deployment/api-gateway -n production

# Rollback to specific revision
kubectl rollout undo deployment/api-gateway --to-revision=2 -n production
```

### Terraform

```bash
# Rollback by reverting Terraform state
terraform plan -out=rollback.plan
terraform apply rollback.plan

# Or use version control to revert changes
git revert <commit>
terraform apply
```

## Notes

- **Update placeholders**: Replace example commands with actual project configurations
- **Environment-specific configs**: Maintain separate configurations for dev/staging/production
- **Infrastructure testing**: Test infrastructure changes in dev before applying to production
- **Documentation**: Document any custom infrastructure or deployment procedures
- **State management**: Always use remote state for Terraform in team environments

## Troubleshooting

- **Container won't start**: Check logs with `docker-compose logs <service>`
- **Kubernetes pod issues**: Use `kubectl describe pod <pod-name>` and check events
- **Terraform errors**: Verify credentials, state file access, and resource quotas
- **Secret access denied**: Verify IAM permissions for secret managers
- **Network issues**: Check security groups, firewall rules, and network policies

## Security Checklist

- [ ] Secrets are stored in secret managers, not in code
- [ ] Images are scanned for vulnerabilities
- [ ] Least privilege IAM/RBAC policies are applied
- [ ] Network policies restrict inter-service communication
- [ ] TLS/SSL is enabled for all external communications
- [ ] Resource limits and quotas are configured
- [ ] Audit logging is enabled
- [ ] Regular security updates are applied

---

**Update this README with actual infrastructure configurations, cloud providers, and deployment procedures specific to your project.**
