<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { CATEGORICAL_PALETTE } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

type StateMetric = {
  name: string;
  average: number;
};

interface Data {
  valueChainRating: number;
  data: StateMetric[];
}

const props = defineProps<{
  resourceId: number | null;
  stateId: number | null;
}>();

const analyticsStore = useAnalyticsStore();
const loading = ref(false);
const stateMetrics = ref<StateMetric[]>([]);
const valueRating = ref<number | null>(null);

const chartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: (p: any) => `${p.marker} ${p.name}: ${p.value} (${tierFor(p.value)})`,
  },
  grid: { left: 140, right: 24, top: 12, bottom: 12 },
  xAxis: { type: "value", axisLabel: { color: "#64748B" } },
  yAxis: {
    type: "category",
    data: stateMetrics.value.map((item) => item.name),
    axisLabel: { color: "#334155", fontWeight: 600, fontSize: 12 },
  },
  series: [
    {
      type: "bar",
      data: stateMetrics.value.map((item, index) => ({
        value: item.average,
        itemStyle: { color: CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length] },
      })),
      barMaxWidth: 22,
      itemStyle: { borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: "right", color: "#64748B", fontSize: 11 },
    },
  ],
}));

const fetchData = async () => {
  if (!props.resourceId || !props.stateId) return;
  loading.value = true;
  try {
    const res: Data = await analyticsStore.dispatchFetchStateResourceValueMetrics(
      props.resourceId,
      props.stateId,
    );
    stateMetrics.value = (res.data || []).map((item) => ({
      name: item.name,
      average: item.average,
    }));
    valueRating.value = res.valueChainRating;
  } catch (error) {
    console.error("resource-metrics-chart-error", error);
    stateMetrics.value = [];
  } finally {
    loading.value = false;
  }
};

watch([() => props.resourceId, () => props.stateId], fetchData);
onMounted(fetchData);
</script>

<template>
  <AnalyticsChartCard
    title="Value-Chain Drivers"
    description="Market value, access, environmental impact & industry challenges"
    :loading="loading"
    :empty="stateMetrics.length === 0"
  >
    <VChart :option="chartOption" style="height: 260px" autoresize />
    <div v-if="valueRating" class="mt-2 flex items-center justify-end">
      <p class="text-xs font-medium text-uimuted-500">
        Value Chain Rating: <span class="text-sm font-semibold text-uimuted-900">{{ valueRating.toFixed(2) }}</span>
      </p>
    </div>
  </AnalyticsChartCard>
</template>
