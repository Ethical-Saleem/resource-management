<script setup>
import { useLoadingStore } from "~/stores/loading-store";
import { useApiClient, unwrap } from "~/composables/useApiClient";

const loadingStore = useLoadingStore();

definePageMeta({ layout: false });

const loading = ref(true);
const apiError = ref(false);
const errorData = ref(null);
const energyCount = ref(0);
const solidMineralCount = ref(0);
const agricCount = ref(0);
const strategics = ref([]);
const criticals = ref([]);
const groupings = ref([]);
const selectedGrouping = ref({});
const detailModal = ref(false);

const totalCount = computed(
  () => energyCount.value + solidMineralCount.value + agricCount.value,
);
const share = (n) =>
  totalCount.value ? Math.max(3, Math.round((n / totalCount.value) * 100)) : 0;

const categoryCards = computed(() => [
  { label: "Energy", count: energyCount.value, dot: "#FC8813", tint: "#FFF1D4" },
  { label: "Solid Minerals", count: solidMineralCount.value, dot: "#64748B", tint: "#F1F5F9" },
  { label: "Agricultural", count: agricCount.value, dot: "#0ABF98", tint: "#D0FBEA" },
]);

const openDetailModal = (data) => {
  detailModal.value = true;
  selectedGrouping.value = data;
};
const closeDetailModal = () => {
  detailModal.value = false;
};

const byName = (a, b) => a.name.localeCompare(b.name);

const dispatchFetchSummaryData = async () => {
  loading.value = true;
  apiError.value = false;
  loadingStore.showLoading();
  try {
    const api = useApiClient();
    const data = unwrap(await api.GET("/analytics/get-summary-data", {}));
    if (data) {
      energyCount.value = data.energyCount;
      solidMineralCount.value = data.solidCount;
      agricCount.value = data.agricCount;
      strategics.value = [...data.strategics].sort(byName);
      criticals.value = [...data.criticals].sort(byName);
      groupings.value = data.groupings
        .map((grouping) => ({
          ...grouping,
          resources: [...grouping.resources].sort(byName),
        }))
        .sort(byName);
    }
  } catch (error) {
    console.log("summary-data-error", error);
    apiError.value = true;
    errorData.value = "Failed to Fetch Summary Data. Please try again";
  } finally {
    loading.value = false;
    loadingStore.hideLoading();
  }
};

onMounted(dispatchFetchSummaryData);
</script>

<template>
  <div class="flex min-h-screen flex-col bg-uimuted-50">
    <AppHeader active="dashboard" />

    <main class="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-7">
      <div class="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-uimuted-950">Dashboard</h1>
          <p class="mt-0.5 text-[13px] text-uimuted-500">
            A snapshot of Nigeria's catalogued raw materials
          </p>
        </div>
        <NuxtLink
          to="/map-view"
          class="hidden items-center gap-2 rounded-[10px] border border-uimuted-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-uigreen-700 hover:bg-uimuted-50 sm:flex"
        >
          Open Map Explorer
          <UIcon name="i-heroicons-arrow-right-20-solid" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <div v-if="!loading && !apiError" class="flex flex-col gap-4">
        <!-- Stat cards -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div class="col-span-2 rounded-2xl bg-[#EBEFE7] p-5 lg:col-span-1">
            <div class="text-xs font-semibold text-uigreen-700">Total resources</div>
            <div class="mt-1.5 text-4xl font-extrabold tracking-tight text-uigreen-800">
              {{ totalCount }}
            </div>
            <div class="mt-0.5 text-xs text-uigreen-600">across 3 categories</div>
          </div>
          <div
            v-for="card in categoryCards"
            :key="card.label"
            class="rounded-2xl border border-uimuted-200 bg-white p-5"
          >
            <div class="flex items-center justify-between">
              <div class="text-xs font-semibold text-uimuted-500">{{ card.label }}</div>
              <div
                class="flex h-7 w-7 items-center justify-center rounded-lg"
                :style="{ background: card.tint }"
              >
                <span class="h-2.5 w-2.5 rounded-full" :style="{ background: card.dot }" />
              </div>
            </div>
            <div class="mt-1.5 text-4xl font-extrabold tracking-tight text-uimuted-950">
              {{ card.count }}
            </div>
            <div class="mt-2 h-1.5 rounded-full bg-uimuted-100">
              <div
                class="h-full rounded-full"
                :style="{ width: share(card.count) + '%', background: card.dot }"
              />
            </div>
          </div>
        </div>

        <!-- Lists -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_340px]">
          <section
            v-for="list in [
              { title: 'Strategic Minerals', items: strategics, badge: 'bg-[#D0FBEA] text-[#036252]' },
              { title: 'Critical Minerals', items: criticals, badge: 'bg-[#FFF1D4] text-[#9C4010]' },
            ]"
            :key="list.title"
            class="flex flex-col rounded-2xl border border-uimuted-200 bg-white p-5"
          >
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-[15px] font-bold text-uimuted-950">{{ list.title }}</h3>
              <span class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" :class="list.badge">
                {{ list.items.length }}
              </span>
            </div>
            <div class="max-h-[26rem] overflow-y-auto">
              <NuxtLink
                v-for="item in list.items"
                :key="item.id"
                :to="`/resource-data/${item.id}?resource=${item.name}`"
                class="group flex items-center gap-3 border-b border-uimuted-100 px-1.5 py-2.5 last:border-0 hover:bg-uimuted-50"
              >
                <span
                  class="h-3.5 w-3.5 flex-shrink-0 rounded-full"
                  :style="{ background: item.colorCode }"
                />
                <span class="flex-1 truncate text-[13.5px] font-medium text-uimuted-800">
                  {{ item.name }}
                </span>
                <UPopover mode="hover" :popper="{ placement: 'left' }">
                  <span class="text-[11.5px] text-uimuted-500 underline decoration-dotted">
                    {{ item.states?.length ?? 0 }}
                    {{ item.states?.length === 1 ? "state" : "states" }}
                  </span>
                  <template #panel>
                    <div class="max-w-[20rem] p-4">
                      <p class="mb-2 text-xs font-semibold text-uimuted-700">
                        {{ item.name }} is found in:
                      </p>
                      <p class="text-xs leading-relaxed text-uimuted-600">
                        {{ (item.states || []).join(", ") }}
                      </p>
                    </div>
                  </template>
                </UPopover>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="h-4 w-4 text-uimuted-400 group-hover:text-uigreen-600"
                />
              </NuxtLink>
            </div>
          </section>

          <!-- Categories -->
          <section class="flex flex-col rounded-2xl bg-[#EBEFE7] p-5">
            <h3 class="text-[15px] font-bold text-uigreen-800">Resource Categories</h3>
            <p class="mb-3.5 mt-1 text-xs text-uigreen-600">Select a group to see its materials</p>
            <div class="flex max-h-[26rem] flex-col gap-2 overflow-y-auto">
              <button
                v-for="item in groupings"
                :key="item.id"
                type="button"
                class="flex items-center justify-between rounded-[10px] bg-white px-3.5 py-2.5 text-left hover:ring-1 hover:ring-uigreen-500"
                @click="openDetailModal(item)"
              >
                <span class="text-[13px] font-medium text-uimuted-800">{{ item.name }}</span>
                <span class="rounded-full bg-uimuted-200 px-2 py-0.5 text-[11.5px] font-bold text-uimuted-700">
                  {{ item.resources.length }}
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>

      <AlertContainer
        v-else-if="!loading && apiError"
        alert-type="error"
        title="Error"
        :description="errorData"
        :action="dispatchFetchSummaryData"
      />

      <div v-else class="flex h-64 items-center justify-center">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-uigreen-500 border-t-transparent" />
      </div>
    </main>

    <UModal v-model="detailModal" prevent-close>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-bold">{{ selectedGrouping.name }}</h4>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="closeDetailModal"
            />
          </div>
        </template>
        <p class="text-sm font-medium text-uimuted-700">
          The following materials are classified under {{ selectedGrouping.name }}:
        </p>
        <div class="mt-4 grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pb-2 sm:grid-cols-3">
          <NuxtLink
            v-for="item in selectedGrouping.resources"
            :key="item.id"
            :to="`/resource-data/${item.id}?resource=${item.name}`"
            class="flex items-center gap-2 rounded-lg border border-uimuted-200 p-2 hover:border-uigreen-500 hover:bg-uimuted-50"
          >
            <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-uigreen-600" />
            <span class="truncate text-xs">{{ item.name }}</span>
          </NuxtLink>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
