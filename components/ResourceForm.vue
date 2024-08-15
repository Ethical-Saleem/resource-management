<script setup lang="ts">
import { useApi } from "~/composables/useApi";

interface NewResource {
  name: string;
  description: string | null;
  categoryId: number | null;
  amount: number | null;
  value: number | null;
  quality: string | null;
  colorCode: string | null;
  //   stateLgas: Array<{ stateId: number; lgasIds: number[] }>;
}

interface NewLgaResource {
  lgaId: number;
  name: string;
  quantity: number;
  quality: string | null;
  value: number | null;
}

const resource = ref<NewResource>({
  name: "",
  description: null,
  categoryId: null,
  amount: 0,
  value: 0,
  quality: "",
  colorCode: "",
  //   stateLgas: [],
});

const loading = ref(false);
const { data: categories, status } = useAsyncData("categories", () =>
  useApi.get("/resource/fetch-all-categories")
);

const selectedStates = ref<
  Array<{
    id: number;
    name: string;
    selectedLgas: NewLgaResource[];
  }>
>([]);
const selectedState = ref<{ id: number; name: string } | null>(null);

const onStateSelect = (state: { id: number; name: string }) => {
  //   selectedState.value = state;
  //   selectedStates.value.push({ ...state, selectedLgas: [] });
  if (!selectedStates.value.find((s) => s.id === state.id)) {
    selectedStates.value.push({ ...state, selectedLgas: [] });
    selectedState.value = state;
  }
};

const onLgaSelect = (lga: { id: number; name: string }) => {
  //   const state = selectedStates.value.find(
  //     (s) => s.id === selectedState.value!.id
  //   );
  //   if (state) {
  //     state.selectedLgas.push(lga);
  //   }
  const state = selectedStates.value.find(
    (s) => s.id === selectedState.value?.id
  );
  if (state && !state.selectedLgas.find((l) => l.lgaId === lga.id)) {
    state.selectedLgas.push({
      lgaId: lga.id,
      name: lga.name,
      quantity: 0,
      quality: "",
      value: null,
    });
  }
};

const updateLgaDetails = (stateId: number, lgaResource: NewLgaResource) => {
  const state = selectedStates.value.find((state) => state.id === stateId);
  if (state) {
    const lgaIndex = state.selectedLgas.findIndex(
      (lga) => lga.lgaId === lgaResource.lgaId
    );
    if (lgaIndex > -1) {
      state.selectedLgas[lgaIndex] = lgaResource;
    }
  }
};

function removeState(stateId: number) {
  selectedStates.value = selectedStates.value.filter(
    (state) => state.id !== stateId
  );
  //   selectedState.value = null;
}

function removeLga(stateId: number, lgaId: number) {
  const state = selectedStates.value.find((state) => state.id === stateId);
  console.log("lgas-selected", state, stateId, lgaId);
  if (state) {
    state.selectedLgas = state.selectedLgas.filter(
      (lga) => lga.lgaId !== lgaId
    );
    console.log("lgas-selected", state.selectedLgas);
  } else {
    console.log("no state found");
  }
}
const resetForm = () => {
  resource.value = {
    name: "",
    description: null,
    categoryId: null,
    amount: 0,
    value: 0,
    quality: "",
    colorCode: "",
  };
  selectedStates.value = [];
};

const submitData = async () => {
  const stateIds = selectedStates.value.map((state) => state.id);
  const lgaResources = selectedStates.value.flatMap((state) =>
    state.selectedLgas.map((lga) => ({
      lgaId: lga.lgaId,
      quantity: lga.quantity,
      quality: lga.quality,
      value: lga.value,
    }))
  );

  const createData = {
    name: resource.value.name,
    description: resource.value.description,
    categoryId: resource.value.categoryId,
    amount: resource.value.amount,
    quality: resource.value.quality,
    value: resource.value.value,
    colorCode: resource.value.colorCode,
    stateIds: stateIds,
    lgaResources: lgaResources,
  };

  loading.value = true;

  try {
    const res = await useApi.post("/resource/create-resource", createData);
    if (res) {
      alert("New Resource added successfully");
      resetForm()
    }
  } catch (error) {
    console.log(error);
    alert("Error adding new resource data");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row px-3">
    <div class="w-1/2">
      <UFormGroup label="Resource Name" class="mb-3">
        <UInput v-model="resource.name" />
      </UFormGroup>
      <UFormGroup label="Description" class="mb-3">
        <UTextarea v-model="resource.description" />
      </UFormGroup>
      <UFormGroup label="Category" class="mb-3">
        <USelectMenu
          v-model="resource.categoryId"
          :options="categories"
          option-attribute="name"
          value-attribute="id"
          :loading="status === 'pending'"
        />
      </UFormGroup>
      <!-- <UFormGroup label="Quantity" class="mb-3">
        <UInput v-model="resource.amount" type="number" />
      </UFormGroup>
      <UFormGroup label="Value" class="mb-3">
        <UInput v-model="resource.value" type="number" />
      </UFormGroup>
      <UFormGroup label="Quality" class="mb-3">
        <UInput v-model="resource.quality" />
      </UFormGroup> -->
      <div class="mb-3">
        <StateSelect @state-selected="onStateSelect" />
      </div>
      <div v-if="selectedState" class="mb-3">
        <LgaSelect :state-id="selectedState.id" @lga-selected="onLgaSelect" />
      </div>
      <UFormGroup
        label="Color Code"
        help="Select a unique color for the resource."
        class="mb-3"
      >
        <UInput
          v-model="resource.colorCode"
          type="color"
          class="cursor-pointer"
        />
      </UFormGroup>

      <div class="pt-8">
        <UButton block class="flex items-center text-white" :loading="loading" @click="submitData">
          <UIcon name="i-heroicons-plus" />
          <span class="pl-2">Submit</span>
        </UButton>
      </div>
    </div>
    <div class="w-1/2">
      <SelectedLocations
        :selected-states="selectedStates"
        @update-lga-details="updateLgaDetails"
        @remove-lga="removeLga"
        @remove-state="removeState"
      />
    </div>
  </div>
</template>
