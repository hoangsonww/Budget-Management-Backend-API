# ELK Stack Demo

This module ships structured JSON logs into Elasticsearch through Logstash and Filebeat.

## What It Includes

- **Log generator** (`elk-stack/index.js`) that emits realistic budget/expense events.
- **Logstash pipeline** listening on HTTP (8080) and Beats (5044).
- **Filebeat** tailing `elk-stack/logs/budget-api.log`.
- **Elasticsearch + Kibana** for indexing and exploration.

## Run With Docker Compose

```bash
docker compose -f docker/docker-compose.yml up --build
```

## Local Run

```bash
node index.js
```

Environment variables:

- `ELASTICSEARCH_URL` (default: `http://localhost:9200`)
- `LOGSTASH_URL` (default: `http://localhost:8080`)
- `KIBANA_URL` (default: `http://localhost:5601`)
- `LOG_FILE_PATH` (default: `elk-stack/logs/budget-api.log`)
- `EVENT_COUNT` (default: `50`)
- `EVENT_INTERVAL_MS` (default: `200`)
