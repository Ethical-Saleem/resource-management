<script setup lang="ts">
import { useApiClient, unwrap } from "~/composables/useApiClient";
import type { State } from "~/types";

const selectedState = ref<number | null>(null);

const dataEmit = defineEmits(["state-selected"]);

const onStateChange = () => {
  const state = states.value?.find((s) => s.id === selectedState.value);
  if (state) {
    dataEmit("state-selected", state);
    console.log('state-select', selectedState, state);
  }
};

const { data: states, status } = await useAsyncData<State[]>("states", async () =>
  unwrap(await useApiClient().GET("/territory/fetch-all-states", {}))
);
</script>

<template>
  <UFormGroup label="State">
    <USelectMenu
      v-model="selectedState"
      :options="states"
      option-attribute="name"
      value-attribute="id"
      searchable
      :loading="status === 'pending'"
      :placeholder="status === 'pending' ? 'Fetching states' : '-- Select --'"
      @change="onStateChange"
    />
  </UFormGroup>
</template>
