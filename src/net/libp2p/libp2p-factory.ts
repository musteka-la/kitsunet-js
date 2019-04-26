'use strict'

import { register } from 'opium-decorator-resolvers'

import WS from 'libp2p-websockets'
import TCP from 'libp2p-tcp'
import Bootstrap from 'libp2p-bootstrap'
import MDNS from 'libp2p-mdns'
import PeerInfo from 'peer-info'
import PeerId from 'peer-id'
import Libp2p from 'libp2p'

const promisifiedPeerInfo = promisify(PeerInfo, false)
const promisifiedPeerId = promisify(PeerId, false)

export class LibP2PFactory {
  /**
   * Return a libp2p config
   *
   * @param peerInfo {PeerInfo} - the peerInfo for this peer
   * @param addrs {string[]} - the addrs array
   * @param bootstrap {string[]} - the bootstraps addrs array
   */
  async getLibP2PConfig (peerInfo: PeerInfo, addrs?: string[], bootstrap?: string[]): Promise<Object> {
    return {
      peerInfo,
      modules: {
        transport: [
          WS,
          TCP
        ],
        peerDiscovery: [
          MDNS,
          Bootstrap
        ]
      },
      config: {
        peerDiscovery: {
          bootstrap: {
            list: bootstrap,
            interval: 10000
          }
        }
      }
    }
  }

  /**
   * Create libp2p node
   *
   * @param identity {{privKey: string}} - an object with a private key entry
   * @param addrs {string[]} - an array of multiaddrs
   * @param bootstrap {string[]} - an array of bootstrap multiaddr strings
   */
  @register('libp2p-node')
  async createLibP2PNode (identity?: { privKey?: string },
                          addrs?: string[],
                          bootstrap?: string[]): Promise<Libp2p> {
    const peerInfo: PeerInfo = await LibP2PFactory.createPeerInfo(identity, addrs)

    const options = this.getLibP2PConfig(peerInfo, addrs, bootstrap)
    return new Libp2p(options)
  }

  /**
   * Helper to create a PeerInfo
   *
   * @param identity {{privKey: string}} - an object with a private key entry
   * @param addrs {string[]} - an array of multiaddrs
   */
  static async createPeerInfo (identity?: { privKey?: string }, addrs?: string[]): Promise<PeerInfo> {
    let id: PeerId
    const privKey = identity && identity.privKey ? identity.privKey : null
    if (!privKey) {
      id = await promisifiedPeerId.create()
    } else {
      id = await promisifiedPeerId.createFromJSON(identity)
    }

    const peerInfo: PeerInfo = await promisifiedPeerInfo.create(id)
    addrs = addrs || []
    addrs.forEach((a) => peerInfo.multiaddrs.add(a))
    return peerInfo
  }
}
