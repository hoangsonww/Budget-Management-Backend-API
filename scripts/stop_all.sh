#!/usr/bin/env bash
# stop_all.sh
# Description: Stop the Node.js app and all docker-compose services.

echo "Stopping Node.js application and all services..."

# Stop Node app if running via PM2 (optional)
if command -v pm2 &> /dev/null
then
    pm2 stop all || true
fi

# Stop Docker containers
docker-compose down || true

echo "All services stopped."
