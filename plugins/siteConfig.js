export default async ({env, $axios}, inject) => {

    // console.log(env)
    let siteConfig = {}
    
    try {
        const { data: websiteConfig } = await $axios.get(`/websites/${env.WEBSITE_ID}/config`)
        console.log({websiteConfig})
        siteConfig = websiteConfig
    } catch (err) {
        siteConfig = require('@/siteConfig.json')
        console.error(err)
    }

    inject('siteConfig', siteConfig)
}
