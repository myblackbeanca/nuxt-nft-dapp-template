<template>
	<div
		class="
			container
			d-flex
			flex-column
			align-items-center
			justify-content-center
		">
		<div v-if="user">
			<b-form-checkbox
				v-model="publicSaleStatus"
				switch
				size="lg"
				class="mb-2"
				@change="call('flipSaleState')"
				:disabled="isBusy">
				<b>Public Sale</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<b-form-checkbox
				v-if="$siteConfig.smartContract.hasWhitelist"
				v-model="presaleStatus"
				switch
				size="lg"
				class="mb-2"
				:disabled="isBusy"
				@change="call('flipPreSaleState')">
				<b>Whitelist Sale</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<b-form-checkbox
				v-if="$siteConfig.smartContract.hasDelayedReveal"
				v-model="revealStatus"
				:disabled="revealStatus || isBusy"
				switch
				size="lg"
				class="mb-2"
				@change="call('reveal')">
				<b>Revealed</b> {{ isBusy ? 'loading...' : '' }}
			</b-form-checkbox>
			<p>Balance: {{ balance }} ETH</p>
			<b-button
				@click="call('withdraw')"
				variant="outline-dark"
				:disabled="balance === 0"
				>Withdraw</b-button
			>
			<!-- <div class="btn-admin">
        <b-button @click="call('reserve')" class="mr-2" variant="outline-dark"
          >Reserve</b-button
        >
      </div> -->
		</div>
		<div v-else><h3>Admin only area</h3></div>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

const identity = window.netlifyIdentity

export default {
	layout: 'admin',
	name: 'admin',
	data() {
		return {
			user: identity.currentUser(),
			alreadyCalled: false,
			presaleStatus: false,
			publicSaleStatus: false,
			revealStatus: false,
			balance: 0,
			isBusy: false,
		}
	},
	async mounted() {
		identity.on('login', (user) => {
			this.user = user
			if (!this.alreadyCalled) {
				this.alreadyCalled = true
				this.init()
			}
		})
		identity.on('logout', () => {
			this.user = null
		})
		if (this.user) {
			this.init()
		}
	},
	methods: {
		async init() {
			if (!this.$wallet.provider) return

			const { chainId: targetChainId } = this.$siteConfig.smartContract
			const isWrongNetwork = this.$wallet.chainId != targetChainId

			if (isWrongNetwork) {
				const config = CHAINID_CONFIG_MAP[targetChainId]
				await this.$wallet.switchNetwork(config) // will trigger page reload on success
				return
			}

			if (!this.$wallet.account) {
				await this.$wallet.connect()
			}

			await this.loadState()
		},
		async call(name) {
			try {
				if (
					!confirm(
						`Are you sure you want to call smart contract's '${name.toUpperCase()}' function ?`
					)
				) {
					return
				}

				this.isBusy = true

				const { address, abi } = this.$siteConfig.smartContract
				const signer = await this.$wallet.provider.getSigner()
				const signedContract = new ethers.Contract(address, abi, signer)

				const gasPrice = await signer.getGasPrice()
				console.log('gasPrice', ethers.utils.formatUnits(gasPrice))

				const txResponse = await signedContract[name]({
					gasPrice: gasPrice,
				})

				console.log({ txResponse })

				txResponse.wait().then(async (res) => {
					console.log({ res })
					await this.loadState()
					this.onSuccess('State reloaded')
				})
			} catch (err) {
				this.onError(err)
			} finally {
				this.isBusy = false
			}
		},
		async loadState() {
			const { address, abi } = this.$siteConfig.smartContract
			const contract = new ethers.Contract(address, abi, this.$wallet.provider)
			this.presaleStatus = await contract.isWhitelistSaleActive()
			this.publicSaleStatus = await contract.isPublicSaleActive()
			this.revealStatus = await contract.canReveal()
			this.balance = +ethers.utils.formatUnits(
				await this.$wallet.provider.getBalance(contract.address)
			)
		},
		onError(err) {
			console.error({ err })
			this.$bvToast.toast(err?.data?.message || err.message || 'Request failed', {
				title: 'Error',
				variant: 'danger',
			})
		},
		onSuccess(msg) {
			this.$bvToast.toast(msg || 'Request successful', {
				title: 'Success',
				variant: 'success',
			})
		},
	},
}
</script>

<style scoped lang="scss">
.container {
	min-height: calc(100vh - 178px);
}
</style>
