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
        -e 0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5 \
        -e 0x1d805bc00b8fa3c96ae6c8fa97b2fd24b19a9801 \
        -r http://mustekala-geth:8545 \
        -b -t -i `pwd`/monkey.json \
        -T https://telemetry.lab.metamask.io

# expose server
EXPOSE 30333
EXPOSE 30334
