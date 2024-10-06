#!/bin/bash

# Wait for Kafka to be ready
while ! nc -z kafka 9092; do   
  sleep 0.1 
done

# Create Kafka topics
kafka-topics.sh --create --topic ping --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1
kafka-topics.sh --create --topic pong --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1
