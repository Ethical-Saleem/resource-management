<script setup lang="ts">
const sidebarOpen = useState("sidebarOpen", () => true);
const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>

<template>
  <div
    class="fixed start-0 top-0 z-[60] flex h-full xl:z-10 pointer-events-none"
  >
    <div
      :class="[
        'border-uigreen-200 dark:border-uigreen-700 bg-white dark:bg-uigreen-800 relative z-10 h-full border-r pointer-events-auto transition-all duration-300',
        sidebarOpen
          ? 'w-[250px]'
          : 'translate-x-[calc(-100%_-_80px)] rtl:translate-x-[calc(100%_+_80px)]',
      ]"
    >
      <div class="flex h-screen flex-col">
        <div class="flex h-24 w-full items-center px-6">
          <NuxtLink class="flex items-center justify-center">
            <NuxtImg src="/img/rmrdc.png" class="App Logo" />
          </NuxtLink>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1 text-3xl text-uigreen-400 hover:bg-uigreen-100 hover:text-uigreen-600 ms-auto flex size-10 items-center justify-center rounded-full transition-colors duration-300 xl:hidden" @click="closeSidebar" />
        </div>
        <div class="relative size-full overflow-y-auto">
          <div class="pb-8">
            <ul class="">
              <li class="group mb-1 min-h-8">
                <NuxtLink
                  to="/dashboard"
                  class="relative top-0.5 flex items-center hover:bg-uigreen-900 active:ring-uigreen-500 active:bg-uigreen-900 px-2 py-3"
                  active-class="bg-uigreen-900 ring-1 ring-uigreen-500"
                >
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-home-20-solid" class="w-6 h-6 text-uigreen-400" size="lg" />
                    <span
                      class="text-uigreen-400 group-hover:text-uigreen-500 relative inline-flex items-center gap-2 text-sm transition-colors duration-300"
                      >Resource Dashboard</span
                    >
                  </div>
                </NuxtLink>
              </li>
              <li class="group mb-1 min-h-8">
                <NuxtLink
                  to="/resource-data"
                  class="relative top-0.5 flex items-center hover:bg-uigreen-900 active:ring-uigreen-500 active:bg-uigreen-900 px-2 py-3"
                  active-class="bg-uigreen-900 ring-1 ring-uigreen-500"
                >
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-table-cells-20-solid" class="w-6 h-6 text-uigreen-400" />
                    <span
                      class="text-uigreen-400 group-hover:text-uigreen-500 relative inline-flex items-center gap-2 text-sm transition-colors duration-300"
                      >Resource Data</span
                    >
                  </div>
                </NuxtLink>
              </li>
              <li class="group mb-1 min-h-8">
                <NuxtLink
                  to="/resource-statistics"
                  class="relative flex items-center hover:bg-uigreen-900 px-2 py-3"
                  active-class="bg-uigreen-900 ring-1 ring-uigreen-500"
                >
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-chart-bar-20-solid" class="w-6 h-6 text-uigreen-400" />
                    <span
                      class="text-uigreen-400 group-hover:text-uigreen-500 relative inline-flex items-center gap-2 text-sm transition-colors duration-300"
                      >Resource Analytics</span
                    >
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div
            class="fixed bottom-0 z-10 h-10 w-[212px] bg-gradient-to-t from-white to-transparent dark:from-uigreen-800"
          />
        </div>
        <div class="mt-auto">
          <div class="flex w-full">
            <NuxtLink
              to="/map-view"
              class="relative flex items-center hover:bg-uigreen-900 px-2 py-3 w-full"
              active-class="bg-uigreen-900 ring-1 ring-uigreen-500"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-map-20-solid" class="w-6 h-6 text-uigreen-400" />
                <span
                  class="text-uigreen-400 group-hover:text-uigreen-500 relative inline-flex items-center gap-2 text-sm transition-colors duration-300"
                  >Map</span
                >
              </div>
            </NuxtLink>
          </div>
          <div class="flex w-full">
            <a
              href="#"
              class="hover:bg-uigreen-900 cursor-pointer px-2 py-3 text-uigreen-400 flex size-12 gap-2 items-center w-full transition-colors duration-300"
            >
              <UIcon name="i-heroicons-question-mark-circle" />
              <span>Help</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
