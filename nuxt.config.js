
const { VOUCHER_SIGNER_PRIVATE_KEY, CONTRACT_ADDRESS, CHAIN_ID, ALCHEMY_MAINNET_API_KEY } = process.env;

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    VOUCHER_SIGNER_PRIVATE_KEY,
    CONTRACT_ADDRESS,
    CHAIN_ID,
    ALCHEMY_MAINNET_API_KEY
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'My NFT Site',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // mobile responsive https://search.google.com/test/mobile-friendly
      { hid: 'description', name: 'description', content: '10 000 items beautiful NFT collection' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: "og:site_name", content: "My NFT Site" },
    ],
    link: [
      {
        hid: "canonical",
        rel: "canonical",
        href: "https://mysite.com",
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/wallet'
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
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
