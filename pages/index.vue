<template>
    <b-container id="container" fluid>
      <b-row id="landing">
          <b-col class="d-flex align-items-center justify-content-center backdrop-blur">
              <b-jumbotron :header="$siteConfig.title" class="shadow text-center" :lead="$siteConfig.description" bg-variant="dark" text-variant="white">
                <div v-if="isMintingAvailable">
                  <h4 class='pt-2 text-light'>Minted: {{ mintedCount }}/{{ collectionSize }}</h4>
                  <b-form-spinbutton class="w-50 mx-auto my-3" v-model="count" min="1" max="20"></b-form-spinbutton>
                  <b-button class="font-weight-bold" variant="light" size="lg" @click="mint">MINT</b-button>
                </div>
                <div v-else>
                  <Countdown :date="$siteConfig.dropDate" />
                </div>
              </b-jumbotron>
          </b-col>
      </b-row>
    </b-container>
</template>

<script>

console.group("Powered by www.zerocodenft.com")
console.info(
  "%cDrop Your NFT collection with ZERO coding skills",
  `background: linear-gradient(100.07deg, #DB6F3D -28.71%, #9534DE 36.75%, #5FB9E6 103.59%);
  color:white;
  font-weight:bold;`
)
console.groupEnd()

import { CHAINID_CONFIG_MAP } from '@/utils/metamask'
import signVoucher from '@/utils/signVoucher'
import { ethers } from 'ethers'

export default {
  data(){
    return {
      count: 1,
      mintedCount: 0,
      collectionSize: 0
    }
  },
  computed: {
    isMintingAvailable() {
      // console.log(this.$siteConfig.dropDate, new Date(this.$siteConfig.dropDate))
      return new Date() > new Date(this.$siteConfig.dropDate)
    }
  },
  async mounted() {

    const { chainId: targetChainId, abi, address, collectionSize } = this.$siteConfig.smartContract

    try {

      if(!this.$wallet.provider) return 

      if(!this.isMintingAvailable) return

      const isWrongNetwork = this.$wallet.chainId != targetChainId

      if (isWrongNetwork) {        
        const config = CHAINID_CONFIG_MAP[targetChainId]
        await this.$wallet.switchNetwork(config) // will trigger page reload on success
        return
      }

      const nftContract = new ethers.Contract(address, abi, this.$wallet.provider)
      this.mintedCount = await nftContract.totalSupply()
      this.collectionSize = await nftContract.COLLECTION_SIZE()
      
    } catch (err) {
      console.error({err})
      this.collectionSize ??= collectionSize
    }
  },
  methods: {
    async mint() {

      const { chainId, address, name, hasWhitelist, abi } = this.$siteConfig.smartContract
      
      try {

        if(!this.$wallet.account) {
          await this.$wallet.connect()
        }

        if(this.$wallet.chainId !== chainId) {
          const config = CHAINID_CONFIG_MAP[chainId]
          await this.$wallet.switchNetwork(config) // will trigger page reload on success
          return
        }

        const contract = new ethers.Contract(address, abi)
        const signedContract = contract.connect(this.$wallet.provider.getSigner())
        let buyPrice = +ethers.formatEther(await signedContract.MINT_PRICE())

        let txResponse, isWhitelisted

        if(hasWhitelist) {
          const { data } = fetch(this.$siteConfig.checkWhitelistedUrl, {
            params: {
              wallet: this.$wallet.account,
              contract: address
            }
          })

          isWhitelisted = data

          if(!isWhitelisted) {
            this.$bvToast.toast('Your wallet address is not whitelised', {
              title: 'Mint',
              variant: 'danger',
            })
            return
          }

          const isPresale = await signedContract.isWhitelistSaleActive()
          const presalePrice = +ethers.formatEther(await signedContract.PRESALE_TOKEN_PRICE())
          buyPrice = isPresale ? presalePrice : publicPrice
        }

        const total = this.count * buyPrice
        const value = ethers.utils.parseEther(total.toString())

        console.log({buyPrice})

        if(hasWhitelist) {

          const domain = {
            name: name.replace(/\s/g, ''),
            version: '1',
            chainId,
            verifyingContract: address
          }

          const voucher = {
            redeemer: $wallet.account,
            whitelisted: isWhitelisted,
            numberOfTokens: this.count
          }

          const { signer: mintSigner, signature } = await signVoucher(voucher, domain);

          txResponse = await signedContract.redeem(voucher, mintSigner.address, signature, {
            value,
            // gasPrice,
            // gasLimit: gasEstimate
          })
        }
        else {
          txResponse = await signedContract.mint(this.count, {
            value
          })
        }

        console.log({ txResponse });

        this.$bvToast.toast('Minted successfully! Wait for transaction to clear', {
					title: 'Mint',
					variant: 'success',
				})

        txResponse.wait().then(async (res) => {
          console.log({ res });
          this.$bvToast.toast('Mint transaction confirmed. NFT should be in your wallet now!', {
            title: 'Mint',
            variant: 'success',
          })
        });

      } catch (err) {
        console.error({err})
        this.$bvToast.toast(err.message || 'Mint failed', {
					title: 'Mint',
					variant: 'danger',
				})
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#container {
  overflow:hidden;
  min-height: calc(100vh - 164px);
}

#landing {
  min-height:inherit;
  background: url("@/assets/img/background.jpg");
}

.backdrop-blur {
  backdrop-filter: blur(2px);
}

</style>