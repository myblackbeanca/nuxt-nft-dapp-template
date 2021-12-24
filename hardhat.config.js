/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-waffle");
 const { 
  ALCHEMY_ROPSTEN_API_KEY,
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  ALCHEMY_KOVAN_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY
} = process.env;
 
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`]
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ROPSTEN_API_KEY}`,
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_API_KEY}`,
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`]
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KOVAN_API_KEY}`,
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_MAINNET_API_KEY}`,
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`],
      // chainId: 1,
      // from: `0x${METAMASK_PRIVATE_KEY}`,
      // gasPrice: 5000000
      // gasMultiplier: 1.5
      // gasPrice: ethers.utils.parseUnits('10', 'wei')
    }
  },
  mocha: {
    timeout: 20000
  }
};
