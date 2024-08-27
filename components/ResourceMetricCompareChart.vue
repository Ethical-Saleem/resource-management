<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import * as echarts from "echarts";
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useLoadingStore } from "~/stores/loading-store";

import type { Resource } from "~/types";

type ScatterPlotPoint = {
  x: number;
  y: number;
};

type ScatterPlotData = {
  marketValueVsAccessToMarket: ScatterPlotPoint[];
  environmentalImpactVsIndustryChallenges: ScatterPlotPoint[];
};

const analyticsStore = useAnalyticsStore();
const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const resourceId = ref<number>(1);
const selectedStateId = ref<number | undefined>(1);
const states = ref([]);
const resources = ref([] as Resource[]);

const scatterPlotContainer = ref<HTMLDivElement | null>(null);
const scatterPlotData = ref<ScatterPlotData>({
  marketValueVsAccessToMarket: [],
  environmentalImpactVsIndustryChallenges: [],
});
let myChart: echarts.ECharts | null = null;
let currentPage = 1;
const pageSize = 10; // Adjust page size as needed

const fetchData = async (page: number) => {
  loadingStore.showLoading();
  try {
    const data = await analyticsStore.dispatchFetchResourceMetricsCompare(
      resourceId.value,
      page,
      pageSize,
      selectedStateId.value
    );
    scatterPlotData.value = {
      marketValueVsAccessToMarket: data.marketValueVsAccessToMarket.map(
        (item: any) => ({
          x: item.marketValue,
          y: item.accessToMarket,
        })
      ),
      environmentalImpactVsIndustryChallenges:
        data.environmentalImpactVsIndustryChallenges.map((item: any) => ({
          x: item.environmentalImpact,
          y: item.industryChallenges,
        })),
    };
    initializeChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingStore.hideLoading();
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
          const seriesName = params.seriesName;
          if (seriesName === "Market Value vs. Access to Market") {
            return `Market Value: ${params.value[0]}, Access to Market: ${params.value[1]}`;
          } else if (
            seriesName === "Environmental Impact vs. Industry Challenges"
          ) {
            return `Environmental Impact: ${params.value[0]}, Industry Challenges: ${params.value[1]}`;
          }
          return "";
        },
        // formatter: (params) =>
        //   `Market Value: ${params.value[0]}, Access to Market: ${params.value[1]}`,
      },
      xAxis: {
        type: "value",
        name: "Market Value / Environmental Impact",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "value",
        name: "Access to Market / Industry Challenges",
        nameLocation: "middle",
        nameGap: 30,
      },
      series: [
        {
          name: "Market Value vs. Access to Market",
          type: "scatter",
          data: scatterPlotData.value.marketValueVsAccessToMarket.map(
            (item) => [item.x, item.y]
          ),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          // symbolSize: function (value) {
          //   return value;
          // },
        },
        {
          name: "Environmental Impact vs. Industry Challenges",
          type: "scatter",
          data: scatterPlotData.value.environmentalImpactVsIndustryChallenges.map(
            (item) => [item.x, item.y]
          ),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          // symbolSize: function (value) {
          //   return value;
          // },
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

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    await fetchData(currentPage);
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

// Initialize chart on component mount
onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  await fetchResources(props.categoryId);
  await fetchData(currentPage);
});
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h6 class="text-sm pr-1">Market Value vs. Access to Market</h6>
          <UPopover mode="hover">
            <UButton label="?" variant="ghost" class="text-lg" />
            <template #panel>
              <div
                class="p-4 text-xs h-30 w-60 ring-2 ring-[#d292ff] overflow-y-auto"
              >
                This scatter plot displays key comparisons between different
                metrics for a specific resource across various Local Government
                Areas (LGAs). The chart includes two views: one that compares
                market value with access to market and another that contrasts
                environmental impact with industry challenges. By analyzing the
                distribution of points, you can gain insights into how these
                metrics relate to each other in different LGAs, helping to
                identify trends and outliers. <br ><br >
                0 - 3 : Low <br >
                4 - 6 : Average <br >
                7 - 10 : High
              </div>
            </template>
          </UPopover>
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
      <div
        v-if="
          scatterPlotData.marketValueVsAccessToMarket.length === 0 ||
          scatterPlotData.environmentalImpactVsIndustryChallenges.length === 0
        "
        class="mx-auto"
      >
        <div class="mx-auto text-center">
          <p class="text-sm">
            No data available to compare the selected resources
          </p>
        </div>
      </div>
      <div ref="scatterPlotContainer" style="width: 100%; height: 400px" />
    </div>
  </UCard>
</template>
