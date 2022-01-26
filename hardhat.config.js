/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-waffle");
 const { 
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY
} = process.env;
 
module.exports = {
  solidity: "0.8.1",
  defaultNetwork: "localhost",
  settings: {
    optimizer: {
      enabled: true,
      runs: 5000,
    },
  },
  networks: {
    localhost: {
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_API_KEY}`,
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_MAINNET_API_KEY}`,
      accounts: [`0x${CONTRACT_OWNER_PRIVATE_KEY}`],
    }
  },
  mocha: {
    timeout: 20000
  }
};
