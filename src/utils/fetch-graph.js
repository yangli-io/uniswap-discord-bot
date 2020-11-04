const fetch = require('node-fetch');

module.exports = async function fetchGraph(query) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: query
    })
  })

  if (res.ok) {
    const result = await res.json();
    
    return result.data;
  } else {
    console.log(res.status);
  }

  return {};
}