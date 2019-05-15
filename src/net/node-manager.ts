'use strict'

import { Node } from './node'
import { register } from 'opium-decorators'
import { EventEmitter } from 'events'
import { IPeerDescriptor } from './interfaces';

/**
 * A node manager to start/stop nodes as well
 * as subscribet to discovery events
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:disconnected - fires when a peer disconnects
 */
@register()
export class NodeManager<T extends IPeerDescriptor<any>> extends EventEmitter {
  private connectedHandler = (...args: any[]) =>
    this.emit('kitsunet:peer:connected', ...args)

  private disconnectedHandler = (...args: any[]) =>
    this.emit('kitsunet:peer:disconnected', ...args)

  constructor (@register('nodes') public nodes: Node<T>[]) {
    super()
  }

  async start (): Promise<void> {
    for (const node of this.nodes) {
      node.on('kitsunet:peer:connected', this.connectedHandler)
      node.on('kitsunet:peer:disconnected', this.disconnectedHandler)

      await node.start()
    }
  }

  async stop (): Promise<void> {
    for (const node of this.nodes) {
      node.off('kitsunet:peer:connected', this.connectedHandler)
      node.off('kitsunet:peer:disconnected', this.disconnectedHandler)

      await node.stop()
    }
  }
}
