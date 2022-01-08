const siteConfig = require('@/siteConfig.json')

export default ({env}, inject) => {

    console.log({siteConfig})

    inject('siteConfig', siteConfig)
}
