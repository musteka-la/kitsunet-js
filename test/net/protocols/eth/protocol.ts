'use strict'

import 'mocha'
import { expect } from 'chai'
import BN from 'bn.js'
import { EthProtocol, ProtocolCodes } from '../../../../src/net/protocols/eth'
import { IPeerDescriptor, INetwork, IEncoder, IProtocol } from '../../../../src/net'
import { IBlockchain } from '../../../../src/blockchain'
import fromRpc = require('ethereumjs-block/from-rpc')
import Block from 'ethereumjs-block'
import * as jsonBlock from '../../../fixtures/block.json'
import { GetBlockHeaders, BlockHeaders, NewBlockHashes, Status } from '../../../../src/net/protocols/eth/handlers'

const passthroughEncoder: IEncoder = {
  encode: async function* <T, U>(msg) { yield msg },
  decode: async function* <T, U>(msg) { yield msg }
}

const block: Block = new Block(fromRpc(jsonBlock.block))

describe('Eth protocol', () => {
  describe('setup', () => {
    let ethProtocol
    beforeEach(() => {
      ethProtocol = new EthProtocol({} as IBlockchain,
                                    {} as IPeerDescriptor<any>,
                                    {} as INetwork<any>,
                                    {} as IEncoder)
    })

    it('should have correct protocol id', () => {
      expect(ethProtocol.id).to.eql('eth')
    })

    it('should have correct protocol codec', () => {
      expect(ethProtocol.codec).to.eql('/kitsunet/eth/63')
    })

    it('should have correct protocol versions', () => {
      expect(ethProtocol.versions).to.eql(['62', '63'])
    })
  })

  describe('handlers - handle', () => {
    let ethProtocol
    beforeEach(() => {
      ethProtocol = new EthProtocol({} as IBlockchain,
                                    {} as IPeerDescriptor<any>,
                                    {} as INetwork<any>,
                                    passthroughEncoder)
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

    it('should handle GetBlockHeaders request using block number', async () => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [
            ProtocolCodes.GetBlockHeaders,
            new BN(block.header.number).toArrayLike(Buffer),
            Buffer.from([20]),
            Buffer.from([0]),
            Buffer.from([0])
          ]
        }
      }

      for await (const msg of ethProtocol.receive(source)) {
        expect(msg).to.eql({
          block: new BN(block.header.number),
          max: 20,
          skip: 0,
          reverse: 0
        })
      }
    })

    it('should handle GetBlockHeaders request using block hash', async () => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [
            ProtocolCodes.GetBlockHeaders,
            block.header.hash(),
            Buffer.from([20]),
            Buffer.from([0]),
            Buffer.from([0])
          ]
        }
      }

      for await (const msg of ethProtocol.receive(source)) {
        expect(msg).to.eql({
          block: block.header.hash(),
          max: 20,
          skip: 0,
          reverse: 0
        })
      }
    })
  })

  describe('handles - request', () => {
    let sendHandler: Function | undefined
    let receiveHandler: (msg: any) => AsyncIterable<any> | undefined
    const networkProvider: INetwork<any> = {
      send: async <T, U>(msg: T, protocol?: IProtocol<any>, peer?: any): Promise<any> => {
        return sendHandler ? sendHandler(msg) : msg
      },
      receive: async function* <T, U>(readable: AsyncIterable<T>): AsyncIterable<U | U[]> {
        return receiveHandler ? receiveHandler(readable) : receiveHandler
      }
    }

    let ethProtocol
    beforeEach(() => {
      ethProtocol = new EthProtocol({} as IBlockchain,
                                    {} as IPeerDescriptor<any>,
                                    networkProvider,
                                    passthroughEncoder)
    })

    it('should send GetBlockHeaders request using block number', async () => {
      sendHandler = (msg) => {
        const [msgId, _block, max, skip, reverse] = msg
        expect(msgId).to.eql(ProtocolCodes.GetBlockHeaders)
        expect(_block).to.eql(block.header.number)
        expect(max).to.eql(Buffer.from([20]))
        expect(skip).to.eql(Buffer.from([0]))
        expect(reverse).to.eql(Buffer.from([0]))
      }

      const getBlockHeaders: GetBlockHeaders<any> = new GetBlockHeaders(ethProtocol,{} as IPeerDescriptor<any>)
      await getBlockHeaders.request([new BN(block.header.number), 20, 0, 0])
    })
  })
})
