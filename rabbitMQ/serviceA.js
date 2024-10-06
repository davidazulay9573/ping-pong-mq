const amqp = require('amqplib');

const PING_QUEUE = 'ping_queue';
const PONG_QUEUE = 'pong_queue';

async function startPingService() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // Declare queues for Ping and Pong
        await channel.assertQueue(PING_QUEUE, { durable: false });
        await channel.assertQueue(PONG_QUEUE, { durable: false });

        // Send the first "Ping"
        console.log('Sending Ping...');
        channel.sendToQueue(PONG_QUEUE, Buffer.from('Ping'));

        // Listen for Pong messages
        channel.consume(PING_QUEUE, (msg) => {
            if (msg !== null) {
                console.log('Received:', msg.content.toString());

                // After receiving Pong, send Ping again
                console.log('Sending Ping...');
                channel.sendToQueue(PONG_QUEUE, Buffer.from('Ping'));
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error('Error starting Ping service:', err);
    }
}

startPingService();
