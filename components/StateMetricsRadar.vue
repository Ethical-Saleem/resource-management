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

const resourceId = ref<number | null>(null);
const selectedStateId = ref<number | undefined>();
const states = ref([]);
const loading = ref(false);
const fetching = ref(false);
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

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 16, // Increase the legend label font size
        },
        color: '#2fd8ae'
      },
    },
  },
  scales: {
    r: {
      pointLabels: {
        font: {
          size: 14, // Increase the radar point label font size
        },
        color: '#2fd8ae'
      },
      ticks: {
        font: {
          size: 12, // Increase the radar ticks font size
        },
        color: '#2fd8ae'
      },
    },
  },
};

const fetchData = async () => {
  loading.value = true;
  try {
    console.log("resourceId", resourceId.value);
    if (resourceId.value) {
      const data = await analyticsStore.dispatchFetchStateLevelMetrics(
        resourceId.value,
        selectedStateId.value
      );
      stateMetrics.value = data;
    }
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

watch(
  () => resourceId.value,
  async () => {
    await fetchResourceStates();
  }
);

const fetchResources = async (categoryId: number) => {
  loadingStore.showLoading();
  try {
    const data: Resource[] = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    resources.value = data;
    if (data.length > 0) {
      resourceId.value = data[0].id; // Set the first resource as the default
    }
    if (resourceId.value) {
      await fetchResourceStates();
    }
    console.log("data", data);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

const fetchResourceStates = async () => {
  fetching.value = true;
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
    fetching.value = false;
  }
};

watchEffect(() => {
  if (resourceId.value) {
    fetchData();
  }
});

onMounted(async () => {
  await fetchResources(props.categoryId);
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
    class="dark:bg-uigreen-50 border border-uigreen-700 dark:border-uigreen-200 shadow-lg text-uigreen-400 dark:text-uigreen-700"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h6 class="text-sm pr-1">State Level Market/Investment Potential Analysis</h6>
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
      <UFormGroup label="Resource">
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
      <UFormGroup label="State">
        <USelectMenu
          v-model="selectedStateId"
          :options="customStateOptions"
          :loading="fetching"
          :disabled="fetching"
          option-attribute="name"
          value-attribute="id"
          searchable
          placeholder="-- Select --"
          @change="fetchData"
        />
      </UFormGroup>
    </div>
    <div v-if="!loading" class="">
      <Radar
        v-if="stateMetrics.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
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

<style>
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #9c4010;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
