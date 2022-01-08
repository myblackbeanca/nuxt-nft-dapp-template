
export default async ({env}, inject) => {

    const wallet = {
        account: null,
        accountCompact: null,
        network: null,
        balance: null,
        provider: null
    }

    
    inject('wallet', wallet)

}
