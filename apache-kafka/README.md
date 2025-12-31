# Apache Kafka Demo

This module wraps `kafkajs` with helpers for topic provisioning, event envelopes, and consumer registration.

## Highlights

- Topic provisioning for budget/expense/task streams
- Event envelopes with correlation IDs
- Dead-letter queue (`dlq-events`) on publish failures

## Run With Docker Compose

```bash
docker compose -f docker/docker-compose.yml up --build
```

Kafka UI will be available at `http://localhost:8081`.

## Run the Demo Script

```bash
KAFKA_BROKER=localhost:9092 node index.js
```

The demo reads events from `files/kafka/sample-events.jsonl` and publishes them to Kafka.
