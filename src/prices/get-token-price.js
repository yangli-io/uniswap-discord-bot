const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js');
const getList = require('../coingecko/get-token-list')

async function getPrice(id, currency) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);

    if (res.ok) {
      const [data] = await res.json();

      let message = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(data.current_price)
      message += " | "

      let color = '#777777'
      if (data.price_change_percentage_24h > 0) {
        color = '#57bd0f'
        message += "▲ "
      } else if (data.price_change_percentage_24h < 0) {
        color = '#ed5565'
        message += "▼ "
      }

      message += `${data.price_change_percentage_24h}% (24H)`

      return {
        color,
        message,
      }
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
    const { message, color } = await getPrice(id, currency);

    const msg = new MessageEmbed()
      .setColor(color)
      .addField("BTC - USD", message)

    sendingFn.send(msg)
  } else {
    sendingFn.send(`can't find "${tokenRaw}" from coingecko`)
  }
}
