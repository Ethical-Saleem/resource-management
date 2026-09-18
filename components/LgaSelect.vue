<script setup lang="ts">
import { useApiClient, unwrap } from "~/composables/useApiClient";
import type { Lga } from "~/types";

const lgas = ref([] as Lga[]);
const selectedLga = ref<number | null>(null);
const loading = ref(false);

const props = defineProps<{ stateId: number }>();

const dataEmit = defineEmits(["lga-selected"]);

watch(
  () => props.stateId,
  async (newStateId) => {
    await fetchStateLgas(newStateId);
  }
);

const onLgaChange = () => {
  const lga = lgas.value?.find((s) => s.id === selectedLga.value);
  console.log('lga-select', selectedLga.value, lga)
  if (lga) {
    dataEmit("lga-selected", lga);
    console.log('lga-select', selectedLga.value, lga)
  }
};
const fetchStateLgas = async (stateId: number) => {
  loading.value = true;

  try {
    const api = useApiClient();
    const res = unwrap<Lga[]>(
      await api.GET("/territory/fetch-state-lgas/{id}", {
        params: { path: { id: stateId } },
      }),
    );
    if (res) {
      lgas.value = res;
      console.log("lgas", res);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UFormGroup label="L.G.A">
    <USelectMenu
      v-model="selectedLga"
      :options="lgas"
      :loading="loading"
      option-attribute="name"
      value-attribute="id"
      searchable
      :placeholder="loading ? 'Fetching states' : '-- Select --'"
      @change="onLgaChange"
    />
  </UFormGroup>
</template>
