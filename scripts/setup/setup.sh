#!/bin/bash

# BYCHEFIZA Platform Setup Script
# This script sets up the development environment

set -e

echo "==================================="
echo "BYCHEFIZA Platform Setup"
echo "==================================="

# Check for required tools
echo "Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting." >&2; exit 1; }

echo "✓ Docker found"
echo "✓ Docker Compose found"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo "⚠ Please update .env with your configuration"
else
    echo "✓ .env file already exists"
fi

# Create directories for volumes
echo "Creating data directories..."
mkdir -p data/{postgres,mongodb,redis}
echo "✓ Data directories created"

# Pull Docker images
echo "Pulling Docker images..."
docker-compose pull

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "To start the platform:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the platform:"
echo "  docker-compose down"
echo ""
