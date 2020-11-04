const fetchGraph = require('../utils/fetch-graph');

const idQuery = (symbol) => `
{
  tokens(where: { symbol: "${symbol}" }) {
    id
    tradeVolumeUSD
  }
}
`

module.exports = async function getTokenId(token) {
  const data = await fetchGraph(idQuery(token));

  let maxVolume = 0;
  let maxVolumneId = '';

  data.tokens.forEach(({ id, tradeVolumeUSD }) => {
    if (+tradeVolumeUSD > maxVolume) {
      maxVolumneId = id;
      maxVolume = +tradeVolumeUSD;
    }
  })
  
  return maxVolumneId;
}