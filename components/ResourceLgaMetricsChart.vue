<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import type { Resource } from "~/types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const analyticsStore = useAnalyticsStore();

interface BarChartData {
  lgaId: number;
  lgaName: string;
  environmentalImpact: number;
  industryChallenges: number;
  stakeholderEngagement: number;
  investmentOpportunities: number;
}

const skip = ref(0);
const take = ref(8);
const hasMore = ref(true);
const resourceId = ref<number>(93);
const selectedStateId = ref<number | undefined>();
const states = ref([]);
const apiData = ref([] as BarChartData[]);
const resources = ref([] as Resource[]);
const chartData = ref({
  labels: [] as string[], // To be filled with LGA names
  datasets: [
    {
      label: "Environmental Impact",
      backgroundColor: "#FF6384",
      data: [] as number[],
    },
    {
      label: "Industry Challenges",
      backgroundColor: "#36A2EB",
      data: [] as number[],
    },
    {
      label: "Stakeholder Engagement",
      backgroundColor: "#FFCE56",
      data: [] as number[],
    },
    {
      label: "Investment Opportunities",
      backgroundColor: "#4BC0C0",
      data: [] as number[],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: function (context: any) {
          return `${context.dataset.label}: ${context.raw}`;
        },
      },
    },
  },
});

const customStateOptions = computed(() => {
  return [{ id: "", name: "All" }, ...states.value];
});

const loadMore = async () => {
  const data = await fetchBarChartData();
  if (data.length < take.value) {
    hasMore.value = false;
  }
  populateChartData(data);
  skip.value += take.value;
};

const fetchBarChartData = async (): Promise<BarChartData[]> => {
  const res = await analyticsStore.dispatchFetchResourceBarMetrics(
    resourceId.value,
    skip.value,
    take.value,
    selectedStateId.value,
  );
  apiData.value = res;
  populateChartData(apiData.value);
  return res;
};

const populateChartData = (data: BarChartData[]) => {
  const lgaNames = data.map((item) => item.lgaName); // Replace with actual LGA names if available

  chartData.value.labels = lgaNames
  chartData.value.datasets[0].data = data.map(
    (item) => item.environmentalImpact
  );
  chartData.value.datasets[1].data = data.map(
    (item) => item.industryChallenges
  );
  chartData.value.datasets[2].data = data.map(
    (item) => item.stakeholderEngagement
  );
  chartData.value.datasets[3].data = data.map(
    (item) => item.investmentOpportunities
  );
};

onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  resources.value = await useApi.get("/resource/fetch-resources-data");
  await fetchBarChartData();
});
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">State Level Metrics</h6>
        </div>
        <UButton v-if="hasMore" @click="loadMore">Load More</UButton>
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
          @change="fetchBarChartData"
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
          @change="fetchBarChartData"
        />
      </UFormGroup>
    </div>
    <div class="">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </UCard>
</template>
