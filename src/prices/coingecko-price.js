const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const getList = require('../coingecko/get-token-list');

async function getPrice(id, currency) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`);

    if (res.ok) {
      const data = await res.json();

      return data[id][currency]
    }
  } catch (e) {
    console.error(e);
  }
}

const getHrsPast = (time) => {
  const now = new Date();

  const timePast = now.getTime() - time;

  const hrs = Math.round(timePast / (1000 * 60 * 60));

  return hrs;
}

const calcPercent = (currentPrice, pastPrice) => {
  const percentChange = Math.round((currentPrice / pastPrice - 1) * 1000) / 10;

  if (percentChange < 0) {
    return `${percentChange}%`
  } else if (percentChange > 0) {
    return `+${percentChange}%`
  } else {
    return `0%`;
  }
}

async function getHistory(id, currency) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=2`);

    if (res.ok) {
      const data = await res.json();

      const result = [];

      data.prices.reverse().forEach(([time, price]) => {
        const hrsPast = getHrsPast(time);
        if (hrsPast === 1) {
          result.push([hrsPast, price])
        } else if (hrsPast === 2) {
          result.push([hrsPast, price])
        } else if (hrsPast === 6) {
          result.push([hrsPast, price])
        } else if (hrsPast === 24) {
          result.push([hrsPast, price])
        } else if (hrsPast === 48) {
          result.push([hrsPast, price])
        }
      })

      return result;
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = async function getTokenPrice(sendingFn, tokenRaw, currencyRaw = 'USD') {
  if (!tokenRaw) {
    return sendingFn.send('Enter a token please')
  }

  const token = tokenRaw.toLowerCase();
  const currency = currencyRaw.toLowerCase();

  const tokenList = await getList();

  const foundToken = tokenList.find(({ symbol }) => symbol === token);

  if (foundToken) {
    const id = foundToken.id;
    const price = await getPrice(id, currency);

    const priceHistory = await getHistory(id, currency)

    const msg = new MessageEmbed()
      .setTitle(`${tokenRaw} - ${currencyRaw}`)
      .addField("Current Price", `${currencyRaw} ${price}`)

    priceHistory.forEach(([timePast, pastPrice]) => {
      msg.addField(`${timePast} HR Ago`, `${currencyRaw} ${pastPrice} ${calcPercent(price, pastPrice)}`)
    })

    sendingFn.send(msg)
  } else {
    sendingFn.send(`can't find "${tokenRaw}" from coingecko`)
  }
}