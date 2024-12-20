#!/usr/bin/env bash
# run_docker_compose.sh
# Description: Run the application and services (MongoDB, Redis, Elasticsearch, etc.) via Docker Compose.

set -e

echo "Starting services with Docker Compose..."
docker-compose up --build
