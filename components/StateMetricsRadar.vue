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

import type { Resource } from "~/types";

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
  accessToMarket: number;
  marketValue: number;
  quality: number;
  environmentalImpact: number;
  investmentOpportunities: number;
  color: string; // Color field
}

const analyticsStore = useAnalyticsStore();

const resourceId = ref<number>(93);
const selectedStateId = ref<number | undefined>();
const states = ref([]);
const resources = ref([] as Resource[]);
const stateMetrics = ref([] as StateMetric[]);

const customStateOptions = computed(() => {
  return [{ id: "", name: "All" }, ...states.value];
});

const chartData = computed(() => {
  const labels = [
    "Access to Market",
    "Market Value",
    "Quality",
    "Environmental Impact",
    "Investment Opportunities",
  ];
  const datasets = stateMetrics.value.map((metric) => ({
    label: metric.stateName,
    data: [
      metric.accessToMarket,
      metric.marketValue,
      metric.quality,
      metric.environmentalImpact,
      metric.investmentOpportunities,
    ],
    backgroundColor: hexToRgba(metric.color, 0.4),
    borderColor: metric.color,
    pointBackgroundColor: metric.color,
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: metric.color,
  }));

  return {
    labels,
    datasets,
  };
});

const fetchData = async () => {
  const data = await analyticsStore.dispatchFetchStateLevelMetrics(
    resourceId.value,
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
  states.value = await useApi.get("/territory/fetch-all-states");
  resources.value = await useApi.get("/resource/fetch-resources-data");
  await fetchData();
});
</script>

<template>
  <UCard class="dark:to-muted-900 bg-gradient-to-b from-transparent to-white">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">State Level Metrics</h6>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-3 mb-3">
      <UFormGroup>
        <USelectMenu
          v-model="resourceId"
          :options="resources"
          option-attribute="name"
          value-attribute="id"
          searchable
          placeholder="-- Select --"
          @change="fetchData"
        />
      </UFormGroup>
      <UFormGroup>
        <USelectMenu
          v-model="selectedStateId"
          :options="customStateOptions"
          option-attribute="name"
          value-attribute="id"
          searchable
          placeholder="-- Select --"
          @change="fetchData"
        />
      </UFormGroup>
    </div>
    <div class="">
      <Radar :data="chartData" />
    </div>
  </UCard>
</template>
