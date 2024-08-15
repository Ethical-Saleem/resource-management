<script setup lang="ts">
interface NewLgaResource {
  lgaId: number;
  name: string;
  quantity: number;
  quality: string | null;
  value: number | null;
}

const props = defineProps<{
  selectedStates: Array<{
    id: number;
    name: string;
    selectedLgas: NewLgaResource[];
  }>;
}>();

const emit = defineEmits(["remove-state", "remove-lga", "update-lga-details"]);

function removeState(stateId: number) {
  emit("remove-state", stateId);
}

function removeLga(stateId: number, lgaId: number) {
  emit("remove-lga", stateId, lgaId);
}

function updateLgaDetail(stateId: number, lga: NewLgaResource) {
  emit("update-lga-details", stateId, lga);
}
</script>

<template>
  <div class="w-full p-4">
    <div class="">
      <h3 class="mb-5">Selected Locations</h3>
      <ul class="">
        <li v-for="state in props.selectedStates" :key="state.id" class="mb-4">
          <div class="flex items-center mb-3">
            <span class="text-md pr-4">
              {{ state.name }}
            </span>
            <UTooltip text="Remove state">
              <UButton
                class="rounded-full p-1"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                size="sm"
                @click="removeState(state.id)"
              />
            </UTooltip>
          </div>
          <ul class="mx-5">
            <li v-for="lga in state.selectedLgas" :key="lga.lgaId" class="mb-3">
              <div class="flex items-center mb-3">
                <span class="text-md pr-4">
                  {{ lga.name }}
                </span>
                <UTooltip text="Remove LGA">
                  <UButton
                    class="rounded-full text-sm p-1"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    size="sm"
                    @click="removeLga(state.id, lga.lgaId)"
                  />
                </UTooltip>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <UFormGroup label="Quantity" class="mb-3">
                  <UInput v-model="lga.quantity" type="number" @input="updateLgaDetail(state.id, lga)" />
                </UFormGroup>
                <UFormGroup label="Quality" class="mb-3">
                  <UInput v-model="lga.quality" @input="updateLgaDetail(state.id, lga)" />
                </UFormGroup>
                <UFormGroup label="Value" class="mb-3">
                  <UInput v-model="lga.value" type="number" @input="updateLgaDetail(state.id, lga)" />
                </UFormGroup>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
