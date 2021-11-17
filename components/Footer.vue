<template>
  <footer class="bg-dark py-4">
    <b-container fluid>
        <b-row>
            <b-col cols="12" class="d-flex flex-column align-items-center text-center">
                <b-button href="#" target="_blank" variant="link">
                    <b-icon icon='discord' variant='success' font-scale='2.2' />
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12">
                <b-nav align="center">
                    <b-nav-item href="#about" link-classes="text-light">About</b-nav-item>
                    <b-nav-item href="#team" link-classes="text-light">Team</b-nav-item>
                    <b-nav-item href="#privacy-policy" link-classes="text-light">Privacy Policy</b-nav-item>
                </b-nav>
            </b-col>
        </b-row>
    </b-container>
  </footer>
</template>

<script>

export default {
  name:'Footer',
}
</script>

<style lang="scss" scoped>

</style>
