# MQTT-PostgreSQL

This app listens to a topic on the IoT-Hub and saves the received data to the Postgresql database on the WISE-PaaS.

## Quick Start

**STEP 1** Login to WISE-PaaS via command line **`cf login`** with your **domain**, **username** & **password**.

![Imgur](https://i.imgur.com/uEBf2Sk.png)

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

**Note**: Just the same as above **'p-rabbitmq'** is the service name, not service instance name.
To check service name, please login to WISE-PaaS Management Portal or command line: `cf services`
