require('dotenv').config();

async function main() {
    const digiDragonz = await ethers.getContractFactory("MyContract")

    const { HIDDEN_METADATA_CID, POKEMON_IMAGE_FOLDER_CID } = process.env;

    const hiddenMetadata = `https://gateway.pinata.cloud/ipfs/${HIDDEN_METADATA_CID}`
    const pokeBaseUri = `https://gateway.pinata.cloud/ipfs/${POKEMON_IMAGE_FOLDER_CID}/`

    const contract = await digiDragonz.deploy(hiddenMetadata, pokeBaseUri)
        
    console.log("Contract deployed to address:", contract.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  