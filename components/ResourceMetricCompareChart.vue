<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import * as echarts from "echarts";
import { useAnalyticsStore } from "~/stores/analytics-store";

import type { Resource } from "~/types";

const analyticsStore = useAnalyticsStore();

const resourceId = ref<number>(1);
const selectedStateId = ref<number | undefined>(1);
const states = ref([]);
const resources = ref([] as Resource[]);

const scatterPlotContainer = ref<HTMLDivElement | null>(null);
const scatterPlotData = ref<{ x: number; y: number }[]>([]);
let myChart: echarts.ECharts | null = null;
let currentPage = 1;
const pageSize = 10; // Adjust page size as needed

const fetchData = async (page: number) => {
  try {
    const data = await analyticsStore.dispatchFetchResourceMetricsCompare(
      resourceId.value,
      page,
      pageSize,
      selectedStateId.value
    );
    scatterPlotData.value = data.marketValueVsAccessToMarket.map(
      (item: any) => ({
        x: item.marketValue,
        y: item.accessToMarket,
      })
    );
    initializeChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const initializeChart = () => {
  if (scatterPlotContainer.value) {
    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(scatterPlotContainer.value);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `Market Value: ${params.value[0]}, Access to Market: ${params.value[1]}`;
        },
        // formatter: (params) =>
        //   `Market Value: ${params.value[0]}, Access to Market: ${params.value[1]}`,
      },
      xAxis: {
        type: "value",
        name: "Market Value",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "value",
        name: "Access to Market",
        nameLocation: "middle",
        nameGap: 30,
      },
      series: [
        {
          name: "Scatter Data",
          type: "scatter",
          data: scatterPlotData.value.map((item) => [item.x, item.y]),
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
    console.error("Scatter plot container is not available.");
  }
};

const loadMoreData = async () => {
  currentPage += 1;
  await fetchData(currentPage);
};

// Initialize chart on component mount
onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  resources.value = await useApi.get("/resource/fetch-resources-data");
  resourceId.value = resources.value[0].id
  await fetchData(currentPage);
});
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">Market Value vs. Access to Market</h6>
        </div>
        <UButton @click="loadMoreData">Load More</UButton>
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
      <div ref="scatterPlotContainer" style="width: 100%; height: 400px" />
    </div>
  </UCard>
</template>
