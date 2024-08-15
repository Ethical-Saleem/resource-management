<script setup lang="ts"></script>

<template>
  <div class="">
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <USlideovers />
</template>

<style>
@import url("~/assets/css/global.css");

:root {
  font-family: "Poppins", "Inter";
}
</style>
