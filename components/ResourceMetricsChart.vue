<script setup lang="ts">
import { Pie } from "vue-chartjs";
import { useAnalyticsStore } from "~/stores/analytics-store";
// import { useLoadingStore } from "~/stores/loading-store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import type { Resource } from "~/types";

ChartJS.register(ArcElement, Tooltip, Legend);

type StateMetric = {
  name: string;
  average: number;
}

interface Data {
  valueChainRating: number;
  data: StateMetric[];
}

const analyticsStore = useAnalyticsStore();
// const loadingStore = useLoadingStore();

const props = defineProps({
  categoryId: {
    type: Number,
    default: () => 2,
  },
});

const resourceId = ref<number | null>(null);
const selectedStateId = ref<number | null>(null);
const states = ref([]);
const resourceStates = ref([]);
const loading = ref(false);
const fetching = ref(false);
const resources = ref([] as Resource[]);
const stateMetrics = ref([] as StateMetric[]);
const valueRating = ref<number | null>(null);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, // Important to allow custom sizing
});

const chartData = computed(() => {
  const labels = stateMetrics.value.map((item) => item.name);
  const data = stateMetrics.value.map((item) => item.average);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
});

const fetchData = async () => {
  loading.value = true;
  try {
    console.log("resourceId", resourceId.value);
    if (resourceId.value && selectedStateId.value) {
      const res: Data = await analyticsStore.dispatchFetchStateResourceValueMetrics(
        resourceId.value,
        selectedStateId.value
      );
      //   stateMetrics.value = data;
      stateMetrics.value = res.data.map((item) => ({
        name: item.name,
        average: item.average,
      }));
      valueRating.value = res.valueChainRating;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// const hexToRgba = (hex: string, alpha: number): string => {
//   const r = parseInt(hex.slice(1, 3), 16);
//   const g = parseInt(hex.slice(3, 5), 16);
//   const b = parseInt(hex.slice(5, 7), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };

watch(
  () => props.categoryId,
  async (newCategoryId) => {
    await fetchResources(newCategoryId);
    // await fetchData();
  }
);

const fetchResources = async (categoryId: number) => {
  loading.value = true;
  try {
    const data: Resource[] = await useApi.get(
      `/resource/fetch-resources-data-by-category/${categoryId}`
    );
    resources.value = data;
    if (data.length > 0) {
      resourceId.value = data[0].id; // Set the first resource as the default
    }
    if (resourceId.value) {
      await fetchResourceStates();
    }
    console.log("data", data);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const fetchResourceStates = async () => {
  fetching.value = true;
  try {
    if (resourceId.value) {
      const data = await analyticsStore.dispatchFetchResourceStates(
        resourceId.value
      );
      resourceStates.value = data;
      states.value = data;
      console.log("data", data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    fetching.value = false;
  }
};

// watchEffect(() => {
//   if (resourceId.value) {
//     fetchData();
//   }
// });

onMounted(async () => {
  //   states.value = await useApi.get("/territory/fetch-all-states");
  await fetchResources(props.categoryId);
  //   await fetchData();
});
</script>

<template>
  <UCard
    :ui="{
      base: 'mb-4',
      divide: 'divide-y divide-uiearth-700 dark:divide-uiearth-800',
      ring: 'ring-1 ring-uiearth-200 dark:ring-uiearth-800',
      body: {
        padding: 'p-3 sm:p-6',
      },
      footer: {
        base: '',
        background: '',
        padding: 'px-2 pt-2 pb-2 sm:px-2',
      },
    }"
    class="bg-uigreen-50 ring-2 ring-uiearth-700"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h6 class="text-sm pr-1">State Level Metrics</h6>
          <UPopover mode="hover">
            <UButton label="?" variant="ghost" class="text-lg" />
            <template #panel>
              <div
                class="p-4 text-xs h-30 w-60 ring-2 ring-[#d292ff] overflow-y-auto"
              >
                <strong>Value-Chain Drivers</strong> <br><br>
                This chart compares various metrics for a specific resource
                across different states. The focus is to undertsand how each
                metric contributes to the value chain of the resource in the
                particular state The chart shows how each state performs in
                areas like market access, market value, environmental impact,
                and industry challenges. By hovering over the chart, you can see
                detailed information on each metric, helping you quickly
                understand where a state excels or needs improvement in resource
                management.
                <br><br>
                0 - 3 : Low <br>
                4 - 6 : Average <br>
                7 - 10 : High
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-12 gap-3 mb-3">
      <div class="col-span-12 lg:col-span-11 grid grid-cols-2 gap-2">
        <UFormGroup label="Resource">
          <USelectMenu
            v-model="resourceId"
            :options="resources"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
            @change="fetchResourceStates"
          />
        </UFormGroup>
        <UFormGroup label="State">
          <USelectMenu
            v-model="selectedStateId"
            :options="states"
            :loading="fetching"
            :disabled="fetching"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="-- Select --"
          />
        </UFormGroup>
      </div>
      <div class="col-span-12 lg:col-span-1 text-end">
        <UButton
          icon="i-heroicons-magnifying-glass"
          class="text-white rounded-full"
          :disabled="!selectedStateId"
          @click="fetchData"
        />
      </div>
    </div>
    <div v-if="!loading" class="">
      <div v-if="stateMetrics.length > 0">
        <div style="height: '300px'">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
        <div class="flex items-center justify-end">
          <p v-if="valueRating" class="text-xs font-medium">
            Value Chain Rating: <span class="text-sm font-semibold">{{ valueRating.toFixed(3) }}</span>
          </p>
        </div>
      </div>
      <div v-else class="mx-auto my-8">
        <div class="mx-auto text-center">
          <p class="text-sm">
            No data available to compare the selected resources
          </p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex items-center justify-center my-4">
      <div class="spinner" />
    </div>
  </UCard>
</template>

<style></style>
