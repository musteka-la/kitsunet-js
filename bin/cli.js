'use strict'

import yargs from 'yargs'
import path from 'path'
import fs from 'fs'

import createKitsunet from '../src'

const options = yargs
  .usage(`Kitsunet cmd client`)
  .options({
    'libp2p-addrs': {
      alias: 'a',
      description: 'list of libp2p multiaddrs to listen on',
      requiresArg: true,
      required: false,
      type: 'array'
    },
    'libp2p-bootstrap': {
      alias: 'A',
      description: 'list of libp2p bootstrap nodes',
      requiresArg: true,
      required: false,
      type: 'array'
    },
    'eth-addrs': {
      alias: 'e',
      description: 'list of Ethereum addresses to track',
      requiresArg: true,
      required: false,
      type: 'array'
    },
    // TODO: make this required if in bridge mode
    'rpc-url': {
      alias: 'r',
      description: 'bridge rpc url <http[s]://host:port>',
      requiresArg: true,
      required: false
    },
    'rpc-poll-interval': {
      description: 'rpc poll interval in milliseconds',
      requiresArg: true,
      required: false,
      default: 10 * 1000
    },
    bridge: {
      alias: 'b',
      description: 'enable bridge mode - read slices from the rpc',
      requiresArg: false,
      required: false,
      default: false,
      type: 'boolean'
    },
    'chain-db': {
      alias: 'D',
      description: 'the blockchain db path',
      requiresArg: true,
      required: false,
      default: './.kitsunet/chain-db/',
      type: 'string'
    },
    'slice-path': {
      alias: 'p',
      description: 'slice path',
      requiresArg: true,
      required: false,
      type: 'array'
    },
    'slice-depth': {
      alias: 'd',
      description: 'slice depth',
      requiresArg: true,
      required: false,
      type: 'string'
    },
    'slice-file': {
      alias: 'f',
      description: 'slice depth',
      requiresArg: true,
      required: false
    },
    identity: {
      alias: 'i',
      description: 'json peer info file, containing the private and public keys',
      requiresArg: true,
      required: false
    },
    config: {
      alias: 'c',
      description: 'path to config file',
      config: true,
      requiresArg: true,
      required: false
    },
    'dial-interval': {
      alias: 'df',
      description: 'dial frequency',
      requiresArg: true,
      required: false,
      type: 'integer'
    }
  })
  .help('help')
  .alias('help', 'h')
  .argv

  (async function run () {
    let config = {}
    if (options.config) {
      config = options.config
    }

    options.NODE_ENV = process.env.NODE_ENV || 'prod'

    options.identity = options.identity ? require(options.identity) : config.identity
    options.libp2pAddrs = options.libp2pAddrs || options.libp2PAddrs || config.libp2pAddrs

    options.chainDb = path.resolve(options.chainDb)
    if (!fs.existsSync(options.chainDb)) {
      fs.mkdirSync(options.chainDb, { recursive: true, mode: 0o755 })
    }

    try {
      const kitsunet = await createKitsunet(options)
      await kitsunet.start()

      // process.on('unhandledRejection', function (reason, p) {
      //   console.dir(reason)
      // })

      process.on('INT', () => {
        kitsunet.stop()
      })
    } catch (err) {
      console.error(err)
    }
  })()
