FROM node:14-alpine as test
WORKDIR /aggregator
COPY . /aggregator/
RUN npm i
CMD [ "npm", "test" ]

FROM node:14-alpine as development
WORKDIR /aggregator
COPY . /aggregator/
RUN npm i
CMD [ "npm", "start" ]