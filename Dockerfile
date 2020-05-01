FROM node:lts-alpine

WORKDIR /app

# Add python to get support for certain modules
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ 

COPY . .

# Setup server dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn
RUN apk del .gyp

# Build client
RUN cd ./client/ && yarn && yarn build