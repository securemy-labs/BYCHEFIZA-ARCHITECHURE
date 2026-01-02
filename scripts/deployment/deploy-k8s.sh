#!/bin/bash

# Deployment script for Kubernetes
# Deploys all services to Kubernetes cluster

set -e

echo "==================================="
echo "BYCHEFIZA Kubernetes Deployment"
echo "==================================="

# Check if kubectl is available
command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required but not installed. Aborting." >&2; exit 1; }

echo "✓ kubectl found"

# Apply Kubernetes configurations
echo "Creating namespace..."
kubectl apply -f infrastructure/kubernetes/namespace.yaml

echo "Deploying services..."
kubectl apply -f infrastructure/kubernetes/api-gateway.yaml
kubectl apply -f infrastructure/kubernetes/auth-service.yaml
kubectl apply -f infrastructure/kubernetes/product-service.yaml

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/api-gateway -n bychefiza
kubectl wait --for=condition=available --timeout=300s deployment/auth-service -n bychefiza
kubectl wait --for=condition=available --timeout=300s deployment/product-service -n bychefiza

echo ""
echo "==================================="
echo "Deployment Complete!"
echo "==================================="
echo ""
echo "To check status:"
echo "  kubectl get pods -n bychefiza"
echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/api-gateway -n bychefiza"
echo ""
