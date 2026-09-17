<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { COMPARISON_PAIR } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

import type { State } from "~/types";

interface StateMetric {
  resourceName: string;
  metrics: Metric[];
}

type Metric = {
  metricName: string;
  state1: number;
  state2: number;
};

const props = defineProps<{
  resourceId: number | null;
}>();

const analyticsStore = useAnalyticsStore();

const selectedStateId1 = ref<number | null>(null);
const selectedStateId2 = ref<number | null>(null);
const loading = ref(false);
const fetching = ref(false);
const states = ref<State[]>([]);
const stateMetrics = ref<StateMetric>({} as StateMetric);

const state1Name = computed(
  () => states.value.find((s) => s.id === selectedStateId1.value)?.name || "State 1",
);
const state2Name = computed(
  () => states.value.find((s) => s.id === selectedStateId2.value)?.name || "State 2",
);

const chartOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params: any[]) => {
      const lines = params.map(
        (p) => `${p.marker} ${p.seriesName}: ${p.value} (${tierFor(p.value)})`,
      );
      return [`<strong>${params[0]?.axisValue ?? ""}</strong>`, ...lines].join("<br/>");
    },
  },
  legend: { bottom: 0, textStyle: { color: "#64748B" } },
  grid: { left: 40, right: 24, top: 24, bottom: 48 },
  xAxis: {
    type: "category",
    data: (stateMetrics.value.metrics || []).map((m) => m.metricName),
    axisLabel: { color: "#64748B", fontSize: 11, interval: 0, rotate: 20 },
  },
  yAxis: { type: "value", max: 10, axisLabel: { color: "#64748B" } },
  series: [
    {
      name: state1Name.value,
      type: "bar",
      data: (stateMetrics.value.metrics || []).map((m) => m.state1),
      itemStyle: { color: COMPARISON_PAIR[0], borderRadius: [4, 4, 0, 0] },
    },
    {
      name: state2Name.value,
      type: "bar",
      data: (stateMetrics.value.metrics || []).map((m) => m.state2),
      itemStyle: { color: COMPARISON_PAIR[1], borderRadius: [4, 4, 0, 0] },
    },
  ],
}));

const fetchData = async () => {
  if (!props.resourceId || !selectedStateId1.value || !selectedStateId2.value) return;
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchResourceStatesCompareMetrics(
      props.resourceId,
      selectedStateId1.value,
      selectedStateId2.value,
    );
    stateMetrics.value = data;
  } catch (error) {
    console.error("resource-compare-state-error", error);
    stateMetrics.value = {} as StateMetric;
  } finally {
    loading.value = false;
  }
};

const fetchResourceStates = async () => {
  if (!props.resourceId) return;
  fetching.value = true;
  try {
    const data = await analyticsStore.dispatchFetchResourceStates(props.resourceId);
    states.value = data || [];
    selectedStateId1.value = states.value[0]?.id ?? null;
    selectedStateId2.value = states.value[1]?.id ?? null;
  } catch (error) {
    console.error("fetch-resource-states-error", error);
    states.value = [];
  } finally {
    fetching.value = false;
  }
};

watch(() => props.resourceId, fetchResourceStates);
watch([selectedStateId1, selectedStateId2], fetchData);

onMounted(async () => {
  await fetchResourceStates();
  await fetchData();
});
</script>

<template>
  <AnalyticsChartCard
    title="Inter-State Comparison"
    description="Compare a resource's metrics between two states"
    :loading="loading"
    :empty="!stateMetrics.metrics?.length"
  >
    <template #filters>
      <USelectMenu
        v-model="selectedStateId1"
        :options="states"
        :loading="fetching"
        option-attribute="name"
        value-attribute="id"
        searchable
        placeholder="State one"
        class="w-36"
      />
      <span class="text-xs font-semibold text-uimuted-400">vs</span>
      <USelectMenu
        v-model="selectedStateId2"
        :options="states"
        :loading="fetching"
        option-attribute="name"
        value-attribute="id"
        searchable
        placeholder="State two"
        class="w-36"
      />
    </template>
    <VChart :option="chartOption" style="height: 320px" autoresize />
  </AnalyticsChartCard>
</template>
