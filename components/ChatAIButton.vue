<script setup lang="ts">
const isHovered = ref(false);

const emit = defineEmits(['open']);

const openSlideover = () => {
  emit('open');
};
</script>

<template>
  <div>
    <UButton
      class="group w-auto flex items-center fixed bottom-4 right-4 bg-uiearth-500 text-white rounded-full shadow-lg hover:bg-uiearth-700 transition-all duration-300 ease-in-out"
      :class="{ 'px-4': !isHovered, 'px-6': isHovered }"
      @click="openSlideover"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6" />
      <span
        class="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300"
        :class="isHovered ? 'w-auto' : 'w-0'"
        >Ask GeoRes AI</span
      >
    </UButton>
  </div>
</template>
