const fetchGraph = require('../utils/fetch-graph');

const reserveQuery = (token0, token1) => `
{
  pairs(where: { token0: "${token0}", token1: "${token1}"}) {
    id
    reserve0
    reserve1
    volumeUSD
  }
}
`

module.exports = async function getPairReserves(base, quote) {
  if (base < quote) {
    const query = reserveQuery(base, quote)

    const { pairs } = await fetchGraph(query);

    if (!pairs.length) {
      return {}
    }

    return {
      id: pairs[0].id,
      baseReserve: pairs[0].reserve0,
      quoteReserve: pairs[0].reserve1,
      volumeUSD: pairs[0].volumeUSD
    }
  } else {
    const query = reserveQuery(quote, base);

    const { pairs } = await fetchGraph(query);

    if (!pairs.length) {
      return {}
    }

    return {
      id: pairs[0].id,
      baseReserve: pairs[0].reserve1,
      quoteReserve: pairs[0].reserve0,
      volumeUSD: pairs[0].volumeUSD
    }
  }
}