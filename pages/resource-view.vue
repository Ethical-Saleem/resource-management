<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";
import { useApi } from "~/composables/useApi";

import type { Resource } from "~/types";

const loadingStore = useLoadingStore();

const resources = ref<Resource[]>([]);
const q = ref<string>('');

const filteredData = computed(() => {
  if (!q.value) {
    return resources.value;
  }

  return resources.value.filter((item) => {
    return Object.values(item).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const fetchResources = async () => {
  loadingStore.showLoading();
  try {
    resources.value = await useApi.get("/resource/fetch-resources-data");
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

onMounted(async () => {
  await fetchResources();
});

definePageMeta({
  layout: "withheader",
});
</script>

<template>
  <div class="grid gap-4 ptablet:grid-cols-2 sm:grid-cols-4 py-8">
    <div class="relative">
      <div class="flex flex-col gap-4">
        <UButton label="" class="" />
      </div>
    </div>
    <div class="relative col-span-3">
      <div class="flex items-center justify-between gap-3 px-4 py-3 mb-4">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search for resource"
        />
      </div>
      <div class="sm:col-span-3 grid grid-cols-6 gap-4">
        <div v-for="(r, index) in filteredData" :key="index" class="col-span-2">
          <UCard>
            <div class="relative rounded-lg">
              <NuxtImg src="/img/map_bg_2.PNG" height="250" width="100%" />
            </div>
            <div class="mt-3">
              <h3
                class="font-medium mb-1"
                :style="{ color: r.colorCode ?? '#333333' }"
              >
                {{ r.name }}
              </h3>
              <p class="text-xs font-normal"></p>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
