import { ethers } from 'ethers'
import Vue from 'vue'

export default ({env}, inject) => {

    const wallet = Vue.observable({
        account: null,
        accountCompact: null,
        network: null,
        balance: null,
        transactionCount: null,
        async init() {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const [account] = await provider.listAccounts()
            // console.log('wallet init', {account})

            !!account && this.setAccount(account)
        },
        setAccount(newAccount) {
            if(newAccount) {
                this.account = newAccount
                this.accountCompact = `${newAccount.substring(0, 4)}...${newAccount.substring(newAccount.length - 4)}`
            }
            else {
                this.account = null
                this.accountCompact = null
            }
        },
        connect() {
            return new Promise(async (resolve, reject) => {
                if (!window.ethereum) {
                    reject("Metamask is not installed")
                  }

                  try {
                    // console.log(typeof window.ethereum.networkVersion)
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    console.log({provider})
                    const [account] = await provider.send('eth_requestAccounts')

                    console.log('wallet connect', {account})

                    if(!account) return
                    this.setAccount(account)

                    const balance = (await provider.getBalance(account)).toString()
                    this.balance = ethers.utils.formatEther(balance)

                    this.network = await provider.getNetwork()
                    this.transactionCount = await provider.getTransactionCount(account)
                  } catch (e) {
                    console.error(e)
                    reject(e)
                  }

                resolve(this.$wallet.account)
            })

        },
    })

    window.ethereum.on('connect', (data) => {
        console.log('connect', data)
    })

    window.ethereum.on('disconnect', (data) => {
        console.log('disconnect', data)
    })

    window.ethereum.on('accountsChanged', ([newAddress]) => {
        console.log('accountsChanged', newAddress)
        wallet.setAccount(newAddress)
    })

    window.ethereum.on('chainChanged', (chainId) => {
        console.log('chainChanged', chainId)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    })

    window.ethereum.on('error', (e) => {
        console.error('on error', e)
    })

    wallet.init()

    inject('wallet', wallet)
}