FROM node:14-alpine
WORKDIR /authentication
COPY . /authentication/
RUN npm i
RUN npx sequelize-cli db:seed --seed 20220212150215-users.js
CMD [ "npm", "start" ]