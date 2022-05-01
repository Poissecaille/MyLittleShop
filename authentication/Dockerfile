FROM node:14-alpine as test
WORKDIR /authentication
COPY . /authentication/
RUN npm i
CMD [ "npm", "test" ]


FROM node:14-alpine as development
WORKDIR /authentication
COPY . /authentication/
RUN npm i
CMD [ "npm", "start" ]