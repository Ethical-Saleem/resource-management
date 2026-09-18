<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    badge?: string;
    loading?: boolean;
    empty?: boolean;
    emptyMessage?: string;
  }>(),
  {
    description: undefined,
    badge: undefined,
    loading: false,
    empty: false,
    emptyMessage: "No data available for this selection.",
  },
);
</script>

<template>
  <div class="flex h-full flex-col rounded-2xl border border-uimuted-200 bg-white p-4 lg:p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-uimuted-950">{{ title }}</span>
          <span
            v-if="badge"
            class="rounded px-1.5 py-0.5 text-[10px] font-bold"
            style="background: #ede9fe; color: #6d28d9"
          >
            {{ badge }}
          </span>
        </div>
        <p v-if="description" class="mt-0.5 text-xs text-uimuted-400">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex flex-shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.filters" class="mt-3 flex flex-wrap items-center gap-2">
      <slot name="filters" />
    </div>

    <div v-if="loading" class="flex flex-1 items-center justify-center py-16">
      <div class="h-6 w-6 animate-spin rounded-full border-2 border-uigreen-500 border-t-transparent" />
    </div>
    <div v-else-if="empty" class="flex flex-1 items-center justify-center py-16">
      <p class="text-sm text-uimuted-400">{{ emptyMessage }}</p>
    </div>
    <div v-else class="mt-3 flex flex-1 flex-col">
      <slot />
    </div>
  </div>
</template>
