# Clamp Assignment <img src="https://media.licdn.com/dms/image/D4D0BAQHRsKa5dCuhSA/company-logo_200_200/0/1664740149232?e=1683763200&v=beta&t=n765tAkPUBj8qULCGHzFOmayB52SmHtES8Ko9tTftbA" width="50" height="50" />

---

# 🔒Question :

Develop a solution that utilizes the concept of multi calls to fetch prices from Uniswap. The solution should allow for the retrieval of multiple token prices in a single call, rather than multiple separate API requests. The objective is to improve efficiency by reducing the number of calls to the blockchain node. The user should be able to input an index of the desired token prices, and the solution should return the prices in a single call.

---

# 🔓Solution :

## 🔑 What is Uniswap ?

1. **Uniswap** is a decentralized exchange that enables peer-to-peer market making. Uniswap API is commonly used by developers to build DeFi applications like Token swapping, AMM, and Decentralized Exchange(DEX), etc.

2. **Uniswap V2** : It is used to determine the price of tokens and it has improved token listing process.

3. **Reason to retrieve multiple token prices in a single API call** : To improve efficiency by reducing the number of calls to the blockchain node.

## 🔑 Approach to Answer the Question :

1. **Batch Requests** : Batch Requests to our blockchain node, are when we send a list of data inputs to our call to our blockchain nodes. **BUT** batching requests has some issue as they can't handle a lot of nodes and some service don't even support them. So instead of batch requests we use _Multicall_.

2. **Multicall** : Instead of making a ton of requests like massive batch thing, we call one function of an on-chain contract that takes unlimited parameter and we define the functions we want the contract to call. So basically we are going to make a single API call to retrieve data of function having multiple parameters and this is known as **Multicall**.

---

## 🔑 Step by Step Explanation of Code :

## Step 1 👉🏻

1. Store Multicall Address in `UniswapMulticallAddress` **variable**.
2. Store ABI(Application Binary Interface) of Multicall in `UniswapMulticallABI` **variable** which provides necessary information about contract like functions, etc.

```web3.js
const UniswapMulticallAddress = Address;
const UniswapMulticallABI = [{},];
```

## Step 2 👉🏻

1. This step is done to **interact** with Smart Contract.

```web3.js
const UniswapMulticall = new web3.eth.Contract(UniswapMulticallABI, UniswapMulticallAddress);
```

## Step 3 👉🏻

1. Create a async function fetchTokenPrices which takes an **array** of token indices as its **input arguement**. The purpose of the function is to **retrieve** the **token prices** for the token specified by the indices and return them in a single call.

2. Calls array will contain a list of objects, each representing a call to the Uniswap Multicall contract to retrieve the **price** of a **specific token**.

3. **encodeFunctionCall** is a function provided by Web3.js **library** to encode the data of function call into the ABI format.

- **first arguement** holds information about the function name, type and inputs and here
- **second arguement** holds the tokenIndex which represents the index of token whose price is to be retrieved from Multicall contract.

```web3.js
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
```

## Step 4 👉🏻

1. Here the **aggregate** method is the main method of the contract that allows for multiple calls to be made in a single transaction.

2. **calls** is the array that is created in previous step, which contains the encoded function calls to retrieve the prices of multiple tokens.

3. **.call()** is a method which sends a read-only request to the Ethereum Network. The result of this is stored in **result** variable which is an array of 32 bytes encoded values representing the **token prices** returned by Multicall contract

```web3.js
 const result = await UniswapMulticall.methods
    .aggregate(calls)
    .call();
```

## Step 5 👉🏻

1. This loop decodes the result returned from contract.

2. In each iteration of the loop, **encodedResult** is assigned the next 32 bytes (**Here 32 bytes means token prices**).

3. Then the encodedResult is passed as an arguement to the **web3.eth.abi.decodeParameter** to decode the result using **uint256** ABI encoding.

4. Return the **tokenPrices**.

```web3.js
 const tokenPrices = {};
  for (let i = 0; i < calls.length; i++) {
    const encodedResult = result.slice(i * 32, (i + 1) * 32);
    const decodedResult = web3.eth.abi.decodeParameter('uint256', encodedResult);
    tokenPrices[tokenIndices[i]] = decodedResult;
  }

  return tokenPrices;
}
```

## Step 6 👉🏻

1. Store the token index in **tokenIndices**.

2. And finally use our function **fetchTokenPrices** and pass tokenIndices as an arguement to get the price of tokens at a single call.

```web3.js
const tokenIndices = [
  'xxxxxx1',
  'xxxxxx2',
  'xxxxxx3',
];

fetchTokenPrices(tokenIndices)
  .then((tokenPrices) => {
    console.log(tokenPrices);
  })
  .catch((error) => {
    console.error(error);
  });
```

3. Output :

```
Output: { 'xxxxxx1': 100.0, 'xxxxxx2': 200.0, 'xxxxxx3': 300.0 }
```
