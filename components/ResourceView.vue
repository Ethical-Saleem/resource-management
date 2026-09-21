<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";
import { useApiClient, unwrap } from "~/composables/useApiClient";

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
    const api = useApiClient();
    const res = unwrap(
      await api.GET("/resource/fetch-resources-data-by-filter", {
        params: { query: { page, pageSize: 12, categoryId } },
      }),
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
  <div class="grid gap-4 lg:grid-cols-[240px_1fr]">
    <aside class="h-fit rounded-2xl border border-uimuted-200 bg-white p-4">
      <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-uimuted-400">Category</div>
      <div class="flex flex-col gap-1">
        <button
          v-for="c in [
            { id: 1, label: 'Solid Minerals', dot: '#64748B' },
            { id: 2, label: 'Energy Resource', dot: '#FC8813' },
            { id: 3, label: 'Agricultural Produce', dot: '#0ABF98' },
          ]"
          :key="c.id"
          type="button"
          class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px]"
          :class="currentCategory === c.id ? 'bg-uigreen-600 font-semibold text-white' : 'text-uimuted-700 hover:bg-uimuted-50'"
          @click="fetchData(1, c.id)"
        >
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: c.dot }" />
          {{ c.label }}
        </button>
      </div>
    </aside>

    <div>
      <div class="mb-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-uimuted-200 bg-white p-4 sm:flex-row">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search for resource"
          class="w-full sm:w-72"
        />
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-chevron-left"
            color="gray"
            variant="soft"
            :disabled="currentPage === 1"
            @click="fetchData(currentPage - 1, currentCategory)"
          >
            Previous
          </UButton>
          <span class="text-[13px] text-uimuted-500">
            Page <strong class="text-uimuted-900">{{ currentPage }}</strong> of
            <strong class="text-uimuted-900">{{ totalPages }}</strong>
          </span>
          <UButton
            icon="i-heroicons-chevron-right"
            color="gray"
            variant="soft"
            trailing
            :disabled="currentPage === totalPages"
            @click="fetchData(currentPage + 1, currentCategory)"
          >
            Next
          </UButton>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="r in filteredData"
          :key="r.id"
          :to="`/resource-data/${r.id}/?resource=${r.name}`"
          class="group overflow-hidden rounded-2xl border border-uimuted-200 bg-white hover:border-uigreen-500"
        >
          <NuxtImg
            :src="r.imageUrl"
            :alt="r.name"
            referrerpolicy="no-referrer"
            class="h-[180px] w-full bg-[#EBEFE7] object-cover"
          />
          <div class="flex items-center justify-between gap-2 p-4">
            <div class="min-w-0">
              <h3 class="truncate text-[14px] font-semibold text-uimuted-950">{{ r.name }}</h3>
              <p class="truncate text-xs text-uimuted-500">
                {{ r.categories.map((c) => c.category.name).join(", ") }}
              </p>
            </div>
            <UIcon
              name="i-heroicons-chevron-right-20-solid"
              class="h-4 w-4 flex-shrink-0 text-uimuted-400 group-hover:text-uigreen-600"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
