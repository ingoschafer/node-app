var express = require('express');
var router = express.Router();

const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

const fullyQualifiedNamespace = "test-s-bus.servicebus.windows.net";
const credential = new DefaultAzureCredential();
const queueName = "testsbusqueue";



async function receive() {
  const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);
  const receiver = sbClient.createReceiver(queueName);
  
  const messageHandler = async (messageReceived) => {
    console.log(JSON.parse(messageReceived.body)["dedicomID"]);
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
}


// shall run forever
receive();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
