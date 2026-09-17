<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { useApiClient, unwrap } from "~/composables/useApiClient";
import { COMPARISON_PAIR } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

import type { Resource } from "~/types";

interface StateMetric {
  stateName: string;
  resource1: {
    accessToMarket: number;
    marketValue: number;
    quality: number;
    environmentalImpact: number;
    investmentOpportunities: number;
  };
  resource2: {
    accessToMarket: number;
    marketValue: number;
    quality: number;
    environmentalImpact: number;
    investmentOpportunities: number;
  };
}

const METRICS = [
  { key: "accessToMarket", label: "Access to Market" },
  { key: "marketValue", label: "Market Value" },
  { key: "quality", label: "Quality" },
  { key: "environmentalImpact", label: "Env. Impact" },
  { key: "investmentOpportunities", label: "Investment" },
] as const;

const props = defineProps<{
  stateId: number | null;
  categoryId: number;
}>();

const analyticsStore = useAnalyticsStore();

const resourceId1 = ref<number | null>(null);
const resourceId2 = ref<number | null>(null);
const loading = ref(false);
const fetching = ref(false);
const resources = ref<Resource[]>([]);
const stateMetrics = ref<StateMetric[]>([]);

const resource1Name = computed(
  () => resources.value.find((r) => r.id === resourceId1.value)?.name || "Resource 1",
);
const resource2Name = computed(
  () => resources.value.find((r) => r.id === resourceId2.value)?.name || "Resource 2",
);

const chartOption = computed(() => {
  const metric = stateMetrics.value[0];
  return {
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
      data: METRICS.map((m) => m.label),
      axisLabel: { color: "#64748B", fontSize: 11, interval: 0, rotate: 20 },
    },
    yAxis: { type: "value", max: 10, axisLabel: { color: "#64748B" } },
    series: [
      {
        name: resource1Name.value,
        type: "bar",
        data: metric ? METRICS.map((m) => metric.resource1[m.key]) : [],
        itemStyle: { color: COMPARISON_PAIR[0], borderRadius: [4, 4, 0, 0] },
      },
      {
        name: resource2Name.value,
        type: "bar",
        data: metric ? METRICS.map((m) => metric.resource2[m.key]) : [],
        itemStyle: { color: COMPARISON_PAIR[1], borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
});

const fetchData = async () => {
  if (!props.stateId || !resourceId1.value || !resourceId2.value) return;
  loading.value = true;
  try {
    const data = await analyticsStore.dispatchFetchStateResourceCompareMetrics(
      resourceId1.value,
      resourceId2.value,
      props.stateId,
    );
    stateMetrics.value = data || [];
  } catch (error) {
    console.error("state-resource-compare-error", error);
    stateMetrics.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchResources = async () => {
  fetching.value = true;
  try {
    const api = useApiClient();
    const data = unwrap<Resource[]>(
      await api.GET("/resource/fetch-resources-data-by-category/{categoryId}", {
        params: { path: { categoryId: props.categoryId } },
      }),
    );
    resources.value = data;
    resourceId1.value = data[0]?.id ?? null;
    resourceId2.value = data[1]?.id ?? null;
  } catch (error) {
    console.error("fetch-resources-error", error);
    resources.value = [];
  } finally {
    fetching.value = false;
  }
};

watch(() => props.categoryId, fetchResources);
watch([() => props.stateId, resourceId1, resourceId2], fetchData);

onMounted(async () => {
  await fetchResources();
  await fetchData();
});
</script>

<template>
  <AnalyticsChartCard
    title="Cross-Resource Comparison"
    description="Compare two resources within the selected state"
    :loading="loading"
    :empty="stateMetrics.length === 0"
  >
    <template #filters>
      <USelectMenu
        v-model="resourceId1"
        :options="resources"
        :loading="fetching"
        option-attribute="name"
        value-attribute="id"
        searchable
        placeholder="Resource one"
        class="w-40"
      />
      <span class="text-xs font-semibold text-uimuted-400">vs</span>
      <USelectMenu
        v-model="resourceId2"
        :options="resources"
        :loading="fetching"
        option-attribute="name"
        value-attribute="id"
        searchable
        placeholder="Resource two"
        class="w-40"
      />
    </template>
    <VChart :option="chartOption" style="height: 320px" autoresize />
  </AnalyticsChartCard>
</template>
