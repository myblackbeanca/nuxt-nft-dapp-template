import { ethers } from 'ethers'

export default ({env}, inject) => {

    const { CONTRACT_ADDRESS } = env

    // const provider = new ethers.Wallet(METAMASK_PUBLIC_KEY)
    const contractJson = require("../artifacts/contracts/minter.sol/MyContract.json")
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi)

    inject('contract', contract)
}
