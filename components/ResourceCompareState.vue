<script setup lang="ts">
import { Radar } from "vue-chartjs";
import { useAnalyticsStore } from "~/stores/analytics-store";
// import { useLoadingStore } from "~/stores/loading-store";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import type { Resource, State } from "~/types";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StateMetric {
  resourceName: string;
  colors: { state1: string; state2: string };
  metrics: Metric[];
}

type Metric = {
  metricName: string;
  state1: number;
  state2: number;
};

const analyticsStore = useAnalyticsStore();
// const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const resourceId = ref<number>(93);
const selectedStateId1 = ref<number>(1);
const selectedStateId2 = ref<number>(2);
const loading = ref(false);
const states = ref([] as State[]);
const resources = ref([] as Resource[]);
const stateMetrics = ref({} as StateMetric);

const chartData = computed(() => {
  const labels = stateMetrics.value.metrics?.map((metric) => metric.metricName);
  const datasets = [
    {
      label: "State 1",
      data: stateMetrics.value.metrics?.map((metric) => metric.state1),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: stateMetrics.value.colors?.state1,
      borderWidth: 2,
    },
    {
      label: "State 2",
      data: stateMetrics.value.metrics?.map((metric) => metric.state2),
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: stateMetrics.value.colors?.state2,
      borderWidth: 2,
    },
  ];

  return {
    labels,
    datasets,
  };
});

const fetchData = async () => {
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchResourceStatesCompareMetrics(
      resourceId.value,
      selectedStateId1.value,
      selectedStateId2.value
    );
    stateMetrics.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// const hexToRgba = (hex: string, alpha: number): string => {
//   const r = parseInt(hex.slice(1, 3), 16);
//   const g = parseInt(hex.slice(3, 5), 16);
//   const b = parseInt(hex.slice(5, 7), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    // await fetchData();
  }
);

const fetchResources = async (categoryId: number) => {
  // loadingStore.showLoading();
  try {
    const data = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    resources.value = data;
    resourceId.value = resources.value[0].id;
    if (resourceId.value) {
      await fetchResourceStates();
    }
  } catch (error) {
    console.log(error);
  } finally {
    // loadingStore.hideLoading();
  }
};

const fetchResourceStates = async () => {
  loading.value = true;
  try {
    if (resourceId.value) {
      const data = await analyticsStore.dispatchFetchResourceStates(
        resourceId.value
      );
      states.value = data;
      console.log("data", data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchResources(props.categoryId);
});
</script>

<template>
  <UCard
    :ui="{
      base: 'mb-4',
      divide: 'divide-y divide-uiearth-700 dark:divide-uiearth-800',
      ring: 'ring-1 ring-uiearth-200 dark:ring-uiearth-800',
      body: {
        padding: 'p-3 sm:p-6',
      },
      footer: {
        base: '',
        background: '',
        padding: 'px-2 pt-2 pb-2 sm:px-2',
      },
    }"
    class="bg-uigreen-50 ring-2 ring-uiearth-700"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h6 class="text-sm pr-1">State Level Metrics Comparison</h6>
          <UPopover mode="hover">
            <UButton label="?" variant="ghost" class="text-lg" />
            <template #panel>
              <div
                class="p-4 text-xs h-30 w-60 ring-2 ring-[#d292ff] overflow-y-auto"
              >
                This chart compares a resource across two different states it
                can be found, evaluating key metrics like market value, quality,
                access to market, environmental impact, and investment
                opportunities. The chart helps you visually understand how these
                resource perform in different regions, highlighting areas of
                strength or concern for the resource. Hover over each
                data-point of a particular metric to compare the value against
                the selected states. <br ><br >
                0 - 3 : Low <br >
                4 - 6 : Average <br >
                7 - 10 : High
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-12 gap-3 mb-3">
      <div class="col-span-12 lg:col-span-11 grid grid-cols-3 gap-2">
        <UFormGroup label="State One">
          <USelectMenu
            v-model="selectedStateId1"
            :options="states"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
        <UFormGroup label="Resource">
          <USelectMenu
            v-model="resourceId"
            :options="resources"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
            @change="fetchResourceStates"
          />
        </UFormGroup>
        <UFormGroup label="State Two">
          <USelectMenu
            v-model="selectedStateId2"
            :options="states"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
      </div>
      <div class="col-span-12 lg:col-span-1 text-end">
        <UButton
          icon="i-heroicons-magnifying-glass"
          class="text-white rounded-full"
          @click="fetchData"
        />
      </div>
    </div>
    <div v-if="!loading" class="">
      <Radar v-if="stateMetrics" :data="chartData" />
      <div v-else class="mx-auto my-8">
        <div class="mx-auto text-center">
          <p class="text-sm">
            No data available to compare the selected resources
          </p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex items-center justify-center my-4">
      <div class="spinner" />
    </div>
  </UCard>
</template>
