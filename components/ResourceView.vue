<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
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

const viewButtonClass = computed(() => {
  switch (currentCategory.value) {
    case 1:
      return "uiearth";
    case 2:
      return "uiyellow";
    case 3:
      return "uigreen";
    default:
      return "uigreen";
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

// const convertBufferToBlobUrl = (buffer: any): string => {
//   const byteArray = new Uint8Array(buffer.data);
//   const blob = new Blob([byteArray], { type: "image/jpeg" });
//   return URL.createObjectURL(blob);
// };

const fetchData = async (page = 1, categoryId: number) => {
  loadingStore.showLoading();
  currentCategory.value = categoryId;
  try {
    const res = await useApi.get(
      `/resource/fetch-resources-data-by-filter?page=${page}&pageSize=${12}&categoryId=${categoryId}`
    );
    console.log("resources", res);

    // resources.value = res.data.map((resource: Resource) => {
    //   if (resource.image) {
    //     resource.imageUrl = convertBufferToBlobUrl(resource.image);
    //   }
    //   return resource;
    // });
    resources.value = res.data;
    totalPages.value = res.totalPages;
    currentPage.value = res.currentPage;
    totalCount.value = res.totalCount;
    console.log("resources-value", resources.value);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

onMounted(async () => {
  await fetchData(1, 3);
});
</script>

<template>
  <div
    class="grid gap-4 ptablet:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 py-8"
  >
    <div class="relative">
      <UCard class="bg-white dark:bg-uigreen-800 border border-uiearth-200">
        <div class="flex flex-col gap-4">
          <UButton
            label="Solid Minerals"
            block
            :class="currentCategory === 1 ? 'bg-uigreen-700 dark:bg-uigreen-800 text-white ring-1 ring-uigreen-200' : 'bg-transparent dark:bg-transparent text-uigreen-400'"
            class="hover:bg-uigreen-900 dark:hover:bg-uigreen-900 dark:text-white"
            @click="fetchData(1, 1)"
          />
          <UButton
            label="Energy Resource"
            block
            :class="
              currentCategory === 2 ? 'bg-uigreen-700 dark:bg-uigreen-800 text-white ring-1 ring-uigreen-200' : 'bg-transparent dark:bg-transparent text-uigreen-400'
            "
            class="hover:bg-uigreen-900 dark:hover:bg-uigreen-900 dark:text-white"
            @click="fetchData(1, 2)"
          />
          <UButton
            label="Agricultural Produce"
            block
            :class="currentCategory === 3 ? 'bg-uigreen-700 dark:bg-uigreen-800 text-white ring-1 ring-uigreen-200' : 'bg-transparent dark:bg-transparent text-uigreen-400'"
            class="hover:bg-uigreen-900 dark:hover:bg-uigreen-900 dark:text-white"
            @click="fetchData(1, 3)"
          />
        </div>
      </UCard>
    </div>
    <div class="relative sm:col-span-2 lg:col-span-3">
      <UCard class="mb-4 bg-white dark:bg-uigreen-300 border border-uiearth-200">
        <div
          class="flex items-center justify-between flex-col sm:flex-row gap-3"
        >
          <UInput
            v-model="q"
            color="uiearth"
            class="bg-uimuted-300 dark:bg-uimuted-800 text-uiearth-400 rounded-md"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search for resource"
          />
          <div class="flex items-center gap-4 mt-4 sm:mt-2">
            <UButton
              icon="i-heroicons-chevron-left"
              color="uiearth"
              class="!text-white"
              :disabled="currentPage === 1"
              @click="fetchData(currentPage - 1, currentCategory)"
            >
              Previous
            </UButton>
            <span class="text-md px-3"
              >Page <strong class="text-uigreen-500">{{ currentPage }}</strong> of <strong class="text-uigreen-500">{{ totalPages }}</strong></span
            >
            <UButton
              icon="i-heroicons-chevron-right"
              color="uiearth"
              trailing
              class="!text-white"
              :disabled="currentPage === totalPages"
              @click="fetchData(currentPage + 1, currentCategory)"
            >
              Next
            </UButton>
          </div>
        </div>
      </UCard>
      <div class="grid sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="(r, index) in filteredData" :key="index" class="col-span-2">
          <UCard class="dark:bg-uigreen-600 border border-uigreen-700 dark:border-uigreen-200 shadow-lg">
            <div class="relative rounded-lg">
              <NuxtImg
                :src="r.imageUrl"
                :alt="r.name"
                referrerpolicy="no-referrer"
                class="w-full h-[200px] object-cover rounded-lg"
              />
            </div>
            <div class="mt-3">
              <h3
                class="font-medium mb-1 text-uigreen-800 dark:text-white truncate"
              >
                {{ r.name }}
              </h3>
              <p class="text-xs font-normal text-uimuted-800">
                <span
                  v-for="(category, catIndex) in r.categories"
                  :key="catIndex"
                >
                  {{ category.category.name }}
                  <span v-if="catIndex < r.categories.length - 1">, </span>
                </span>
              </p>
            </div>
            <div class="mt-2">
              <UButton
                label="View"
                icon="i-heroicons-chevron-right"
                block
                trailing
                :to="`/resource-data/${r.id}/?resource=${r.name}`"
                :color="viewButtonClass"
              />
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
