<script setup lang="ts">
import { icons } from '~/components/icons'

const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  customClass: {
    type: String,
    default: ''
  }
})

const icon = computed(() => icons[props.iconName] || '');

function parsePaths(svgContent: string) {
  // Extract the paths from the SVG content (assuming well-formed SVGs).
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const paths = Array.from(doc.querySelectorAll('path')).map((path) => ({
    d: path.getAttribute('d') || '',
  }));
  return paths;
}
</script>

<template>
  <svg
    v-if="icon"
    :class="props.customClass"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <g v-for="(path, index) in parsePaths(icon)" :key="index">
      <path :d="path.d" />
    </g>
  </svg>
</template>
