<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { CATEGORICAL_PALETTE, hexToRgba } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

const props = defineProps<{
  resourceId: number | null;
}>();

interface ScatterPoint {
  marketValue: number | null;
  accessToMarket: number | null;
}

const analyticsStore = useAnalyticsStore();
const loading = ref(false);
const points = ref<ScatterPoint[]>([]);

const fetchData = async () => {
  if (!props.resourceId) return;
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchResourceMetricsCompare(
      props.resourceId,
      1,
      200,
    );
    points.value = (data.marketValueVsAccessToMarket || []).filter(
      (p: ScatterPoint) => p.marketValue !== null && p.accessToMarket !== null,
    );
  } catch (error) {
    console.error("market-scatter-error", error);
    points.value = [];
  } finally {
    loading.value = false;
  }
};

const pointColor = CATEGORICAL_PALETTE[2];

const chartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: (p: { data: [number, number] }) =>
      `Access to Market: ${p.data[0]} (${tierFor(p.data[0])})<br/>Market Value: ${p.data[1]} (${tierFor(p.data[1])})`,
  },
  grid: { left: 48, right: 24, top: 24, bottom: 48 },
  xAxis: {
    type: "value",
    name: "Access to Market",
    nameLocation: "middle",
    nameGap: 28,
    nameTextStyle: { color: "#94A3B8", fontWeight: 600, fontSize: 11 },
    axisLabel: { color: "#64748B" },
  },
  yAxis: {
    type: "value",
    name: "Market Value",
    nameTextStyle: { color: "#94A3B8", fontWeight: 600, fontSize: 11 },
    axisLabel: { color: "#64748B" },
  },
  series: [
    {
      type: "scatter",
      symbolSize: 9,
      data: points.value.map((p) => [p.accessToMarket, p.marketValue]),
      itemStyle: { color: hexToRgba(pointColor, 0.75) },
    },
  ],
}));

watch(() => props.resourceId, fetchData);
onMounted(fetchData);
</script>

<template>
  <AnalyticsChartCard
    title="Market Value vs. Access to Market"
    description="Each point is one survey record for the selected resource"
    :loading="loading"
    :empty="points.length === 0"
  >
    <VChart :option="chartOption" style="height: 300px" autoresize />
  </AnalyticsChartCard>
</template>
