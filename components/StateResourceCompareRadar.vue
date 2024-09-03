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
  stateName: string;
  resource1: {
    accessToMarket: number;
    marketValue: number;
    quality: number;
    environmentalImpact: number;
    investmentOpportunities: number;
    color: string;
  };
  resource2: {
    accessToMarket: number;
    marketValue: number;
    quality: number;
    environmentalImpact: number;
    investmentOpportunities: number;
    color: string;
  };
}

const analyticsStore = useAnalyticsStore();
// const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const resourceId1 = ref<number>(93);
const resourceId2 = ref<number>(94);
const loading = ref(false);
const selectedStateId = ref<number>(1);
const states = ref([] as State[]);
const resourceState = ref([] as State[])
const resources = ref([] as Resource[]);
const stateMetrics = ref([] as StateMetric[]);

const chartData = computed(() => {
  const labels = [
    "Access to Market",
    "Market Value",
    "Quality",
    "Environmental Impact",
    "Investment Opportunities",
  ];
  const datasets = stateMetrics.value.flatMap((metric) => [
    {
      label: `${metric.stateName} - Resource 1`,
      data: [
        metric.resource1.accessToMarket,
        metric.resource1.marketValue,
        metric.resource1.quality,
        metric.resource1.environmentalImpact,
        metric.resource1.investmentOpportunities,
      ],
      backgroundColor: hexToRgba(metric.resource1.color, 0.4),
      borderColor: metric.resource1.color,
      pointBackgroundColor: metric.resource1.color,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: metric.resource1.color,
    },
    {
      label: `${metric.stateName} - Resource 2`,
      data: [
        metric.resource2.accessToMarket,
        metric.resource2.marketValue,
        metric.resource2.quality,
        metric.resource2.environmentalImpact,
        metric.resource2.investmentOpportunities,
      ],
      backgroundColor: hexToRgba(metric.resource2.color, 0.4),
      borderColor: metric.resource2.color,
      pointBackgroundColor: metric.resource2.color,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: metric.resource2.color,
    },
  ]);

  return {
    labels,
    datasets,
  };
});

const fetchData = async () => {
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchStateResourceCompareMetrics(
      resourceId1.value,
      resourceId2.value,
      selectedStateId.value
    );
    stateMetrics.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    await fetchData();
  }
);

const fetchResources = async (categoryId: number) => {
  // loadingStore.showLoading();
  try {
    const data = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    resources.value = data;
    resourceId1.value = resources.value[0].id;
    resourceId2.value = resources.value[1].id;
  } catch (error) {
    console.log(error);
  } finally {
    // loadingStore.hideLoading();
  }
};

// const fetchResourceStates = async () => {
//   fetching.value = true;
// }

onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  await fetchResources(props.categoryId);
  selectedStateId.value = states.value[0].id;
  await fetchData();
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
                This chart compares two resources across various states,
                evaluating key metrics like market value, quality, access to
                market, environmental impact, and investment opportunities. The
                chart helps you visually understand how these resources perform
                in different regions, highlighting areas of strength or concern
                for each resource. Hover over a state to see the specific metric
                values for both resources side by side, enabling a detailed
                comparison. <br ><br >
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
        <UFormGroup label="Resource">
          <USelectMenu
            v-model="resourceId1"
            :options="resources"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
        <UFormGroup label="State">
          <USelectMenu
            v-model="selectedStateId"
            :options="states"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
        <UFormGroup label="Resource">
          <USelectMenu
            v-model="resourceId2"
            :options="resources"
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
      <Radar v-if="stateMetrics.length > 0" :data="chartData" />
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
