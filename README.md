# Geist Finance Subgraph

Subgraph for the [Geist Finance](https://geist.finance/markets) protocol on the [Fantom](https://fantom.foundation) blockchain.


## Status: WIP
Currently implements a minimal set of the full schema, implemented set is in `schema.graphql`.

The subgraph is live on The Graph Hosted Service [here](https://thegraph.com/hosted-service/subgraph/dineshpinto/geist-finance).

## Commands
Generate code and build structures

`graph codegen && graph build`

Authenticated deploy to The Graph hosted service

`graph deploy --product hosted-service dineshpinto/geist-finance`