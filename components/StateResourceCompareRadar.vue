<script setup lang="ts">
import { Radar } from "vue-chartjs";
import { useAnalyticsStore } from "~/stores/analytics-store";
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

const resourceId1 = ref<number>(93);
const resourceId2 = ref<number>(94);
const selectedStateId = ref<number>(1);
const states = ref([] as State[]);
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
  const data = await analyticsStore.dispatchFetchStateResourceCompareMetrics(
    resourceId1.value,
    resourceId2.value,
    selectedStateId.value
  );
  stateMetrics.value = data;
};

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

onMounted(async () => {
  await analyticsStore.dispatchFetchStateResourceCompareMetrics(
    resourceId1.value,
    resourceId2.value,
    selectedStateId.value
  );
  states.value = await useApi.get("/territory/fetch-all-states");
  resources.value = await useApi.get("/resource/fetch-resources-data");
  selectedStateId.value = states.value[0].id;
  resourceId1.value = resources.value[0].id;
  resourceId2.value = resources.value[1].id;
  await fetchData();
});
</script>

<template>
  <UCard class="">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">State Level Metrics</h6>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-12 gap-3 mb-3">
      <div class="col-span-11 grid grid-cols-3 gap-2">
        <UFormGroup>
          <USelectMenu
            v-model="resourceId1"
            :options="resources"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
        <UFormGroup>
          <USelectMenu
            v-model="selectedStateId"
            :options="states"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
        <UFormGroup>
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
      <UButton
        icon="i-heroicons-magnifying-glass"
        class="text-white rounded-full"
        @click="fetchData"
      />
    </div>
    <div class="">
      <Radar :data="chartData" />
    </div>
  </UCard>
</template>
