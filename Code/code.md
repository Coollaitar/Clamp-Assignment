const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

const UniswapMulticallAddress = '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a';
const UniswapMulticallABI = [
{
constant: true,
inputs: [
{
name: 'calls',
type: 'bytes[]',
},
],
name: 'aggregate',
outputs: [
{
name: '',
type: 'bytes',
},
],
payable: false,
stateMutability: 'view',
type: 'function',
},
];

const UniswapMulticall = new web3.eth.Contract(UniswapMulticallABI, UniswapMulticallAddress);

async function fetchTokenPrices(tokenIndices) {
const calls = tokenIndices.map((tokenIndex) => {
return web3.eth.abi.encodeFunctionCall(
{
name: 'getTokenPrice',
type: 'function',
inputs: [
{
type: 'address',
name: 'token',
},
],
},
[tokenIndex],
);
});

const result = await UniswapMulticall.methods
.aggregate(calls)
.call();

const tokenPrices = {};
for (let i = 0; i < calls.length; i++) {
const encodedResult = result.slice(i _ 32, (i + 1) _ 32);
const decodedResult = web3.eth.abi.decodeParameter('uint256', encodedResult);
tokenPrices[tokenIndices[i]] = decodedResult;
}

return tokenPrices;
}

// Example usage
const tokenIndices = [
'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
'0x6B175474E89094C44Da98b954EedeAC495271d0F',
];

fetchTokenPrices(tokenIndices)
.then((tokenPrices) => {
console.log(tokenPrices);
// Output: { '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 150.0, '0x6B175474E89094C44Da98b954EedeAC495271d0F': 250.0 }
})
.catch((error) => {
console.error(error);
});
