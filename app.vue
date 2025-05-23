<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";
import { useMainStore } from "#imports";
import { AppState } from "./stores/main-store";

const loadingStore = useLoadingStore();
const mainStore = useMainStore();
const route = useRoute()

const config = useRuntimeConfig();
const appUrl = config.public.baseUrl;
const currentUrl = `${appUrl}${route.fullPath}`;

useSeoMeta({
  title: "NRMIS - Nigeria Resources Management and Information System",
  ogTitle: "NRMIS - Nigeria Resource Management and Information System",
  description:
    "This is a platform showing the various resource distribution and statistical data, within Nigeria. Owned by the Raw Materials Research and Development Council",
  ogDescription:
    "This is a platform showing the various resource distribution and statistical data, within Nigeria. Owned by the Raw Materials Research and Development Council",
  ogImage: `${appUrl}/img/og-image.png`,
  twitterCard: "summary_large_image",
  ogType: "website",
  ogUrl: currentUrl,
  ogLocale: "en_US",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageAlt: "NRMIS Resource Information Portal",
  twitterTitle: "NRMIS - Nigeria Resource Management and Information System",
  twitterDescription: "Resource distribution and statistical data platform for Nigeria",
  twitterImage: `${appUrl}/img/og-image.png`,
  twitterImageAlt: "NRMIS Resource Information Portal"
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} | NRMIS - Resource Information Portal`
      : "NRMIS - Resource Information Portal";
  },
  link: [
    { rel: "icon", sizes: "32x32", type: "image/png", href: `${appUrl}/img/favicon-32x32.png` },
    { rel: "icon", sizes: "16x16", type: "image/png", href: `${appUrl}/img/favicon-16x16.png` },
    { rel: "apple-touch-icon", sizes: "152x152", type: "image/png", href: `${appUrl}/img/apple-touch-icon.png` },
    { rel: "manifest", href: `${appUrl}/manifest.json` },
    { rel: "icon", sizes: "192x192", type: "image/png", href: `${appUrl}/img/android-chrome-192x192.png` },
    { rel: "icon", sizes: "512x512", type: "image/png", href: `${appUrl}/img/android-chrome-512x512.png` },
  ],
  meta: [
    { name: 'keywords', content: 'NRMIS, Nigeria Resource Information Portal, Nigeria Resource Map, Nigeria Resource Statistics, Statistics, RMRDC Portal, NRMIS Portal' },
    { name: "theme-color", content: "#2fd8ae" }
  ],
});

const isChatOpen = ref(false);

const isMaintenance = computed(() => mainStore.appState === AppState.maintenance);
const isRunning = computed(() => mainStore.appState === AppState.running);
</script>

<template>
  <div v-if="isRunning" class="">
    <NuxtLayout>
      <NuxtPage />

      <!-- <ChatAIButton @open="isChatOpen = true" /> -->
      <ChatBar :is-open="isChatOpen" @close="isChatOpen = false" />
    </NuxtLayout>

    <div v-if="loadingStore.isLoading" class="loading-overlay">
      <!-- <div class="spinner"></div> -->
      <div class="loading-text">Please wait</div>
      <div class="progress-bar">
        <div class="progress" />
      </div>
    </div>
  </div>
  <div v-if="isMaintenance" class="">
    <MaintenanceState />
  </div>

  <USlideovers />
</template>

<style>
@import url("~/assets/css/global.css");

:root {
  font-family: "Poppins", "Inter";
}

/* .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  } */

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* .loading-text {
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 20px;
} */

.loading-text {
  font-size: 18px;
  font-weight: 500;
  color: white;
  margin-bottom: 10px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.progress-bar {
  width: 20%;
  height: 8px;
  background-color: #d1eca5;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar::before {
  content: "";
  position: absolute;
  width: 40%;
  height: 100%;
  background-color: #d292ff;
  animation: moveBackAndForth 2s linear infinite;
}

@keyframes moveBackAndForth {
  0% {
    left: 0%;
  }
  50% {
    left: 80%;
  }
  100% {
    left: 0%;
  }
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* .progress-bar {
  width: 20%;
  height: 8px;
  background-color: #333;
  overflow: hidden;
  border-radius: 5px;
}

.progress {
  width: 100%;
  height: 100%;
  background-color: #3498db;
  animation: progressMove 2s infinite ease-in-out;
} */

@keyframes progressMove {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
