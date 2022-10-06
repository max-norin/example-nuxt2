module.exports = {
  mode: 'spa',
  router: {
    base: '/app/',
    mode: 'hash',
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.APP_NAME || 'Магазин',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  generate: {
    dir: process.env.GENERATE_DIR || 'dist',
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#464646' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/buefy.scss',
    '@/node_modules/css-reset-and-normalize-sass',
    '@/assets/scss/reset-and-normalize.scss',
    '@/assets/scss/general.scss',
    '~/node_modules/@mdi/font/css/materialdesignicons.css',
    'vue-select/dist/vue-select.css',
    '@riophae/vue-treeselect/dist/vue-treeselect.css',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    [
      'nuxt-buefy', {
      css: false,
      materialDesignIcons: false,
    }],
  ],
  styleResources: {
    scss: [
      '@/assets/scss/variables.scss',
    ],
  },
  plugins: [
    '~/plugins/axios',
    '~/plugins/axiosMarketplace',
    '~/plugins/vuelidate-error-extractor.js',
  ],
  publicRuntimeConfig: {
    api: { url: process.env.API_URL },
    storage: { url: process.env.STORAGE_URL },
    mainSite: process.env.MAIN_SITE,
    aboutPage: process.env.ABOUT_PAGE,
    contactPage: process.env.CONTACT_PAGE,
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['vuelidate-error-extractor'],
  },
  hooks: {
    error () {
      console.log('Logged in error')
    },
    render: {
      errorMiddleware (app) {
        app.use((error, req, res, next) => {
          debugger
          if (error) {
            console.log('Logged in errorMiddleware', error)
          }
          next(error)
        })
      },
    },
  },
}

