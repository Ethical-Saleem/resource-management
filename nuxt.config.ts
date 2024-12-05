// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "nuxt-echarts",
    "@nuxtjs/mdc",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots"
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3003',
      baseUrl: process.env.APP_BASE_URL || "http://localhost:3001"
    },
  },

  ssr: true,
  app: {
    head: {
      title: "RMRDC - Resource Exploration",
      meta: [
        { name: "description", content: "This is a platform showing resource distribution and statistical data within Nigeria." },
        { property: "og:title", content: "RMRDC - Resource Exploration" },
        { property: "og:description", content: "Platform showing resource distribution and statistical data within Nigeria." },
        { property: "og:image", content: "/img/og-image.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "/img/og-image.png" },
      ],
    },
  },

  routeRules: {
    '/': { ssr: false },
    '/test-map': { ssr: false },
  },

  echarts: {
    renderer: ['canvas'],
    charts: ['BarChart', 'LineChart', 'PieChart'],
    components: ['DatasetComponent', 'GridComponent', 'TooltipComponent', "LegendComponent"],
    features: ['LabelLayout', 'UniversalTransition']
  },
  sitemap: {
    hostname: process.env.APP_BASE_URL || "http://localhost:3001",
    gzip: true,
    exclude: [
      '/create-resource',
      '/state-level-map',
      '/test-map',
      '/server-error',
      '/resource-view'
    ],
    defaults: {
      changefreq: 'monthly',
      priority: 1,
      lastmod: new Date()
    }
  },

  robots: {
    UserAgent: '*',
    Disallow: '/admin', // Block certain paths
    Allow: '/',         // Allow the rest of the site
    Sitemap: process.env.APP_BASE_URL + '/sitemap.xml',
  },

  compatibilityDate: "2024-08-11"
})