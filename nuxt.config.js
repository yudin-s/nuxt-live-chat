const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/nuxt-live-chat/'
  }
} : {}

export default {
  ...routerBase,

  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_description || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/graphql-connector.js', mode: 'client'}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
  ],
  'google-gtag':{
    id: 'UA-165421608-1',

    config:{
      anonymize_ip: false, // anonymize IP
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
      linker:{
        domains:['yudin-s.github.io']
      }
    },
    debug: false, // enable to track in dev mode
    disableAutoPageTrack: false,
  },
  /*
  ** Build configuration
  */
  styleResources: {
    // your settings here
    scss: [
      '~assets/scss/global.scss'
    ],
    sass:[
      '~assets/global.scss'

    ]
  },
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
