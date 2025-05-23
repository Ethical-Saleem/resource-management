<script setup lang="ts">
import { useApi } from "#imports";
import { useLoadingStore } from "~/stores/loading-store";
import type { Resource } from "~/types";

const loadingStore = useLoadingStore();
const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: "main-layout",
  title: "Resource Data",
});

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
  { key: "actions" },
];

const items = (row: Resource) => [
  [
    {
      label: "View Resource Locations",
      icon: "i-heroicons-eye-20-solid",
      click: () => router.push(`/resource-data/${row.id}?resource=${row.name}`),
    },
    // {
    //   label: "Upload Image",
    //   icon: "i-heroicons-document-duplicate-20-solid",
    //   click: () => openImageModal(row),
    // },
  ],
];

const q = ref("");
const search = ref("");
const currentView = ref(1);
const fetching = ref(false);
const loading = ref(false);
const selectedCategoryId = ref<number | null>(null);
const rowData = ref([] as Resource[]);
const newImage = ref<File | null>(null);
const selectedResource = ref<Resource | null>(null);
const imageModal = ref(false);
const page = ref(1);
const pageCount = ref(10);
const pageTotal = computed(() => filteredData.value.length);
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

const signFileUrl = ref<string | null>(null);
const signFileInput = ref<HTMLInputElement | null>(null);
const signFile = ref<File | null>(null);

const triggerSignFileInput = () => {
  signFileInput.value?.click();
};

const handleSignFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    newImage.value = file;
    signFile.value = file;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        signFileUrl.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removeSignFile = () => {
  newImage.value = null;
  signFileUrl.value = null;
  signFile.value = null;
  if (signFileInput.value) {
    signFileInput.value.value = ""; // Reset the file input
  }
};

const selectedColumns = ref(columns);
const tableColumns = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column))
);

const selectedStatus = ref([]);
const resetFilters = () => {
  search.value = "";
  selectedStatus.value = [];
};

// const openImageModal = (data: Resource) => {
//   imageModal.value = true;
//   selectedResource.value = data;
// };
const closeImageModal = () => {
  imageModal.value = false;
  selectedResource.value = null;
};

const filteredData = computed(() => {
  let filtered = rowData.value;

  if (selectedCategoryId.value) {
    filtered = filtered.filter((item) =>
      item.categories.some((cat) => cat.categoryId === selectedCategoryId.value)
    );
  }
  if (q.value) {
    filtered = filtered.filter((item) => {
      return Object.values(item).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  }

  return filtered;
});
const paginatedFilteredData = computed(() => {
  const start = (page.value - 1) * pageCount.value;
  const end = start + pageCount.value;
  return filteredData.value.slice(start, end);
});

const setCurrentView = (value: number) => {
  currentView.value = value;
};

const addImage = async () => {
  loading.value = true;
  try {
    if (newImage.value) {
      const data = new FormData();
      data.append("image", newImage.value);

      const res = await useApi.postForm(
        `/resource/add-resource-image/${selectedResource?.value?.id}`,
        data
      );
      if (res) {
        alert("Resource Image added successfully");
        closeImageModal();
        // await fetchData()
        removeSignFile();
      }
    } else {
      alert("No image selected");
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const fetchData = async () => {
  loadingStore.showLoading();
  try {
    const resources: Resource[] = await useApi.get(
      "/resource/fetch-resources-data"
    );
    console.log("resources", resources);

    rowData.value = resources;
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="mx-auto w-full">
    <main class="pt-20">
      <div class="">
        <UCard class="mb-2 dark:bg-uigreen-600 ring-1 ring-uiearth-200 dark:border-uiearth-700 rounded-lg">
          <div class="">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="w-full">
                <h4 class="text-lg lg:text-xl text-left">Resources Bank</h4>
              </div>
              <div class="flex flex-row items-center justify-end w-full">
                <UButton
                  color="uiyellow"
                  variant="ghost"
                  icon="i-heroicons-arrow-path-20-solid"
                  class="mr-3"
                  :loading="fetching"
                  @click="fetchData()"
                />
                <a
                  class="flex sm:w-40 items-center p-2 mx-2 rounded-md ring-1 ring-uiearth-900 text-uiearth-900 text-sm"
                  href="https://drive.google.com/file/d/1susvOozh-nggovY6j08pXq6qDdIqeEMW/view?usp=sharing"
                  target="_blank"
                >
                  <UIcon name="i-heroicons-eye-20-solid" />
                  <span class="pl-1">View Report</span>
                </a>
                <div class=" sm:w-60">
                  <div
                    class="rounded-md relative flex items-center bg-white border border-uigreen-200 dark:bg-uigreen-800 w-full"
                  >
                    <UButton
                      :variant="currentView === 1 ? 'solid' : 'ghost'"
                      :class="
                        currentView === 1
                          ? 'text-white bg-uiearth-950 hover:bg-uigreen-900'
                          : 'text-uigreen-400'
                      "
                      class="nui-focus relative flex flex-1 cursor-pointer items-center justify-center font-sans text-sm transition-colors duration-300 rounded-md"
                      @click="setCurrentView(1)"
                    >
                      <UIcon name="i-heroicons-list-bullet" />
                      <span class="hidden sm:block">List View</span>
                    </UButton>
                    <UButton
                      :variant="currentView === 2 ? 'solid' : 'ghost'"
                      :class="
                        currentView === 2
                          ? 'text-white bg-uiearth-950 hover:bg-uigreen-900'
                          : 'text-uigreen-400'
                      "
                      class="nui-focus relative flex flex-1 cursor-pointer items-center justify-center font-sans text-sm transition-colors duration-300 rounded-md"
                      @click="setCurrentView(2)"
                    >
                      <UIcon name="i-heroicons-rectangle-group" />
                      <span class="hidden sm:block">Grid View</span></UButton
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
        <UCard
          v-if="currentView === 1"
          :ui="{
            base: 'mb-4 text-uigreen-400',
            divide: 'divide-y divide-uiearth-700 dark:divide-uiearth-800',
            ring: 'ring-1 ring-uiearth-200 dark:ring-uiearth-700',
            body: {
              base: 'text-uigreen-400 rounded-t-lg dark:bg-uicream-50',
              padding: 'p-3 sm:p-6',
            },
            footer: {
              base: 'bg-uigreen-100 dark:bg-uicream-100 rounded-b-lg',
              background: '',
              padding: 'px-2 pt-2 pb-2 sm:px-2',
            },
          }"
          class="bg-white ring-1 ring-uigreen-700"
        >

          <div
            class="flex flex-col sm:flex-row w-full items-center justify-between gap-3 px-4 py-3 mb-4"
          >
            <UInput
              v-model="q"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="Search..."
            />
            <USelectMenu
              v-model="selectedCategoryId"
              :options="[
                { id: 1, name: 'Solid Minerals' },
                { id: 2, name: 'Energy Resource' },
                { id: 3, name: 'Agricultural Produce' },
              ]"
              searchable
              option-attribute="name"
              value-attribute="id"
              placeholder="-- Select --"
            />
          </div>

          <div
            class="flex flex-col sm:flex-row justify-between items-center w-full px-4 py-3"
          >
            <div class="flex items-center gap-1.5 mb-2">
              <span class="text-xs sm:text-sm leading-5">Rows per page:</span>

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
              tbody: 'divide-y divide-uiearth-500 dark:divide-uiearth-700',
              tr: {
                base: 'whitespace-nowrap',
                padding: 'px-4 py-4',
                color: 'text-uigreen-500 dark:text-uigreen-400',
                font: '',
                size: 'text-sm',
              },
              th: {
                color: 'text-uigreen-900',
              },
              td: {
                base: 'whitespace-nowrap',
                padding: 'px-4 py-4',
                color: 'text-uigreen-500 dark:text-uigreen-400',
                font: '',
                size: 'text-sm',
              },
              default: {
                checkbox: { color: 'uiyellow', base: 'hidden md:block' },
              },
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
            <template #colorCode-data="{ row }">
              <div :class="`flex items-center`">
                <span class="p-2 border border-uiearth-600" :style="`background-color: ${row.colorCode}`" />
                <span class="pl-2">{{ row.colorCode.toUpperCase() }}</span>
              </div>
            </template>
            <template #category-data="{ row }">
              <div class="">
                <span
                  v-for="(category, catIndex) in row.categories"
                  :key="catIndex"
                >
                  {{ category.category.name }}
                  <span v-if="catIndex < row.categories.length - 1">, </span>
                </span>
              </div>
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
        <ResourceView v-if="currentView === 2" />
        <UModal v-model="imageModal">
          <UCard>
            <template #header>
              <h3 class="">Resource Image Upload</h3>
            </template>
            <div class="">
              <fieldset class="relative">
                <UFormGroup label="Resource Name" class="mb-5">
                  <UInput :value="selectedResource?.name" disabled />
                </UFormGroup>
                <UFormGroup label="Resource Image">
                  <div
                    class="flex flex-col relative items-center bg-uiblue-50 p-2 rounded-md ring-1 ring-uiyellow-700"
                  >
                    <div
                      v-if="!signFile"
                      class="flex flex-col items-center rounded-md p-4"
                    >
                      <UButton
                        color="uiblue"
                        variant="outline"
                        class="rounded-full"
                        icon="i-heroicons-camera"
                        @click="triggerSignFileInput"
                      />
                      <p class="text-sm mb-2 mt-1">
                        Upload a n image of the selected resource
                      </p>
                      <span class="text-xs"
                        >Only images ending with .jpg, .jpeg, and .png are
                        allowed</span
                      >
                    </div>
                    <div v-else class="flex items-center justify-center gap-2 p-1">
                      <img
                        v-if="signFileUrl"
                        :src="signFileUrl"
                        alt="preview"
                        class="w-20 h-20 object-cover rounded-md"
                      >
                      <div class="flex flex-col items-start">
                        <span class="text-sm font-medium">{{ signFile.name }}</span>
                        <span class="text-xs text-gray-500"
                          >{{ (signFile.size / 1024).toFixed(2) }} KB</span
                        >
                      </div>
                      <UButton
                        icon="i-heroicons-x-mark"
                        color="uiblue"
                        class="rounded-full"
                        variant="ghost"
                        @click="removeSignFile"
                      />
                    </div>
                    <input
                      ref="signFileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleSignFileChange"
                    >
                  </div>
                </UFormGroup>
              </fieldset>
            </div>
            <template #footer>
              <div class="flex flex-row justify-end">
                <UButton
                  label="Close"
                  variant="outline"
                  color="uimuted"
                  class=""
                  @click="closeImageModal"
                />
                <UButton
                  label="Upload"
                  variant="solid"
                  color="uiearth"
                  class="ml-3"
                  :loading="loading"
                  @click="addImage"
                />
              </div>
            </template>
          </UCard>
        </UModal>
      </div>
    </main>
  </div>
</template>
