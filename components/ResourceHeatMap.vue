<template>
  <UCard>
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="col-span-12 md:col-span-11 grid grid-cols-2 gap-2">
        <UFormGroup>
          <USelectMenu
            v-model="resourceIds"
            :options="resources"
            option-attribute="name"
            value-attribute="id"
            searchable
            multiple
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
      <div class="col-span-12 md:col-span-1 text-end">
        <UButton
          icon="i-heroicons-magnifying-glass"
          class="text-white rounded-full"
          @click="fetchData"
        />
      </div>
    </div>
    <div>
      <div ref="heatmapChart" style="width: 100%; height: 600px" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useLoadingStore } from "~/stores/loading-store";
import * as echarts from "echarts";

import type { Resource } from "~/types";

const analyticsStore = useAnalyticsStore();
const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const heatmapChart = ref<HTMLDivElement | null>(null);
const resourceIds = ref<number[]>([]);
const selectedStateId = ref<number>(0);
const states = ref([]);
const resources = ref([] as Resource[]);
let myChart: echarts.ECharts | null = null;

const customStateOptions = computed(() => {
  return [{ id: "", name: "All" }, ...states.value];
});

const stateHeatmapData = ref([]);

const fetchData = async () => {
  loadingStore.showLoading();
  try {
    console.log("resourceId", resourceIds.value);
    const data = await analyticsStore.dispatchFetchStateResourceHeatmap(
      selectedStateId.value,
      resourceIds.value
    );
    stateHeatmapData.value = data;
    initializeChart();
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

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
    console.log("data", data);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

const initializeChart = () => {
  if (myChart) {
    myChart.dispose();
  }

  myChart = echarts.init(heatmapChart.value);

  const stateNames = [...new Set(stateHeatmapData.value.map(d => d.stateName))];
  const parameters = [
    "stakeholderEngagement",
    "industryChallenges",
    "investmentOpportunities",
    "valueChainAnalysis",
    "environmentalImpact",
    "marketValue",
    "accessToMarket",
    "policiesRegulations",
  ];

  // Creating the heatmap data in the format [stateName, parameter, value]
  const heatmapData = stateHeatmapData.value.flatMap(resource =>
    parameters.map(param => [
      resource.stateName,
      param,
      resource[param],
      resource.resourceId,
    ])
  );

  const resourceDataMap = new Map();
  stateHeatmapData.value.forEach(resource => {
    if (!resourceDataMap.has(resource.resourceId)) {
      resourceDataMap.set(resource.resourceId, []);
    }
    parameters.forEach(param => {
      resourceDataMap.get(resource.resourceId).push([
        resource.stateName,
        param,
        resource[param]
      ]);
    });
  });

  // Create series for each resource
  const series = [...resourceDataMap.keys()].map(resourceId => ({
    name: `Resource ${resourceId}`,
    type: 'heatmap',
    data: resourceDataMap.get(resourceId),
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  }));

  const option = {
    tooltip: {
      position: "top",
    },
    grid: {
      height: "50%",
      top: "10%",
    },
    xAxis: {
      type: "category",
      data: stateNames,
    },
    yAxis: {
      type: "category",
      data: parameters, // Parameters
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%",
    },
    series: series,
  };

  myChart.setOption(option);
};

onMounted(async () => {
  states.value = await useApi.get("/territory/fetch-all-states");
  selectedStateId.value = states.value[0].id;
  await fetchResources(props.categoryId);
});
</script>
