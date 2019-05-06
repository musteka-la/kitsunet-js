'use strict'

import 'mocha'
import { expect } from 'chai'
import { EthProtocol, ProtocolCodes } from '../../../../src/net/protocols/eth'
import { IPeerDescriptor, INetwork, IEncoder } from '../../../../src/net'
import { IBlockchain } from '../../../../src/blockchain'
import Block from 'ethereumjs-block'
import utils from 'ethereumjs-util'
import BN from 'bn.js'

import fromRpc = require('ethereumjs-block/from-rpc')
import * as jsonBlock from '../../../fixtures/block.json'

describe('Eth protocol', () => {
  const ethProtocol = new EthProtocol({} as IBlockchain,
                                      {} as IPeerDescriptor<any>,
                                      {} as INetwork<any>,
                                      {
                                        encode: async function* (msg) { yield msg },
                                        decode: async function* (msg) { yield msg }
                                      } as IEncoder)

  it('should have correct protocol id', () => {
    expect(ethProtocol.id).to.eql('eth')
  })

  it('should have correct protocol codec', () => {
    expect(ethProtocol.codec).to.eql('/kitsunet/eth/63')
  })

  it('should have correct protocol versions', () => {
    expect(ethProtocol.versions).to.eql(['62', '63'])
  })

  it('should handle status request', async () => {
    const source: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield [ProtocolCodes.Status, 0, 0, Buffer.from([0]), Buffer.from([0]), Buffer.from([0]), 0]
      }
    }

    for await (const msg of ethProtocol.receive(source)) {
      expect(msg).to.deep.eq({
        protocolVersion: 0,
        networkId: 0,
        td: new BN(Buffer.from([0])),
        bestHash: new BN(Buffer.from([0])),
        genesisHash: new BN(Buffer.from([0])),
        number: 0
      })
    }
  })

  it('should handle block headers request', async () => {
    const source: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield [ProtocolCodes.BlockHeaders, fromRpc(jsonBlock.block).header.raw]
      }
    }

    for await (const msg of ethProtocol.receive(source)) {
      expect(msg[0].bloom).to.eql(fromRpc(jsonBlock.block).header.bloom)
      expect(msg[0].coinbase).to.eql(fromRpc(jsonBlock.block).header.coinbase)
      expect(msg[0].difficulty).to.eql(fromRpc(jsonBlock.block).header.difficulty)
      expect(msg[0].extraData).to.eql(fromRpc(jsonBlock.block).header.extraData)
      expect(msg[0].gasLimit).to.eql(fromRpc(jsonBlock.block).header.gasLimit)
      expect(msg[0].gasUsed).to.eql(fromRpc(jsonBlock.block).header.gasUsed)
      expect(msg[0].mixHash).to.eql(fromRpc(jsonBlock.block).header.mixHash)
      expect(msg[0].nonce).to.eql(fromRpc(jsonBlock.block).header.nonce)
      expect(msg[0].number).to.eql(fromRpc(jsonBlock.block).header.number)
      expect(msg[0].parentHash).to.eql(fromRpc(jsonBlock.block).header.parentHash)
      expect(msg[0].raw).to.eql(fromRpc(jsonBlock.block).header.raw)
      expect(msg[0].receiptTrie).to.eql(fromRpc(jsonBlock.block).header.receiptTrie)
      expect(msg[0].stateRoot).to.eql(fromRpc(jsonBlock.block).header.stateRoot)
      expect(msg[0].timestamp).to.eql(fromRpc(jsonBlock.block).header.timestamp)
    }
  })
})
