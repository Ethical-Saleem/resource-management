<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";

import type { Resource } from "~/types";

const loadingStore = useLoadingStore();

// const props = defineProps({
//   resources: {
//     type: Array,
//     default: () => [] as Resource[],
//   },
// });

const q = ref<string>("");
const currentCategory = ref<number>(3);
const resources = ref([] as Resource[]);

const cardBgClass = computed(() => {
  switch (currentCategory.value) {
    case 1:
      return "bg-uiearth-400";
    case 2:
      return "bg-uiyellow-100 ring-uigreen-800";
    case 3:
      return "bg-uigreen-400 ring-uiearth-800";
    default:
      return "bg-uimuted-400";
  }
});

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

const fetchData = async (categoryId: number) => {
  loadingStore.showLoading();
  currentCategory.value = categoryId;
  try {
    const res = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    console.log("resources", res);

    resources.value = res;
    console.log("resources-value", resources.value);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

onMounted(async () => {
  await fetchData(3);
});
</script>

<template>
  <div class="grid gap-4 ptablet:grid-cols-2 sm:grid-cols-4 py-8">
    <div class="relative">
      <UCard>
        <div class="flex flex-col gap-4">
          <UButton
            label="Solid Minerals"
            block
            :class="currentCategory === 1 ? 'bg-uiearth-700' : 'bg-uimuted-700'"
            class=""
            @click="fetchData(1)"
          />
          <UButton
            label="Energy Resource"
            block
            :class="
              currentCategory === 2 ? 'bg-uiyellow-500' : 'bg-uimuted-700'
            "
            class=""
            @click="fetchData(2)"
          />
          <UButton
            label="Agricultural Produce"
            block
            :class="currentCategory === 3 ? 'bg-uigreen-700' : 'bg-uimuted-700'"
            class=""
            @click="fetchData(3)"
          />
        </div>
      </UCard>
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
          <UCard :class="cardBgClass">
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
              <p class="text-xs font-normal">
                <span
                  v-for="(category, catIndex) in r.categories"
                  :key="catIndex"
                >
                  {{ category.category.name }}
                  <span v-if="catIndex < r.categories.length - 1"
                    >,
                  </span>
                </span>
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
