FROM node:14-alpine as test
WORKDIR /inventory
COPY . /inventory/
RUN npm i
CMD [ "npm", "test" ]

FROM node:14-alpine as development
WORKDIR /inventory
COPY . /inventory/
RUN npm i
CMD [ "npm", "start" ]