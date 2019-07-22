# MQTT-PostgreSQL

This app listens to a topic on the IoT-Hub and saves the received data to the Postgresql database on the WISE-PaaS.

## Code description

Part 1. Get variables of PostgreSQl

```js
// ----- Remote DB --- Get env variables
const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
const host = vcap_services['postgresql-innoworks'][0].credentials.host;
const user = vcap_services['postgresql-innoworks'][0].credentials.username;
const password = vcap_services['postgresql-innoworks'][0].credentials.password;
const dbPort = vcap_services['postgresql-innoworks'][0].credentials.port;
const database = vcap_services['postgresql-innoworks'][0].credentials.database;
```

**Note**:'postgresql-innoworks' is the service name, not service instance name. To check service name, please login to WISE-PaaS management portal or command line:

    cf services
    
