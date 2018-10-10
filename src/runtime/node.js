'use strict'

const yargs = require('yargs')
const WS = require('libp2p-websockets')
const TCP = require('libp2p-tcp')
const MDNS = require('libp2p-mdns')

const kitsunet = require('../kitsunet-app')
const createNode = require('../libp2p')

const log = require('debug')('kitsunet:node')

const args = yargs
  .usage(`Kitsunet cmd client`)
  .options({
    'libp2p-addrs': {
      alias: 'a',
      description: 'list of libp2p multiaddrs to listen on',
      requiresArg: true,
      required: false,
      type: 'array'
    },
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
    'rpc-enable-tracker': {
      description: 'enable block tracker to propagate over libp2p multicast',
      alias: 't',
      type: 'boolean',
      default: false,
      requiresArg: false,
      required: false
    },
    'slice-bridge': {
      alias: 'b',
      description: 'enable bridge mode - read slices from the rpc',
      requiresArg: false,
      required: false,
      default: false,
      type: 'boolean'
    },
    'slice-path': {
      alias: 'p',
      description: 'slice path',
      requiresArg: true,
      required: true,
      type: 'string'
    },
    'slice-depth': {
      alias: 'd',
      description: 'slice depth',
      requiresArg: true,
      required: true
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
    }
  })
  .help('help')
  .alias('help', 'h')
  .argv

let config = {}
if (args.config) {
  config = args.config
}

const identity = args.identity ? require(args.identity) : config.identity
const addrs = args.libp2pAddrs || config.libp2pAddrs

run()

async function run () {
  let node = null

  const options = {
    modules: {
      transport: [
        WS,
        TCP
      ],
      peerDiscovery: [
        MDNS
      ]
    }
  }

  try {
    node = await createNode({ identity, addrs, options })
  } catch (err) {
    log(err)
    return
  }

  if (node) { kitsunet({ options: args, node }) }
}
