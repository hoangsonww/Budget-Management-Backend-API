#!/usr/bin/env bash
# notify.sh
# Description: Send a real-time notification via WebSockets using the CLI.

set -e

MESSAGE=$1

if [ -z "$MESSAGE" ]; then
  echo "Usage: ./scripts/notify.sh \"Your notification message\""
  exit 1
fi

echo "Sending notification: $MESSAGE"
budget-manager notify "$MESSAGE"
