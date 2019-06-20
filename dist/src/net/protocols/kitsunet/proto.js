'use strict';
const protobuf = require("protons");
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

  enum Status {
    UNKNOWN_ERROR = 0;
    OK            = 1;
    ERROR         = 2;
  }

  message Identify {
    repeated string   versions     = 1;  // e.g. kitsunet-js/0.0.1
    optional string   userAgent    = 2;  // e.g. kitsunet-js/0.0.1
    optional NodeType nodeType     = 3;  // the node type - bridge, edge, normal
    optional bytes    latestBlock  = 4;  // block number
    repeated bytes    sliceIds     = 5;  // a list of slice name 0xXXXX-XX that this peer tracks, can be incomplete
    optional uint32   networkId    = 6;  // the eth network id
    optional bytes    td           = 7;  // total difficulty
    optional bytes    bestHash     = 8;  // best hash
    optional bytes    genesis      = 9;  // genesis
    optional bytes    number       = 10; // the block number
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
`;
module.exports = protobuf(proto);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9raXRzdW5ldC9wcm90by50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7QUFDWixvQ0FBb0M7QUFFcEMsTUFBTSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBcURiLENBQUE7QUFFRCxpQkFBUyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcbmltcG9ydCBwcm90b2J1ZiA9IHJlcXVpcmUoJ3Byb3RvbnMnKVxuXG5jb25zdCBwcm90byA9IGBcbm1lc3NhZ2UgS2l0c3VuZXQge1xuICBlbnVtIE1zZ1R5cGUge1xuICAgIFVOS05PV05fTVNHICAgPSAwO1xuICAgIElERU5USUZZICAgICAgPSAxO1xuICAgIFNMSUNFUyAgICAgICAgPSAyO1xuICAgIFNMSUNFX0lEICAgICAgPSAzO1xuICAgIEhFQURFUlMgICAgICAgPSA0O1xuICAgIExBVEVTVF9CTE9DSyAgPSA1O1xuICAgIE5PREVfVFlQRSAgICAgPSA2O1xuICAgIFBJTkcgICAgICAgICAgPSA3O1xuICB9XG5cbiAgZW51bSBOb2RlVHlwZSB7XG4gICAgVU5LTk9XTl9UWVBFICA9IDA7XG4gICAgTk9STUFMICAgICAgICA9IDE7XG4gICAgRURHRSAgICAgICAgICA9IDI7XG4gICAgQlJJREdFICAgICAgICA9IDM7XG4gIH1cblxuICBlbnVtIFN0YXR1cyB7XG4gICAgVU5LTk9XTl9FUlJPUiA9IDA7XG4gICAgT0sgICAgICAgICAgICA9IDE7XG4gICAgRVJST1IgICAgICAgICA9IDI7XG4gIH1cblxuICBtZXNzYWdlIElkZW50aWZ5IHtcbiAgICByZXBlYXRlZCBzdHJpbmcgICB2ZXJzaW9ucyAgICAgPSAxOyAgLy8gZS5nLiBraXRzdW5ldC1qcy8wLjAuMVxuICAgIG9wdGlvbmFsIHN0cmluZyAgIHVzZXJBZ2VudCAgICA9IDI7ICAvLyBlLmcuIGtpdHN1bmV0LWpzLzAuMC4xXG4gICAgb3B0aW9uYWwgTm9kZVR5cGUgbm9kZVR5cGUgICAgID0gMzsgIC8vIHRoZSBub2RlIHR5cGUgLSBicmlkZ2UsIGVkZ2UsIG5vcm1hbFxuICAgIG9wdGlvbmFsIGJ5dGVzICAgIGxhdGVzdEJsb2NrICA9IDQ7ICAvLyBibG9jayBudW1iZXJcbiAgICByZXBlYXRlZCBieXRlcyAgICBzbGljZUlkcyAgICAgPSA1OyAgLy8gYSBsaXN0IG9mIHNsaWNlIG5hbWUgMHhYWFhYLVhYIHRoYXQgdGhpcyBwZWVyIHRyYWNrcywgY2FuIGJlIGluY29tcGxldGVcbiAgICBvcHRpb25hbCB1aW50MzIgICBuZXR3b3JrSWQgICAgPSA2OyAgLy8gdGhlIGV0aCBuZXR3b3JrIGlkXG4gICAgb3B0aW9uYWwgYnl0ZXMgICAgdGQgICAgICAgICAgID0gNzsgIC8vIHRvdGFsIGRpZmZpY3VsdHlcbiAgICBvcHRpb25hbCBieXRlcyAgICBiZXN0SGFzaCAgICAgPSA4OyAgLy8gYmVzdCBoYXNoXG4gICAgb3B0aW9uYWwgYnl0ZXMgICAgZ2VuZXNpcyAgICAgID0gOTsgIC8vIGdlbmVzaXNcbiAgICBvcHRpb25hbCBieXRlcyAgICBudW1iZXIgICAgICAgPSAxMDsgLy8gdGhlIGJsb2NrIG51bWJlclxuICB9XG5cbiAgbWVzc2FnZSBEYXRhIHtcbiAgICBvcHRpb25hbCBJZGVudGlmeSBpZGVudGlmeSAgICA9IDE7XG4gICAgcmVwZWF0ZWQgYnl0ZXMgICAgc2xpY2VzICAgICAgPSAyO1xuICAgIHJlcGVhdGVkIGJ5dGVzICAgIGhlYWRlcnMgICAgID0gMztcbiAgICBvcHRpb25hbCBOb2RlVHlwZSB0eXBlICAgICAgICA9IDQ7XG4gICAgcmVwZWF0ZWQgYnl0ZXMgICAgc2xpY2VJZHMgICAgPSA1O1xuICAgIG9wdGlvbmFsIGJ5dGVzICAgIGxhdGVzdEJsb2NrID0gNjtcbiAgfVxuXG4gIG9wdGlvbmFsIE1zZ1R5cGUgIHR5cGUgICAgPSAxIFtkZWZhdWx0ID0gVU5LTk9XTl9NU0ddOyAvLyB0aGUgbWVzc2FnZSB0eXBlXG4gIG9wdGlvbmFsIFN0YXR1cyAgIHN0YXR1cyAgPSAyOyAgLy8gb25seSB1c2VkIGZvciByZXNwb25zZXMgLSBPSyBmb3Igc3VjY2VzcyBFUlJPUiBmb3IgZXJyb3JzXG4gIG9wdGlvbmFsIHN0cmluZyAgIGVycm9yICAgPSAzOyAgLy8gb25seSB1c2VkIGZvciByZXNwb25zZXMgLSBpZiBzdGF0dXMgPT0gRVJST1IsIHRoaXMgbWlnaHQgY29udGFpbiBhbiBlcnJvciBzdHJpbmdcbiAgb3B0aW9uYWwgRGF0YSAgICAgcGF5bG9hZCA9IDQ7ICAvLyB0aGUgZGF0YSBvZiB0aGUgcmVxdWVzdC9yZXNwb25zZVxufVxuYFxuXG5leHBvcnQgPSBwcm90b2J1Zihwcm90bylcbiJdfQ==