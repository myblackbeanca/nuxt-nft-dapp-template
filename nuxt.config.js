
const { METAMASK_PRIVATE_KEY, METAMASK_PUBLIC_KEY, CONTRACT_ADDRESS } = process.env;

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    METAMASK_PRIVATE_KEY,
    METAMASK_PUBLIC_KEY,
    CONTRACT_ADDRESS
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-nft-template',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '@/plugins/smart-contract'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/sitemap'
  ],

  bootstrapVue: {
    icons: true,
  },

  sitemap: {
    hostname: 'https://mysite.com',
    exclude: [
      '/admin/**'
    ],
    // routes: getRoutes
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
