const { Client, MessageEmbed } = require('discord.js');
const getPairPrice = require('./prices/get-pair-price');
const getTokenPrice = require('./prices/get-token-price');
const getWeeklyNew = require('./new-pairs/get-weekly-new');
const pollBTC = require('./prices/poll-btc');
const { evaluate } = require('mathjs');
const getCoingeckoPrice = require('./prices/coingecko-price')

const client = new Client();
const prefix = '!';
const privatePrefix = '#';

client.once('ready', () => {
  pollBTC((price) => {
    client.user.setPresence({ activity: { name: `BTC @ ${price}` }, status: 'idle' })
  })
	console.log('bot ready')
});

const data = {
  
}

client.on('message', async message => {
  if (!(message.content.startsWith(prefix) || message.content.startsWith(privatePrefix)) || message.author.bot) return;

  let sendingFn = message.channel;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'private') {
    message.author.send('Hello! Info bot at your service')
  }

  if (command === 'pair') {
    async function getPairPriceAsync() {
      const response = await getPairPrice(args[0], +args[1]);

      sendingFn.send(response);
    }

    getPairPriceAsync();
  }

  if (command === 'price') {
    getTokenPrice(sendingFn, args[0], args[1]);
  }

  if (command === 'gecko') {
    getCoingeckoPrice(sendingFn, args[0], args[1])
  }

  if (command === 'watchlist-add') {
    data[message.author.id] = data[message.author.id] || [];

    data[message.author.id].push(args[0]);

    sendingFn.send(`Added ${args[0]}`);
  }

  if (command === 'watchlist') {
    sendingFn.send(data[message.author.id].join(', '))
  }

  if (command === 'calc') {
    const answer = evaluate(args[0])

    sendingFn.send(args[0] + ' = ' + answer)
  }

  if (command === 'recent') {
    getWeeklyNew(sendingFn, args[0])
  }

  if (command === 'alive') {
    sendingFn.send('I am ALIVE!');
  }

  if (command === 'help') {
    sendingFn.send({
      embed: new MessageEmbed()
        .setTitle("DiscordBot Help")
        .setColor("#42b6f4")
        .addField("To get Private response use # instead of !", "#pair USDC-ETH")
        .addField("To check if bot is alive", "!alive")
        .addField("For Pair Information", "!pair USDC-ETH")
        .addField("For USD Price Information", "!price USDC aud")
        .addField("For past 48 price changes", "!gecko ETH hkd")
        .addField("For Math Calculations", "!calc 50/23\n(make sure no spaces)")
        .addField("For new pairs listed in uniswap within 48 hours", "!recent 500000\n(the number is a filter to only show if the liquidity is above 500000USD)")
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
