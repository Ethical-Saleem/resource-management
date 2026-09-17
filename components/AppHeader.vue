<script setup lang="ts">
defineProps<{
  active: "dashboard" | "map" | "resource-data" | "analytics";
}>();
</script>

<template>
  <header class="flex h-16 flex-shrink-0 items-center justify-between border-b border-uimuted-200 bg-white px-4 md:px-6">
    <div class="flex items-center gap-3">
      <div class="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] bg-uigreen-600">
        <UIcon name="i-heroicons-globe-alt" class="h-5 w-5 text-white" />
      </div>
      <div class="hidden flex-col leading-tight sm:flex">
        <span class="text-[15px] font-bold text-uimuted-900">NRMIS Resource Portal</span>
        <span class="text-[11px] font-medium text-uimuted-500">Raw Materials Research &amp; Development Council</span>
      </div>
    </div>

    <nav class="flex items-center gap-1 rounded-xl bg-uimuted-100 p-1">
      <NuxtLink
        to="/dashboard"
        class="rounded-lg px-3 py-2 text-[13px] font-medium"
        :class="active === 'dashboard' ? 'bg-white font-semibold text-uigreen-700 shadow-sm' : 'text-uimuted-600 hover:text-uimuted-900'"
      >
        Dashboard
      </NuxtLink>
      <NuxtLink
        to="/map-view"
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium"
        :class="active === 'map' ? 'bg-white font-semibold text-uigreen-700 shadow-sm' : 'text-uimuted-600 hover:text-uimuted-900'"
      >
        <UIcon name="i-heroicons-map" class="h-4 w-4" />
        <span class="hidden sm:inline">Map Explorer</span>
      </NuxtLink>
      <NuxtLink
        to="/resource-data"
        class="rounded-lg px-3 py-2 text-[13px] font-medium"
        :class="active === 'resource-data' ? 'bg-white font-semibold text-uigreen-700 shadow-sm' : 'text-uimuted-600 hover:text-uimuted-900'"
      >
        Resource Data
      </NuxtLink>
      <NuxtLink
        to="/resource-statistics"
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium"
        :class="active === 'analytics' ? 'bg-white font-semibold text-uigreen-700 shadow-sm' : 'text-uimuted-600 hover:text-uimuted-900'"
      >
        <UIcon v-if="active === 'analytics'" name="i-heroicons-chart-bar" class="h-4 w-4" />
        <span class="hidden sm:inline">Analytics</span>
      </NuxtLink>
    </nav>

    <div class="flex items-center gap-2.5">
      <div class="hidden h-9 w-9 rounded-[10px] bg-uimuted-100 sm:block" />
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-uiearth-100 text-xs font-bold text-uiearth-800">
        RM
      </div>
    </div>
  </header>
</template>
