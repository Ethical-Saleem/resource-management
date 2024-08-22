<script setup lang="ts">
</script>

<template>
  <div>
    <div
      class="group/nav ltablet:max-w-[1000px] ptablet:max-w-[47rem] fixed inset-x-0 top-0 z-50 mx-auto max-w-[350px] group-[&.scrolled]/landing:mt-2 group-[&:not(.scrolled)]/landing:mt-4 motion-safe:transition-all motion-safe:duration-200 lg:max-w-7xl"
    >
      <div
        class="group-[&.scrolled]/landing:dark:bg-muted-950/95 group-[&.scrolled]/landing:border-muted-200 group-[&.scrolled]/landing:dark:border-muted-700 group-[&.scrolled]/landing:motion-safe:shadow-muted-300/30 group-[&.scrolled]/landing:motion-safe:dark:shadow-muted-800/20 flex items-center justify-between rounded-2xl border p-4 group-[&:not(.scrolled)]/landing:border-transparent group-[&.scrolled]/landing:bg-white/95 motion-safe:transition-all motion-safe:duration-200 group-[&.scrolled]/landing:motion-safe:shadow-xl"
      >
        <div class="flex w-1/2 items-center gap-2 md:w-1/5">
          <NuxtImg src="/img/logo_5.png" width="70" height="70" />
        </div>
        <div
          class="hidden ltablet:static ltablet:w-auto ltablet:flex ltablet:flex-row dark:bg-muted-950 ltablet:!bg-transparent ltablet:mx-0 fixed inset-x-0 top-20 mx-auto w-[calc(100%_-_2rem)] items-center justify-center bg-white lg:static lg:mx-0 lg:flex lg:w-auto lg:flex-row lg:!bg-transparent"
        >
          <ULink
            to="/resource-data"
            active-class="text-primary"
            class="inline-flex items-center justify-center px-6"
            >Resource Data</ULink
          >
          <ULink
            to="/resource-statistics"
            active-class="text-primary"
            class="inline-flex items-center justify-center px-6"
            >Resource Statistics</ULink
          >
          <ULink
            to="/"
            active-class="text-primary"
            class="inline-flex ring-1 ring-primary-400 bg-primary-700 rounded-md p-2 items-center justify-center px-6"
            >View Map</ULink
          >
        </div>
        <div class="flex w-1/2 items-center justify-end gap-4 md:w-1/5">
          <UButton icon="i-heroicons-square-2x2" />
          <label class="theme-toggle"></label>
          <UButton
            class="ltablet:hidden flex items-center justify-center lg:hidden"
          ></UButton>
        </div>
      </div>
    </div>
    <div class="stat-bg overflow-y-auto p-4 pt-32">
      <slot />
    </div>
  </div>
</template>
