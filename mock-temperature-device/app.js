const mqtt = require('mqtt')

// -- Get env variables for rabbitmq service
const mqttUri = 'mqtt://f456d95d-b76f-43e9-8b35-bac8383bf941%3Aa506b31f-c1d9-4812-a9f3-ddfc3857f91c:Ws7qbwKMep5nODgfKwpiYiBXU@40.81.27.10:1883';

// Use mqttUri or connectOpts
const client = mqtt.connect(mqttUri);

client.on('connect', (connack) => {
  setInterval(() => {
    publishMockTemp();
  }, 3000);
});

// Publish mock random temperature periodically
function publishMockTemp() {
  const temp = Math.floor((Math.random() * 7) + 22);

  client.publish('livingroom/temperature', temp.toString(), { qos: 2 }, (err, packet) => {
    if (!err) console.log('Data sent to livingroom/temperature -- ' + temp);
  });
}
