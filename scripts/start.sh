#!/bin/bash

# Function to display a banner
function display_banner() {
  echo "======================================="
  echo "       Budget Manager App Setup        "
  echo "======================================="
}

# Function to build and start services
function start_services() {
  echo "Building and starting Docker services..."
  docker-compose up --build -d
  if [ $? -eq 0 ]; then
    echo "Services started successfully."
  else
    echo "Failed to start services."
    exit 1
  fi
}

# Function to check service health
function check_health() {
  echo "Checking service health..."
  echo "App: http://localhost:3000"
  echo "Swagger Docs: http://localhost:3000/docs"
  echo "RabbitMQ Management UI: http://localhost:15672 (default: guest/guest)"
}

# Function to stop services
function stop_services() {
  echo "Stopping and cleaning up Docker services..."
  docker-compose down
  if [ $? -eq 0 ]; then
    echo "Services stopped successfully."
  else
    echo "Failed to stop services."
    exit 1
  fi
}

# Function to display usage
function usage() {
  echo "Usage: $0 {start|stop|restart|status}"
  exit 1
}

# Main script execution
case "$1" in
  start)
    display_banner
    start_services
    check_health
    ;;
  stop)
    stop_services
    ;;
  restart)
    stop_services
    start_services
    check_health
    ;;
  status)
    docker-compose ps
    ;;
  *)
    usage
    ;;
esac
