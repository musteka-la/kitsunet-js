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

ADD ./monkey.json /kitsunet/

# start server
CMD node src/cli.js \
        -a /ip4/127.0.0.1/tcp/30334/ws \
        -a /ip4/127.0.0.1/tcp/30333 \
        -d 10 \
        -p 8e99 \
        -p 1372 \
        -e 0x6810e776880C02933D47DB1b9fc05908e5386b96 \
        -r http://mustekala-geth:8545 \
        -b -t -i `pwd`/monkey.json

# expose server
EXPOSE 30333
EXPOSE 30334
