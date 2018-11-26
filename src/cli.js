'use strict'

const yargs = require('yargs')

const createKitsunet = require('./kitsunet-factory')

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
      alias: 'a',
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
    'rpc-url': {
      alias: 'r',
      description: 'bridge rpc url <http[s]://host:port>',
      requiresArg: true,
      required: true
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
    'telemetry-url': {
      alias: 'T',
      description: 'the telemetry endpoint url <http[s]://host:port>',
      requiresArg: true,
      required: true
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

run()

async function run () {
  let config = {}
  if (options.config) {
    config = options.config
  }

  const identity = options.identity ? require(options.identity) : config.identity
  const addrs = options.libp2pAddrs || config.libp2pAddrs

  try {
    const { kitsunet } = await createKitsunet({ options, identity, addrs })
    await kitsunet.start()

    process.on('INT', () => {
      kitsunet.stop()
    })
  } catch (err) {
    console.error(err)
  }
}
