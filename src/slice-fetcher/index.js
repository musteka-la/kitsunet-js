'use strict'
const request = require('request')
const payload = require('./payload')

module.exports = async function (uri) {
  return (slice) => {
    return new Promise((resolve, reject) => {
      request.post({
        uri,
        headers: { 'Content-Type': 'application/json' },
        json: payload({
          ...slice
        })
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
