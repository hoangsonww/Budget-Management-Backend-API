#!/usr/bin/env bash
# seed_data.sh
# Description: Seeds the MongoDB database with initial data via the CLI.

set -e

echo "Seeding database..."
budget-manager seed
