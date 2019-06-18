/* eslint-env mocha */

'use strict'

import 'mocha'
import { expect } from 'chai'

import { EventEmitter } from 'events'
import {
  PeerManager,
  NetworkPeer,
  Node,
  NodeManager,
  Peer
} from '../../src/net'
import { BaseProtocol } from '../../src/net/base-protocol'

class FakePeer extends NetworkPeer<any, any> {
  used: boolean = false
  peer: any
  id: string = '12345'
  addrs: Set<string> = new Set('/ip4/127.0.0.1/tcp/5000')

  constructor (id: string = '12345',
               addrs: Set<string> = new Set(['/ip4/127.0.0.1/tcp/5000'])) {
    super()

    this.id = id
    this.addrs = addrs
  }
}

class FakeProto extends BaseProtocol<FakePeer> {
// tslint:disable-next-line: no-empty
  async handshake (): Promise<void> {
  }

  id: string
  versions: string[]

  constructor (id: string, versions: string[], peer: FakePeer) {
    super(peer, {} as Node<FakePeer>)
    this.id = id
    this.versions = versions
  }
}

describe('peer manager', () => {
  let nodeManager: NodeManager<any>
  let peerManager: PeerManager
  let fakePeer: Peer

  beforeEach(() => {
    nodeManager = new EventEmitter() as NodeManager<any>
    peerManager = new PeerManager(nodeManager)
    fakePeer = new FakePeer()
  })

  it('should add peer', () => {
    nodeManager.emit('kitsunet:peer:connected', fakePeer)
    expect(peerManager.peers).to.have.keys('12345')
    expect(peerManager.peers.get('12345')).to.eql(fakePeer)
  })

  it('should remove peer', () => {
    nodeManager.emit('kitsunet:peer:disconected', fakePeer)
    expect(peerManager.peers).to.not.have.keys('12345')
  })

  it('should retrieve peer by id', () => {
    nodeManager.emit('kitsunet:peer:connected', fakePeer)
    expect(peerManager.getById('12345')).to.eql(fakePeer)
    expect(fakePeer.used).to.be.eq(true)
  })

  it('should retrieve unused peers', () => {
    const peer1 = new FakePeer('12345')
    const peer2 = new FakePeer('678910')
    const peer3 = new FakePeer('1112131415')
    const peer4 = new FakePeer('1617181920')

    nodeManager.emit('kitsunet:peer:connected', peer1)
    nodeManager.emit('kitsunet:peer:connected', peer2)
    nodeManager.emit('kitsunet:peer:connected', peer3)
    nodeManager.emit('kitsunet:peer:connected', peer4)
    peer3.used = true
    const peers = peerManager.getUnusedPeers()
    expect(peers).to.have.members([peer1, peer2, peer4])
  })

  it('should retrieve by capability', () => {
    const peer1 = new FakePeer('12345')
    peer1.protocols.set('proto1', new FakeProto('proto1', ['1.0.0'], peer1))

    const peer2 = new FakePeer('678910')
    peer2.protocols.set('proto2', new FakeProto('proto2', ['1.0.0'], peer2))

    const peer3 = new FakePeer('1112131415')
    peer3.protocols.set('proto3', new FakeProto('proto3', ['1.0.0'], peer3))

    const peer4 = new FakePeer('1617181920')
    peer4.protocols.set('proto4', new FakeProto('proto4', ['1.0.0'], peer4))

    nodeManager.emit('kitsunet:peer:connected', peer1)
    nodeManager.emit('kitsunet:peer:connected', peer2)
    nodeManager.emit('kitsunet:peer:connected', peer3)
    nodeManager.emit('kitsunet:peer:connected', peer4)
    const peers = peerManager.getByCapability({ id: 'proto3', versions: ['1.0.0'] })
    expect(peers[0]).to.eql(peer3)
  })
})
