(async () => {
  'use strict'

  const distance = require('xor-distance')
  const promisify = require('pify')
  const PeerId = promisify(require('peer-id'))
  const multihashing = require('multihashing')

  const SLICE_RANGE = 16 ** 4
  const RANGE = 40

  try {
    const p1 = Buffer.from('cba5271651bee35e9173ea1eb1fb1143d5147b3eaa6500536987c1d41ac4ed71', 'hex')
    const p2 = Buffer.from('cba5271651d461b94844a5f4394fbf0008fa8851cafee68b82d655fb951c9675', 'hex')

    const p3 = Buffer.from('c716f1b210009fa598764faa40484848341b98ecf7cb2f06f0a3831d700d6c4c', 'hex')
    const p4 = Buffer.from('c716f1b2101bee35e9173ea1eb1fb1143d5147b3eaa6500536987c1d41ac4ed71', 'hex')

    const p1s = Number(`0x${p1.toString('hex').slice(0, 16)}`)
    const p2s = Number(`0x${p2.toString('hex').slice(0, 16)}`)

    const p3s = Number(`0x${p3.toString('hex').slice(0, 16)}`)
    const p4s = Number(`0x${p4.toString('hex').slice(0, 16)}`)

    console.dir(`p1: ${p1s % SLICE_RANGE}`)
    console.dir(`p2: ${p2s % SLICE_RANGE}`)

    console.dir(`p3: ${p3s % SLICE_RANGE}`)
    console.dir(`p4: ${p4s % SLICE_RANGE}`)

    // var dist1 = distance(p1, p2)
    // var dist2 = distance(p3, p4)

    // // the following returns true since the distance between foo and bar
    // // is greater than the distance between foo and baz
    // console.log(distance.gt(dist1, dist2))
  } catch (e) {
    console.dir(e)
  }
})()
