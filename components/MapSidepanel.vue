<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const { isMobileSidebarOpen } = useDashboard()

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
  customOptions: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['updateFilter', 'updateResource']);

const selectedFilter = ref(props.selectedFilter);
const selectedResource = ref(props.selectedResource);

watch(selectedFilter, (newFilter) => {
  emit('updateFilter', newFilter);
  console.log('new', newFilter)
});

watch(selectedResource, (newResource) => {
  emit('updateResource', newResource);
});
</script>

<template>
  <USlideover v-model="isMobileSidebarOpen" side="left" :ui="{ width: 'w-screen max-w-[300px]' }">
    <div
      class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 lg:w-[300px] flex-shrink-0 lg:flex"
    >
      <div
        class="h-[4rem] flex-shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent"
      >
        <p class="" />
        <div class="flex items-center gap-2">
          <ColorScheme
            ><USelect
              v-model="$colorMode.preference"
              :options="['system', 'light', 'dark']"
          /></ColorScheme>
          <div class="group inline-flex items-center justify-center text-right">
            <div class="relative size-9 text-left" />
          </div>
          <UButton
            class="border-uimuted-200 block lg:hidden hover:ring-uimuted-200 dark:hover:ring-uimuted-700 dark:border-uimuted-700 dark:bg-uimuted-800 dark:ring-offset-uimuted-900 flex size-9 items-center justify-center rounded-full border ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
            icon="i-heroicons-squares-2x2"
          />
        </div>
      </div>
      <div class="p-4 flex-1 flex flex-col overflow-y-auto">
        <p class="font-medium text-lg flex items-center mb-3">
          <UIcon name="i-heroicons-funnel" class="" />
          <span class="pl-2">Filters</span>
        </p>
        <div
          class="ptablet:flex-none ptablet:grid ptablet:grid-cols-2 ptablet:pb-10 flex flex-col gap-4"
        >
          <UCard class="ring-1 ring-primary-400 dark:ring-primary-500">
            <div class="relative">
              <div class="relative">
                <div class="mb-3 flex items-center">
                  <UIcon name="i-heroicons-adjustments-vertical" />
                  <p class="pl-2">Map Filter</p>
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
          <UCard class="ring-1 ring-primary-400 dark:ring-primary-500">
            <div class="relative">
              <div class="relative">
                <div class="mb-3 flex items-center">
                  <UIcon name="i-heroicons-adjustments-vertical" />
                  <p class="pl-2">Resource Filter</p>
                </div>
                <div class="">
                  <UFormGroup>
                    <USelectMenu
                      v-model="selectedResource"
                      :options="customOptions.value"
                      option-attribute="name"
                      value-attribute="id"
                      placeholder="-- Select --"
                    />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </UCard>
          <UCard />
        </div>
      </div>
    </div>
  </USlideover>
</template>
