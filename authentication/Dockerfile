FROM node:14-alpine
WORKDIR /authentication
COPY . /authentication/
RUN npm i
ARG PASSWORD_SECRET=$PASSWORD_SECRET
RUN npm test
CMD [ "npm", "start" ]