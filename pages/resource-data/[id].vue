<script setup lang="ts">
import { useApi } from "#imports";
import type { LgaResource } from "~/types";

const route = useRoute();

const columns = [
  { key: "SampleId", label: "Sample ID", sortable: true },
  { key: "locationName", label: "Location Name", sortable: true },
  { key: "lga.state.name", label: "State", sortable: true },
  { key: "lga.name", label: "L.G.A", sortable: true },
  { key: "locationLgaWard", label: "LGA Ward", sortable: true },
  { key: "townVillage", label: "Town/Village", sortable: true },
  { key: "storageConditions", label: "Storage Condition", sortable: true },
  { key: "marketPrice", label: "Market Price", sortable: true },
  { key: "actions" },
];

const items = (row: { id: number }) => [
  [
    {
      label: "View Resource Locations",
      icon: "i-heroicons-eye-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
    },
  ],
];

const q = ref("");
const search = ref("");
const fetching = ref(true);
const rowData = ref([] as LgaResource[]);
const page = ref(1);
const pageCount = ref(10);
const pageTotal = ref(rowData.value.length);
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

const selectedColumns = ref(columns);
const tableColumns = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column))
);

const selectedStatus = ref([]);
const resetFilters = () => {
  search.value = "";
  selectedStatus.value = [];
};

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
  const resources: LgaResource[] = await useApi.get(
    `/resource/fetch-resource-locations/${route.params.id}`
  );
  console.log("resources", resources);

  rowData.value = resources;
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div>
    <NavHeader />
    <div class="stat-bg overflow-y-auto p-4 pt-32">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="">
            <h4 class="text-xl">Resource Locations</h4>
            <p class="text-lg">{{ route.query.resource }}</p>
          </div>
          <div class="flex">
            <UButton
              color="uiyellow"
              variant="ghost"
              icon="i-heroicons-arrow-path-20-solid"
              class="mr-3"
              :loading="fetching"
              @click="fetchData()"
            />
            <UButton
              color="uiyellow"
              variant="outline"
              label="More"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </div>
        </div>
      </template>

      <div class="flex items-center justify-between gap-3 px-4 py-3 mb-4">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search..."
        />
      </div>

      <div class="flex justify-between items-center w-full px-4 py-3 mb-4">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>

          <USelect
            v-model="pageCount"
            :options="[3, 5, 10, 20, 30, 40]"
            class="me-2 w-20"
            size="xs"
          />
        </div>

        <div class="flex gap-1.5 items-center">
          <USelectMenu v-model="selectedColumns" :options="columns" multiple>
            <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
              Columns
            </UButton>
          </USelectMenu>

          <UButton
            icon="i-heroicons-funnel"
            color="gray"
            size="xs"
            :disabled="q === '' && selectedStatus.length === 0"
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
          table: 'table-relative',
          tbody: 'divide-y divide-uicream-200 dark:divide-uicream-700',
          tr: {
            base: 'whitespace-nowrap',
            padding: 'px-4 py-4',
            color: 'text-gray-500 dark:text-gray-400',
            font: '',
            size: 'text-sm',
          },
          td: {
            base: 'whitespace-nowrap',
            padding: 'px-4 py-4',
            color: 'text-gray-500 dark:text-gray-400',
            font: '',
            size: 'text-sm',
          },
          default: { checkbox: { color: 'uiyellow', base: 'hidden md:block' } },
        }"
      >
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>

      <template #footer>
        <div class="flex flex-wrap items-center justify-between">
          <div>
            <span class="text-sm leading-5">
              Showing
              <span class="font-medium">{{ pageFrom }}</span>
              to
              <span class="font-medium">{{ pageTo }}</span>
              of
              <span class="font-medium">{{ pageTotal }}</span>
              results
            </span>
          </div>
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="filteredData.length"
            :ui="{
              wrapper: 'flex items-center gap-1',
              default: {
                activeButton: {
                  variant: 'outline',
                  color: 'uired',
                },
              },
            }"
          />
        </div>
      </template>
    </UCard>
  </div>
  </div>
</template>
