<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useLoadingStore } from "~/stores/loading-store"; 
import * as echarts from "echarts";

import type { Resource } from "~/types";

const analyticsStore = useAnalyticsStore();
const loadingStore = useLoadingStore();

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
const resourceId = ref<number>(1);
const selectedStateId = ref<number | undefined>();
const states = ref([]);
const resources = ref([] as Resource[]);
const chartContainer = ref<HTMLDivElement | null>(null);
const barChartData = ref<BarChartData[]>([]);
let myChart: echarts.ECharts | null = null;

const customStateOptions = computed(() => {
  return [{ id: "", name: "All" }, ...states.value];
});

const loadMore = async () => {
  fetchBarChartData();
};

const fetchBarChartData = async () => {
  loadingStore.showLoading()
  try {
    const res = await analyticsStore.dispatchFetchResourceBarMetrics(
      resourceId.value,
      skip.value,
      take.value,
      selectedStateId.value
    );
    if (res.length < take.value) {
      hasMore.value = false;
    }
    barChartData.value = res;
    skip.value += take.value;
    initializeChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingStore.hideLoading()
  }
};

const initializeChart = () => {
  if (chartContainer.value) {
    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(chartContainer.value);

    const option: echarts.EChartsOption = {
      tooltip: {},
      legend: {
        data: [
          "Environmental Impact",
          "Industry Challenges",
          "Stakeholder Engagement",
          "Investment Opportunities",
        ],
      },
      xAxis: {
        type: "category",
        data: barChartData.value.map((item) => item.lgaName),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Environmental Impact",
          type: "bar",
          data: barChartData.value.map((item) => item.environmentalImpact),
        },
        {
          name: "Industry Challenges",
          type: "bar",
          data: barChartData.value.map((item) => item.industryChallenges),
        },
        {
          name: "Stakeholder Engagement",
          type: "bar",
          data: barChartData.value.map((item) => item.stakeholderEngagement),
        },
        {
          name: "Investment Opportunities",
          type: "bar",
          data: barChartData.value.map((item) => item.investmentOpportunities),
        },
      ],
    };

    myChart.setOption(option);
  }
};

// watch(
//   () => chartContainer.value,
//   (newValue) => {
//     if (myChart && !newValue) {
//       myChart.dispose();
//       myChart = null;
//     }
//   }
// );

onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  resources.value = await useApi.get("/resource/fetch-resources-data");
  resourceId.value = resources.value[0].id;
  await fetchBarChartData();
});
</script>

<template>
  <UCard>
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
                This bar chart provides a comparison of key metrics for a
                specific resource across various Local Government Areas (LGAs).
                It shows how each LGA performs in terms of environmental impact,
                industry challenges, stakeholder engagement, and investment
                opportunities. By hovering over the bars, you can see detailed
                metrics for each LGA, helping you identify areas of strength or
                concern. <br><br> 0 - 3 : Low <br> 4 - 6 : Average <br> 7 - 10 : High
              </div>
            </template>
          </UPopover>
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
      <div ref="chartContainer" style="width: 100%; height: 400px" />
    </div>
  </UCard>
</template>
