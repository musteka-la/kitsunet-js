/* eslint-env mocha */

'use strict'

import 'mocha'
import Block from 'ethereumjs-block'
import Common from 'ethereumjs-common'
import BN from 'bn.js'
import { EventEmitter as EE } from 'events'
import { expect } from 'chai'
import { EthProtocol } from '../../../../src/net/protocols/eth'
import { ETH } from 'ethereumjs-devp2p'

import {
  IPeerDescriptor,
  IEncoder,
  Node
} from '../../../../src/net'

import {
  GetBlockHeaders,
  BlockHeaders,
  NewBlockHashes,
  Status
} from '../../../../src/net/protocols/eth/handlers'

import * as jsonBlock from '../../../fixtures/block.json'
import { nextTick } from 'async'
import fromRpc = require('ethereumjs-block/from-rpc')
const block: Block = new Block(fromRpc(jsonBlock.block))

const passthroughEncoder: IEncoder = {
  encode: async function* <T, U>(msg) { yield msg },
  decode: async function* <T, U>(msg) { yield msg }
}

describe('Eth protocol', () => {
  describe('setup', () => {
    let ethProtocol
    beforeEach(() => {
      ethProtocol = new EthProtocol({} as IPeerDescriptor<any>,
                                    new EE() as unknown as Node<any>, {
                                      getBlocksTD: () => Buffer.from([0]),
                                      getBestBlock: () => block,
                                      common: new Common('mainnet')
                                    } as any,
                                    passthroughEncoder)
    })

    it('should have correct protocol id', () => {
      expect(ethProtocol.id).to.eql('eth')
    })

    it('should have correct protocol versions', () => {
      expect(ethProtocol.versions).to.eql(['62', '63'])
    })
  })

  describe('handlers - handle', () => {
    let ethProtocol: EthProtocol<any>
    let provider: any = new EE()
    provider.send = () => []

    const chain: any = {
      getBlocksTD: () => Buffer.from([0]),
      getBestBlock: () => block,
      common: new Common('mainnet')
    }

    beforeEach(() => {
      ethProtocol = new EthProtocol({} as IPeerDescriptor<any>, provider, chain, passthroughEncoder)
    })

    it('should handle Status request', async () => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [ETH.MESSAGE_CODES.STATUS, 0, 0, new BN(0), Buffer.from([0]), '0x0', new BN(0)]
        }
      }

      // eslint-disable-next-line no-unused-vars
      for await (const _ of ethProtocol.receive(source)) {
        const status = {
          protocolVersion: 0,
          networkId: 0,
          td: new BN(0),
          bestHash: Buffer.from([0]),
          genesisHash: '0x0',
          number: new BN(0)
        }

        expect(await ethProtocol.getStatus()).to.eql(status)
      }
    })

    it('should handle block headers request', async () => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [ETH.MESSAGE_CODES.BLOCK_HEADERS, block.header.raw]
        }
      }

      const msg: Promise<Block.Header[]> = new Promise(async (resolve) => {
        for await (const msg of ethProtocol.getHeaders(1, 1)) {
          return resolve(msg)
        }
      })

      // eslint-disable-next-line no-unused-vars
      for await (const _ of ethProtocol.receive(source)) {
        return msg.then((header: Block.Header[]) => {
          expect(header[0].bloom).to.eql(fromRpc(jsonBlock.block).header.bloom)
          expect(header[0].coinbase).to.eql(fromRpc(jsonBlock.block).header.coinbase)
          expect(header[0].difficulty).to.eql(fromRpc(jsonBlock.block).header.difficulty)
          expect(header[0].extraData).to.eql(fromRpc(jsonBlock.block).header.extraData)
          expect(header[0].gasLimit).to.eql(fromRpc(jsonBlock.block).header.gasLimit)
          expect(header[0].gasUsed).to.eql(fromRpc(jsonBlock.block).header.gasUsed)
          expect(header[0].mixHash).to.eql(fromRpc(jsonBlock.block).header.mixHash)
          expect(header[0].nonce).to.eql(fromRpc(jsonBlock.block).header.nonce)
          expect(header[0].number).to.eql(fromRpc(jsonBlock.block).header.number)
          expect(header[0].parentHash).to.eql(fromRpc(jsonBlock.block).header.parentHash)
          expect(header[0].raw).to.eql(fromRpc(jsonBlock.block).header.raw)
          expect(header[0].receiptTrie).to.eql(fromRpc(jsonBlock.block).header.receiptTrie)
          expect(header[0].stateRoot).to.eql(fromRpc(jsonBlock.block).header.stateRoot)
          expect(header[0].timestamp).to.eql(fromRpc(jsonBlock.block).header.timestamp)
        })
      }
    })

    it('should handle GetBlockHeaders request using block number', async () => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [
            ETH.MESSAGE_CODES.GET_BLOCK_HEADERS,
            new BN(block.header.number).toArrayLike(Buffer), 20, 0, 0
          ]
        }
      }

      ethProtocol.handlers[ETH.MESSAGE_CODES.GET_BLOCK_HEADERS] = {
        handle: (...msg) => expect(msg).to.eql([
          (new BN(block.header.number)).toArrayLike(Buffer), 20, 0, 0
        ])
      } as any

      // eslint-disable-next-line no-unused-vars
      for await (const _ of ethProtocol.receive(source)) {
      }
    })

    it('should handle GetBlockHeaders request using block hash', async () => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [
            ETH.MESSAGE_CODES.GET_BLOCK_HEADERS,
            block.header.hash(), 20, 0, 0
          ]
        }
      }

      ethProtocol.handlers[ETH.MESSAGE_CODES.GET_BLOCK_HEADERS] = {
        handle: (...msg) => expect(msg).to.eql([
          block.header.hash(), 20, 0, 0
        ])
      } as any

      // eslint-disable-next-line no-unused-vars
      for await (const _ of ethProtocol.receive(source)) {
      }
    })

    it('should handle NewBlockHashes request', (done) => {
      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield [
            ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, [block.header.hash(), block.header.number]
          ]
        }
      }

      ethProtocol.on('new-block-hashes', (newBlocks) => {
        expect(newBlocks[0]).to.eql([block.header.hash(), new BN(block.header.number)])
        done()
      })

      nextTick(async () => {
      // eslint-disable-next-line no-unused-vars
        for await (const _ of ethProtocol.receive(source) as any) {
        }
      })
    })
  })

  describe('handles - request', () => {
    let sendHandler: Function | undefined
    let receiveHandler: (msg: any) => AsyncIterable<any> | undefined
    const networkProvider: any = {
      send: async function <T, U> (msg: T): Promise<any> {
        return sendHandler ? sendHandler(msg) : msg
      },
      receive: async function* <T, U>(readable: AsyncIterable<T>): AsyncIterable<U | U[]> {
        return receiveHandler ? receiveHandler(readable) : receiveHandler
      }
    }

    let ethProtocol: EthProtocol<any>
    beforeEach(() => {
      ethProtocol = new EthProtocol({} as IPeerDescriptor<any>,
        networkProvider, {
          getBlocksTD: () => Buffer.from([0]),
          getBestBlock: () => block,
          common: new Common('mainnet')
        } as any,
        passthroughEncoder)
    })

    it('should send Status request', async () => {
      sendHandler = (msg: [any, any]) => {
        const [ msgId, request ] = msg
        const [protocolVersion, networkId, td, bestHash, genesisHash] = request
        expect(msgId).to.eql(ETH.MESSAGE_CODES.STATUS)
        expect(protocolVersion).to.eql(Buffer.from([0]))
        expect(networkId).to.eql(Buffer.from([0]))
        expect(td).to.eql(new BN(Buffer.from([0])).toArrayLike(Buffer))
        expect(bestHash).to.eql(Buffer.from([0]))
        expect(genesisHash).to.eql(Buffer.from('0', 'hex'))
      }

      const status: Status<any> = new Status(ethProtocol, {} as IPeerDescriptor<any>)
      await status.send(0, 0, new BN(0), Buffer.from([0]), '0x0')
    })

    it('should send GetBlockHeaders request using block number', async () => {
      sendHandler = (msg) => {
        const [msgId, req] = msg
        const [_block, max, skip, reverse] = req
        expect(msgId).to.eql(ETH.MESSAGE_CODES.GET_BLOCK_HEADERS)
        expect(_block).to.eql(block.header.number)
        expect(max).to.eql(20)
        expect(skip).to.eql(0)
        expect(reverse).to.eql(0)
      }

      const getBlockHeaders: GetBlockHeaders<any> = new GetBlockHeaders(ethProtocol, {} as IPeerDescriptor<any>)
      await getBlockHeaders.send(new BN(block.header.number), 20, 0, false)
    })

    it('should send GetBlockHeaders request using block hash', async () => {
      sendHandler = (msg) => {
        const [msgId, res] = msg
        const [_block, max, skip, reverse] = res
        expect(msgId).to.eql(ETH.MESSAGE_CODES.GET_BLOCK_HEADERS)
        expect(_block).to.eql(block.header.hash())
        expect(max).to.eql(20)
        expect(skip).to.eql(0)
        expect(reverse).to.eql(0)
      }

      const getBlockHeaders: GetBlockHeaders<any> = new GetBlockHeaders(ethProtocol, {} as IPeerDescriptor<any>)
      await getBlockHeaders.send(block.header.hash(), 20, 0, false)
    })

    it('should send BlockHeaders', async () => {
      sendHandler = (msg) => {
        expect(msg[0]).to.eq(ETH.MESSAGE_CODES.BLOCK_HEADERS)
        expect(msg[1][0]).to.eql(fromRpc(jsonBlock.block).header.raw)
      }

      ethProtocol.ethChain.getHeaders = async () => [fromRpc(jsonBlock.block).header]
      const blockHeaders: BlockHeaders<any> = new BlockHeaders(ethProtocol, {} as IPeerDescriptor<any>)
      await blockHeaders.send(fromRpc(jsonBlock.block).header.hash(), 0, 1, false)
    })

    it('should send NewBlockHashes', async () => {
      sendHandler = (msg) => {
        expect(msg[0]).to.eq(ETH.MESSAGE_CODES.NEW_BLOCK_HASHES)
        expect(msg[1][0]).to.eql([
          fromRpc(jsonBlock.block).header.hash(),
          (new BN(fromRpc(jsonBlock.block).header.number)).toArrayLike(Buffer)
        ])
      }

      const newBlockHashes: NewBlockHashes<any> = new NewBlockHashes(ethProtocol, {} as IPeerDescriptor<any>)
      await newBlockHashes.send([
        fromRpc(jsonBlock.block).header.hash(),
        new BN(fromRpc(jsonBlock.block).header.number)
      ])
    })
  })
})
