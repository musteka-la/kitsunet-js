FROM node:10
MAINTAINER dryajov

# setup app dir
RUN mkdir -p /kitsunet/
WORKDIR /kitsunet/

# install dependencies
COPY ./package.json /kitsunet/package.json
RUN npm install

# copy over app dir
COPY ./src /kitsunet/src

# start server
CMD npm run start

# expose server
EXPOSE 30333
EXPOSE 30334
