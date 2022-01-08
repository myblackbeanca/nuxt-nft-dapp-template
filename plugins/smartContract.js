const siteConfig = require('@/siteConfig.json')
import { ethers } from 'ethers'

export default ({env}, inject) => {

    let contract = {}

    const { address, abi } = siteConfig.smartContract
    if(!address || !abi) {
        console.error("Smart Contract configuration is missing. Check siteConfig.js")
    }
    else {
        contract = new ethers.Contract(address, abi)
    }
    
    inject('contract', contract)
}
