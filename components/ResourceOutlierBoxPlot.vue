<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { STATUS_COLORS, CATEGORICAL_PALETTE } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

const props = defineProps<{
  resourceId: number | null;
}>();

interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

interface StateOutlier {
  stateId: number;
  stateName: string;
  quantityRating: BoxStats | null;
  marketValue: BoxStats | null;
  estimatedVolumeIndex: BoxStats | null;
}

const MAX_STATES_SHOWN = 12;

// "quantity" as recorded in the field is free text with no standardized
// unit (see box-plot data audit) — quantityRating and estimatedVolumeIndex
// (a log-scale, per-resource percentile normalization of the parsed
// quantity — see scripts/normalize-quantity.ts) are the comparable
// abundance signals, labeled plainly rather than implying false precision
// in the raw text.
const METRIC_LABELS = {
  quantityRating: "Abundance",
  marketValue: "Market Value",
  estimatedVolumeIndex: "Est. Volume",
} as const;
type MetricKey = keyof typeof METRIC_LABELS;

const analyticsStore = useAnalyticsStore();
const loading = ref(false);
const allByState = ref<StateOutlier[]>([]);
const metric = ref<MetricKey>("quantityRating");

const availableMetrics = computed(() =>
  (Object.keys(METRIC_LABELS) as MetricKey[]).filter((key) =>
    allByState.value.some((s) => s[key] !== null),
  ),
);

const byState = computed(() =>
  [...allByState.value]
    .sort((a, b) => (b[metric.value]?.median ?? 0) - (a[metric.value]?.median ?? 0))
    .slice(0, MAX_STATES_SHOWN),
);
const truncated = computed(() => allByState.value.length > MAX_STATES_SHOWN);

const fetchData = async () => {
  if (!props.resourceId) return;
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchStateResourceOutliers(props.resourceId);
    allByState.value = (data.byState || []).filter(
      (s: StateOutlier) => s.quantityRating || s.marketValue || s.estimatedVolumeIndex,
    );
    if (!allByState.value.some((s) => s[metric.value] !== null) && availableMetrics.value.length > 0) {
      metric.value = availableMetrics.value[0];
    }
  } catch (error) {
    console.error("outlier-boxplot-error", error);
    allByState.value = [];
  } finally {
    loading.value = false;
  }
};

const boxColor = CATEGORICAL_PALETTE[2];

const chartOption = computed(() => {
  const categories = byState.value.map((s) => s.stateName);
  const boxData = byState.value.map((s) => {
    const stats = s[metric.value];
    return stats ? [stats.min, stats.q1, stats.median, stats.q3, stats.max] : [0, 0, 0, 0, 0];
  });
  const outlierPoints: [number, number][] = [];
  byState.value.forEach((s, index) => {
    const stats = s[metric.value];
    stats?.outliers.forEach((value) => outlierPoints.push([index, value]));
  });

  return {
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const state = categories[p.dataIndex] ?? "";
        if (p.seriesType === "boxplot") {
          const [min, q1, median, q3, max] = p.data;
          const tier = tierFor(median);
          return [
            `<strong>${state}</strong>`,
            `Median: ${median} (${tier})`,
            `Range: ${min} – ${max}`,
            `Q1 – Q3: ${q1} – ${q3}`,
          ].join("<br/>");
        }
        const value = p.data[1];
        return `<strong>${state}</strong><br/>Outlier: ${value} (${tierFor(value)})`;
      },
    },
    grid: { left: 48, right: 24, top: 24, bottom: 48 },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: { color: "#64748B", fontSize: 11 },
      boundaryGap: true,
    },
    yAxis: { type: "value", axisLabel: { color: "#64748B" } },
    series: [
      {
        name: METRIC_LABELS[metric.value],
        type: "boxplot",
        data: boxData,
        itemStyle: {
          color: `${boxColor}22`,
          borderColor: boxColor,
        },
      },
      {
        name: "Outliers",
        type: "scatter",
        data: outlierPoints,
        symbolSize: 7,
        itemStyle: { color: STATUS_COLORS.critical },
      },
    ],
  };
});

watch(() => props.resourceId, fetchData);
onMounted(fetchData);
</script>

<template>
  <AnalyticsChartCard
    :title="`${METRIC_LABELS[metric]} · Outliers by State`"
    :description="truncated ? `Top ${MAX_STATES_SHOWN} of ${allByState.length} states, by median · hover a box for Low/Medium/High` : 'Spread and outliers across states · hover a box for Low/Medium/High'"
    :loading="loading"
    :empty="byState.length === 0"
  >
    <template #actions>
      <div class="flex gap-1 rounded-lg bg-uimuted-100 p-1">
        <button
          v-for="option in availableMetrics"
          :key="option"
          type="button"
          class="rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors"
          :class="metric === option ? 'bg-white text-uigreen-700 shadow-sm' : 'text-uimuted-500 hover:text-uimuted-700'"
          @click="metric = option"
        >
          {{ METRIC_LABELS[option] }}
        </button>
      </div>
    </template>
    <VChart :option="chartOption" style="height: 300px" autoresize />
  </AnalyticsChartCard>
</template>
