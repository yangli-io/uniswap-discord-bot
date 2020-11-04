const { Client } = require('discord.js');
const getPairPrice = require('./prices/get-pair-price');
const getTokenPrice = require('./prices/get-token-price');
const { evaluate } = require('mathjs');

const client = new Client();
const prefix = '!';

client.once('ready', () => {
	console.log('bot ready')
});

const data = {
  
}

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'pair') {
    async function getPairPriceAsync() {
      const response = await getPairPrice(args[0], +args[1]);

      message.channel.send(response);
    }

    getPairPriceAsync();
  }

  if (command === 'price') {
    async function getTokenPriceAsync() {
      const response = await getTokenPrice(args[0]);

      message.channel.send(response);
    }

    getTokenPriceAsync();
  }

  if (command === 'watchlist-add') {
    data[message.author.id] = data[message.author.id] || [];

    data[message.author.id].push(args[0]);

    message.channel.send(`Added ${args[0]}`);
  }

  if (command === 'watchlist') {
    message.channel.send(data[message.author.id].join(', '))
  }

  if (command === 'calc') {
    const answer = evaluate(args[0])

    message.channel.send(args[0] + ' = ' + answer)
  }

  if (command === 'help') {
    const response = `Hi ${message.author.username}
- For pair information type - !pair USDC-ETH
- For token USD Price - !price ETH
- For Math Calculations - !calc 50/23 (make sure no spaces)
    `

    message.channel.send(response);
  }
});

client.login(process.env.DISCORD_TOKEN);
