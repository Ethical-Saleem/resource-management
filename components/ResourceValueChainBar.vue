<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { CATEGORICAL_PALETTE } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

const MAX_STATES_SHOWN = 15;

const props = defineProps<{
  resourceId: number | null;
}>();

const analyticsStore = useAnalyticsStore();
const loading = ref(false);
const allBarChartData = ref<{ stateName: string; averageValueChainAnalysis: number }[]>([]);

// A single series (one bar per state) needs one consistent color, not a
// color per bar — the y-axis labels already carry state identity, so a
// rainbow-per-bar would just be redundant, noisy encoding.
const SERIES_COLOR = CATEGORICAL_PALETTE[0];

const barChartData = computed(() =>
  [...allBarChartData.value]
    .sort((a, b) => b.averageValueChainAnalysis - a.averageValueChainAnalysis)
    .slice(0, MAX_STATES_SHOWN),
);
const truncated = computed(() => allBarChartData.value.length > MAX_STATES_SHOWN);

const chartOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params: any[]) => {
      const p = params[0];
      if (!p) return "";
      return `<strong>${p.axisValue}</strong><br/>${p.marker} ${p.value} (${tierFor(p.value)})`;
    },
  },
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: "value", axisLabel: { color: "#64748B" } },
  yAxis: {
    type: "category",
    data: barChartData.value.map((item) => item.stateName).reverse(),
    axisLabel: { color: "#64748B", fontSize: 12 },
  },
  series: [
    {
      name: "Value Chain Analysis",
      type: "bar",
      data: barChartData.value.map((item) => item.averageValueChainAnalysis).reverse(),
      itemStyle: { color: SERIES_COLOR, borderRadius: [0, 4, 4, 0] },
      barMaxWidth: 22,
    },
  ],
}));

const fetchData = async () => {
  if (!props.resourceId) return;
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchValueChainAnalysisByState(props.resourceId);
    allBarChartData.value = data.stateAverages || [];
  } catch (error) {
    console.error("value-chain-bar-error", error);
    allBarChartData.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.resourceId, fetchData);
onMounted(fetchData);
</script>

<template>
  <AnalyticsChartCard
    title="Value Chain Analysis by State"
    :description="truncated ? `Top ${MAX_STATES_SHOWN} of ${allBarChartData.length} states, by rating` : 'Overall value chain rating by state'"
    :loading="loading"
    :empty="barChartData.length === 0"
  >
    <VChart :option="chartOption" :style="{ height: `${Math.max(240, barChartData.length * 26)}px` }" autoresize />
  </AnalyticsChartCard>
</template>
