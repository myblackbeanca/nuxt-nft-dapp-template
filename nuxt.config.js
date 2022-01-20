
import fs from 'fs'
import path from 'path'

const { VOUCHER_SIGNER_PRIVATE_KEY, ALCHEMY_RINKEBY_API_KEY, ALCHEMY_MAINNET_API_KEY, NODE_ENV  } = process.env;
const siteConfig = require('./siteConfig.json')
import getSiteMeta from './utils/siteMeta'

const { title, description, url, iconName } = siteConfig

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    VOUCHER_SIGNER_PRIVATE_KEY,
    ALCHEMY_API_KEY: NODE_ENV === 'production' ? ALCHEMY_MAINNET_API_KEY : ALCHEMY_RINKEBY_API_KEY
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: title,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // mobile responsive https://search.google.com/test/mobile-friendly
      { name: 'format-detection', content: 'telephone=no' },
      ...getSiteMeta({
        url: url,
        title: title,
        description: description,
        mainImage: `${url}/${iconName}`
      })
    ],
    link: [
      {
        hid: "canonical",
        rel: "canonical",
        href: url,
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
    '@/plugins/wallet',
    '@/plugins/siteConfig',
    '@/plugins/smartContract'
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
    '@nuxtjs/sitemap',
    '@nuxtjs/axios'
  ],

  bootstrapVue: {
    icons: true
  },

  sitemap: {
    hostname: url,
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
  },

  hooks: {
    generate: {
      before(generator, options) {
        // console.log(generator, options, siteConfig)
        console.log(generator.nuxt.options.buildDir)
        const extraFilePath = path.join(
          generator.nuxt.options.buildDir,
          'siteConfig.json'
        )
        
        const config = {
          "address":"123"
        }
        fs.writeFileSync(extraFilePath, JSON.stringify(config))
      }
    }
  }


}
