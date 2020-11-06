const fetch = require('node-fetch')

async function pollBtc(cb) {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');

    if (res.ok) {
      const data = await res.json();

      cb(data.bitcoin.usd);
    }
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    pollBtc(cb)
  }, 5000)
}

module.exports = function callPollBTC(cb) {
  pollBtc(cb);
}