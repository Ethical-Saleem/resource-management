<script setup lang="ts">
const { status, refresh, daysRemaining } = useLicenseStatus();

onMounted(refresh);

const show = computed(
  () => status.value?.enabled && !status.value.unlocked && !status.value.locked,
);
// Only nag loudly in the last week; before that it's a quiet notice.
const urgent = computed(() => (daysRemaining.value ?? 99) <= 7);
</script>

<template>
  <div
    v-if="show"
    class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-[12.5px]"
    :class="urgent ? 'bg-uiearth-100 text-uiearth-800' : 'bg-uigreen-50 text-uigreen-800'"
  >
    <span>
      <strong>Licence key required:</strong>
      this installation stays fully available for
      <strong>{{ daysRemaining }} more {{ daysRemaining === 1 ? "day" : "days" }}</strong>.
      After that, access is suspended until a licence key is entered.
    </span>
    <NuxtLink to="/license" class="font-semibold underline">Enter licence key</NuxtLink>
  </div>
</template>
