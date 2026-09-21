<script setup lang="ts">
import { useLoadingStore } from "~/stores/loading-store";
import { useApiClient, unwrap } from "~/composables/useApiClient";
import type { LgaResource } from "~/types";

const loadingStore = useLoadingStore();
const route = useRoute();
const router = useRouter();

definePageMeta({ layout: false });

useHead({
  title: "Resource Data",
  meta: [
    {
      name: "description",
      content:
        "Data Table showing the varoius resources and their distribution across the country (Nigeria)",
    },
    {
      property: "og:title",
      content: `RMRDC - Resource Exploration | ${route.query.resource}`,
    },
  ],
});

const columns = [
  { key: "SampleId", label: "Sample ID", sortable: true },
  { key: "locationName", label: "Location Name", sortable: true },
  { key: "lga.state.name", label: "State", sortable: true },
  { key: "lga.name", label: "L.G.A", sortable: true },
  { key: "locationLgaWard", label: "LGA Ward", sortable: true },
  { key: "townVillage", label: "Town/Village", sortable: true },
  { key: "locationLong", label: "Longitude", sortable: false },
  { key: "locationLat", label: "Latitude", sortable: false },
  { key: "storageConditions", label: "Storage Condition", sortable: true },
  { key: "marketPrice", label: "Market Price", sortable: true },
  { key: "actions" },
];

const q = ref("");
const fetching = ref(false);
const rowData = ref([] as LgaResource[]);
const page = ref(1);
const pageCount = ref(10);
const pageTotal = computed(() => filteredData.value.length);
const pageFrom = computed(() => (pageTotal.value ? (page.value - 1) * pageCount.value + 1 : 0));
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

const selectedColumns = ref(columns);
const tableColumns = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column))
);

const resetFilters = () => {
  q.value = "";
};

// A new filter or page size can leave the current page past the end.
watch([q, pageCount], () => {
  page.value = 1;
});

const filteredData = computed(() => {
  if (!q.value) {
    return rowData.value;
  }

  return rowData.value.filter((item) => {
    return Object.values(item).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
const paginatedFilteredData = computed(() => {
  const start = (page.value - 1) * pageCount.value;
  const end = start + pageCount.value;
  return filteredData.value.slice(start, end);
});

const fetchData = async () => {
  fetching.value = true;
  loadingStore.showLoading();
  try {
    const api = useApiClient();
    const result = unwrap(
      await api.GET("/resource/fetch-resource-locations/{id}", {
        params: { path: { id: Number(route.params.id) } },
      }),
    );
    console.log("resources", result);

    rowData.value = result.data as LgaResource[];
  } catch (error) {
    console.log(error);
  } finally {
    fetching.value = false;
    loadingStore.hideLoading();
  }
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-uimuted-50">
    <AppHeader active="resource-data" />

    <main class="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 px-4 py-6 md:px-8 md:py-7">
      <!-- Title row -->
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-uimuted-200 bg-white text-uimuted-600 hover:bg-uimuted-50"
            aria-label="Back"
            @click="router.go(-1)"
          >
            <UIcon name="i-heroicons-arrow-left-20-solid" class="h-4 w-4" />
          </button>
          <div>
            <div class="text-[12px] font-semibold uppercase tracking-wider text-uimuted-500">
              Resource Locations
            </div>
            <h1 class="text-2xl font-extrabold tracking-tight text-uimuted-950">
              {{ route.query.resource }}
            </h1>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="rounded-full bg-uigreen-50 px-3 py-1 text-[12px] font-semibold text-uigreen-700">
            {{ rowData.length }} locations
          </span>
          <UButton
            variant="ghost"
            color="gray"
            icon="i-heroicons-arrow-path-20-solid"
            :loading="fetching"
            aria-label="Refresh"
            @click="fetchData()"
          />
        </div>
      </div>

      <div class="flex flex-col overflow-hidden rounded-2xl border border-uimuted-200 bg-white">
        <div class="flex flex-wrap items-center gap-3 border-b border-uimuted-100 px-5 py-4">
          <UInput
            v-model="q"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search locations…"
            class="w-full sm:w-72"
          />
          <div class="ml-auto flex items-center gap-2 text-[12.5px] text-uimuted-500">
            Rows
            <USelect
              v-model="pageCount"
              :options="[5, 10, 20, 30, 40]"
              size="xs"
              class="w-16"
            />
            <USelectMenu v-model="selectedColumns" :options="columns" multiple>
              <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
                Columns
              </UButton>
            </USelectMenu>
            <UButton
              icon="i-heroicons-funnel"
              color="gray"
              size="xs"
              :disabled="q === ''"
              @click="resetFilters"
            >
              Reset
            </UButton>
          </div>
        </div>

        <div>
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
            <template #SampleId-data="{ row }">
              <span>{{ row.SampleId ? row.SampleId : 'N/A' }}</span>
            </template>
            <template #locationName-data="{ row }">
              <span>{{ row.locationName ? row.locationName : 'N/A' }}</span>
            </template>
            <template #townVillage-data="{ row }">
              <span>{{ row.townVillage ? row.townVillage : 'N/A' }}</span>
            </template>
            <template #storageConditions-data="{ row }">
              <span>{{ row.storageConditions ? row.storageConditions : 'N/A' }}</span>
            </template>
            <template #marketPrice-data="{ row }">
              <span>{{ row.marketPrice ? row.marketPrice : 'N/A' }}</span>
            </template>
            <template #locationLong-data="{ row }">
              <span>{{ row.locationLong ? row.locationLong : 'N/A' }}</span>
            </template>
            <template #locationLat-data="{ row }">
              <span>{{ row.locationLat ? row.locationLat : 'N/A' }}</span>
            </template>
            <template #empty-state>
              <div class="py-10 text-center text-sm text-uimuted-500">No locations found.</div>
            </template>
          </UTable>
        </div>

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
    </main>
  </div>
</template>
