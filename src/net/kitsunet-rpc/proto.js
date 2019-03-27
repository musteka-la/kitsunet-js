'use strict'
const protobuf = require('protons')

const proto = `
message Kitsunet {
  enum MsgType {
    UNKNOWN_MSG   = 0;
    IDENTIFY      = 1;
    SLICES        = 2;
    SLICE_ID      = 3;
    HEADERS       = 4;
    LATEST_BLOCK  = 5;
    NODE_TYPE     = 6;
    PING          = 7;
  }

  enum NodeType {
    UNKNOWN_TYPE  = 0;
    NORMAL        = 1;
    EDGE          = 2;
    BRIDGE        = 3;
  }

  enum Compression {
    UNKNOWN_COMPRESSION = 0;
    NONE                = 1;
    SNAPPY              = 2; // the only one currently supported 
  }

  enum Status {
    UNKNOWN_ERROR = 0;
    OK            = 1;
    ERROR         = 2;
  }

  message Identify {
    optional string   version      = 1; // e.g. kitsunet-js/0.0.1
    optional string   userAgent    = 2; // e.g. kitsunet-js/0.0.1
    optional NodeType nodeType     = 3; // the node type - brige, edge, normal
    optional bytes    latestBlock  = 4; // block number
    repeated bytes    sliceIds     = 5; // a list of slice name 0xXXXX-XX that this peer tracks, can be incomplete
  }

  message Data {
    optional Identify identify    = 1;
    repeated bytes    slices      = 2;
    repeated bytes    headers     = 3;
    optional NodeType type        = 4;
    repeated bytes    sliceIds    = 5;
    optional bytes    latestBlock = 6;
  }

  optional MsgType  type    = 1 [default = UNKNOWN_MSG]; // the message type
  optional Status   status  = 2;  // only used for responses - OK for success ERROR for errors
  optional string   error   = 3;  // only used for responses - if status == ERROR, this might contain an error string
  optional Data     payload = 4;  // the data of the request/response
}
`

module.exports = protobuf(proto)
