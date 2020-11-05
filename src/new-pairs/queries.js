const pairsQuery = (startDate, endDate) => `
{
  pairs(where: { createdAtTimestamp_lt: "${endDate}", createdAtTimestamp_gt: "${startDate}"}) {
    id
    token0 {
      id
      symbol
    }
    token1 {
      id
      symbol
    }
    reserveUSD
    createdAtTimestamp
  }
}
`

module.exports = {
  pairsQuery,
}