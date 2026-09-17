<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { tierFor } from "~/composables/useMetricTier";

interface StateMetric {
  stateName: string;
  accessToMarket: number;
  marketValue: number;
  quality: number;
  environmentalImpact: number;
  investmentOpportunities: number;
}

const METRICS: { key: keyof StateMetric; label: string }[] = [
  { key: "marketValue", label: "Market Value" },
  { key: "accessToMarket", label: "Access to Market" },
  { key: "quality", label: "Quality" },
  { key: "environmentalImpact", label: "Env. Impact" },
  { key: "investmentOpportunities", label: "Investment" },
];
const MAX_STATES_SHOWN = 15;

const props = defineProps<{
  resourceId: number | null;
}>();

const analyticsStore = useAnalyticsStore();
const loading = ref(false);
const allStateMetrics = ref<StateMetric[]>([]);

const stateMetrics = computed(() => {
  const withAverage = allStateMetrics.value.map((m) => ({
    ...m,
    _avg:
      (m.accessToMarket + m.marketValue + m.quality + m.environmentalImpact + m.investmentOpportunities) / 5,
  }));
  return withAverage
    .sort((a, b) => b._avg - a._avg)
    .slice(0, MAX_STATES_SHOWN);
});

const truncated = computed(() => allStateMetrics.value.length > MAX_STATES_SHOWN);

const fetchData = async () => {
  if (!props.resourceId) return;
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchStateLevelMetrics(props.resourceId);
    allStateMetrics.value = data || [];
  } catch (error) {
    console.error("state-level-metrics-error", error);
    allStateMetrics.value = [];
  } finally {
    loading.value = false;
  }
};

const chartOption = computed(() => {
  const rows = stateMetrics.value;
  const cells: [number, number, number][] = [];
  rows.forEach((row, rowIndex) => {
    METRICS.forEach((metric, colIndex) => {
      cells.push([colIndex, rowIndex, Math.round((row[metric.key] as number) * 10) / 10]);
    });
  });

  return {
    tooltip: {
      position: "top",
      formatter: (p: { data: [number, number, number] }) =>
        `${rows[p.data[1]].stateName}<br/>${METRICS[p.data[0]].label}: ${p.data[2]} (${tierFor(p.data[2])})`,
    },
    grid: { left: 110, right: 24, top: 24, bottom: 24 },
    xAxis: {
      type: "category",
      data: METRICS.map((m) => m.label),
      axisLabel: { color: "#64748B", fontWeight: 600, fontSize: 11 },
      splitArea: { show: true },
    },
    yAxis: {
      type: "category",
      data: rows.map((r) => r.stateName),
      axisLabel: { color: "#334155", fontWeight: 600, fontSize: 12 },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 10,
      show: false,
      inRange: { color: ["#EBFAF5", "#0ABF98"] },
    },
    series: [
      {
        type: "heatmap",
        data: cells,
        label: {
          show: true,
          color: "#044235",
          fontWeight: 700,
          fontSize: 11,
        },
        itemStyle: { borderColor: "#fff", borderWidth: 4, borderRadius: 6 },
      },
    ],
  };
});

watch(() => props.resourceId, fetchData);
onMounted(fetchData);
</script>

<template>
  <AnalyticsChartCard
    title="State-Level Performance"
    :description="(truncated ? `Top ${MAX_STATES_SHOWN} of ${allStateMetrics.length} states, by average score` : 'Market and investment potential across states') + ' · hover a cell for Low/Medium/High'"
    :loading="loading"
    :empty="stateMetrics.length === 0"
  >
    <VChart
      :option="chartOption"
      :style="{ height: `${Math.max(240, stateMetrics.length * 36)}px` }"
      autoresize
    />
  </AnalyticsChartCard>
</template>
