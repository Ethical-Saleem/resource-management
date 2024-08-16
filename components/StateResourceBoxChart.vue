<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import * as echarts from 'echarts'

import type { Resource, State } from "~/types";

const analyticsStore = useAnalyticsStore()

const resourceId = ref<number>(1);
const selectedStateId = ref<number>(1);
const states = ref([] as State[]);
const resources = ref([] as Resource[]);

const customStateOptions = computed(() => {
  return [{ id: "", name: "All" }, ...states.value];
});

const boxPlotContainer = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

const fetchBoxPlotData = async () => {
  try {
    const data = await analyticsStore.dispatchFetchStateResourceOutliers(resourceId.value, selectedStateId.value);
    initializeChart(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const initializeChart = (data: any) => {
  if (boxPlotContainer.value) {
    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(boxPlotContainer.value);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => `${params.seriesName}: ${params.value}`,
      },
      xAxis: {
        type: 'category',
        data: ['Quantity Rating', 'Market Value'],
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameLocation: 'middle',
        nameGap: 30,
      },
      series: [
        {
          name: 'Quantity Rating',
          type: 'boxplot',
          data: [
            [
              data.quantityRating.min,
              data.quantityRating.q1,
              data.quantityRating.median,
              data.quantityRating.q3,
              data.quantityRating.max,
            ],
          ],
        },
        {
          name: 'Market Value',
          type: 'boxplot',
          data: [
            [
              data.marketValue.min,
              data.marketValue.q1,
              data.marketValue.median,
              data.marketValue.q3,
              data.marketValue.max,
            ],
          ],
        },
        {
          name: 'Outliers',
          type: 'scatter',
          data: [
            ...data.quantityRating.outliers.map((v: number) => ['Quantity Rating', v]),
            ...data.marketValue.outliers.map((v: number) => ['Market Value', v]),
          ],
          tooltip: {
            formatter: (params: any) => `Outlier: ${params.value[1]}`,
          },
        },
      ],
    };

    myChart.setOption(option);
  } else {
    console.error('Box plot container is not available.');
  }
};

onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  resources.value = await useApi.get("/resource/fetch-resources-data");
  resourceId.value = resources.value[0].id;
  selectedStateId.value = states.value[0].id;
  await fetchBoxPlotData()
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
    <div class="grid grid-cols-2 gap-3 mb-3">
      <UFormGroup>
        <USelectMenu
          v-model="resourceId"
          :options="resources"
          option-attribute="name"
          value-attribute="id"
          searchable
          placeholder="-- Select --"
          @change="fetchBoxPlotData"
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
          @change="fetchBoxPlotData"
        />
      </UFormGroup>
    </div>
    <div class="">
        <div ref="boxPlotContainer" style="width: 100%; height: 400px;"/>
    </div>
  </UCard>
</template>
