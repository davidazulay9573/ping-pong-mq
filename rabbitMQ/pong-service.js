const amqp = require('amqplib');

const PING_QUEUE = 'ping_queue';
const PONG_QUEUE = 'pong_queue';

async function startPongService() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(PING_QUEUE, { durable: false });
        await channel.assertQueue(PONG_QUEUE, { durable: false });

        channel.consume(PONG_QUEUE, (msg) => {
            if (msg !== null) {
                console.log('Received:', msg.content.toString());

                console.log('Sending Pong...');
                channel.sendToQueue(PING_QUEUE, Buffer.from('Pong'));
                channel.ack(msg);
            }
        });

    } catch (err) {
        console.error('Error starting Pong service:', err);
    }
}

startPongService();
