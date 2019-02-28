/*
The code below will Generate PeerIDs, for use with IPFS.

A Peer ID is the SHA-256 multihash of a public key.

The public key is a base64 encoded string of a protobuf containing an RSA DER buffer. 

This uses a node buffer to pass the base64 encoded public key protobuf to the multihash for ID generation.

More info: https://github.com/libp2p/js-peer-id#createfromjsonobj

*/

const PeerId = require('peer-id')

PeerId.create({ bits: 1024 }, (err, id) => {
  if (err) { throw err }
  console.log(JSON.stringify(id.toJSON(), null, 2))
})
