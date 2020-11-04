const getTokenId = require('./get-token-id');
const getPairReserves = require('./get-pair-reserves');
const convertEth = require('../utils/token');


module.exports = async function getPairPrice(pair, amount) {
  const [baseRaw, quoteRaw] = pair.split('-');

  const base = convertEth(baseRaw);
  const quote = convertEth(quoteRaw);

  if (!base || !quote || base === quote) return 'Please input correct pair - e.g DAI-FARM'

  const [baseId, quoteId] = await Promise.all([getTokenId(base), getTokenId(quote)]);

  if (!baseId && !quoteId) {
    return `Cannot find token: ${baseRaw},${quote}`
  } else if (!baseId) {
    return `Cannot find token: ${baseRaw}`
  } else if (!quoteId) {
    return `Cannot find token: ${quote}`
  }

  const { baseReserve, quoteReserve, volumeUSD } = await getPairReserves(baseId, quoteId);

  if (volumeUSD < 10000) {
    return `${pair} exists but doesn't have a lot of trades`
  }

  if (!quoteReserve || !baseReserve) {
    return `${pair} exists but doesn't exist`;
  }

  const price = quoteReserve / baseReserve;

  let tradeAmount = '';
  if (!Number.isNaN(amount)) {
    tradeAmount = `\n${amount} ${baseRaw} = ${amount * price} ${quoteRaw}`;
  }

  return `${pair} trading at ${baseRaw} = ${price} ${quoteRaw} ${tradeAmount}`
}