# Groupe de boury_a 950231
## .env variables
```
DB_HOST=DB_HOST
APP_MAILER_PORT=APP_MAILER_PORT
APP_AGGREGATOR_PORT=APP_AGGREGATOR_PORT
APP_AUTHENTICATION_PORT=APP_AUTHENTICATION_PORT
APP_INVENTORY_PORT=APP_INVENTORY_PORT
APP_ORDER_PORT=APP_ORDER_PORT
PASSWORD_SECRET=PASSWORD_SECRET
DB_PORT=DB_PORT
DB_NAME=DB_NAME
DB_USERNAME=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DIALECT=DIALECT
JWT_SECRET=JWT_SECRET

DBTEST_NAME=DBTEST_NAME
DBTEST_USERNAME=DBTEST_USERNAME
DBTEST_PASSWORD=DBTEST_PASSWORD
DBTEST_PORT=DBTEST_PORT

NODE_ENV=NODE_ENV
```

## packages
```bash
express
nodemon
dotenv
crypto-js
sequelize
pg
axios
concurrently
supertest
jest 
nodemailer
```

## environements
The test environnement is setup when NODE_ENV variable is equal to test.
The dev environnement is setup when NODE_ENV variable is equal to dev.

## seeder
A the root of the project excecute this script to download data into database:  
```
./seeder.sh
```

## nodemon
To avoid network bugs you can create a nodemon.json file in each service with this format:
```
{
    "events": {
      "restart": "kill-port-command ${PORT}",
      "crash": "kill-port-command ${PORT}"
    },
    "delay": "1500"
  }
```
Please use a command supported by your os to kill port activity

## launch all services
```npm i``` in each service
```npm run launch``` in aggregator service
You can also ```npm start``` each service