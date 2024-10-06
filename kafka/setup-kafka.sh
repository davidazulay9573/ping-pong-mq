#!/bin/bash

# Stop and remove any existing containers
sudo docker stop kafka zookeeper
sudo docker rm kafka zookeeper

# Start Zookeeper
echo "Starting Zookeeper..."
sudo docker run -d --name zookeeper -p 2181:2181 zookeeper:3.6.3

# Start Kafka
echo "Starting Kafka..."
sudo docker run -d --name kafka --link zookeeper \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
    -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$(hostname -I | awk '{print $1}'):9092 \
    -p 9092:9092 \
    wurstmeister/kafka:2.13-2.7.0

# Wait for Kafka to start
echo "Waiting for Kafka to start..."
sleep 10

# Create topics
echo "Creating topics..."
sudo docker exec -it kafka kafka-topics.sh --create --topic ping --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
sudo docker exec -it kafka kafka-topics.sh --create --topic pong --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# List topics to confirm creation
echo "Listing topics..."
sudo docker exec -it kafka kafka-topics.sh --list --bootstrap-server localhost:9092

echo "Kafka and Zookeeper setup completed."
