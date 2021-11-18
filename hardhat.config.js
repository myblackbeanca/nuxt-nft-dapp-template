/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-waffle");
 const { ALCHEMY_API_KEY, METAMASK_PRIVATE_KEY } = process.env;
 
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      accounts: [`0x${METAMASK_PRIVATE_KEY}`]
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`]
    }
  },
  mocha: {
    timeout: 20000
  }
};
