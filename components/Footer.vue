<template>
	<footer class="bg-dark py-4">
		<b-container fluid>
			<b-row>
				<b-col sm="12" md="6">
					<b-nav class="justify-content-center justify-content-md-start">
						<b-img-lazy src="logo.svg" width="60px" alt="logo" />
						<!-- <b-nav-item href="#about" class="align-self-center" link-classes="text-light">About</b-nav-item>
                    <b-nav-item href="#team" class="align-self-center" link-classes="text-light">Team</b-nav-item> -->
					</b-nav>
				</b-col>
				<b-col sm="12" md="6">
					<div class="d-flex flex-column align-items-center align-items-md-end">
						<span class="text-light" style="font-size: small">Powered By</span>
						<b-link href="https://zerocodenft.com" target="_blank">
							<b-img-lazy width="100px" src="@/assets/img/zerocodenftlogo_white.svg" />
						</b-link>
					</div>
				</b-col>
			</b-row>
		</b-container>
	</footer>
</template>

<script>
export default {
	name: 'Footer',
}
</script>

<style lang="scss" scoped></style>
