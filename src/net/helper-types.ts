'use strict'

import { Devp2pPeer, Libp2pPeer } from './stacks'
import { KsnProtocol, EthProtocol } from './protocols'
import { NetworkPeer } from './network-peer'

export type PeerTypes = Libp2pPeer | Devp2pPeer
export type ProtocolTypes = KsnProtocol<PeerTypes> | EthProtocol<PeerTypes>
export type Peer = NetworkPeer<PeerTypes, ProtocolTypes>
