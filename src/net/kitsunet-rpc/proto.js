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

  enum Types {
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

  message Data {
    message SliceId {
      repeated string sliceId = 1; // [packed = true];
    }

    message Slices {
      repeated bytes slices = 1; // [packed = true]; // a list of slices
    }

    message Headers {
      repeated bytes headers = 1; // [packed = true]; // a list of rlp encoded block headers
    }

    message NodeType {
      repeated Types type = 1;
    }

    message Identify {
      optional string   version       = 1; // e.g. kitsunet-js/0.0.1
      optional string   userAgent     = 2; // e.g. kitsunet-js/0.0.1
      optional NodeType nodeType      = 3; // the node type - brige, edge, normal
      optional Headers  latestBlock   = 4; // rlp encoded block header
      optional SliceId  sliceIds      = 5; // a list of slice name 0xXXXX-XX that this peer tracks, can be incomplete
    }

    optional Identify identify  = 1;
    repeated Slices   slices    = 2;
    repeated Headers  headers   = 3;
    optional NodeType type      = 4;
    repeated SliceId  sliceIds  = 5;
  }

  optional MsgType type   = 1 [default = UNKNOWN_MSG]; // the message type
  optional Status status  = 2;  // only used for responses - OK for success ERROR for errors
  optional string error   = 3;  // only used for responses - if status == ERROR, this might contain an error string
  optional Data   data    = 4;  // the data of the request/response
}
`

module.exports = protobuf(proto)
