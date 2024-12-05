<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// const setIsMobileSidebarOpen = (value: boolean) => {
//   isMobileSidebarOpen.value = value
// }

// watch(() => window?.innerWidth > 991, () => {
//   if (isMobileSidebarOpen.value === true) {
//     setIsMobileSidebarOpen(false)
//   }
// })

interface Props {
  selectedFilter: string;
  selectedResource: string | number;
  selectedResourceCategory: number | null;
  resources: any;
}

const items = [
  [
    {
      label: "Resource Dashboard",
      icon: "i-heroicons-home-20-solid",
      to: "/dashboard",
    },
    {
      label: "Resource Data",
      icon: "i-heroicons-table-cells-20-solid",
      to: "/resource-data",
    },
    {
      label: "Resource Analytics",
      icon: "i-heroicons-chart-bar-20-solid",
      to: "/resource-statistics",
    },
  ],
];

const props = defineProps<Props>();
const emit = defineEmits([
  "updateFilter",
  "updateResource",
  "categoryChange",
  "update:category",
  "loadResource",
  "clickOutside",
]);

const selectedFilter = ref(props.selectedFilter);
const selectedResource = ref(props.selectedResource);
const selectedResourceCategory = ref(props.selectedResourceCategory);
const availableResources = ref(props.resources);

const backgroundClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "bg-uiearth-950";
    case 2:
      return "bg-uimuted-950";
    case 3:
      return "bg-uigreen-950";
    default:
      return "bg-uimuted-950";
  }
});

console.log("res-cat", selectedResourceCategory.value);

const dropdownButtonClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "border-uigreen-600 bg-uigreen-600 dark:bg-uigreen-600 hover:ring-uigreen-200 dark:hover:ring-uiearth-700 dark:border-uiearth-700 dark:ring-offset-uiearth-900";
    case 2:
      return "bg-uimuted-600 dark:bg-uimuted-600";
    case 3:
      return "border-uiearth-600 bg-uiearth-600 dark:bg-uiearth-600 hover:ring-uiearth-200 dark:hover:ring-uiearth-700 dark:border-uigreen-700 dark:ring-offset-uigreen-900";
    default:
      return "bg-uimuted-600 dark:bg-uimuted-600";
  }
});

const headerTextClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "text-uiearth-200";
    case 2:
      return "text-uimuted-200";
    case 3:
      return "text-uigreen-200";
    default:
      return "text-uimuted-200";
  }
});

const cardClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "ring-uigreen-400 bg-uiearth-800 dark:bg-uiearth-600 dark:ring-uigreen-500";
    case 2:
      return "ring-uimuted-400 bg-uimuted-600 dark:bg-uimuted-600";
    case 3:
      return "ring-uiearth-400 bg-uigreen-800 dark:bg-uigreen-600 dark:ring-uiearth-500";
    default:
      return "ring-uimuted-400 bg-uimuted-600 dark:bg-uimuted-600";
  }
});

const cardTextClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "text-uiearth-200";
    case 2:
      return "text-uimuted-200";
    case 3:
      return "text-uigreen-200";
    default:
      return "text-uimuted-200";
  }
});

const customOptions = computed(() => {
  return [{ id: "", name: "All Resources" }, ...availableResources.value];
});

watch(selectedResourceCategory, (newCategory) => {
  emit("categoryChange");
  emit("update:category", newCategory)
});

watch(selectedFilter, (newFilter) => {
  emit("updateFilter", newFilter);
  console.log("new", newFilter);
});

watch(
  () => props.resources,
  (newResources) => {
    availableResources.value = newResources
  }
)

watch(selectedResource, (newResource) => {
  emit("updateResource", newResource);
});
</script>

<template>
  <div class="fixed inset-0 flex z-50">
    <div
      class="fixed inset-0 transition-opacity bg-gray-200/75 dark:bg-gray-800/75"
    />
    <div class="flex">
      <div
        :class="backgroundClass"
        class="relative flex-1 flex flex-col w-full focus:outline-none w-screen max-w-[300px] h-full"
      >
        <div
          class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 lg:w-[300px] flex-shrink-0 flex"
        >
          <div
            class="h-[4rem] flex-shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent py-2"
          >
            <NuxtImg src="/img/rmrdc.png" width="70" height="70" />
            <div class="flex items-center gap-2">
              <ColorScheme
                ><USelect
                  v-model="$colorMode.preference"
                  :options="['system', 'light', 'dark']"
              /></ColorScheme>
              <div
                class="group inline-flex items-center justify-center text-right"
              >
                <div class="relative size-9 text-left" />
              </div>
              <UDropdown :items="items">
                <UButton
                  :class="dropdownButtonClass"
                  class="block flex size-9 items-center justify-center rounded-full border ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
                  icon="i-heroicons-squares-2x2"
                />
              </UDropdown>
            </div>
          </div>
          <div class="p-4 flex-1 flex flex-col overflow-y-auto">
            <p
              :class="headerTextClass"
              class="font-medium text-lg flex items-center mb-3"
            >
              <UIcon name="i-heroicons-funnel" class="" />
              <span class="pl-2">Filters</span>
            </p>
            <div
              class="ptablet:flex-none ptablet:grid ptablet:grid-cols-2 ptablet:pb-10 flex flex-col gap-4"
            >
              <UCard :class="cardClass">
                <div class="relative">
                  <div class="relative">
                    <div class="mb-3 flex items-center text-uiearth-200">
                      <UIcon name="i-heroicons-adjustments-vertical" />
                      <p :class="cardTextClass" class="pl-2">Map Filter</p>
                    </div>
                    <div class="">
                      <UFormGroup>
                        <USelectMenu
                          v-model="selectedFilter"
                          :options="[
                            { label: 'State', value: 'state' },
                            { label: 'LGA', value: 'lga' },
                          ]"
                          option-attribute="label"
                          value-attribute="value"
                          placeholder="-- Select --"
                        />
                      </UFormGroup>
                    </div>
                  </div>
                </div>
              </UCard>
              <UCard :class="cardClass">
                <div class="relative">
                  <div class="relative">
                    <div class="mb-3 flex items-center text-uiearth-200">
                      <UIcon name="i-heroicons-adjustments-vertical" />
                      <p :class="cardTextClass" class="pl-2">
                        Resource Category
                      </p>
                    </div>
                    <div class="">
                      <UFormGroup>
                        <USelectMenu
                          v-model="selectedResourceCategory"
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
                      </UFormGroup>
                    </div>
                  </div>
                </div>
              </UCard>
              <UCard v-if="selectedResourceCategory" :class="cardClass">
                <div class="relative">
                  <div class="relative">
                    <div class="mb-3 flex items-center text-uiearth-200">
                      <UIcon name="i-heroicons-adjustments-vertical" />
                      <p :class="cardTextClass" class="pl-2">Resource Filter</p>
                    </div>
                    <div class="">
                      <UFormGroup>
                        <USelectMenu
                          v-model="selectedResource"
                          :options="customOptions"
                          searchable
                          option-attribute="name"
                          value-attribute="id"
                          placeholder="-- Select --"
                        />
                      </UFormGroup>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
      <UButton
        :class="backgroundClass"
        class="absolute left-[310px] top-2 text-white rounded-full z-50 shadow-lg"
        icon="i-heroicons-x-mark"
        @click="$emit('clickOutside')"
      />
    </div>
  </div>
</template>
