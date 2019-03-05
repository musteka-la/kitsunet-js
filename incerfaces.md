# These are the high level interfaces/APIs used and exposed by KSN

- Slice Tracking - this interface exposes methods to get periodic updates for slices, either by polling/querying, or through the pubsub mechanism. It also allows publishing updates over the network. Regardless, it provides a way of managing subscriptions to slices.
  - `trackSlices` - track slices
  - `untrackSlices` - un-track slices
  - `isTracking` - is this slice being tracked
  - `publishSlice` - propagate the slice through the network
- Event tracking methods - this interface also assumes that this evens will be emitted
  - `slice` - a Slice object

- Slice Retrieval - this interface allows "querying" the underlying provider for slices. The main method `getSliceById`, allows retrieving a concrete slice. It's also flexible enough to allow implementing a few more methods on top of it.
  - `getSliceById` - get the specific slice
  - Helpers:
    - `getLatestSlice` - helper to get the latest slice
    - `getSliceForBlock` - helper to get the slice for this block

- Discovery - this interface allows discovering peers using some underlying mechanism. For example, the DHT can be used to discover peers for a particular slice.
  - `findSlicePeers` - finds peers for the specified slices
  - `announceSlices` (not sure about this one yet) - announce slices that we provide to the network.
  - Helpers:
    - `findAndConnect` - finds and connects to peers tracking this slices

- Block Retrieval/Tracking - Block tracking doesn't require registration, instead only retrieval methods are available.
  - `getLatestBlockHeader`  - get the latest block header
  - `getBlockHeaderByNumber` - get the block header for a block number
  - `getBlockHeaderByHash` - get the block header for a block hash
