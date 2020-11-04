module.exports = function convertEth(token) {
  return token.toUpperCase() === 'ETH' ? 'WETH' : token.toUpperCase(); 
}