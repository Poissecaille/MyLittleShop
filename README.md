## MyLittleShop
- E-commerce with distributed architecture (microservices) developed in nodejs and react.  
  
![alt text](images/littleshop.png)

## .env variables
```
APP_AGGREGATOR_PORT=APP_AGGREGATOR_PORT
APP_AUTHENTICATION_PORT=APP_AUTHENTICATION_PORT
APP_INVENTORY_PORT=APP_INVENTORY_PORT
APP_ORDER_PORT=APP_ORDER_PORT
APP_MAILER_PORT=APP_MAILER_PORT

PASSWORD_SECRET=PASSWORD_SECRET
JWT_SECRET=JWT_SECRET

NODE_ENV=NODE_ENV

ADMIN_EMAIL=ADMIN_EMAIL
ADMIN_FIRSTNAME=ADMIN_FIRSTNAME
ADMIN_LASTNAME=ADMIN_LASTNAME
ADMIN_PASSWORD=ADMIN_PASSWORD

WEB_FRONT_PORT=WEB_FRONT_PORT
PORT=PORT

AUTH_DB_PORT=AUTH_DB_PORT
INVENTORY_DB_PORT=INVENTORY_DB_PORT
ORDER_DB_PORT=ORDER_DB_PORT
AUTH_DB_HOST=AUTH_DB_HOST
INVENTORY_DB_HOST=INVENTORY_DB_HOST
ORDER_DB_HOST=ORDER_DB_HOST
DB_NAME=DB_NAME
DB_USERNAME=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DIALECT=DIALECT
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
To avoid network bugs on linux distributions you can create a nodemon.json file in each service with this format:
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