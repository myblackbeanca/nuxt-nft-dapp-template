<template>
  <div>
    <b-container id="container1" class="p-0" fluid>
      <b-row id="landing">
          <b-col class="d-flex align-items-center justify-content-center">
            <b-button-toolbar key-nav aria-label="Toolbar with button groups">
              <b-button-group class="mx-1">
                <b-button class="font-weight-bold" variant="success" @click="onCountDown">-</b-button>
                <b-button class="text-light font-weight-bold" variant="transparent"><h4>{{ count }}</h4></b-button>
                <b-button class="font-weight-bold" variant="success" @click="onCountUp">+</b-button>
              </b-button-group>
              <b-button-group class="mx-1">
                <b-button class="font-weight-bold" variant="success" size="lg" @click="mint">MINT</b-button>
              </b-button-group>
            </b-button-toolbar>
          </b-col>
      </b-row>
    </b-container>
  </div>
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

export default {
  data(){
    return {
      count: 1
    }
  },
  methods: {
    onCountUp() {
      this.count += 1
    },
    onCountDown(){
      if(this.count > 1) this.count -= 1
    },
    async mint() {
      try {
        if(this.$wallet.hexChainId !== this.$siteConfig.smartContract.chainIdHex) {
          const config = CHAINID_CONFIG_MAP[this.$siteConfig.smartContract.chainIdHex]
          await this.$wallet.switchNetwork(config) // will trigger page reload on success
          return
        }

        if(!this.$wallet.account) {
          await this.$wallet.connect()
        }

        let buyPrice, txResponse, isWhitelisted

        if(this.$siteConfig.smartContract.hasWhitelist) {
          const { data } = fetch(this.$siteConfig.endpoints.checkwhitelisted, {
            params: {
              wallet: this.$wallet.account,
              contract: this.$contract.address
            }
          })

          isWhitelisted = data

          if(!isWhitelisted) {
            this.$bvToast.toast('Your wallet address is not whitelised', {
              title: 'Mint',
              variant: 'danger',
              autoHideDelay: 3000
            })
            return
          }

          const isPresale = await signedContract.isWhitelistSaleActive()
          const presalePrice = +ethers.formatEther(await signedContract.PRESALE_TOKEN_PRICE())
          const publicPrice = +ethers.formatEther(await signedContract.MINT_PRICE())
          buyPrice = isPresale ? presalePrice : publicPrice
        }
        else {
          buyPrice = +ethers.formatEther(await signedContract.MINT_PRICE())
        }

        const total = this.count * buyPrice
        const value = ethers.utils.parseEther(total.toString())

        console.log({buyPrice})

        if(this.$siteConfig.smartContract.hasWhitelist) {
          const { chainId, address, name } = this.$siteConfig.smartContract

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
					autoHideDelay: 3000
				})

        txResponse.wait().then(async (res) => {
          console.log({ res });
          this.$bvToast.toast('Mint transaction confirmed. NFT should be in your wallet now!', {
            title: 'Mint',
            variant: 'success',
            autoHideDelay: 3000
          })
        });

      } catch (err) {
        console.error({err})
        this.$bvToast.toast(err.message || 'Mint failed', {
					title: 'Mint',
					variant: 'danger',
					autoHideDelay: 3000
				})
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#container1 {
  overflow:hidden;
  min-height: calc(100vh - 194px);
}

#landing {
  min-height:inherit;
  background: url("@/assets/img/background.jpg");
}

</style>