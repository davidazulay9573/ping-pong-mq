// pongService.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'pong-service',
  brokers: ['192.168.192.39:9092'], // Update with your Kafka broker's IP
});

const consumer = kafka.consumer({ groupId: 'pong-group' });
const producer = kafka.producer(); // Declare producer here

const run = async () => {
  await producer.connect(); // Connect the producer
  console.log('Pong service connected to Kafka...');

  await consumer.connect(); // Connect the consumer
  await consumer.subscribe({ topic: 'ping', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received: ${message.value.toString()}`);

      // After receiving "Ping", send "Pong"
      console.log('Sending Pong...');
      await producer.send({
        topic: 'pong',
        messages: [{ value: 'Pong' }],
      });
    },
  });
};

run().catch(console.error);
