"use strict";
// /* eslint-env mocha */
// 'use strict'
// const chai = require('chai')
// const dirtyChai = require('dirty-chai')
// const expect = chai.expect
// chai.use(dirtyChai)
// const { default: Account } = require('ethereumjs-account')
// const { SlicedTrie } = require('../src/sliced-trie')
// const { Slice } = require('../src/slice')
// const loadFixture = require('aegir/fixtures')
// const sliceRaw = loadFixture('test/fixtures/account.json')
// const sliceData = JSON.parse(sliceRaw).result
// describe('sliced trie', () => {
//   const root = '1025f8dbd129c52d04b48119db1b8215495182e8023e5dfc6cc41c25c65c448d'
//   const slice = new Slice(sliceData)
//   const slicedTrie = new SlicedTrie({ root,
//     depth: 12,
//     sliceManager: {
//       async getSlice (sliceId) {
//         return slice
//       }
//     }
//   })
//   it('should retrieve key from trie', (done) => {
//     slicedTrie.get('1372c6cc9ad4698bc90e4f827e36bf3930b9a02aa2d626d71dddbf3b9e9eb9d4', (err, node) => {
//       expect(err).to.not.exist()
//       expect(node).to.exist()
//       const account = new Account(node)
//       expect(account.balance.toString('hex')).to.be.eq('02042d55a624beaf4bc1') // should be able to parse account
//       done()
//     })
//   })
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VkLXRyaWUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2xpY2VkLXRyaWUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQXlCO0FBQ3pCLGVBQWU7QUFFZiwrQkFBK0I7QUFDL0IsMENBQTBDO0FBQzFDLDZCQUE2QjtBQUM3QixzQkFBc0I7QUFFdEIsNkRBQTZEO0FBQzdELHVEQUF1RDtBQUN2RCw0Q0FBNEM7QUFFNUMsZ0RBQWdEO0FBQ2hELDZEQUE2RDtBQUU3RCxnREFBZ0Q7QUFFaEQsa0NBQWtDO0FBQ2xDLG9GQUFvRjtBQUVwRix1Q0FBdUM7QUFDdkMsOENBQThDO0FBQzlDLGlCQUFpQjtBQUNqQixzQkFBc0I7QUFDdEIsbUNBQW1DO0FBQ25DLHVCQUF1QjtBQUN2QixVQUFVO0FBQ1YsUUFBUTtBQUNSLE9BQU87QUFFUCxvREFBb0Q7QUFDcEQsMEdBQTBHO0FBQzFHLG1DQUFtQztBQUNuQyxnQ0FBZ0M7QUFFaEMsMENBQTBDO0FBQzFDLG9IQUFvSDtBQUNwSCxlQUFlO0FBQ2YsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyogZXNsaW50LWVudiBtb2NoYSAqL1xuLy8gJ3VzZSBzdHJpY3QnXG5cbi8vIGNvbnN0IGNoYWkgPSByZXF1aXJlKCdjaGFpJylcbi8vIGNvbnN0IGRpcnR5Q2hhaSA9IHJlcXVpcmUoJ2RpcnR5LWNoYWknKVxuLy8gY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Rcbi8vIGNoYWkudXNlKGRpcnR5Q2hhaSlcblxuLy8gY29uc3QgeyBkZWZhdWx0OiBBY2NvdW50IH0gPSByZXF1aXJlKCdldGhlcmV1bWpzLWFjY291bnQnKVxuLy8gY29uc3QgeyBTbGljZWRUcmllIH0gPSByZXF1aXJlKCcuLi9zcmMvc2xpY2VkLXRyaWUnKVxuLy8gY29uc3QgeyBTbGljZSB9ID0gcmVxdWlyZSgnLi4vc3JjL3NsaWNlJylcblxuLy8gY29uc3QgbG9hZEZpeHR1cmUgPSByZXF1aXJlKCdhZWdpci9maXh0dXJlcycpXG4vLyBjb25zdCBzbGljZVJhdyA9IGxvYWRGaXh0dXJlKCd0ZXN0L2ZpeHR1cmVzL2FjY291bnQuanNvbicpXG5cbi8vIGNvbnN0IHNsaWNlRGF0YSA9IEpTT04ucGFyc2Uoc2xpY2VSYXcpLnJlc3VsdFxuXG4vLyBkZXNjcmliZSgnc2xpY2VkIHRyaWUnLCAoKSA9PiB7XG4vLyAgIGNvbnN0IHJvb3QgPSAnMTAyNWY4ZGJkMTI5YzUyZDA0YjQ4MTE5ZGIxYjgyMTU0OTUxODJlODAyM2U1ZGZjNmNjNDFjMjVjNjVjNDQ4ZCdcblxuLy8gICBjb25zdCBzbGljZSA9IG5ldyBTbGljZShzbGljZURhdGEpXG4vLyAgIGNvbnN0IHNsaWNlZFRyaWUgPSBuZXcgU2xpY2VkVHJpZSh7IHJvb3QsXG4vLyAgICAgZGVwdGg6IDEyLFxuLy8gICAgIHNsaWNlTWFuYWdlcjoge1xuLy8gICAgICAgYXN5bmMgZ2V0U2xpY2UgKHNsaWNlSWQpIHtcbi8vICAgICAgICAgcmV0dXJuIHNsaWNlXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgcmV0cmlldmUga2V5IGZyb20gdHJpZScsIChkb25lKSA9PiB7XG4vLyAgICAgc2xpY2VkVHJpZS5nZXQoJzEzNzJjNmNjOWFkNDY5OGJjOTBlNGY4MjdlMzZiZjM5MzBiOWEwMmFhMmQ2MjZkNzFkZGRiZjNiOWU5ZWI5ZDQnLCAoZXJyLCBub2RlKSA9PiB7XG4vLyAgICAgICBleHBlY3QoZXJyKS50by5ub3QuZXhpc3QoKVxuLy8gICAgICAgZXhwZWN0KG5vZGUpLnRvLmV4aXN0KClcblxuLy8gICAgICAgY29uc3QgYWNjb3VudCA9IG5ldyBBY2NvdW50KG5vZGUpXG4vLyAgICAgICBleHBlY3QoYWNjb3VudC5iYWxhbmNlLnRvU3RyaW5nKCdoZXgnKSkudG8uYmUuZXEoJzAyMDQyZDU1YTYyNGJlYWY0YmMxJykgLy8gc2hvdWxkIGJlIGFibGUgdG8gcGFyc2UgYWNjb3VudFxuLy8gICAgICAgZG9uZSgpXG4vLyAgICAgfSlcbi8vICAgfSlcbi8vIH0pXG4iXX0=