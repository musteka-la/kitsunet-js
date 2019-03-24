'use strict'

const { default: Blockchain, Block, Header } = require('ethereumjs-blockchain')
const fromRpc = require('ethereumjs-block/from-rpc')
const { default: Common } = require('ethereumjs-common')
const level = require('level')

const main = require('./mainnet')
const block = fromRpc(require('./block').result)

main.genesis = fromRpc(main.genesis)

const blockchain = new Blockchain({ validate: false, common: new Common(main) })

blockchain.putHeader(new Header(block.header), (err, res) => {
  if (err) return console.error(err)
  console.dir(res)

  blockchain.getLatestHeader((err, res) => {
    if (err) return console.log(err)
    // console.log(`Latest block: ${res.hash().toString('hex')}`)
    console.dir(res.header.hash().toString('hex'))
  })
})
