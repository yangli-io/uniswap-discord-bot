const fetchGraph = require('../utils/fetch-graph');
const getTokenId = require('./get-token-id');
const BigNumber = require('bignumber.js');
const convertEth = require('../utils/token');

const priceQuery = (tokenId) => `
{
  tokenDayDatas (where: { token: "${tokenId}" })  {
    id
    date
    priceUSD
    token {
      symbol
    }
  }
}
`

module.exports = async function getTokenPrice(tokenRaw) {
  const token = convertEth(tokenRaw);

  const tokenId = await getTokenId(token);

  if (!tokenId) return `${token} is not a valid token`;

  const { tokenDayDatas } = await fetchGraph(priceQuery(tokenId));

  const currentPrice = tokenDayDatas[tokenDayDatas.length - 1];
  
  const value = new BigNumber(currentPrice.priceUSD);

  return `${tokenRaw} - $${value.toFormat(4)}`;
}