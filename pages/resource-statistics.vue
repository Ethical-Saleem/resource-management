<script setup lang="ts">
definePageMeta({
  layout: "main-layout",
});

useHead({
  title: "Statistical Data",
  meta: [
    {
      name: "description",
      content:
        "Statistical data on the resource distribution in the 36 states in Nigeria",
    },
  ],
});

const selectedResourceCategory = ref<number | null>(null);
</script>

<template>
  <div class="mx-auto w-full">
    <main class="pt-20">
      <div class="">
        <UCard class="mb-2 bg-white dark:bg-uigreen-800 border border-uiearth-200">
          <div class="">
            <div class="flex items-center justify-between">
              <h4 class="text-lg lg:text-xl">Resource Stats</h4>
              <div class="flex items-center w-full sm:w-60">
                <UFormGroup label="Category" class="w-full">
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
        <div v-if="selectedResourceCategory" class="grid grid-cols-12 gap-3">
          <div class="col-span-12 md:col-span-6">
            <StateMetricsRadar :category-id="selectedResourceCategory" />
          </div>
          <div class="col-span-12 md:col-span-6">
            <ResourceLgaMetricsEChart :category-id="selectedResourceCategory" />
          </div>
          <div class="col-span-12 md:col-span-6">
            <ResourceMetricsChart :category-id="selectedResourceCategory" />
          </div>
          <div class="col-span-12 md:col-span-6">
            <StateResourceCompareRadar :category-id="selectedResourceCategory" />
          </div>
          <div class="col-span-12 md:col-span-6">
            <ResourceCompareState :category-id="selectedResourceCategory" />
          </div>
          <div class="col-span-12 md:col-span-6">
            <ResourceValueChainBar :category-id="selectedResourceCategory" />
          </div>
        </div>
        <div v-else class="mt-8">
          <div class="flex items-center justify-center">
            <div class="content mx-auto max-w-96 text-center">
              <h4 class="font-medium text-xl mb-4">Select Resource Category</h4>
              <p class="">
                Select a resource category to view statistics on the group
                metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.stat-bg {
  position: relative;
}
.stat-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      rgba(211, 133, 31, 0.5),
      rgba(118, 100, 24, 0.5)
    ),
    url("/img/map_bg.PNG");
  background-size: cover;
  background-position: center;
  opacity: 1; /* Adjust this value to control opacity */
  z-index: -1; /* Ensures the background is behind the content */
}
</style>
