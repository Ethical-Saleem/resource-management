<script setup lang="ts">
import { Radar } from "vue-chartjs";
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useLoadingStore } from "~/stores/loading-store";
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
const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const resourceId = ref<number>(1);
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
  loadingStore.showLoading();
  try {
    const data = await analyticsStore.dispatchFetchStateLevelMetrics(
      resourceId.value,
      selectedStateId.value
    );
    stateMetrics.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
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
    await fetchData()
  }
);

const fetchResources = async (categoryId: number) => {
  loadingStore.showLoading();
  try {
    const data = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    resources.value = data;
    resourceId.value = resources.value[0].id;
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  await fetchResources(props.categoryId);
  await fetchData();
});
</script>

<template>
  <UCard class="">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h6 class="text-sm pr-1">State Level Metrics</h6>
          <UPopover mode="hover">
            <UButton label="?" variant="ghost" class="text-lg" />
            <template #panel>
              <div
                class="p-4 text-xs h-30 w-60 ring-2 ring-[#d292ff] overflow-y-auto"
              >
                This radar chart compares various metrics for a specific
                resource across different states. The chart shows how each state
                performs in areas like market value, quality, and investment
                opportunities. By hovering over the chart, you can see detailed
                information on each metric, helping you quickly understand where
                a state excels or needs improvement in resource management.
                <br ><br >
                0 - 3 : Low <br >
                4 - 6 : Average <br >
                7 - 10 : High
              </div>
            </template>
          </UPopover>
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
      <Radar v-if="stateMetrics.length > 0" :data="chartData" />
      <div v-else class="mx-auto my-8">
        <div class="mx-auto text-center">
          <p class="text-sm">
            No data available to compare the selected resources
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>
