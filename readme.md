# sample node app for azure service bus
Primarily, create a new .env file to provide the following variables:\
Please exchange variables from first block to your azure subscription.\
<code>
FULLY_QUALIFIED_NAMESPACE=\
CONNECTION=\
QUEUE_NAME=\
AS_QUEUE_NAME=\
\
PIM_OAUTH_URL=https://dedidev.cloud.akeneo.com/api/oauth/v1/\
PIM_REST_URL=https://dedidev.cloud.akeneo.com/api/rest/v1/\
PIM_AUTHORIZATION_TOKEN="Basic MV8yaGoxYmRxZDZpMDQ4Z3d3OGt3Yzg4Y28wNGM4bzBrNGswZ28wdzgwMGtvb2trazQ0azoydzJyODBlMXVsMmNrYzBzY3MwNGtrY2dvODBnY28wOGdnY3N3ODBvbzAwYzhva2N3Zw=="\
PIM_USERNAME=dev_pim_event_connection_7813\
PIM_PASSWORD=56a26b967
</code>

to get everything installed: <code>npm install</code>


send a message to the queue: <code>node send.js</code>

start the receiver: <code>node app.js</code>

