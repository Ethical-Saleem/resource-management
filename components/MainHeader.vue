<script setup lang="ts">
const profItems = [
  [
    {
      label: "johnDoe@gmail.com",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Manage Account",
      icon: "i-heroicons-wrench-screwdriver",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-start-on-rectangle",
    },
  ],
];

defineProps({
  title: {
    type: String,
    default: () => "Home",
  },
});

const emit = defineEmits(["toggle-sidebar"]);
const toggleSidebar = () => {
  emit("toggle-sidebar");
};

const colorMode = useColorMode();

const toggleColorScheme = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};

const setSystemColorMode = (event: Event) => {
  event.preventDefault();
  colorMode.preference = "system";
};
</script>

<template>
  <div class="flex items-center justify-between h-16 bg-white dark:bg-uimuted-800 items-center gap-2 z-[1]">
    <div class="flex items-center gap-2">
      <button
        class="flex size-10 items-center justify-center ms-3"
        @click="toggleSidebar"
      >
        <UIcon name="i-heroicons-bars-3-center-left" class="w-6 h-6" />
      </button>
      <h2 class="font-bold">Raw Materials Research and Development Council</h2>
    </div>
    <div class="">
      <slot />
    </div>
    <div class="flex items-center gap-2 h-16 px-2">
      <label
        class="theme-toggle relative cursor-pointer"
        @contextmenu="setSystemColorMode"
      >
        <input
          type="checkbox"
          class="sr-only"
          @change="toggleColorScheme"
        >
        <span
          class="toggle-inner block relative bg-uimuted-950 ring-1 ring-uiearth-300 rounded-full w-14 h-7 flex items-center justify-between px-2"
        >
          <span
            :class="{
              'translate-x-7': colorMode.preference === 'dark',
              'translate-x-0': colorMode.preference !== 'dark',
            }"
            class="absolute left-0 top-0 h-7 w-7 bg-uigreen-200 rounded-full shadow-md flex items-center justify-center transform motion-safe:transition-all motion-safe:duration-300"
          >
            <UIcon
              :name="
                colorMode.preference === 'dark'
                  ? 'i-heroicons-moon-solid'
                  : 'i-heroicons-sun-solid'
              "
              class="dark:text-gray-700 text-uiyellow-400"
            />
          </span>
        </span>
      </label>
    </div>
  </div>
</template>
