require('dotenv').config();

const { ServiceBusClient } = require("@azure/service-bus");

const connection = 'Endpoint=sb://test-s-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=m8IPyrt7pH6FKV3uldLI4ELzEJ++lh0xO+ASbGk2ncE=';
const queueName = 'testsbusqueue';

async function main() {
  const sbClient = new ServiceBusClient(connection);
  const queueReceiver = sbClient.createReceiver(queueName);

  try {
    let allMessages = [];

    console.log(`Receiving messages...`);

    while (allMessages.length < 2) {
      const messages = await queueReceiver.receiveMessages(2, {
        maxWaitTimeInMs: 60 * 1000,
      });

      if (!messages.length) {
        console.log("No more messages to receive");
        continue;
      }

      console.log(`Received ${messages.length} messages`);
      allMessages.push(...messages);

      for (let message of messages) {
        console.log(`  Message: '${message.body}'`);

        await queueReceiver.completeMessage(message);
      }
    }

    await queueReceiver.close();
  } finally {
    await sbClient.close();
  }
}

main().catch((err) => {
  console.log("ReceiveMessageLoop Sample - Error occurred: ", err);
  process.exit(1);
});