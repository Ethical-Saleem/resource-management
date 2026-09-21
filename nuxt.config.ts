// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // The redesigned pages are light-only; without this, Nuxt UI inputs and
  // buttons follow the OS dark preference and clash with the white cards.
  // A new storageKey also drops any "system"/"dark" value saved earlier.
  colorMode: {
    preference: "light",
    fallback: "light",
    storageKey: "nrmis-color-mode",
  },

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
    // Server-only — used for SSR's own API calls when the frontend and API
    // sit in the same Docker network (e.g. http://api:3003/api), reaching
    // the API container directly instead of round-tripping back out through
    // IIS. Falls back to the public value so this is a no-op everywhere
    // else (local dev, Vercel).
    apiBaseInternal: process.env.API_BASE_INTERNAL_URL || '',
    public: {
      // Browser-facing. Behind a same-origin IIS reverse proxy this should
      // be a relative path ("/api") so it resolves against whatever host
      // the page was loaded from, rather than a hardcoded one.
      apiBase: process.env.API_BASE_URL || 'http://localhost:3003/api',
      baseUrl: process.env.APP_BASE_URL || "http://localhost:3001"
    },
  },

  css: [
    "leaflet/dist/leaflet.css",
    "leaflet.markercluster/dist/MarkerCluster.css",
    "leaflet.markercluster/dist/MarkerCluster.Default.css",
  ],

  ssr: true,
  app: {
    head: {
      title: "NRMIS Resource Information Portal",
      meta: [
        { name: "description", content: "This is a platform showing the various resource distribution and statistical data within Nigeria." },
        { property: "og:title", content: "NRMIS Resource Information Portal" },
        { property: "og:description", content: "Platform showingthe various resource distribution and statistical data within Nigeria." },
        { property: "og:image", content: "/img/og-image.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "/img/og-image.png" },
      ],
    },
  },

  routeRules: {
    '/': { ssr: false },
    '/test-map': { ssr: false },
    // Leaflet touches window/document at import time — never SSR this page.
    '/map-view': { ssr: false },
  },

  echarts: {
    renderer: ['canvas'],
    charts: ['BarChart', 'LineChart', 'PieChart', 'RadarChart', 'BoxplotChart', 'ScatterChart', 'HeatmapChart'],
    components: ['DatasetComponent', 'GridComponent', 'TooltipComponent', 'LegendComponent', 'RadarComponent', 'VisualMapComponent'],
    features: ['LabelLayout', 'UniversalTransition']
  },

  // plugins: [
  //   '~/plugins/sw-registration.ts'
  // ],

  sitemap: {
    hostname: process.env.APP_BASE_URL || "http://localhost:3001",
    gzip: true,
    exclude: [
      '/create-resource',
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