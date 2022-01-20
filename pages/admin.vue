<template>
  <div
    class="
      container
      d-flex
      flex-column
      align-items-center
      justify-content-center
    "
  >
    <div v-if="user">
      <p>PreSale Status: {{ presaleStatus }}</p>
      <p>Sale Status: {{ publicSaleStatus }}</p>
      <p>Reveal Status: {{ revealStatus }}</p>
      <p>Balance: {{ balance }} </p>
      <div class="btn-admin">
        <b-button
          @click="call('flipPresaleState')"
          class="mr-2"
          variant="outline-light"
          >Flip Presale State</b-button
        >
        <b-button
          @click="call('flipSaleState')"
          class="mr-2"
          variant="outline-light"
          >Flip Sales State</b-button
        >
        <b-button
          @click="call('reveal')"
          :disabled="revealStatus === 'ON'"
          class="mr-2"
          variant="outline-light"
          >Reveal</b-button
        >
        <b-button @click="call('reserve')" class="mr-2" variant="outline-light"
          >Reserve</b-button
        >
        <b-button @click="call('withdraw')" variant="outline-light"
          >Withdraw</b-button
        >
      </div>
    </div>
    <div v-else><h3>Admin only area. Please login</h3></div>
  </div>
</template>

<script>
import { ethers } from "ethers";

const identity = window.netlifyIdentity;

export default {
  layout: "admin",
  name: "admin",
  data() {
    return {
      user: identity.currentUser(),
      alreadyCalled: false,
      signedContract: null,
      presaleStatus: "loading...",
      publicSaleStatus: "loading...",
      revealStatus: "loading...",
      balance: "loading..."
    };
  },
  async mounted() {
    identity.on("login", (user) => {
      this.user = user;
      if (!alreadyCalled) {
        this.alreadyCalled = true;
        this.init();
      }
    });
    identity.on("logout", () => {
      this.user = null;
    });
    if (this.user) {
      this.init();
    }
  },
  methods: {
    async init() {
      try {
        if (!this.$wallet.provider) return
  
        const signer = this.$wallet.provider.getSigner();
        this.signedContract = this.$contract.connect(signer);
  
        await this.loadState();
      } catch (err) {
        console.error({err})
      }
    },
    async call(name) {
      try {

        if(!confirm(
          `Are you sure you want to call smart contract's '${name.toUpperCase()}' function ?`
        )) return

        const signer = this.$wallet.provider.getSigner()
        const gasPrice = await signer.getGasPrice()
        console.log("gasPrice", ethers.utils.formatUnits(gasPrice))

        const txResponse = await this.signedContract[name]({
          gasPrice: gasPrice,
        });

        console.log({ txResponse });

        txResponse.wait().then(async (res) => {
          console.log({ res });
          await this.loadState();
          this.onSuccess("State reloaded");
        });
      } catch (e) {
        this.onError(e);
      }
    },
    async loadState() {
      this.presaleStatus = (await this.signedContract.isWhitelistSaleActive())
        ? "ON"
        : "OFF"
      this.publicSaleStatus = (await this.signedContract.isPublicSaleActive())
        ? "ON"
        : "OFF"
      this.revealStatus = (await this.signedContract.canReveal())
        ? "ON"
        : "OFF"
      
      const contractBalance = await this.$wallet.provider.getBalance(this.signedContract.address)
      this.balance = ethers.utils.formatUnits(contractBalance)
    },
    onError(e) {
      console.error(e);
      this.$bvToast.toast(e?.data?.message || e.message || "Operation failed", {
        title: "Error",
        variant: "danger",
      });
    },
    onSuccess(msg) {
      this.$bvToast.toast(msg || "Operation successful", {
        title: "Success",
        variant: "success",
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.container {
  min-height: calc(100vh - 185px);
}
</style>
