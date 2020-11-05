const { MessageEmbed } = require('discord.js');
const graphQl = require('../utils/fetch-graph');
const { pairsQuery } = require('./queries');

const HOUR = 60 * 60;
const ONE_WEEK = 2 * 24 * HOUR;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function getWeeklyPairs(sendingFn, minLiquidity) {
  let minimumLiquidity = +minLiquidity;

  if (Number.isNaN(minimumLiquidity)) {
    minimumLiquidity = 100000
  }

  sendingFn.send('fetching data.... please wait up to 30 seconds');

  const message = new MessageEmbed()
    .setTitle(`Pairs Added in the last 48HRs with Liquidity > $${numberWithCommas(minimumLiquidity)}`)
    .setDescription('beware: liquidity can be added by anyone, trade at your own risk.')

  const startTime = Math.round(new Date() / 1000)

  async function getData(minusHOUR, now, last) {
    const data = await graphQl(pairsQuery(minusHOUR, now));

    data.pairs.forEach((item) => {
      if (+item.reserveUSD > minimumLiquidity) {
        const datetime = +item.createdAtTimestamp;

        const diff = startTime - datetime;

        const hoursAgo = Math.round(diff * 10 / (60 * 60)) / 10;

        message.addField(`${item.token0.symbol}-${item.token1.symbol}`, `[${hoursAgo}hrs ago : liquidity - $${numberWithCommas(Math.round(+item.reserveUSD))}](https://info.uniswap.org/pair/${item.id})`)
      }
    })

    if (last) {
      sendingFn.send(message)
    }
  }

  async function start(now) {
    const minusHOUR = now - HOUR;

    let last = false;

    if (minusHOUR < (startTime - ONE_WEEK)) {
      last = true;
    }

    getData(minusHOUR, now, last)

    if (!last) {
      setTimeout(() => start(minusHOUR), 100);
    }
  }

  start(startTime);
}