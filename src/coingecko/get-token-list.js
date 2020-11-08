const fetch = require('node-fetch');

let list = [];
async function getList() {
  if (list.length) return list;
  const res = await fetch('https://api.coingecko.com/api/v3/coins/list');

  if (res.ok) {
    const data = await res.json();

    list = data;
    return data;
  }

  return []
}

module.exports = getList;