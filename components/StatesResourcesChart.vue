<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
// import type { StatesResourceChart } from "~/stores/analytics-store";
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

interface ChartData {
  labels: string[];
  datasets: Array<{ label: string, data: number[], backgroundColor: string[]}>
}

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const analyticsStore = useAnalyticsStore();

const currentPage = ref(1);
// const data = ref({
//   labels: [] as string[],
//   datasets: [] as any[],
// });

const data = ref<ChartData>({
  labels: [],
  datasets: [{
    label: 'a bar',
    data: [87, 67, 18],
    backgroundColor: ['red']
  },{
    label: 'a bar',
    data: [96, 25, 74],
    backgroundColor: ['blue']
  }],
})

const options = ref({
  responsive: true,
  scales: {
    x: {
      stacked: true,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
    y: {
      stacked: true,
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'States Resources Composition',
    },
  },
});

watch(data, (newData) => {
  console.log("Chart data:", newData);
}, { immediate: true });

const fetchData = async () => {
  await analyticsStore.dispatchFetchStatesResources(currentPage.value);
  const stateData = analyticsStore.statesResources;

  const resourceNames = new Set<string>();
  stateData.forEach(item => {
    item.resources.forEach(resource => {
      resourceNames.add(resource.name);
    });
  });

  // Create datasets for each resource type
  const datasets = Array.from(resourceNames).map(resourceName => ({
    label: resourceName,
    data: stateData.map(item => {
      const resource = item.resources.find(r => r.name === resourceName);
      return resource ? resource.quantity : 0;
    }),
    backgroundColor: stateData.map(item => {
      const resource = item.resources.find(r => r.name === resourceName);
      return resource ? resource.colorCode : '#E0E0E0';
    }),
  }));

  console.log('datasets', datasets);

  data.value.labels = stateData.map(item => item.state);
  data.value.datasets = datasets;
  console.log('labels', data.value.labels);
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">States Resources</h6>
        </div>
      </div>
    </template>
    <Bar :data="data" :options="options" />
  </UCard>
</template>
