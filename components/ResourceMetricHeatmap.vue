<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useApiClient, unwrap } from "~/composables/useApiClient";
import { tierForScale } from "~/composables/useMetricTier";
import type { Resource } from "~/types";

const props = defineProps<{
  stateId: number | null;
  categoryId: number;
}>();

interface HeatmapRow {
  resourceId: number;
  resourceName: string;
  marketValue: number;
  accessToMarket: number;
  environmentalImpact: number;
  investmentOpportunities: number;
  stakeholderEngagement: number;
}

const METRICS: { key: keyof HeatmapRow; label: string }[] = [
  { key: "marketValue", label: "Value" },
  { key: "accessToMarket", label: "Access" },
  { key: "environmentalImpact", label: "Env. Impact" },
  { key: "investmentOpportunities", label: "Investment" },
  { key: "stakeholderEngagement", label: "Engagement" },
];

const analyticsStore = useAnalyticsStore();
const loading = ref(false);
const rows = ref<HeatmapRow[]>([]);

const fetchData = async () => {
  if (!props.stateId) return;
  loading.value = true;
  try {
    const api = useApiClient();
    const resources = unwrap<Resource[]>(
      await api.GET("/resource/fetch-resources-data-by-category/{categoryId}", {
        params: { path: { categoryId: props.categoryId } },
      }),
    );
    const resourceIds = (resources || []).slice(0, 6).map((r) => r.id);
    if (resourceIds.length === 0) {
      rows.value = [];
      return;
    }
    const data = await analyticsStore.dispatchFetchStateResourceHeatmap(
      props.stateId,
      resourceIds,
    );
    rows.value = data || [];
  } catch (error) {
    console.error("resource-heatmap-error", error);
    rows.value = [];
  } finally {
    loading.value = false;
  }
};

const chartOption = computed(() => {
  const resourceNames = rows.value.map((r) => r.resourceName);
  const cells: [number, number, number][] = [];
  rows.value.forEach((row, rowIndex) => {
    METRICS.forEach((metric, colIndex) => {
      cells.push([colIndex, rowIndex, Math.round((row[metric.key] as number) || 0)]);
    });
  });

  return {
    tooltip: {
      position: "top",
      formatter: (p: { data: [number, number, number] }) =>
        `${resourceNames[p.data[1]]}<br/>${METRICS[p.data[0]].label}: ${p.data[2]}% (${tierForScale(p.data[2], 100)} share)`,
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
      data: resourceNames,
      axisLabel: { color: "#334155", fontWeight: 600, fontSize: 12 },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 100,
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
          formatter: (p: { data: [number, number, number] }) => String(p.data[2]),
        },
        itemStyle: { borderColor: "#fff", borderWidth: 4, borderRadius: 6 },
      },
    ],
  };
});

watch(() => [props.stateId, props.categoryId], fetchData);
onMounted(fetchData);
</script>

<template>
  <AnalyticsChartCard
    title="Cross-Resource Metric Heatmap"
    description="Up to 6 resources in the selected category, within the selected state"
    :loading="loading"
    :empty="rows.length === 0"
    empty-message="No data available for the selected state and category."
  >
    <VChart :option="chartOption" :style="{ height: `${Math.max(220, rows.length * 56)}px` }" autoresize />
    <div class="mt-3 flex items-center justify-end gap-2">
      <span class="text-[10px] font-semibold text-uimuted-400">Low</span>
      <div class="h-2 w-28 rounded-full" style="background: linear-gradient(90deg, #EBFAF5, #0ABF98)" />
      <span class="text-[10px] font-semibold text-uimuted-400">High</span>
    </div>
  </AnalyticsChartCard>
</template>
