# Groupe de boury_a 950231
## .env variables
```
HOST=HOST
APP_PORT=APP_PORT
PASSWORD_SECRET=PASSWORD_SECRET
DB_PORT=DB_PORT
DB_NAME=DB_NAME
DB_USERNAME=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DIALECT=DIALECT
JWT_SECRET=JWT_SECRET
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
```

## local environment
Please create a .env file in each microservice with a different APP_PORT value.

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