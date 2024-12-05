<script setup>
import { useApi } from "#imports";
definePageMeta({
  layout: "main-layout",
});

const loading = ref(true);
const energyCount = ref(11)
const solidMineralCount = ref(157)
const agricCount = ref(120)
const strategics = ref([])
const criticals = ref([])
const groupings = ref([])
const selectedGrouping = ref({})
const detailModal = ref(false);
const openDetailModal = (data) => {
  detailModal.value = true
  selectedGrouping.value = data
}
const closeDetailModal = () => {
  detailModal.value = false
}

const dispatchFetchSummaryData = async () => {
  loading.value = true;
  try {
    const data = await useApi.get(`/analytics/get-summary-data`);
    console.log('summary-data', data);
    if (data) {
      energyCount.value = data.energyCount
      solidMineralCount.value = data.solidCount
      agricCount.value = data.agricCount
      strategics.value = data.strategics
      criticals.value = data.criticals
      groupings.value = data.groupings
      loading.value = false
    }
  } catch (error) {
    console.log('summary-data-error', error);
    loading.value = false;
    useToast().add({
      title: 'Error',
      description: 'Failed to Fetch Summary Data. Please try again',
      color: 'red',
    })
    throw error;
  }
}

onMounted(async () => {
  await dispatchFetchSummaryData()
})
</script>

<template>
  <div class="mx-auto w-full">
    <main class="pt-20 min-h-[calc(100vh_-_64px)]">
      <div v-if="!loading" class="grid grid-cols-12 gap-4">
        <div class="ltablet:col-span-9 col-span-12 lg:col-span-9">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-4">
              <div
                class="dark:bg-uiearth-800 border border-uiearth-200 dark:border-uiearth-700 p-4 rounded-lg"
              >
                <div class="flex items-center justify-between mb-1">
                  <h5
                    class="text-sm font-medium text-uigreen-500 dark:text-uigreen-400"
                  >
                    Energy
                  </h5>
                  <div
                    class="bg-yellow-100 text-yellow-500 rounded-full w-[2rem] h-[2rem] inline-flex items-center justify-center relative dark:border-2 dark:border-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      class="icon size-6 text-yellow-400"
                      style=""
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-v-b4402e20=""
                    >
                      <g fill="currentColor">
                        <path
                          d="m96 240l16-80l-64-24L160 16l-16 80l64 24Z"
                          opacity=".2"
                        />
                        <path
                          d="M215.79 118.17a8 8 0 0 0-5-5.66L153.18 90.9l14.66-73.33a8 8 0 0 0-13.69-7l-112 120a8 8 0 0 0 3 13l57.63 21.61l-14.62 73.25a8 8 0 0 0 13.69 7l112-120a8 8 0 0 0 1.94-7.26M109.37 214l10.47-52.38a8 8 0 0 0-5-9.06L62 132.71l84.62-90.66l-10.46 52.38a8 8 0 0 0 5 9.06l52.8 19.8Z"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                <div class="mb-2">
                  <h4
                    class="font-bold text-3xl text-uimuted-800 dark:text-white"
                  >
                    {{ energyCount }}
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-4">
              <div
                class="dark:bg-uiearth-800 border border-uiearth-200 dark:border-uiearth-700 p-4 rounded-lg"
              >
                <div class="flex items-center justify-between mb-1">
                  <h5
                    class="text-sm font-medium text-uigreen-500 dark:text-uigreen-400"
                  >
                    Solid Minerals
                  </h5>
                  <div
                    class="bg-yellow-100 text-yellow-500 rounded-full w-[2rem] h-[2rem] inline-flex items-center justify-center relative dark:border-2 dark:border-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      class="icon size-6 text-lime-500"
                      style=""
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-v-b4402e20=""
                    >
                      <g fill="currentColor">
                        <path
                          d="M240 104L128 224L80 104l48-64h56Z"
                          opacity=".2"
                        />
                        <path
                          d="m246 98.73l-56-64a8 8 0 0 0-6-2.73H72a8 8 0 0 0-6 2.73l-56 64a8 8 0 0 0 .17 10.73l112 120a8 8 0 0 0 11.7 0l112-120a8 8 0 0 0 .13-10.73M222.37 96H180l-36-48h36.37ZM74.58 112l30.13 75.33L34.41 112Zm89.6 0L128 202.46L91.82 112ZM96 96l32-42.67L160 96Zm85.42 16h40.17l-70.3 75.33ZM75.63 48H112L76 96H33.63Z"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                <div class="mb-2">
                  <h4
                    class="font-bold text-3xl text-uimuted-800 dark:text-white"
                  >
                    {{ solidMineralCount }}
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-4">
              <div
                class="dark:bg-uiearth-800 border border-uiearth-200 dark:border-uiearth-700 p-4 rounded-lg"
              >
                <div class="flex items-center justify-between mb-1">
                  <h5
                    class="text-sm font-medium text-uigreen-500 dark:text-uigreen-400"
                  >
                    Agricultural Resources
                  </h5>
                  <div
                    class="bg-yellow-100 text-yellow-500 rounded-full w-[2rem] h-[2rem] inline-flex items-center justify-center relative dark:border-2 dark:border-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      class="icon text-success-500 size-6"
                      style=""
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-v-b4402e20=""
                    >
                      <g fill="currentColor">
                        <path
                          d="M63.81 192.19c-47.89-79.81 16-159.62 151.64-151.64c7.98 135.68-71.83 199.53-151.64 151.64"
                          opacity=".2"
                        />
                        <path
                          d="M223.45 40.07a8 8 0 0 0-7.52-7.52C139.8 28.08 78.82 51 52.82 94a87.1 87.1 0 0 0-12.76 49c.57 15.92 5.21 32 13.79 47.85l-19.51 19.5a8 8 0 0 0 11.32 11.32l19.5-19.51C81 210.73 97.09 215.37 113 215.94q1.67.06 3.33.06A86.93 86.93 0 0 0 162 203.18c43-26 65.93-86.97 61.45-163.11m-69.7 149.43c-22.75 13.78-49.68 14-76.71.77l88.63-88.62a8 8 0 0 0-11.32-11.32L65.73 179c-13.19-27-13-54 .77-76.71c22.09-36.47 74.6-56.44 141.31-54.06c2.39 66.66-17.59 119.18-54.06 141.27"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                <div class="mb-2">
                  <h4
                    class="font-bold text-3xl text-uimuted-800 dark:text-white"
                  >
                    {{ agricCount }}
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="dark:bg-uigreen-600 border border-uiearth-200 dark:border-uiearth-700 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-md font-semibold text-uimuted-800 dark:text-white">
                    Strategic Minerals
                  </h3>
                </div>
                <div class="mb-2 space-y-5 max-h-80 overflow-y-auto">
                  <div v-for="(item, i) in strategics" :key="i" class="flex items-center gap-2">
                    <div class="w-[1.5rem] h-[1.5rem] rounded-full shadow-xl border-2 border-uiearth-400" :style="`background-color: ${item.colorCode}`" />
                    <div>
                      <NuxtLink :to="`/resource-data/${item.id}?resource=${item.name}`" class="text-sm font-medium text-uimuted-800 dark:text-white hover:text-uigreen-400 dark:hover:text-uigreen-400">
                        {{ item.name }}
                      </NuxtLink>
                    </div>
                    <div class="ms-auto flex items-center gap-1">
                      <UPopover mode="hover" :ui="{base: 'w-[20rem] bg-uicream-100 dark:bg-uicream-50 text-uigreen-400 dark:text-uigreen-400'}">
                        <UButton icon="i-heroicons-question-mark-circle" variant="ghost" />
                        <template #panel>
                          <div class="p-4">
                            <p class="text-xs mb-2">{{ item.name }} can be found in the following states:</p>
                            <div class="w-full flex flex-wrap items-center gap-2">
                              <span v-for="state in item.states" :key="state.id" class="text-sm text-medium">{{ state }},</span>
                            </div>
                          </div>
                        </template>
                      </UPopover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="dark:bg-uigreen-600 border border-uiearth-200 dark:border-uiearth-700 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-md font-semibold text-uimuted-800 dark:text-white">
                    Critical Minerals
                  </h3>
                </div>
                <div class="mb-2 space-y-5 max-h-80 overflow-y-auto">
                  <div v-for="(item, i) in criticals" :key="i" class="flex items-center gap-2">
                    <div class="w-[1.5rem] h-[1.5rem] rounded-full shadow-xl border-2 border-uiearth-400" :style="`background-color: ${item.colorCode}`" />
                    <div>
                      <NuxtLink :to="`/resource-data/${item.id}?resource=${item.name}`" class="text-sm font-medium text-uimuted-800 dark:text-white hover:text-uigreen-400 dark:hover:text-uigreen-400">
                        {{ item.name }}
                      </NuxtLink>
                    </div>
                    <div class="ms-auto flex items-center gap-1">
                      <UPopover mode="hover" :ui="{base: 'w-[20rem] bg-uicream-100 dark:bg-uicream-50 text-uigreen-400 dark:text-uigreen-400'}">
                        <UButton icon="i-heroicons-question-mark-circle" variant="ghost" />
                        <template #panel>
                          <div class="p-4">
                            <p class="text-xs mb-2">{{ item.name }} can be found in the following states:</p>
                            <div class="w-full flex flex-wrap items-center gap-2">
                              <span v-for="state in item.states" :key="state" class="text-sm text-medium">{{ state }},</span>
                            </div>
                          </div>
                        </template>
                      </UPopover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ltablet:col-span-3 col-span-12 lg:col-span-3">
          <div class="col-span-12 md:col-span-6">
              <div class="dark:bg-uigreen-600 border border-uiearth-200 dark:border-uiearth-700 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-md font-semibold text-uimuted-800 dark:text-white">
                    Resource Categories
                  </h3>
                </div>
                <ul class="mb-2 space-y-3">
                  <li v-for="item in groupings" :key="item.id">
                    <a class="flex items-center justify-between cursor-pointer" @click="openDetailModal(item)">
                      <p class="text-sm">{{ item.name }}</p>
                      <div class="bg-uiearth-200 dark:bg-uiearth-700 text-uiearth-500 dark:text-uiearth-200 flex size-7 items-center justify-center rounded-full text-xs">
                        {{ item.resources.length }}
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-full w-full">
        <div class="h-full">
          <div
            class="w-8 h-8 border-4 border-uigreen-500 border-t-transparent border-solid rounded-full animate-spin"
          />
        </div>
      </div>
    </main>
    <div class="dialogs">
      <UModal v-model="detailModal" prevent-close>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-bold">{{ selectedGrouping.name }}</h4>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeDetailModal" />
            </div>
          </template>
          <div>
            <p class="text-sm font-medium">
              The following materials are classified under {{ selectedGrouping.name }}:
            </p>
            <div class="w-full grid grid-cols-12 gap-2 mt-4 max-h-80 overflow-y-auto pb-4">
              <div v-for="item in selectedGrouping.resources" :key="item.id" class="col-span-12 sm:col-span-6 lg:col-span-3">
                <NuxtLink :to="`/resource-data/${item.id}?resource=${item.name}`" class="w-full flex items-center gap-2 border border-uigreen-800 p-2 rounded-lg">
                  <span class="w-1 h-1 bg-uigreen-800 rounded-full" />
                  <span class="text-xs truncate">{{ item.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>
