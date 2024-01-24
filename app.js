const { delay, ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

const fullyQualifiedNamespace = "test-s-bus.servicebus.windows.net";
const credential = new DefaultAzureCredential();
const queueName = "testsbusqueue";


async function receive() {
  console.log("start receiving.");

  const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);
  const receiver = sbClient.createReceiver(queueName);
  
  const messageHandler = async (messageReceived) => {
    console.log(JSON.parse(messageReceived.body));
  };

  const errorHandler = async (error) => {
    console.error(error);
  };

  receiver.subscribe({
    processMessage: messageHandler,
    processError: errorHandler
  });

  await delay(10000);

  await receiver.close();
  await sbClient.close();
  console.log("connection closed.");
}


// shall run forever
receive();
