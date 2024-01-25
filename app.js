// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT Licence.

const { ServiceBusClient } = require("@azure/service-bus");
const express = require('express');

// Define connection string and related Service Bus entity names here
const connectionString = 'Endpoint=sb://test-s-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=m8IPyrt7pH6FKV3uldLI4ELzEJ++lh0xO+ASbGk2ncE=';
const queueName = 'testsbusqueue';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('huhu?');
});

app.listen(port, () => {
  console.log(`node-app listening on port ${port}`);
});

async function main() {
  const sbClient = new ServiceBusClient(connectionString);
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
        break;
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