require('dotenv').config();

const { ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

const fullyQualifiedNamespace = process.env.FULLY_QUALIFIED_NAMESPACE;

const credential = new DefaultAzureCredential();

const queueName = process.env.QUEUE_NAME;

const messages = [ {body: '{"sender":"FE", "dedicomID":"12345"}'} ];

async function main() {
    const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);
    const sender = sbClient.createSender(queueName);

    try {
        let batch = await sender.createMessageBatch();
        for (let i = 0; i < messages.length; i++) {
            if (!batch.tryAddMessage(messages[i])) {
                await sender.sendMessages(batch);

                batch = await sender.createMessageBatch();

                if (!batch.tryAddMessage(messages[i])) {
                    throw new Error("Message too big to fit in a batch");
                }
            }
        }

        await sender.sendMessages(batch);

        console.log(`Sent a batch of messages to the queue: ${queueName}`);

        await sender.close();
    } finally {
        await sbClient.close();
    }
}

main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
});