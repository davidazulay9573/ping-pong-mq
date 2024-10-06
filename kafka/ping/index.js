const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ping-service',
  brokers: ['kafka:9092'], 
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('Ping service connected to Kafka...');

  setInterval(async () => {
    console.log('Sending Ping...');
    await producer.send({
      topic: 'ping',
      messages: [{ value: 'Ping' }],
    });
  }, 5000);
};

run().catch(console.error);
