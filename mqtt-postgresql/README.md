# MQTT-PostgreSQL

This app listens to a topic on the IoT-Hub and saves the received data to the Postgresql database on the WISE-PaaS.

## Quick Start

**STEP 1** Login to WISE-PaaS via command line **`cf login`** with your **domain**, **username** & **password**.

![Imgur](https://i.imgur.com/893v6x7.png)

**STEP 2** Push the app

    cf push --no-start

**NOTE**: We include "--no-start" because PostgreSQL requires us to bind our app to a certain group.

**STEP 3** Bind the app to the assigned group

Bind to the "groupFamily" group

    cf bs {appName} postgresql -c "{\"group\":\"groupFamily\"}"
    
Bind to other services
    
    cf bs {appName} {serviceInstanceName}

**NOTE**: When you are binding an app to a service, remember to use **service instance name**.

**STEP 4** Start your app

    cf start {appName}


After a successful start, the state of your app should be **running**.

Paste your route on a browser to check your results.

You should get this:

![Imgur](https://i.imgur.com/SM6Rr9v.png)

Under the home route, you would get OK, because in the code, we send a code 200.

And under the "/temps" route, you would see the data queried from the database. 

If you don't have any data yet, you would just see an empty array.

## Code description

#### Part 1. Get variables of PostgreSQL

```js
// ----- Remote DB --- Get env variables
const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
const host = vcap_services['postgresql-innoworks'][0].credentials.host;
const user = vcap_services['postgresql-innoworks'][0].credentials.username;
const password = vcap_services['postgresql-innoworks'][0].credentials.password;
const dbPort = vcap_services['postgresql-innoworks'][0].credentials.port;
const database = vcap_services['postgresql-innoworks'][0].credentials.database;
```

**NOTE**: **'postgresql-innoworks'** is the service name, not service instance name.
To check service name, please login to WISE-PaaS Management Portal or command line: `cf services`

#### Part 2. Get variables of Rabbitmq

```js
// -- Get env variables for rabbitmq service
const vcapServices = JSON.parse(process.env.VCAP_SERVICES);
const mqttUri = vcapServices['p-rabbitmq'][0].credentials.protocols.mqtt.uri
```

**NOTE**: Just the same as above, **'p-rabbitmq'** is the service name, not service instance name.
To check service name, please login to WISE-PaaS Management Portal or command line: `cf services`

#### Part 3. Create Schema for the data

```js
const pool = new Pool({
  host: host,
  user: user,
  password: password,
  port: dbPort,
  database: database,
  max: 3,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000
});

// SQL commands for creating table for storing data
const queryString = `
CREATE SCHEMA IF NOT EXISTS "livingroom";
ALTER SCHEMA "livingroom" OWNER TO "groupFamily";
CREATE TABLE IF NOT EXISTS "livingroom"."temperature"(
  id serial,
  timestamp timestamp (2) default current_timestamp,
  temperature integer,
  PRIMARY KEY (id)
);
ALTER TABLE "livingroom"."temperature" OWNER to "groupFamily";
GRANT ALL ON ALL TABLES IN SCHEMA "livingroom" TO "groupFamily";
GRANT ALL ON ALL SEQUENCES IN SCHEMA "livingroom" TO "groupFamily";
`;

// Execute the SQL commands for startup
pool.query(queryString)
  .then(result => {
    console.log('@' + formatTime() + ' -- Schema and table initialized.');
  })
  .catch(err => console.error('Error adding table...', err.stack));
```

**NOTE**: This part creates the data table and grants the table to a group.

#### Part 4. Subscribe to a topic and listen

```js
const client = mqtt.connect(mqttUri);

// Subscribe
client.on('connect', (connack) => {
  client.subscribe('livingroom/temperature', (err, granted) => {
    if (err) console.log(err);

    console.log('@' + formatTime() + ' -- Subscribed to the topic: livingroom/temperature');
  });
});

// Receiving data
client.on('message', (topic, message, packet) => {
  let time = formatTime();
  console.log(`@${time} -- Got data from: ${topic}`);

  // mock temperature data
  const temp = message.toString();

  const queryString = 'INSERT INTO livingroom.temperature(temperature) VALUES($1) RETURNING *';
  const values = [temp];

  pool.query(queryString, values)
    .then(result => {
      console.log('Data added: ', result['rows'][0]);
    })
    .catch(err => console.error('Error adding data...', err.stack));
});
```

**NOTE**: This part subscribes the app to the topic we assigned and receives data from it, then passes it to the database.
