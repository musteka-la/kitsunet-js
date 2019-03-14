'use strict'
const request = require('request')
const payload = require('./payload')

module.exports = async function (uri) {
  return ({ path, depth, root, isStorage }) => {
    return new Promise((resolve, reject) => {
      request.post({
        uri,
        headers: { 'Content-Type': 'application/json' },
        json: payload({ path, depth, root, isStorage })
      }, (err, response, body) => {
        if (err) {
          return reject(err)
        }

        if (body.error) {
          return reject(body.error)
        }

        resolve(body.result)
      })
    })
  }
}
