<script setup lang="ts">
import type { MapLocation } from "~/types";
import { describeMetric } from "~/composables/useMetricTier";

const props = defineProps<{
  location: MapLocation;
  routeStatus: "idle" | "loading" | "error" | "ready";
  routeInfo: { distanceKm: number; durationMin: number } | null;
  routeError: string | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "get-directions"): void;
}>();

interface LocationInsightResult {
  available: boolean;
  insight: string | null;
  generatedAt: string | null;
  message?: string;
}

const aiStatus = ref<"loading" | "ready" | "unavailable" | "error">("loading");
const aiInsight = ref<string | null>(null);
const aiMessage = ref<string | null>(null);

async function loadInsight(locationId: number) {
  aiStatus.value = "loading";
  aiInsight.value = null;
  aiMessage.value = null;
  try {
    const result = await unwrap<LocationInsightResult>(
      await useApiClient().GET("/ai/location-insight/{id}", {
        params: { path: { id: locationId } },
      }),
    );
    if (result.available && result.insight) {
      aiInsight.value = result.insight;
      aiStatus.value = "ready";
    } else {
      aiMessage.value = result.message ?? "AI insight isn't available for this location.";
      aiStatus.value = "unavailable";
    }
  } catch {
    aiMessage.value = "Couldn't load an AI insight right now.";
    aiStatus.value = "error";
  }
}

watch(
  () => props.location.id,
  (id) => loadInsight(id),
  { immediate: true },
);

const CATEGORY_LABELS: Record<number, string> = {
  1: "Solid Minerals",
  2: "Energy",
  3: "Agriculture",
};

const categoryLabel = computed(
  () => CATEGORY_LABELS[props.location.categoryIds?.[0]] || "Resource",
);

const googleMapsUrl = computed(
  () =>
    `https://www.google.com/maps/dir/?api=1&destination=${props.location.lat},${props.location.long}`,
);

const formattedValue = computed(() => {
  const v = props.location.value;
  if (v === null || v === undefined) return "—";
  return `₦${Number(v).toLocaleString()}`;
});

// "quantity" as recorded in the field has no standardized unit across
// surveyors, so it isn't safe to show as a bare comparable number — the
// estimated volume index (falling back to the coarser abundance rating) is
// the normalized, comparable signal; the raw text stays on hover for anyone
// who wants the original reading.
const abundance = computed(() =>
  describeMetric(props.location.estimatedVolumeIndex ?? props.location.quantityRating),
);
const qualityTier = computed(() => describeMetric(props.location.quality));

const routeSummary = computed(() => {
  if (!props.routeInfo) return "";
  const { distanceKm, durationMin } = props.routeInfo;
  const distance = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;
  const duration = durationMin < 1 ? "<1 min" : `${Math.round(durationMin)} min`;
  return `${distance} · ${duration} drive`;
});
</script>

<template>
  <div class="flex h-full flex-col gap-4 p-5 lg:p-6">
    <div class="flex items-start justify-between">
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
        :style="{
          backgroundColor: `${location.colorCode}22`,
          color: location.colorCode ?? '#334155',
        }"
      >
        <span
          class="inline-block h-1.5 w-1.5 rounded-full"
          :style="{ backgroundColor: location.colorCode ?? '#334155' }"
        />
        {{ categoryLabel }}
      </span>
      <button
        class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-uimuted-100 text-uimuted-500 hover:bg-uimuted-200 lg:hidden"
        @click="$emit('close')"
      >
        <UIcon name="i-heroicons-x-mark" class="h-3.5 w-3.5" />
      </button>
    </div>

    <div>
      <h2 class="text-lg font-bold leading-snug text-uimuted-900 lg:text-xl">
        {{ location.resourceName }}
      </h2>
      <div class="mt-1.5 flex items-center gap-1.5 text-uimuted-500">
        <UIcon name="i-heroicons-map-pin" class="h-3.5 w-3.5 flex-shrink-0" />
        <span class="text-xs lg:text-sm">
          {{ location.locationName ? `${location.locationName} · ` : "" }}{{ location.lgaName }} · {{ location.stateName }}
        </span>
      </div>
    </div>

    <div class="h-px bg-uimuted-100" />

    <div class="grid grid-cols-3 gap-2.5">
      <div class="rounded-lg bg-uimuted-50 p-2.5" :title="location.quantity ? `As reported: ${location.quantity}` : undefined">
        <div class="text-[10px] font-bold uppercase tracking-wide text-uimuted-400">Abundance</div>
        <div class="mt-1 truncate text-sm font-bold text-uimuted-900 lg:text-base">
          {{ abundance.value }}
        </div>
        <div v-if="abundance.tier" class="mt-0.5 text-[10px] font-semibold" :style="{ color: abundance.color }">
          {{ abundance.tier }}
        </div>
      </div>
      <div class="rounded-lg bg-uimuted-50 p-2.5">
        <div class="text-[10px] font-bold uppercase tracking-wide text-uimuted-400">Value</div>
        <div class="mt-1 truncate text-sm font-bold text-uimuted-900 lg:text-base">
          {{ formattedValue }}
        </div>
      </div>
      <div class="rounded-lg bg-uimuted-50 p-2.5">
        <div class="text-[10px] font-bold uppercase tracking-wide text-uimuted-400">Quality</div>
        <div class="mt-1 truncate text-sm font-bold text-uimuted-900 lg:text-base">
          {{ qualityTier.value }}
        </div>
        <div v-if="qualityTier.tier" class="mt-0.5 text-[10px] font-semibold" :style="{ color: qualityTier.color }">
          {{ qualityTier.tier }}
        </div>
      </div>
    </div>

    <div>
      <button
        type="button"
        :disabled="routeStatus === 'loading'"
        class="flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-uigreen-600 py-2.5 text-sm font-semibold text-uigreen-700 transition-colors hover:bg-uigreen-50 disabled:cursor-wait disabled:opacity-70"
        @click="emit('get-directions')"
      >
        <UIcon
          :name="routeStatus === 'loading' ? 'i-heroicons-arrow-path' : 'i-heroicons-map'"
          class="h-4 w-4"
          :class="{ 'animate-spin': routeStatus === 'loading' }"
        />
        {{ routeStatus === "loading" ? "Finding route…" : "Get Directions" }}
      </button>

      <p v-if="routeStatus === 'ready'" class="mt-2 text-center text-xs font-medium text-uigreen-700">
        {{ routeSummary }}
      </p>
      <p v-else-if="routeStatus === 'error'" class="mt-2 text-center text-xs text-danger-600" style="color:#B3261E">
        {{ routeError }}
      </p>

      <a
        :href="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-uimuted-400 hover:text-uimuted-600"
      >
        <UIcon name="i-heroicons-arrow-top-right-on-square" class="h-3 w-3" />
        Open in Google Maps instead
      </a>
    </div>

    <div class="rounded-xl border border-violet-200 bg-violet-50 p-3.5">
      <div class="mb-1.5 flex items-center gap-1.5">
        <UIcon name="i-heroicons-sparkles" class="h-3.5 w-3.5 text-violet-600" />
        <span class="text-[11px] font-bold tracking-wide text-violet-700">AI INSIGHT</span>
        <UIcon
          v-if="aiStatus === 'loading'"
          name="i-heroicons-arrow-path"
          class="ml-auto h-3.5 w-3.5 animate-spin text-violet-400"
        />
      </div>
      <p v-if="aiStatus === 'loading'" class="text-xs leading-relaxed text-uimuted-400">
        Generating a summary from the survey data…
      </p>
      <p v-else-if="aiStatus === 'ready'" class="text-xs leading-relaxed text-uimuted-600">
        {{ aiInsight }}
      </p>
      <p v-else class="text-xs leading-relaxed text-uimuted-500">
        {{ aiMessage }}
      </p>
    </div>
  </div>
</template>
