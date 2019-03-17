'use strict'

const VM = require('ethereumjs-vm')
const blockFromRpc = require('ethereumjs-block/from-rpc')
const FakeTransaction = require('ethereumjs-tx/fake')

const { SlicedTrie } = require('../src/sliced-trie')
const { Slice } = require('../src/slice')

const accountRaw = require('./account.json')
const contractRaw = require('./contract.json')

const accountData = JSON.parse(accountRaw).result
const contractData = JSON.parse(contractRaw).result

const slice = new Slice(accountData)
const slicedTrie = new SlicedTrie({
  depth: 12,
  sliceManager: {
    async getSliceById (sliceId) {
      return slice
    }
  }
})

const block = blockFromRpc(blockParams)
runVm(req, block, (err, results) => {
  if (err) return end(err)
  const returnValue = results.vm.return ? '0x' + results.vm.return.toString('hex') : '0x'
  res.result = returnValue
  end()
})

function runVm (req, block, cb) {
  const txParams = Object.assign({}, req.params[0])

  // create vm with state lookup intercepted
  const vm = new VM({ state: slicedTrie })

  // create tx
  txParams.from = txParams.from || '0x0000000000000000000000000000000000000000'
  txParams.gasLimit = txParams.gasLimit || ('0x' + block.header.gasLimit.toString('hex'))
  const tx = new FakeTransaction(txParams)

  vm.runTx({
    tx: tx,
    block: block,
    skipNonce: true,
    skipBalance: true
  }, function (err, results) {
    if (err) return cb(err)
    if (results.error) {
      return cb(new Error('VM error: ' + results.error))
    }
    if (results.vm && results.vm.exception !== 1 && results.vm.exceptionError !== 'invalid opcode') {
      return cb(new Error('VM Exception while executing ' + req.method + ': ' + results.vm.exceptionError))
    }

    cb(null, results)
  })
}
