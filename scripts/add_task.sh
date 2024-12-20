#!/usr/bin/env bash
# add_task.sh
# Description: Add a new task to the RabbitMQ queue using the CLI.

set -e

TASK_DESC=$1

if [ -z "$TASK_DESC" ]; then
  echo "Usage: ./scripts/add_task.sh \"Task description\""
  exit 1
fi

echo "Adding task: $TASK_DESC"
budget-manager add-task "$TASK_DESC"
