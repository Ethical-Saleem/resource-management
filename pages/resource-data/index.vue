<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";
import { useApiClient, unwrap } from "~/composables/useApiClient";
import type { Resource } from "~/types";

const loadingStore = useLoadingStore();
const router = useRouter();
const route = useRoute();

definePageMeta({ layout: false, title: "Resource Data" });

useHead({
  title: "Resource Data",
  meta: [
    {
      name: "description",
      content:
        "Data Table showing the varoius resources and their distribution across the country (Nigeria)",
    },
    { property: "og:title", content: `RMRDC - Resource Exploration | ${route.meta.title}` },
  ],
});

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "colorCode", label: "Pointer Color", sortable: true },
  { key: "actions", label: "" },
];

const CATEGORY_CHIPS = [
  { id: null, name: "All", dot: "" },
  { id: 1, name: "Solid Minerals", dot: "#64748B" },
  { id: 2, name: "Energy", dot: "#FC8813" },
  { id: 3, name: "Agriculture", dot: "#0ABF98" },
];

// Category pill colours, keyed by categoryId.
const PILL_CLASS: Record<number, string> = {
  1: "bg-uimuted-200 text-uimuted-700",
  2: "bg-[#FFF1D4] text-[#9C4010]",
  3: "bg-[#D0FBEA] text-[#036252]",
};

const q = ref("");
const currentView = ref(1);
const fetching = ref(false);
const selectedCategoryId = ref<number | null>(null);
const rowData = ref([] as Resource[]);
const page = ref(1);
const pageCount = ref(10);

const selectedColumns = ref(columns);
const tableColumns = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column)),
);

const filteredData = computed(() => {
  let filtered = rowData.value;

  if (selectedCategoryId.value) {
    filtered = filtered.filter((item) =>
      item.categories.some((cat) => cat.categoryId === selectedCategoryId.value),
    );
  }
  if (q.value) {
    const needle = q.value.toLowerCase();
    filtered = filtered.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(needle)),
    );
  }
  return filtered;
});

const pageTotal = computed(() => filteredData.value.length);
const pageFrom = computed(() => (pageTotal.value ? (page.value - 1) * pageCount.value + 1 : 0));
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value));
const paginatedFilteredData = computed(() => {
  const start = (page.value - 1) * pageCount.value;
  return filteredData.value.slice(start, start + pageCount.value);
});

// A new filter or page size can leave the current page past the end.
watch([q, selectedCategoryId, pageCount], () => {
  page.value = 1;
});

const resetFilters = () => {
  q.value = "";
  selectedCategoryId.value = null;
};

const openResource = (row: Resource) =>
  router.push(`/resource-data/${row.id}?resource=${row.name}`);

const fetchData = async () => {
  fetching.value = true;
  loadingStore.showLoading();
  try {
    const api = useApiClient();
    rowData.value = unwrap<Resource[]>(await api.GET("/resource/fetch-resources-data", {}));
  } catch (error) {
    console.log(error);
  } finally {
    fetching.value = false;
    loadingStore.hideLoading();
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="flex min-h-screen flex-col bg-uimuted-50">
    <AppHeader active="resource-data" />

    <main class="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 px-4 py-6 md:px-8 md:py-7">
      <!-- Title row -->
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-uimuted-950">Resources Bank</h1>
          <p class="mt-0.5 text-[13px] text-uimuted-500">
            {{ rowData.length }} resources · search, filter and open any material's locations
          </p>
        </div>
        <div class="flex items-center gap-2.5">
          <UButton
            variant="ghost"
            color="gray"
            icon="i-heroicons-arrow-path-20-solid"
            :loading="fetching"
            aria-label="Refresh"
            @click="fetchData()"
          />
          <a
            class="flex items-center gap-1.5 rounded-[10px] border border-uimuted-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-uimuted-700 hover:bg-uimuted-50"
            href="https://drive.google.com/file/d/1susvOozh-nggovY6j08pXq6qDdIqeEMW/view?usp=sharing"
            target="_blank"
            rel="noopener"
          >
            <UIcon name="i-heroicons-document-text-20-solid" class="h-4 w-4 text-uimuted-500" />
            View report
          </a>
          <div class="flex gap-1 rounded-[10px] bg-uimuted-100 p-1">
            <button
              v-for="v in [{ id: 1, label: 'List' }, { id: 2, label: 'Grid' }]"
              :key="v.id"
              type="button"
              class="rounded-[7px] px-4 py-1.5 text-[12.5px] font-semibold"
              :class="currentView === v.id ? 'bg-uigreen-600 text-white' : 'text-uimuted-500'"
              @click="currentView = v.id"
            >
              {{ v.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- List view -->
      <div
        v-if="currentView === 1"
        class="flex flex-col overflow-hidden rounded-2xl border border-uimuted-200 bg-white"
      >
        <div class="flex flex-wrap items-center gap-3 border-b border-uimuted-100 px-5 py-4">
          <UInput
            v-model="q"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search resources…"
            class="w-full sm:w-72"
          />
          <div class="flex flex-wrap gap-2">
            <button
              v-for="chip in CATEGORY_CHIPS"
              :key="chip.name"
              type="button"
              class="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px]"
              :class="
                selectedCategoryId === chip.id
                  ? 'bg-uimuted-950 font-semibold text-white'
                  : 'border border-uimuted-200 font-medium text-uimuted-600 hover:bg-uimuted-50'
              "
              @click="selectedCategoryId = chip.id"
            >
              <span
                v-if="chip.dot"
                class="h-2 w-2 rounded-full"
                :style="{ background: chip.dot }"
              />
              {{ chip.name }}
            </button>
          </div>
          <div class="ml-auto flex items-center gap-2 text-[12.5px] text-uimuted-500">
            Rows
            <USelect v-model="pageCount" :options="[5, 10, 20, 30, 40]" size="xs" class="w-16" />
            <USelectMenu v-model="selectedColumns" :options="columns.slice(0, 3)" multiple>
              <UButton icon="i-heroicons-view-columns" color="gray" size="xs">Columns</UButton>
            </USelectMenu>
            <UButton
              icon="i-heroicons-funnel"
              color="gray"
              size="xs"
              :disabled="q === '' && selectedCategoryId === null"
              @click="resetFilters"
            >
              Reset
            </UButton>
          </div>
        </div>

        <UTable
          :rows="paginatedFilteredData"
          :columns="tableColumns"
          class="w-full"
          :ui="{
            wrapper: 'relative overflow-x-auto',
            divide: 'divide-y divide-uimuted-100',
            thead: 'bg-uimuted-50',
            tbody: 'divide-y divide-uimuted-100',
            th: {
              base: 'text-left rtl:text-right',
              padding: 'px-5 py-3',
              color: 'text-uimuted-500',
              font: 'text-[11px] font-bold uppercase tracking-wider',
            },
            td: {
              base: 'whitespace-nowrap',
              padding: 'px-5 py-3.5',
              color: 'text-uimuted-700',
              size: 'text-[13.5px]',
            },
          }"
        >
          <template #name-data="{ row }">
            <NuxtLink
              :to="`/resource-data/${row.id}?resource=${row.name}`"
              class="font-semibold text-uimuted-950 hover:text-uigreen-700"
            >
              {{ row.name }}
            </NuxtLink>
          </template>
          <template #category-data="{ row }">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="c in row.categories"
                :key="c.categoryId"
                class="rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold"
                :class="PILL_CLASS[c.categoryId] ?? 'bg-uimuted-200 text-uimuted-700'"
              >
                {{ c.category.name }}
              </span>
            </div>
          </template>
          <template #colorCode-data="{ row }">
            <div class="flex items-center gap-2 text-[12.5px] text-uimuted-600">
              <span
                class="h-4 w-4 rounded-[5px] border border-black/10"
                :style="{ background: row.colorCode }"
              />
              {{ row.colorCode?.toUpperCase() }}
            </div>
          </template>
          <template #actions-data="{ row }">
            <UButton
              variant="ghost"
              color="gray"
              icon="i-heroicons-chevron-right-20-solid"
              aria-label="View resource locations"
              @click="openResource(row)"
            />
          </template>
          <template #empty-state>
            <div class="py-10 text-center text-sm text-uimuted-500">No resources match your filters.</div>
          </template>
        </UTable>

        <div
          class="flex flex-wrap items-center justify-between gap-2 border-t border-uimuted-100 bg-uimuted-50 px-5 py-3.5"
        >
          <span class="text-[12.5px] text-uimuted-500">
            Showing <strong class="text-uimuted-800">{{ pageFrom }}</strong> to
            <strong class="text-uimuted-800">{{ pageTo }}</strong> of
            <strong class="text-uimuted-800">{{ pageTotal }}</strong> results
          </span>
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="pageTotal"
            :ui="{ wrapper: 'flex items-center gap-1' }"
            :active-button="{ variant: 'solid', color: 'uigreen' }"
          />
        </div>
      </div>

      <ResourceView v-else />
    </main>
  </div>
</template>
