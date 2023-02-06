// Code in Web3.js

const Web3 = require('web3');
const web3 = new Web3('Enter Your Project ID of Infura or Any other');

// Step 1

const UniswapMulticallAddress = 'xxxxxxxx';
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

// Step 2

const UniswapMulticall = new web3.eth.Contract(
  UniswapMulticallABI,
  UniswapMulticallAddress
);

// Step 3

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
      [tokenIndex]
    );
  });

  // Step 4

  const result = await UniswapMulticall.methods.aggregate(calls).call();

  // Step 5

  const tokenPrices = {};
  for (let i = 0; i < calls.length; i++) {
    const encodedResult = result.slice(i * 32, (i + 1) * 32);
    const decodedResult = web3.eth.abi.decodeParameter(
      'uint256',
      encodedResult
    );
    tokenPrices[tokenIndices[i]] = decodedResult;
  }

  return tokenPrices;
}

// Step 6

const tokenIndices = ['xxxxxx1', 'xxxxxx2', 'xxxxxx3'];

fetchTokenPrices(tokenIndices)
  .then((tokenPrices) => {
    console.log(tokenPrices);
  })
  .catch((error) => {
    console.error(error);
  });
