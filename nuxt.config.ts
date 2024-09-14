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
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3003'
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

  compatibilityDate: "2024-08-11"
})