'use strict'

import WS from 'libp2p-websockets'
import TCP from 'libp2p-tcp'
import MDNS from 'libp2p-mdns'

import Bootstrap from 'libp2p-bootstrap'
import PeerInfo from 'peer-info'

export class Libp2pConfig {
  /**
   * Return a libp2p config
   *
   * @param peerInfo {PeerInfo} - the peerInfo for this peer
   * @param addrs {string[]} - the addrs array
   * @param bootstrap {string[]} - the bootstraps addrs array
   */
  static async getConfig (peerInfo: PeerInfo,
                          addrs?: string[],
                          bootstrap?: string[]): Promise<any> {
    bootstrap = bootstrap || []

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
}
