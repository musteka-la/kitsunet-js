'use strict'

import { Kitsunet } from './kitsunet'
import { register, _container } from 'opium-decorators'
import ethjsUtils from 'ethjs-util'
import ethUtils from 'ethereumjs-util'
import { SliceId } from './slice'
import { debug } from 'debug'

const log = debug('kitsunet:kitsunet-factory')

export class KitsunetFactory {
  @_container()
  static createKitsunet (kitsunet: Kitsunet,
                         @register('options') options: any): Kitsunet<T> {
    let paths = options.slicePath || []
    let ethAddrs = options.ethAddrs || []
    if (ethAddrs.length) {
      paths = paths.concat(ethAddrs.map((a) => {
        if (ethUtils.isValidAddress(a)) {
          return ethUtils.keccak256(ethjsUtils.stripHexPrefix(a)).toString('hex').slice(0, 4)
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

    kitsunet.on('kitsunet:start', () => {
      log('kitsunet started')
      return kitsunet.sliceManager.track(new Set(...slices))
    })
    return kitsunet
  }
}
