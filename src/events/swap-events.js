import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
  uri: `ws://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
  options: {
    reconnect: true
  }
});