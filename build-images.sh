#!/bin/sh

# Build and push example-backend image

IMAGE_NAME="example-backend:latest"

echo "Building backend Docker image..."
docker build -t $IMAGE_NAME ./kubernetes/example-app/backend

# If you have a Docker registry, tag and push the image here
# For example:
# docker tag $IMAGE_NAME your-registry/$IMAGE_NAME
# docker push your-registry/$IMAGE_NAME

echo "Docker image built successfully."
