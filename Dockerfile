FROM node:latest

WORKDIR /poing

COPY . .

RUN yarn

CMD ["yarn", "dev"]