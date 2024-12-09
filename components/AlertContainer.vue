<script setup lang="ts">
const props = defineProps({
  alertType: {
    type: String as PropType<'success' | 'error' | 'warning' | 'info'>,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  action: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Function as PropType<(...args: any[]) => void>,
    default: () => {},
  }
})
</script>

<template>
  <div class="max-w-lg mx-auto w-full">
    <div>
      <div
        class="max-w-[20rem] mx-auto w-full flex items-center justify-center"
      >
        <NuxtImg v-if="props.alertType === 'error'" src="/img/error.png" alt="Error" class="mx-auto" />
        <NuxtImg v-if="props.alertType === 'success'" src="/img/check_circle.png" alt="Success" class="mx-auto" />
      </div>
    </div>
    <div class="mt-4 text-center max-w-[24rem] mx-auto w-full">
      <h4 class="font-bold text-2xl">{{ props.title }}</h4>
      <p class="text-lg font-medium">{{ props.description }}</p>
      <div class="mt-4 max-w-[10rem] mx-auto w-full">
        <UButton
          :label="props.alertType === 'error' ? 'Refresh' : 'Continue'"
          class="bg-uiearth-700 dark:bg-uiearth-400 dark:text-white"
          @click="props.action"
        />
      </div>
    </div>
  </div>
</template>
