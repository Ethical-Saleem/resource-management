<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";

const loadingStore = useLoadingStore();

useSeoMeta({
  title: 'Resource Xplore',
  ogTitle: 'Resource Xplore',
  description: 'This is a platform showing the various resource distribution within the country',
  ogDescription: 'This is a platform showing the various resource distribution within the country',
  ogImage: '/img/logo_5.png',
  twitterCard: 'summary_large_image',
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Resource Xplore` : 'Resource Xplore';
  },
  link: [
    { rel: 'icon', type: 'img/png', href: '/img/favicon-32x32.png' },
    { rel: 'icon', type: 'img/png', href: '/img/favicon-16x16.png' },
  ],
})
</script>

<template>
  <div class="">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div v-if="loadingStore.isLoading" class="loading-overlay">
      <!-- <div class="spinner"></div> -->
      <div class="loading-text">Please wait</div>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
    </div>
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
  0%, 100% {
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
  content: '';
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
