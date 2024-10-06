const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'pong-service',
  brokers: ['kafka:9092'], 
});

const consumer = kafka.consumer({ groupId: 'pong-group' });
const producer = kafka.producer();

const run = async () => {
  await producer.connect(); 
  console.log('Pong service connected to Kafka...');

  await consumer.connect(); 
  await consumer.subscribe({ topic: 'ping', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received: ${message.value.toString()}`);

      console.log('Sending Pong...');
      await producer.send({
        topic: 'pong',
        messages: [{ value: 'Pong' }],
      });
    },
  });
};

run().catch(console.error);
