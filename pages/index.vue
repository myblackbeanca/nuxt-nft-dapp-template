<template>
  <div>
    <b-container id="container1" class="p-0" fluid>
      <b-row id="landing">
          <b-col class="d-flex align-items-center justify-content-center">
            <b-button-toolbar key-nav aria-label="Toolbar with button groups">
              <b-button-group class="mx-1">
                <b-button class="font-weight-bold" variant="success" @click="onCountDown">-</b-button>
                <b-button class="text-light font-weight-bold" variant="transparent">{{ count }}</b-button>
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

import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

console.group("Powered by www.zerocodenft.com")
console.info(
  "%cDrop Your NFT collection with ZERO coding skills",
  `background: linear-gradient(100.07deg, #DB6F3D -28.71%, #9534DE 36.75%, #5FB9E6 103.59%);
  color:white;
  font-weight:bold;`
)
console.groupEnd()

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
        if(`0x${this.$wallet.hexChainId}` !== this.$siteConfig.smartContract.chainIdHex) {
          const config = CHAINID_CONFIG_MAP[this.$siteConfig.smartContract.chainIdHex]
          await this.$wallet.switchNetwork(config) // will trigger page reload on success
          return
        }

        if(!this.$wallet.account) {
          await this.$wallet.connect()
        }

        const signer = this.$wallet.provider.getSigner()
        const signedContract = this.$contract.connect(signer)

        const total = this.count * this.$siteConfig.smartContract.mintPrice
        const value = ethers.utils.parseEther(total.toString())
        
        const txResponse = await signedContract.mint(1, {
          value
        })

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