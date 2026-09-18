<script setup lang="ts">
interface CategoryOption {
  id: number;
  name: string;
  color: string;
  count: number;
}

const props = defineProps<{
  categories: CategoryOption[];
  activeCategoryIds: number[];
  searchQuery: string;
  totalCount: number;
  stateCount: number;
}>();

const emit = defineEmits<{
  (e: "update:activeCategoryIds", value: number[]): void;
  (e: "update:searchQuery", value: string): void;
}>();

function toggleCategory(id: number) {
  const active = props.activeCategoryIds.includes(id);
  emit(
    "update:activeCategoryIds",
    active
      ? props.activeCategoryIds.filter((c) => c !== id)
      : [...props.activeCategoryIds, id],
  );
}
</script>

<template>
  <div class="flex h-full w-72 flex-shrink-0 flex-col gap-4 overflow-y-auto border-r border-uimuted-200 bg-white p-5">
    <div>
      <div class="text-base font-bold text-uimuted-900">Explore Resources</div>
      <div class="mt-0.5 text-xs text-uimuted-500">Filter by category, state or LGA</div>
    </div>

    <div class="flex items-center gap-2 rounded-lg border border-uimuted-200 px-3 py-2">
      <UIcon name="i-heroicons-magnifying-glass" class="h-4 w-4 flex-shrink-0 text-uimuted-400" />
      <input
        :value="searchQuery"
        type="text"
        placeholder="Search state or LGA…"
        class="w-full border-none bg-transparent p-0 text-sm text-uimuted-700 placeholder:text-uimuted-400 focus:outline-none focus:ring-0"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      >
    </div>

    <div>
      <div class="mb-2 text-[11px] font-bold uppercase tracking-wide text-uimuted-400">
        Resource Category
      </div>
      <div class="flex flex-col gap-0.5">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="flex items-center justify-between rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-uimuted-50"
          @click="toggleCategory(category.id)"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px]"
              :style="{
                backgroundColor: activeCategoryIds.includes(category.id) ? category.color : '#E2E8F0',
              }"
            >
              <UIcon
                v-if="activeCategoryIds.includes(category.id)"
                name="i-heroicons-check"
                class="h-3 w-3 text-white"
              />
            </div>
            <span class="text-sm font-medium text-uimuted-700">{{ category.name }}</span>
          </div>
          <span
            class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :style="{ backgroundColor: `${category.color}22`, color: category.color }"
          >
            {{ category.count }}
          </span>
        </button>
      </div>
    </div>

    <div class="h-px bg-uimuted-200" />

    <div class="mt-auto rounded-xl bg-uigreen-50 p-3.5">
      <p class="text-xs leading-relaxed text-uigreen-800">
        Showing <strong>{{ totalCount.toLocaleString() }}</strong> resource records across
        <strong>{{ stateCount }}</strong> states.
      </p>
    </div>
  </div>
</template>
