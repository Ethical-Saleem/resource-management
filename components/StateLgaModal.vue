<script setup lang="ts">
import type { State, Lga } from "~/types";

const props = defineProps({
  territoryData: {
    type: State | Lga
  }
});

const modalVisible = ref(false)
const territoryData = ref<State | Lga | null>(null);

const closeModal = () => {
  modalVisible.value = false
}
</script>

<template>
  <UModal
  v-model="modalVisible"
  prevent-close
  >
    <div class="p-4">
      <div class="">
        <p> Territory Name: {{ territoryData?.name }}</p>
      </div>
    </div>
  </UModal>
</template>