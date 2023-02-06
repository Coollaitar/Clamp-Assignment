# Clamp Assignment

---

# 🔒Question :

Develop a solution that utilizes the concept of multi calls to fetch prices from Uniswap. The solution should allow for the retrieval of multiple token prices in a single call, rather than multiple separate API requests. The objective is to improve efficiency by reducing the number of calls to the blockchain node. The user should be able to input an index of the desired token prices, and the solution should return the prices in a single call.

# 🔓Solution :

## 🔑 What is Uniswap ?

1. **Uniswap** is a decentralized exchange that enables peer-to-peer market making. Uniswap API is commonly used by developers to build DeFi applications like Token swapping, AMM, and Decentralized Exchange(DEX), etc.

2. **Uniswap V2** : It is used to determine the price of tokens and it has improved token listing process.

3. **Reason to retrieve multiple token prices in a single API call** : To improve efficiency by reducing the number of calls to the blockchain node.

## 🔑 Approach to Answer the Question :

1. **Batch Requests** : Batch Requests to our blockchain node, are when we send a list of data inputs to our call to our blockchain nodes.**BUT** batching requests has some issue as they can't handle a lot of nodes and some service don't even support them. So instead of batch requests we use _Multicall_.

2. **Multicall** : Instead of making a ton of requests like massive batch thing, we call one function of an on-chain contract that takes unlimited parameter and we define the functions we want the contract to call. So basically we are going to make a single API call to retrieve data of function having multiple parameters and this is known as **Multicall**.

## 🔑 Step by Step Explanation of Code :

## 🔦 Step 1 👉🏻

1. Store Multicall Address in `UniswapMulticallAddress` variable.
2. Store ABI(Application Binary Interface) of Multicall in `UniswapMulticallABI` variable which provides necessary information about contract like functions, etc.

```web3.js
const UniswapMulticallAddress = Address;
const UniswapMulticallABI = [{},];
```

## 🔦 Step 2 👉🏻

📍This step is done to interact with Smart Contract

```web3.js
const UniswapMulticall = new web3.eth.Contract(UniswapMulticallABI, UniswapMulticallAddress);
```
