import { ethers } from 'ethers'

const signVoucher = async (voucher, domain) => {  
    // The named list of all type definitions
    const types = {
      NFTVoucher: [
        { name: 'redeemer', type: 'address' },
        { name: 'whitelisted', type: 'bool' },
        { name: 'numberOfTokens', type: 'uint' },
      ]
    }
  
    const signer = new ethers.Wallet(process.env.VOUCHER_SIGNER_PRIVATE_KEY)
    const signature = await signer._signTypedData(domain, types, voucher)
    
    return {
      signer,
      signature
    }
  }

export default signVoucher