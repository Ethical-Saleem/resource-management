<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useLoadingStore } from "~/stores/loading-store";
import * as echarts from "echarts";

import type { Resource, State } from "~/types";

interface MetricsData {
  quantityRating: any;
  marketValue: any;
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
const selectedStateId = ref<number>(1);
const states = ref([] as State[]);
const resources = ref([] as Resource[]);
const metricsData = ref({} as MetricsData);

const customStateOptions = computed(() => {
  return [{ id: "", name: "All" }, ...states.value];
});

const boxPlotContainer = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

const fetchBoxPlotData = async () => {
  loadingStore.showLoading();
  try {
    const data = await analyticsStore.dispatchFetchStateResourceOutliers(
      resourceId.value,
      selectedStateId.value
    );
    metricsData.value = data
    initializeChart(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingStore.hideLoading();
  }
};

const initializeChart = (data: any) => {
  if (boxPlotContainer.value) {
    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(boxPlotContainer.value);

    if (data.quantityRating || data.marketValue) {
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: "item",
          formatter: (params: any) => `${params.seriesName}: ${params.value}`,
        },
        xAxis: {
          type: "category",
          data: ["Quantity Rating", "Market Value"],
        },
        yAxis: {
          type: "value",
          name: "Value",
          nameLocation: "middle",
          nameGap: 30,
        },
        series: [
          {
            name: "Quantity Rating",
            type: "boxplot",
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
            name: "Market Value",
            type: "boxplot",
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
            name: "Outliers",
            type: "scatter",
            data: [
              ...data.quantityRating.outliers.map((v: number) => [
                "Quantity Rating",
                v,
              ]),
              ...data.marketValue.outliers.map((v: number) => [
                "Market Value",
                v,
              ]),
            ],
            tooltip: {
              formatter: (params: any) => `Outlier: ${params.value[1]}`,
            },
          },
        ],
      };

      myChart.setOption(option);
    }
  } else {
    console.error("Box plot container is not available.");
  }
};

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    await fetchBoxPlotData();
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
  selectedStateId.value = states.value[0].id;
  await fetchBoxPlotData();
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
                This box plot chart illustrates the distribution of two key
                metrics — quantity rating and market value — for a specific
                resource across different Local Government Areas (LGAs). The
                chart shows the spread of these metrics, including their
                minimum, maximum, median, and quartiles. By examining the box
                plot, you can quickly assess the range and variability of these
                metrics, helping to identify trends and outliers in the resource
                data. <br ><br >
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
      <div v-if="!metricsData.quantityRating && !metricsData.marketValue" class="mx-auto my-8">
        <div class="mx-auto text-center">
          <p class="text-sm">
            No data available to compare the selected resources
          </p>
        </div>
      </div>
      <div ref="boxPlotContainer" style="width: 100%; height: 400px" />
    </div>
  </UCard>
</template>
