<script setup lang="ts">
import { useApiClient, unwrap } from "~/composables/useApiClient";
import { useAnalyticsStore } from "~/stores/analytics-store";
import { describeMetric } from "~/composables/useMetricTier";
import type { Resource, State } from "~/types";

definePageMeta({ layout: false });

useHead({
  title: "Analytics",
  meta: [
    {
      name: "description",
      content: "Statistical data on the resource distribution in the 36 states in Nigeria",
    },
  ],
});

const CATEGORIES = [
  { id: 1, name: "Solid Minerals" },
  { id: 2, name: "Energy Resource" },
  { id: 3, name: "Agricultural Produce" },
];

const analyticsStore = useAnalyticsStore();

const selectedCategoryId = ref<number>(1);
const resources = ref<Resource[]>([]);
const states = ref<State[]>([]);
const selectedResourceId = ref<number | null>(null);
const selectedStateId = ref<number | null>(null);
const fetchingResources = ref(false);
const fetchingStates = ref(false);

const stats = ref({
  totalSites: null as number | null,
  statesCovered: null as number | null,
  avgMarketValue: null as number | null,
  avgQuality: null as number | null,
});
const statsLoading = ref(false);

const selectedResourceName = computed(
  () => resources.value.find((r) => r.id === selectedResourceId.value)?.name || "",
);

const marketValueTier = computed(() => describeMetric(stats.value.avgMarketValue));
const qualityTier = computed(() => describeMetric(stats.value.avgQuality));

const fetchResourcesForCategory = async (categoryId: number) => {
  fetchingResources.value = true;
  try {
    const api = useApiClient();
    const data = unwrap<Resource[]>(
      await api.GET("/resource/fetch-resources-data-by-category/{categoryId}", {
        params: { path: { categoryId } },
      }),
    );
    resources.value = data;
    selectedResourceId.value = data[0]?.id ?? null;
  } catch (error) {
    console.error("fetch-resources-for-category-error", error);
    resources.value = [];
  } finally {
    fetchingResources.value = false;
  }
};

const fetchStatesForResource = async (resourceId: number) => {
  fetchingStates.value = true;
  try {
    const data = await analyticsStore.dispatchFetchResourceStates(resourceId);
    states.value = data || [];
    selectedStateId.value = states.value[0]?.id ?? null;
  } catch (error) {
    console.error("fetch-states-for-resource-error", error);
    states.value = [];
    selectedStateId.value = null;
  } finally {
    fetchingStates.value = false;
  }
};

const fetchStats = async (resourceId: number) => {
  statsLoading.value = true;
  try {
    const [barMetrics, stateMetrics] = await Promise.all([
      analyticsStore.dispatchFetchResourceBarMetrics(resourceId, 1),
      analyticsStore.dispatchFetchStateLevelMetrics(resourceId),
    ]);
    stats.value.totalSites = barMetrics?.totalCount ?? 0;
    stats.value.statesCovered = Array.isArray(stateMetrics) ? stateMetrics.length : 0;
    const marketValues = (stateMetrics || []).map((s: { marketValue: number }) => s.marketValue);
    const qualities = (stateMetrics || []).map((s: { quality: number }) => s.quality);
    stats.value.avgMarketValue = average(marketValues);
    stats.value.avgQuality = average(qualities);
  } catch (error) {
    console.error("fetch-stats-error", error);
  } finally {
    statsLoading.value = false;
  }
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + (v || 0), 0) / values.length;
}

watch(selectedCategoryId, (categoryId) => {
  fetchResourcesForCategory(categoryId);
});

watch(selectedResourceId, (resourceId) => {
  if (resourceId) {
    fetchStatesForResource(resourceId);
    fetchStats(resourceId);
  }
});

onMounted(() => {
  fetchResourcesForCategory(selectedCategoryId.value);
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-uimuted-50">
    <AppHeader active="analytics" />

    <!-- Filter bar -->
    <div class="flex flex-wrap items-center gap-2 border-b border-uimuted-200 bg-white px-4 py-2.5 md:px-6">
      <USelectMenu
        v-model="selectedCategoryId"
        :options="CATEGORIES"
        option-attribute="name"
        value-attribute="id"
        class="w-40"
      />
      <USelectMenu
        v-model="selectedResourceId"
        :options="resources"
        :loading="fetchingResources"
        option-attribute="name"
        value-attribute="id"
        searchable
        placeholder="Select resource"
        class="w-52"
      />
      <USelectMenu
        v-model="selectedStateId"
        :options="states"
        :loading="fetchingStates"
        option-attribute="name"
        value-attribute="id"
        searchable
        placeholder="Select state"
        class="w-48"
      />
    </div>

    <main class="flex-1 px-4 py-5 md:px-6">
      <div v-if="!selectedResourceId" class="flex flex-1 items-center justify-center py-24">
        <div class="mx-auto max-w-96 text-center">
          <h4 class="mb-2 text-xl font-bold text-uimuted-900">Select a Resource</h4>
          <p class="text-sm text-uimuted-500">
            Choose a category and resource above to view statistics and analytics.
          </p>
        </div>
      </div>

      <div v-else class="flex flex-col gap-4">
        <!-- Stat tiles -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div class="rounded-2xl border border-uimuted-200 bg-white p-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-uigreen-100">
              <UIcon name="i-heroicons-map-pin" class="h-4 w-4 text-uigreen-800" />
            </div>
            <div class="mt-2.5 text-[10.5px] font-bold uppercase tracking-wide text-uimuted-400">
              Total Sites
            </div>
            <div class="mt-0.5 text-2xl font-extrabold text-uimuted-950">
              {{ statsLoading ? "…" : (stats.totalSites ?? "—") }}
            </div>
            <div class="mt-1 text-[11.5px] font-semibold text-uimuted-500">
              For {{ selectedResourceName || "selected resource" }}
            </div>
          </div>

          <div class="rounded-2xl border border-uimuted-200 bg-white p-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-uimuted-200">
              <UIcon name="i-heroicons-globe-alt" class="h-4 w-4 text-uimuted-700" />
            </div>
            <div class="mt-2.5 text-[10.5px] font-bold uppercase tracking-wide text-uimuted-400">
              States Covered
            </div>
            <div class="mt-0.5 text-2xl font-extrabold text-uimuted-950">
              {{ statsLoading ? "…" : (stats.statesCovered ?? "—") }} / 37
            </div>
            <div class="mt-1 text-[11.5px] font-semibold text-uimuted-500">National coverage</div>
          </div>

          <div class="rounded-2xl border border-uimuted-200 bg-white p-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-uiearth-100">
              <UIcon name="i-heroicons-currency-dollar" class="h-4 w-4 text-uiearth-800" />
            </div>
            <div class="mt-2.5 text-[10.5px] font-bold uppercase tracking-wide text-uimuted-400">
              Avg. Market Value
            </div>
            <div class="mt-0.5 text-2xl font-extrabold text-uimuted-950">
              {{ statsLoading ? "…" : marketValueTier.value }}
            </div>
            <div v-if="!statsLoading && marketValueTier.tier" class="mt-1 text-[11.5px] font-semibold" :style="{ color: marketValueTier.color }">
              {{ marketValueTier.tier }} <span class="text-uimuted-400">&middot; scale 0&ndash;10</span>
            </div>
          </div>

          <div class="rounded-2xl border border-uimuted-200 bg-white p-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg" style="background: #EDE9FE">
              <UIcon name="i-heroicons-sparkles" class="h-4 w-4" style="color: #6D28D9" />
            </div>
            <div class="mt-2.5 text-[10.5px] font-bold uppercase tracking-wide text-uimuted-400">
              Avg. Quality Index
            </div>
            <div class="mt-0.5 text-2xl font-extrabold text-uimuted-950">
              {{ statsLoading ? "…" : qualityTier.value }}
            </div>
            <div v-if="!statsLoading && qualityTier.tier" class="mt-1 text-[11.5px] font-semibold" :style="{ color: qualityTier.color }">
              {{ qualityTier.tier }} <span class="text-uimuted-400">&middot; scale 0&ndash;10</span>
            </div>
          </div>
        </div>

        <!-- Distribution & comparisons -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StateMetricsRadar :resource-id="selectedResourceId" />
          <ResourceLgaMetricsEChart :resource-id="selectedResourceId" :state-id="selectedStateId" />
          <ResourceMetricsChart :resource-id="selectedResourceId" :state-id="selectedStateId" />
          <StateResourceCompareRadar :state-id="selectedStateId" :category-id="selectedCategoryId" />
          <ResourceCompareState :resource-id="selectedResourceId" />
          <ResourceValueChainBar :resource-id="selectedResourceId" />
        </div>

        <!-- Outliers + scatter -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ResourceOutlierBoxPlot :resource-id="selectedResourceId" />
          <ResourceMarketScatter :resource-id="selectedResourceId" />
        </div>

        <!-- Heatmap -->
        <ResourceMetricHeatmap :state-id="selectedStateId" :category-id="selectedCategoryId" />
      </div>
    </main>
  </div>
</template>
