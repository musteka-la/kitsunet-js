'use strict'

import { KitsunetFactory } from '../src'

import path from 'path'
import fs from 'fs'

import Debug from 'debug'
const debug = Debug('kitsunet:cli')

const cliConfig: any = {
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
  'sync-mode': {
    alias: 's',
    description: 'sync mode',
    requiresArg: true,
    required: false,
    default: 'fast',
    choices: ['fast', 'ksn']
  },
  'eth-addrs': {
    alias: 'e',
    description: 'list of Ethereum addresses to track',
    requiresArg: true,
    required: false,
    type: 'array'
  },
  'devp2p-port': {
    alias: 'P',
    description: 'devp2p port',
    requiresArg: true,
    required: false,
    default: 30303,
    type: 'number'
  },
  'stacks': {
    alias: 'S',
    description: 'stacks',
    requiresArg: true,
    required: false,
    default: ['devp2p', 'libp2p'],
    choices: ['devp2p', 'libp2p']
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
  'eth-chain-db': {
    alias: 'D',
    description: 'the blockchain db path',
    requiresArg: true,
    required: false,
    default: './.kitsunet/chain-db/',
    type: 'string'
  },
  'eth-network': {
    description: `the blockchain network name - 'mainnet' by default`,
    requiresArg: true,
    required: false,
    default: 'mainnet',
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
  'libp2-identity': {
    alias: 'L',
    description: 'json file, containing the private and public keys for libp2p',
    requiresArg: true,
    required: false,
    type: 'string'
  },
  'devp2p-identity': {
    alias: 'I',
    description: 'json file, containing the private and public keys for devp2p',
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
}

class KistunetCli {
  static async run () {
    const options = require('yargs')
      .usage(`Kitsunet cmd client`)
      .options(cliConfig)
      .help('help')
      .alias('help', 'h')
      .argv

    let config: any = {}
    if (options.config) {
      config = options.config
    }

    options.NODE_ENV = process.env.NODE_ENV || 'prod'
    options.libp2pIdentity = options.libp2Identity
      ? await import(options.libp2Identity)
      : config.libp2Identity

    options.devp2pIdentity = options.devp2Identity
      ? await import(options.libp2Identity)
      : config.libp2pIdentity

    options.libp2pAddrs = options.libp2pAddrs || options.libp2PAddrs || config.libp2pAddrs
    options.chainDb = path.resolve(options.ethChainDb)

    if (!fs.existsSync(options.chainDb)) {
      fs.mkdirSync(options.chainDb, {
        recursive: true,
        mode: 0o755
      })
    }

    const kitsunet = await KitsunetFactory.createKitsunet(options)
    await kitsunet.start()

    const cleanup = async () => {
      console.log(`\nshutting down client...`)
      setTimeout(() => process.exit(0), 5000)
      await kitsunet.stop()
    }

    // listen for graceful termination
    process.on('SIGTERM', cleanup)
    process.on('SIGINT', cleanup)
    process.on('SIGHUP', cleanup)
  }
}

process.on('unhandledRejection', (reason) => {
  console.error(reason)
  process.exit(1)
})

try {
  // tslint:disable-next-line: no-floating-promises
  KistunetCli.run()
} catch (err) {
  debug(err)
}
