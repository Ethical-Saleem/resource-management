<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import type { StateResourceData } from "~/stores/analytics-store";
import type { State } from "~/types";

interface ChartOption {
  tooltip: { trigger: string; formatter: string };
  series: Array<{
    type: string;
    data: ChartData[];
    radius: string;
  }>;
}

interface ChartData {
  value: number;
  name: string;
  itemStyle: { color: string };
}

const analyticsStore = useAnalyticsStore();

const data = ref([] as StateResourceData[]);
const states = ref([] as State[]);
const selectedState = ref<number>(1);

const option = ref<ChartOption>({
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
  },
  series: [
    {
      type: "pie",
      data: [],
      radius: "70%",
    },
  ],
});

const fetchData = async () => {
  await analyticsStore.dispatchFetchStateResourceDistribution(
    selectedState.value
  );
  data.value = analyticsStore.stateResourceDistribution;

  const chartData = data.value.map((item) => ({
    value: item._sum.totalQuantity,
    name: item.resource.name,
    itemStyle: {
      color: item.resource.colorCode,
    },
  }));

  option.value.series[0].data = chartData;
};

// const option = ref<ECOption>({
//   dataset: {
//     dimensions: ['Product', '2015', '2016', '2017'],
//     source: [
//       {
//         Product: 'Matcha Latte',
//         2015: 54,
//         2016: 42,
//         2017: 23,
//       },
//     ],
//   },
//   xAxis: { type: 'category' },
//   yAxis: {},
//   series: [{ type: 'bar' }],
// })

onMounted(async () => {
  await fetchData();
  states.value = await useApi.get("/territory/fetch-all-states");
});
</script>

<template>
  <UCard class="">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h6 class="text-sm">Resource by State</h6>
        </div>
        <USelectMenu
          v-model="selectedState"
          :options="states"
          option-attribute="name"
          value-attribute="id"
          searchable
          placeholder="-- Select --"
          @change="fetchData"
        />
      </div>
    </template>
    <VChart :option="option" style="min-height: 200px" />
  </UCard>
</template>
