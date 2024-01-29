require('dotenv').config();

const { ServiceBusClient } = require("@azure/service-bus");
const { run } = require("./pim");
const { send } = require("./send");

const connection = process.env.CONNECTION;
const queueName = process.env.QUEUE_NAME;

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
        const messageJson = JSON.parse(message.body);
        console.log(`  sender: '${messageJson.sender}'`);
        console.log(`  dedicomID: '${messageJson.dedicomID}'`);

        const product = await run(messageJson.dedicomID);
        send(JSON.stringify(product));

        if (messageJson.sender === "FE") {  
          await queueReceiver.completeMessage(message);  
        }
        
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