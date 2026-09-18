<script setup lang="ts">
import { useAnalyticsStore } from "~/stores/analytics-store";
import { CATEGORICAL_PALETTE } from "~/composables/useChartPalette";
import { tierFor } from "~/composables/useMetricTier";

interface BarChartData {
  lgaId: number;
  lgaName: string;
  environmentalImpact: number;
  industryChallenges: number;
  stakeholderEngagement: number;
  investmentOpportunities: number;
}

const props = defineProps<{
  resourceId: number | null;
  stateId: number | null;
}>();

const analyticsStore = useAnalyticsStore();

const currentPage = ref(1);
const totalPages = ref(0);
const loading = ref(false);
const barChartData = ref<BarChartData[]>([]);

const loadPrev = () => {
  currentPage.value -= 1;
  fetchBarChartData();
};

const loadMore = () => {
  currentPage.value += 1;
  fetchBarChartData();
};

const fetchBarChartData = async () => {
  if (!props.resourceId) return;
  loading.value = true;
  try {
    const res = await analyticsStore.dispatchFetchResourceBarMetrics(
      props.resourceId,
      currentPage.value,
      props.stateId ?? undefined,
    );
    barChartData.value = res.barChartData;
    totalPages.value = res.totalPages;
    currentPage.value = res.currentPage;
  } catch (error) {
    console.error("resource-lga-metrics-error", error);
    barChartData.value = [];
  } finally {
    loading.value = false;
  }
};

const SERIES_NAMES = [
  "Environmental Impact",
  "Industry Challenges",
  "Stakeholder Engagement",
  "Investment Opportunities",
] as const;
const SERIES_KEYS = [
  "environmentalImpact",
  "industryChallenges",
  "stakeholderEngagement",
  "investmentOpportunities",
] as const;

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
  legend: { data: [...SERIES_NAMES], bottom: 0, textStyle: { color: "#64748B" } },
  grid: { left: 48, right: 24, top: 24, bottom: 48 },
  xAxis: {
    type: "category",
    data: barChartData.value.map((item) => item.lgaName),
    axisLabel: { color: "#64748B" },
  },
  yAxis: { type: "value", axisLabel: { color: "#64748B" } },
  series: SERIES_KEYS.map((key, index) => ({
    name: SERIES_NAMES[index],
    type: "bar",
    itemStyle: { color: CATEGORICAL_PALETTE[index] },
    data: barChartData.value.map((item) => item[key]),
  })),
}));

watch([() => props.resourceId, () => props.stateId], () => {
  currentPage.value = 1;
  fetchBarChartData();
});
onMounted(fetchBarChartData);
</script>

<template>
  <AnalyticsChartCard
    title="LGA-Level Insights"
    description="Environmental, industry, stakeholder & investment metrics by LGA"
    :loading="loading"
    :empty="barChartData.length === 0"
  >
    <template #actions>
      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-lg border border-uimuted-200 text-uimuted-500 hover:bg-uimuted-50 disabled:opacity-40"
        :disabled="currentPage === 1"
        @click="loadPrev"
      >
        <UIcon name="i-heroicons-chevron-left" class="h-3.5 w-3.5" />
      </button>
      <span class="text-[11px] font-semibold text-uimuted-400">{{ currentPage }} / {{ totalPages || 1 }}</span>
      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-lg border border-uimuted-200 text-uimuted-500 hover:bg-uimuted-50 disabled:opacity-40"
        :disabled="currentPage === totalPages"
        @click="loadMore"
      >
        <UIcon name="i-heroicons-chevron-right" class="h-3.5 w-3.5" />
      </button>
    </template>
    <VChart :option="chartOption" style="height: 340px" autoresize />
  </AnalyticsChartCard>
</template>
