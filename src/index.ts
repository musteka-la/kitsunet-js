'use strict'

import { Kitsunet } from './kitsunet'
import { register } from 'opium-decorators'
import ethjsUtils from 'ethjs-util'
import { isValidAddress, keccak256 } from 'ethereumjs-util'
import { SliceId, Slice } from './slice'
import { debug } from 'debug'
import { IPeerDescriptor } from './net'

export * from './kitsunet'

const log = debug('kitsunet:kitsunet-factory')

export class KitsunetFactory {
  @register('default-slices')
  static defaultSlices (@register('options') options: any): Slice[] {
    let paths = options.slicePath || []
    let ethAddrs = options.ethAddrs || []
    if (ethAddrs.length) {
      paths = paths.concat(ethAddrs.map((a) => {
        if (isValidAddress(a)) {
          return keccak256(ethjsUtils.stripHexPrefix(a)).toString('hex').slice(0, 4)
        }
      }))
    }

    let slices = paths.map((p) => {
      return new SliceId(p, options.sliceDepth)
    })

    if (options.sliceFile && options.sliceFile.length > 0) {
      const slicesFile = require(options.sliceFile)
      slices = slices.concat(slicesFile.slices.map((p) => {
        return new SliceId(p, options.sliceDepth)
      }))
    }

    return slices
  }

  @register('kitsunet')
  static async createKitsunet<T extends IPeerDescriptor<any>> (@register('default-slices')
                                                               slices: Slice[],
                                                               kitsunet: Kitsunet<T>): Promise<Kitsunet<T>> {

    kitsunet.on('kitsunet:start', () => {
      log('kitsunet started')
      return kitsunet.sliceManager.track(new Set(slices))
    })

    await kitsunet.start()
    return kitsunet
  }
}
