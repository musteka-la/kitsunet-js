# Kitsunet architecture

> This document lays out the architecture of the kitsunet client and network.

Kitsunet aims at distributing the Ethereum state trie. The current architecture consists of a p2p network where peers collaborate on serving the Ethereum trie. This is accomplished by slicing the trie such that pieces of it can be distributed across many nodes in the kitsunet p2p network. Each node is in charge of serving only a subset of the slices. This allows splitting the current state which is in the order of tens of gigabytes for a regular node (and hundreds or thousands of gigabytes for historic nodes) across many nodes, which in turn allows using the Ethereum blockchain on resource (storage) constrained devices, such as browsers and IoT devices.

A kitsunet client is a libp2p based node, that uses the provided libp2p primitives to discover new kitsunet peers and create a mesh network that exchange Ethereum trie slices. The exchange protocol is currently envisioned as a multicast (pubsub) type protocol. The multicast protocol is going to be built on top of some sort of efficient gossip protocol, such as `epidemic broadcast trees` (plumtree/ssb) or `epicsub` (previously knows as gossipsub), however for our PoC and possible first few iterations of the MVP, we might be able to get away with using a variation of floodsub (https://github.com/metamask/js-libp2p-multicast-experiment), that provides built in hop limiting and forwarding hooks, which should allow us to control how messages get forwarded to other peers.

## Kitsune network

The kitsunet network consists of libp2p nodes that use existing libp2p mechanisms for peer discovery, communication and data exchange. Bellow is a list of possible techniques and primitives that can be used to achieve a sufficient level of connectivity.

#### Peer discovery

In libp2p, peer discovery is possible using several mechanisms, such as:

- Rendezvous services
- Signaling services, such as the signaling servers in the *-star protocols
  - this will be replaced by a combination of circuit relays and rendezvous nodes in the near feature
- DHT
- MDNS
- Delegated techniques, such as asking other peers to perform peer discovery on behalf of another peer
- Gossip discovery, asking all known peers for a specific peer or peers
- Using high level techniques, such as those built on top of multicast to perform discovery. In the case of multicast, it lends itself well for application level discovery and peer coordination. A good example is https://github.com/ipfs-shipyard/peer-star-app

This mechanisms are either already provided by the libp2p stack, or the libp2p stack provides all the necessary pieces to build them.

#### Peer connectivity

One of the advantages of using libp2p is its ability to use a wealth of network protocols to achieve reliable connectivity, for example, virtually any stream oriented networking protocol can be used as a transport in libp2p.

In the case of kitsunet however, where a sizable portion (or the majority) of the nodes run in connectivity restricted environments such as browsers, establishing and maintaining connections across the browser nodes can be challenging. In the case of browsers the only option to connect two browser nodes directly is using WebRTC. However libp2p provides fallback mechanisms that allow maintaining communication even when direct connectivity across nodes is not possible. Circuit relaying (line switching) is the current fallback mechanism, but more sophisticated techniques are planned for future releases such as packet switching. Circuit relaying allows using a third node to interconnect two nodes that wouldn't otherwise be able to connect due to either topology (NAT) or incompatible transports. In the case of browser nodes, circuit relaying should supplement webrtc to provide better connectivity across nodes.

#### Connecting to the kitsunet network

Connecting to most p2p networks require the use of one or more bootstrap nodes. This nodes, introduce and allow discovering and connecting to other nodes as well exchange information in the network. In the case of kitsunet, this will look roughly like the following:

- Connect to a well known set of nodes (the bootstrap nodes). This list is usually hardcoded in the client's config.
- Start discovering peers, any or all of the following:
  - join the DHT
  - start listening for MDNS packets
  - ask rendezvous nodes for kitsunet peers
  - gossip with other nodes to discover more peers
  - etc...
- Connect to as many peers as possible to achieve reliable connectivity and data flow
  - does this mean connecting to any node or only to nodes that we're interested in collaborating?
    - in the case of connecting to nodes we're interested in collaborating with, we can ask if they are interested in the same multicast topics that we are. This is most likely something that the multicast protocol should/will take care of.
- Enable multicast and start messaging over it
  - this involves asking for an initial set of slices
  - subscribing for slice updates (either deltas or full slices)
  - syncing and tracking the block head
  - etc...

## Exchanging data on kitsunet

Currently, we're leaning towards a multicast based data exchange mechanism, to subscribe to state trie changes (in the form of slices), as well as a publish (propagate) changes to the rest of the network.

Why not use IPFS or a similar mechanism to distribute the data/changes? We think that for data such as the Ethereum state trie, where there are periodic and consistent changes made to the dataset, having a content addressable protocol such as IPFS doesn't solve one of our fundamental requirements - keeping track of constant changes to this data set. With a more passive dataset that changes less frequently it's possible that IPFS would have sufficed, however in our case, we need to constantly signal changes to other nodes in the network, sending a delta of the change or even the full set of changes that consist of a few hundreds of KBs doesn't seem to be much different from using something like `bitswap` to exchange those same data pieces. Another issue that seems to be a limiting factor in the current implementation of `bitswap` and `IPFS`, is the fact that for `bitswap` to work, the two nodes need to be directly connected, this is not the case with most `multicast` mechanism that rely on other nodes forwarding/gossipping the messages which allows us to avoid to constantly connect and disconnect from other nodes in the network, thus saving resources in establishing connections  - handshakes, multiplexers, encryption, etc...

(The above needs more validation...)

## Slice exchange protocol

As stated above, exchanging data over kitsunet is accomplished using a multicast protocol.

### Slice distribution

One important open question is how to distribute slices across nodes in the network. We need to make it so that slices are evenly distributed across all nodes in a constantly changing mesh network. A few ideas come to mind:

- Get the slice for all accounts that we care about and use some number of random samples to help distribute the rest of the state. (lets not use this)
- Get the slice for all accounts that we care about and use consistent hashing to store the "closest" slices based on some numeric metric distance mapped on to the the peer's id. This should scale well in networks where nodes join and leave frequently. (lets use something like this)

### Multicast protocol

The multicast protocol allows distributing the ethereum state and propagating changes to it. Upon joining the network a kitsunet peer will subscribe to slices that it is interested in serving, according to a protocol described above (or some variation of it). A peer will also need to keep track of the current block header as well as some number of historic blocks in order to perform local validation. This process looks something like this:

- Join the kitsunet network using the flow described in `Connecting to the kitsunet network`
- Figure out which slices the peer is interested in
  - subscribe to updates to those slices
    - this can be full slices or partial deltas once a full slice is downloaded
- Synchronize some amount of historic block headers
- Start listening for new block header updates
