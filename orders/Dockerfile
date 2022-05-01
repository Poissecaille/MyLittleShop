FROM node:14-alpine as test
WORKDIR /orders
COPY . /orders/
RUN npm i
CMD [ "npm", "test" ]

FROM node:14-alpine as development
WORKDIR /orders
COPY . /orders/
RUN npm i
CMD [ "npm", "start" ]