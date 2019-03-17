/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const { default: Account } = require('ethereumjs-account')
const { SlicedTrie } = require('../src/sliced-trie')
const { Slice } = require('../src/slice')

const loadFixture = require('aegir/fixtures')
const sliceRaw = loadFixture('test/fixtures/account.json')

const sliceData = JSON.parse(sliceRaw).result

describe('sliced trie', () => {
  const root = '1025f8dbd129c52d04b48119db1b8215495182e8023e5dfc6cc41c25c65c448d'

  const slice = new Slice(sliceData)
  const slicedTrie = new SlicedTrie({ root,
    depth: 12,
    sliceManager: {
      async getSliceById (sliceId) {
        return slice
      }
    }
  })

  it('should retrieve key from trie', (done) => {
    slicedTrie.get('1372c6cc9ad4698bc90e4f827e36bf3930b9a02aa2d626d71dddbf3b9e9eb9d4', (err, node) => {
      expect(err).to.not.exist()
      expect(node).to.exist()

      const account = new Account(node)
      expect(account.balance.toString('hex')).to.be.eq('02042d55a624beaf4bc1') // should be able to parse account
      done()
    })
  })
})
