<script setup lang="ts">
import type { MapLocation } from "~/types";
import { useApiClient, unwrap } from "~/composables/useApiClient";

definePageMeta({ layout: false });

useHead({ title: "Map Explorer" });

const CATEGORY_META: Record<number, { name: string; color: string }> = {
  1: { name: "Solid Minerals", color: "#64748B" },
  2: { name: "Energy", color: "#FC8813" },
  3: { name: "Agriculture", color: "#0ABF98" },
};

const scope = ref<"country" | "state">("country");
const selectedStateId = ref<number | null>(null);
const selectedStateName = ref<string | null>(null);
const activeCategoryIds = ref<number[]>([1, 2, 3]);
const searchQuery = ref("");
const allLocations = ref<MapLocation[]>([]);
const selectedLocation = ref<MapLocation | null>(null);
const loading = ref(false);
const resourceMapRef = ref<{
  zoomIn: () => void;
  zoomOut: () => void;
  locate: () => void;
  showRouteTo: (destination: {
    lat: number;
    long: number;
  }) => Promise<{ distanceKm: number; durationMin: number }>;
  clearRoute: () => void;
} | null>(null);

const routeStatus = ref<"idle" | "loading" | "error" | "ready">("idle");
const routeInfo = ref<{ distanceKm: number; durationMin: number } | null>(null);
const routeError = ref<string | null>(null);

const fetchLocations = async () => {
  loading.value = true;
  selectedLocation.value = null;
  try {
    const api = useApiClient();
    const data = unwrap<MapLocation[]>(
      await api.GET("/resource/fetch-map-locations", {
        params: {
          query: selectedStateId.value ? { stateId: selectedStateId.value } : {},
        },
      }),
    );
    allLocations.value = data;
  } catch (error) {
    console.error("Failed to load map locations:", error);
    allLocations.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLocations();
});

const categories = computed(() => {
  const counts = new Map<number, number>();
  for (const location of allLocations.value) {
    for (const id of location.categoryIds) {
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }
  return Object.entries(CATEGORY_META).map(([id, meta]) => ({
    id: Number(id),
    name: meta.name,
    color: meta.color,
    count: counts.get(Number(id)) || 0,
  }));
});

const filteredLocations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return allLocations.value.filter((location) => {
    const matchesCategory = location.categoryIds.some((id) =>
      activeCategoryIds.value.includes(id),
    );
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      location.stateName?.toLowerCase().includes(q) ||
      location.lgaName?.toLowerCase().includes(q) ||
      location.resourceName?.toLowerCase().includes(q) ||
      location.locationName?.toLowerCase().includes(q)
    );
  });
});

const stateCount = computed(
  () => new Set(allLocations.value.map((l) => l.stateId)).size,
);

const onDrillIntoState = async (stateId: number, stateName: string) => {
  scope.value = "state";
  selectedStateId.value = stateId;
  selectedStateName.value = stateName;
  await fetchLocations();
};

const resetToCountry = async () => {
  scope.value = "country";
  selectedStateId.value = null;
  selectedStateName.value = null;
  await fetchLocations();
};

const onSelectLocation = (location: MapLocation) => {
  selectedLocation.value = location;
  routeStatus.value = "idle";
  routeInfo.value = null;
  routeError.value = null;
};

const onGetDirections = async () => {
  if (!selectedLocation.value || !resourceMapRef.value) return;
  routeStatus.value = "loading";
  routeError.value = null;
  try {
    const result = await resourceMapRef.value.showRouteTo({
      lat: selectedLocation.value.lat,
      long: selectedLocation.value.long,
    });
    routeInfo.value = result;
    routeStatus.value = "ready";
  } catch (error) {
    routeError.value = error instanceof Error ? error.message : "Could not find directions.";
    routeStatus.value = "error";
  }
};

const closeDetailPanel = () => {
  selectedLocation.value = null;
  resourceMapRef.value?.clearRoute();
};
</script>

<template>
  <div class="fixed inset-0 flex flex-col bg-white">
    <AppHeader active="map" />

    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <MapFilterPanel
        class="hidden lg:flex"
        :categories="categories"
        :active-category-ids="activeCategoryIds"
        :search-query="searchQuery"
        :total-count="filteredLocations.length"
        :state-count="stateCount"
        @update:active-category-ids="activeCategoryIds = $event"
        @update:search-query="searchQuery = $event"
      />

      <!-- Map area -->
      <div class="relative min-w-0 flex-1 bg-uimuted-50">
        <MapResourceMap
          ref="resourceMapRef"
          :scope="scope"
          :state-id="selectedStateId"
          :locations="filteredLocations"
          :selected-location-id="selectedLocation?.id ?? null"
          @select-location="onSelectLocation"
          @drill-into-state="onDrillIntoState"
        />

        <!-- Breadcrumb -->
        <div class="absolute left-4 top-4 z-[400] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
          <button
            type="button"
            class="text-sm font-bold"
            :class="scope === 'country' ? 'text-uigreen-700' : 'text-uimuted-500 hover:text-uimuted-700'"
            @click="resetToCountry"
          >
            Nigeria
          </button>
          <UIcon name="i-heroicons-chevron-right" class="h-3 w-3 text-uimuted-300" />
          <span class="text-sm font-medium" :class="scope === 'state' ? 'font-bold text-uigreen-700' : 'text-uimuted-400'">
            {{ selectedStateName || "State" }}
          </span>
          <UIcon name="i-heroicons-chevron-right" class="h-3 w-3 text-uimuted-200" />
          <span class="text-sm font-medium text-uimuted-300">LGA</span>
        </div>

        <!-- Mobile category chips -->
        <div class="absolute left-4 right-20 top-16 z-[400] flex gap-2 overflow-x-auto lg:hidden">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-md"
            :style="
              activeCategoryIds.includes(category.id)
                ? { backgroundColor: category.color, color: '#fff' }
                : { backgroundColor: '#fff', color: '#475569' }
            "
            @click="
              activeCategoryIds = activeCategoryIds.includes(category.id)
                ? activeCategoryIds.filter((c) => c !== category.id)
                : [...activeCategoryIds, category.id]
            "
          >
            <span
              class="inline-block h-1.5 w-1.5 rounded-full"
              :style="{ backgroundColor: activeCategoryIds.includes(category.id) ? '#fff' : category.color }"
            />
            {{ category.name }}
          </button>
        </div>

        <!-- Legend -->
        <div class="absolute bottom-5 left-4 z-[400] hidden w-48 flex-col gap-2 rounded-2xl bg-white p-3.5 shadow-lg sm:flex">
          <div class="text-[11px] font-bold tracking-wide text-uimuted-700">LEGEND</div>
          <div v-for="category in categories" :key="category.id" class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: category.color }" />
            <span class="text-xs text-uimuted-600">{{ category.name }}</span>
          </div>
          <div class="h-px bg-uimuted-100" />
          <div class="text-[10.5px] italic text-uimuted-400">Bubble size = record count</div>
        </div>

        <!-- Zoom control -->
        <div class="absolute right-4 top-4 z-[400] flex w-10 flex-col overflow-hidden rounded-xl bg-white shadow-lg">
          <button type="button" class="flex h-10 items-center justify-center border-b border-uimuted-100 text-lg font-medium text-uimuted-700 hover:bg-uimuted-50" @click="resourceMapRef?.zoomIn()">
            +
          </button>
          <button type="button" class="flex h-10 items-center justify-center text-lg font-medium text-uimuted-700 hover:bg-uimuted-50" @click="resourceMapRef?.zoomOut()">
            −
          </button>
        </div>
        <button
          type="button"
          class="absolute right-4 top-[104px] z-[400] flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg hover:bg-uimuted-50"
          @click="resourceMapRef?.locate()"
        >
          <UIcon name="i-heroicons-map-pin" class="h-4 w-4 text-uimuted-700" />
        </button>

        <div v-if="loading" class="absolute inset-0 z-[500] flex items-center justify-center bg-white/60">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-uigreen-500 border-t-transparent" />
        </div>
      </div>

      <!-- Detail panel / bottom sheet -->
      <div
        v-if="selectedLocation"
        class="fixed inset-x-0 bottom-0 z-[600] max-h-[75vh] overflow-y-auto rounded-t-2xl bg-white shadow-[0_-8px_24px_rgba(15,23,42,0.12)] lg:static lg:z-auto lg:h-auto lg:w-[380px] lg:max-h-none lg:flex-shrink-0 lg:overflow-y-auto lg:rounded-none lg:border-l lg:border-uimuted-200 lg:shadow-[-6px_0_24px_rgba(15,23,42,0.06)]"
      >
        <div class="mx-auto mt-2.5 h-1 w-10 rounded-full bg-uimuted-200 lg:hidden" />
        <MapDetailPanel
          :location="selectedLocation"
          :route-status="routeStatus"
          :route-info="routeInfo"
          :route-error="routeError"
          @close="closeDetailPanel"
          @get-directions="onGetDirections"
        />
      </div>
    </div>
  </div>
</template>
