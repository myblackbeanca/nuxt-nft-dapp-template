require('dotenv').config();
const updateEnv = require('./updateEnv.js');

async function main() {
  const contractFactory = await ethers.getContractFactory("YourContractName")

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const { HIDDEN_METADATA_CID, METADATA_FOLDER_CID, VOUCHER_SIGNER_PUBLIC_KEY } = process.env;
  
  const hiddenMetaUri = `ipfs://${HIDDEN_METADATA_CID}`
  const metaBaseUri = `ipfs://${METADATA_FOLDER_CID}/`
  const reserveTokenCount = 5;

  const contract = await contractFactory.deploy(hiddenMetaUri, metaBaseUri, VOUCHER_SIGNER_PUBLIC_KEY, reserveTokenCount)

  const envUpdate = {
    'CONTRACT_ADDRESS': contract.address
  }

  updateEnv(envUpdate)
      
  console.log("Contract deployed to address:", contract.address)
}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  