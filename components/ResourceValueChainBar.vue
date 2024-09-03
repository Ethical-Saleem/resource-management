<script setup lang="ts">
import { Bar } from "vue-chartjs";
import { useAnalyticsStore } from "~/stores/analytics-store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import type { Resource } from "~/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const analyticsStore = useAnalyticsStore();

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
});

const barChartData = ref(
  [] as { stateName: string; averageValueChainAnalysis: number }[]
);
const loading = ref(false);
const resourceId = ref<number | null>(null);
const resources = ref([] as Resource[]);

const chartData = computed(() => {
  const labels = barChartData.value.map((item) => item.stateName);
  const data = barChartData.value.map((item) => item.averageValueChainAnalysis);

  //   const backgroundColor = data.map(() => {
  //     // const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
  //     //   Math.random() * 256
  //     // )}, ${Math.floor(Math.random() * 256)}, 0.9)`;
  //     // return randomColor;
  //     const randomColor = `rgba(${150 + Math.floor(Math.random() * 106)}, ${150 + Math.floor(
  //       Math.random() * 106
  //     )}, ${150 + Math.floor(Math.random() * 106)}, 0.5)`;
  //     return randomColor;
  //   });

  const backgroundColor = generateRandomColors(data.length);

  return {
    labels,
    datasets: [
      {
        label: "Value Chain Analysis",
        data,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 16, // Increase the legend label font size
          color: "",
        },
      },
    },
    // title: {
    //   display: true,
    //   text: "Value Chain Analysis by State",
    //   font: {
    //     size: 24, // Increase the title font size
    //   },
    // },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 14, // Increase the x-axis label font size
        },
      },
    },
    y: {
      ticks: {
        font: {
          size: 14, // Increase the y-axis label font size
        },
      },
    },
  },
};

function generateRandomColors(length: number) {
  const colors = [];
  for (let i = 0; i < length; i++) {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;
    colors.push(color);
  }
  return colors;
}

const fetchData = async () => {
  loading.value = true;
  try {
    if (resourceId.value) {
      const data = await analyticsStore.dispatchFetchValueChainAnalysisByState(
        resourceId.value
      );
      barChartData.value = data.stateAverages;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const fetchResources = async (categoryId: number) => {
  loading.value = true;
  try {
    const data: Resource[] = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    resources.value = data;
    if (data.length > 0) {
      resourceId.value = data[0].id; // Set the first resource as the default
    }
    console.log("data", data);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    await fetchData();
  }
);

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
    class="bg-uigreen-50 ring-2 ring-uiearth-700"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h6 class="text-sm pr-1">Value Chain Analysis by State</h6>
          <UPopover mode="hover">
            <UButton label="?" variant="ghost" class="text-lg" />
            <template #panel>
              <div
                class="p-4 text-xs h-30 w-60 ring-2 ring-[#d292ff] overflow-y-auto"
              >
                This chart compares the value chain rating of a resource across
                all states it can be found, evaluating the overall value chain
                rating for the resource in each state. The length of the bar
                determine is used as the mode of comparison here. <br ><br >
                <!-- 0 - 3 : Low <br >
                4 - 6 : Average <br >
                7 - 10 : High -->
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-1 gap-3 mb-3">
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
    </div>
    <div v-if="!loading">
      <Bar
        v-if="barChartData.length > 0"
        :data="chartData"
        :options="{ ...chartOptions, indexAxis: 'y' }"
      />
      <div v-else class="mx-auto my-8">
        <div class="mx-auto text-center">
          <p class="text-sm">No data available for the selected resource.</p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex items-center justify-center my-4">
      <div class="spinner" />
    </div>
  </UCard>
</template>
