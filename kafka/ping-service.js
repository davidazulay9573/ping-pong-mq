// pingService.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ping-service',
  brokers: ['localhost:9092'], // Update with your Kafka broker's IP if needed
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('Ping service connected to Kafka...');

  // Send "Ping" every 5 seconds
  setInterval(async () => {
    console.log('Sending Ping...');
    await producer.send({
      topic: 'ping',
      messages: [{ value: 'Ping' }],
    });
  }, 5000);
};

run().catch(console.error);
