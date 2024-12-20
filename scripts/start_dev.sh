#!/usr/bin/env bash
# start_dev.sh
# Description: Start the app in development mode with nodemon.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting application in development mode..."
nodemon index.js
