// 'use strict'

// import { Downloader } from './downloader'
// import { KsnEthQuery } from '../../ksn-eth-query'

// const parallelLimit = require('async/parallelLimit')
// const nextTick = require('async/nextTick')

// function _mkRangeArray (from: number, max: number) {
//   return Array.from({ length: max }, (_, i) => from + i)
// }

// const DEFAULT_CONCURRENCY = 3

// export class RpcDownloader extends Downloader {
//   public ethQuery: KsnEthQuery

//   constructor (ethQuery: KsnEthQuery, start: number, max: number) {
//     super(start, max)
//     this.ethQuery = ethQuery
//   }

//   /**
//    * Get blocks from remote
//    *
//    * @param {Number} from - get blocks from block number/hash
//    * @param {Number} max - max number of blocks to download
//    * @returns {Array<Block>}
//    */
//   async getBlocks (from: number, max: number): Promise<Array<any>> {
//     return new Promise((resolve, reject) => {
//       parallelLimit(_mkRangeArray(from, max || this.maxBlocks)
//         .map((number) => () => this.ethQuery.getBlockByNumber(number)),
//         DEFAULT_CONCURRENCY,
//         (err: Error, blocks: Array<any>) => {
//           if (err) return reject(err)
//           nextTick(() => this.emit('blocks', blocks))
//           resolve(blocks)
//         })
//     })
//   }

//   /**
//    * Get headers from remote
//    *
//    * @param {Number} from - get headers from block number/hash
//    * @param {Number} max - max number of headers to download
//    * @returns {Array<Header>}
//    */
//   async getHeaders (from: number, max: number): Promise<Array<any>> {
//     return new Promise((resolve, reject) => {
//       parallelLimit(_mkRangeArray(from, max || this.maxBlocks)
//         .map((number) => () => this.ethQuery.getBlockByNumber(number)),
//         DEFAULT_CONCURRENCY,
//         (err: Error, headers: Array<any>) => {
//           if (err) return reject(err)
//           nextTick(() => this.emit('headers', headers))
//           resolve(headers)
//         })
//     })
//   }
// }
