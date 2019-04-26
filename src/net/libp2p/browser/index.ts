'use strict'

import WS from 'libp2p-websockets'
import WStar from 'libp2p-webrtc-star'
import Bootstrap from 'libp2p-bootstrap'
import PeerInfo from 'peer-info'
import { LibP2PFactory } from '../libp2p-factory'

export class LibP2PBrowserFactory extends LibP2PFactory {

  /**
   * Return a libp2p config
   *
   * @param peerInfo {PeerInfo} - the peerInfo for this peer
   * @param addrs {string[]} - the addrs array
   * @param bootstrap {string[]} - the bootstraps addrs array
   */
  async getLibP2PConfig (peerInfo: PeerInfo, addrs?: string[], bootstrap?: string[]): Promise<Object> {
    const wstar = new WStar()
    return {
      peerInfo,
      modules: {
        transport: [
          WS,
          wstar
        ],
        peerDiscovery: [
          wstar.discovery,
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
