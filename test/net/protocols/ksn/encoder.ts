/* eslint-env mocha */

'use strict'

import 'mocha'
import { expect } from 'chai'
import { KsnEncoder } from '../../../../src/net/protocols/kitsunet/ksn-encoder'
import pull from 'pull-stream'
import pushable from 'pull-pushable'
import lp from 'pull-length-prefixed'
import toPull from 'async-iterator-to-pull-stream'
import toIterator from 'pull-stream-to-async-iterator'

import {
  MsgType,
  ResponseStatus,
  NodeType
} from '../../../../src/net'
import { nextTick } from 'async'

const identifyMsg = {
  type: MsgType.IDENTIFY,
  status: ResponseStatus.OK,
  payload: {
    identify: {
      versions: ['1.0.0'],
      userAgent: 'ksn-client',
      nodeType: NodeType.NODE,
      latestBlock: Buffer.from([0]),
      sliceIds: [],
      networkId: 0,
      number: null,
      td: null,
      bestHash: null,
      genesis: null
      // sliceIds: this.networkProvider.getSliceIds()
    }
  }
}

const hexEncoded = '08011001221c0a1a0a05312e302e30120a6b736e2d636c69656e7418012201003000'
const hexEncodedLp = '2208011001221c0a1a0a05312e302e30120a6b736e2d636c69656e7418012201003000'

describe('ksn encoder', () => {
  const encoder = new KsnEncoder()

  it('should encode', async () => {
    const readable: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield identifyMsg
      }
    }

    for await (const m of readable) {
      for await (const encoded of encoder.encode(m)) {
        expect(encoded).to.be.instanceOf(Buffer)
        expect((encoded as Buffer).toString('hex')).to.eq(hexEncoded)
      }
    }
  })

  it('should decode', async () => {
    const readable: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(hexEncoded, 'hex')
      }
    }

    for await (const m of readable) {
      for await (const decoded of encoder.decode(m)) {
        expect((decoded as any).payload.identify).to.eql(identifyMsg.payload.identify)
      }
    }
  })

  it('should encode and pull-stream', (done) => {
    const readable: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield identifyMsg
      }
    }

    const stream = pushable()
    pull(stream, pull.collect((err, data) => {
      if (err) done(err)

      try {
        expect(data[0].toString('hex')).to.eq(hexEncoded)
      } catch (e) {
        done(e)
      }
      done()
    }))

    nextTick(async () => {
      for await (const m of readable) {
        for await (const encoded of encoder.encode(m)) {
          stream.push(encoded)
        }
      }
      stream.end()
    })
  })

  it('should decode and pull-stream', (done) => {
    const readable: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(hexEncoded, 'hex')
      }
    }

    const stream = pushable()
    pull(stream, pull.collect((err, data) => {
      if (err) done(err)
      try {
        expect(data[0].payload.identify).to.eql(identifyMsg.payload.identify)
      } catch (e) {
        done(e)
      }
      done()
    }))

    nextTick(async () => {
      for await (const m of readable) {
        for await (const encoded of encoder.decode(m)) {
          stream.push(encoded)
        }
      }
      stream.end()
    })
  })

  it('should encode and pull-stream with lp', (done) => {
    const readable: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield identifyMsg
      }
    }

    const stream = pushable()
    pull(stream, lp.encode(), pull.collect((err, data) => {
      if (err) done(err)

      try {
        expect(data[0].toString('hex')).to.eq(hexEncodedLp)
      } catch (e) {
        done(e)
      }
      done()
    }))

    nextTick(async () => {
      for await (const m of readable) {
        for await (const encoded of encoder.encode(m)) {
          stream.push(encoded)
        }
      }
      stream.end()
    })
  })

  it('should decode and pull-stream with lp', async () => {
    const readable: AsyncIterable<any> = {
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(hexEncodedLp, 'hex')
      }
    }

    const iter = toIterator(pull(toPull(readable), lp.decode()))
    for await (const m of iter) {
      for await (const deccoded of encoder.decode(m)) {
        expect((deccoded as any).payload.identify).to.eql(identifyMsg.payload.identify)
      }
    }
  })
})
