<script setup lang="ts">
import * as echarts from "echarts";
import { useAnalyticsStore } from "~/stores/analytics-store";
// import { useLoadingStore } from "~/stores/loading-store";

import type { Resource } from "~/types";

interface PieChartData {
  category: string;
  count: number;
}

const analyticsStore = useAnalyticsStore();
// const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const resourceId = ref<number>(1);
const loading = ref(false);
const selectedStateId = ref<number | undefined>(1);
const states = ref([]);
const resources = ref([] as Resource[]);

// const customStateOptions = computed(() => {
//   return [{ id: "", name: "All" }, ...states.value];
// });

const pieChartContainer = ref<HTMLDivElement | null>(null);
const pieChartData = ref<PieChartData[]>([]);
let myChart: echarts.ECharts | null = null;

const fetchData = async () => {
  loading.value = true
  try {
    const response = await analyticsStore.dispatchFetchResourceMiscMetrics(resourceId.value, selectedStateId.value);
    pieChartData.value = response.environmentalSustainability;
    console.log('pie-response', response)
    initializeChart(); // Initialize the chart after fetching data
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false
  }
};

const initializeChart = () => {
  if (pieChartContainer.value) {
    // Dispose of the existing chart instance if it exists
    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(pieChartContainer.value);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Categories",
          type: "pie",
          radius: "50%",
          data: pieChartData.value.map((item) => ({
            name: item.category,
            value: item.count,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    myChart.setOption(option);
  } else {
    console.error("Pie chart container is not available.");
  }
};

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    await fetchData()
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
  } catch (error) {
    console.log(error);
  } finally {
    // loadingStore.hideLoading();
  }
};

onMounted(async () => {
    states.value = await useApi.get("/territory/fetch-all-states");
  await fetchResources(props.categoryId)
  await fetchData();
});
</script>

<template>
  <UCard class="bg-uigreen-50 ring-2 ring-uiearth-700">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">Environmental Sustainability</h6>
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
          :options="states"
          option-attribute="name"
          value-attribute="id"
          searchable
          placeholder="-- Select --"
          @change="fetchData"
        />
      </UFormGroup>
    </div>
    <div class="">
      <div ref="pieChartContainer" style="width: 100%; height: 400px" />
    </div>
    <!-- <div v-if="loading" class="flex items-center justify-center my-4">
      <div class="spinner" />
    </div> -->
  </UCard>
</template>
