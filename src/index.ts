'use strict'

import ethjsUtils from 'ethjs-util'
import { Kitsunet } from './kitsunet'
import { register, injectableFactory } from 'opium-decorators'
import { isValidAddress, keccak256 } from 'ethereumjs-util'
import { SliceId, Slice } from './slice'
import { IPeerDescriptor } from './net'

import Debug from 'debug'
const debug = Debug('kitsunet:kitsunet-factory')

export * from './kitsunet'

export class KitsunetFactory {
  static options: any

  @register('options')
  static getOptions (): any {
    return KitsunetFactory.options
  }

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

  @register()
  static async kitsunetFactory<T extends IPeerDescriptor<any>> (@register('default-slices')
                                                                slices: Slice[],
                                                                kitsunet: Kitsunet<T>): Promise<Kitsunet<T>> {

    kitsunet.on('kitsunet:start', () => {
      debug('kitsunet started')
      return kitsunet.sliceManager.track(new Set(slices))
    })

    return kitsunet
  }

  static async createKitsunet (options: any) {
    KitsunetFactory.options = options
    const injectable = injectableFactory()(KitsunetFactory, 'kitsunetFactory')
    return injectable.inject()
  }
}
