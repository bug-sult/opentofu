#!/bin/bash

echo "Building Docker images for Movie Library Application..."

# Build backend image
echo "Building backend image..."
cd kubernetes/movie-app/backend
docker build -t movie-backend:latest .
cd ../../..

# Build frontend image
echo "Building frontend image..."
cd kubernetes/movie-app/frontend
docker build -t movie-frontend:latest .
cd ../../..

echo "Docker images built successfully!"
echo "Backend image: movie-backend:latest"
echo "Frontend image: movie-frontend:latest"

# If using kind or minikube, load images
if command -v kind &> /dev/null; then
    echo "Loading images into kind cluster..."
    kind load docker-image movie-backend:latest
    kind load docker-image movie-frontend:latest
fi

if command -v minikube &> /dev/null; then
    echo "Loading images into minikube..."
    minikube image load movie-backend:latest
    minikube image load movie-frontend:latest
fi

echo "Build complete!"
