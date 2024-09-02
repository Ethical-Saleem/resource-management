<script setup lang="ts">
const isMenuOpen = ref(false);

const colorMode = useColorMode();

const toggleColorScheme = () => {
  // if (colorMode.preference === "dark") {
  //   colorMode.preference = "light";
  // } else if (colorMode.preference === "light") {
  //   colorMode.preference = "system";
  // } else {
  //   colorMode.preference = "dark";
  // }
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};

const setSystemColorMode = (event: Event) => {
  event.preventDefault();
  colorMode.preference = "system";
};
</script>

<template>
  <div class="group/landing scrolled">
    <div
      class="group/nav ltablet:max-w-[1000px] ptablet:max-w-[47rem] fixed inset-x-0 top-0 z-50 mx-auto max-w-[350px] group-[&.scrolled]/landing:mt-2 group-[&:not(.scrolled)]/landing:mt-4 motion-safe:transition-all motion-safe:duration-200 lg:max-w-7xl"
    >
      <div
        class="bg-uiearth-950 group-[&.scrolled]/landing:dark:bg-muted-950/95 group-[&.scrolled]/landing:border-muted-200 group-[&.scrolled]/landing:dark:border-muted-700 group-[&.scrolled]/landing:motion-safe:shadow-muted-300/30 group-[&.scrolled]/landing:motion-safe:dark:shadow-muted-800/20 flex items-center justify-between rounded-2xl border p-4 group-[&:not(.scrolled)]/landing:border-transparent group-[&.scrolled]/landing:bg-uiearth/95 motion-safe:transition-all motion-safe:duration-200 group-[&.scrolled]/landing:motion-safe:shadow-xl"
      >
        <div class="flex w-1/2 items-center gap-2 md:w-1/5">
          <NuxtLink to="/" class="flex items-center">
            <NuxtImg src="/img/rmrdc.png" width="100" height="100" />
            <span class="text-xl text-uigreen-500 font-bold">RMRDC</span>
          </NuxtLink>
        </div>
        <div
          :class="[
            'ltablet:static ltablet:w-auto ltablet:flex ltablet:flex-row dark:bg-uiearth-950 ltablet:!bg-transparent ltablet:mx-0 fixed inset-x-0 top-20 mx-auto w-[calc(100%_-_2rem)] items-center justify-center bg-uiearth-950 lg:static lg:mx-0 lg:flex lg:w-auto lg:flex-row lg:!bg-transparent shadow-muted-300/30 dark:shadow-muted-900/20 group-[&.scrolled]/landing:ltablet:mt-4 group-[&:not(.scrolled)]/landing:ltablet:mt-2 flex flex-col rounded-xl p-6 shadow-xl group-[&.scrolled]/landing:mt-12 group-[&:not(.scrolled)]/landing:mt-4 motion-safe:transition-all motion-safe:duration-200 group-[&.scrolled]/landing:lg:mt-0 group-[&:not(.scrolled)]/landing:lg:mt-0',
            isMenuOpen ? '' : 'hidden',
          ]"
        >
          <ULink
            to="/resource-data"
            active-class="text-uiearth-500"
            inactive-class="text-uimuted-500"
            class="inline-flex items-center justify-center px-6"
            >Resource Data</ULink
          >
          <ULink
            to="/resource-statistics"
            active-class="text-uiearth-500"
            inactive-class="text-uimuted-500"
            class="inline-flex items-center mt-0 justify-center px-6"
            >Resource Statistics</ULink
          >
          <ULink
            to="/"
            active-class="text-uiearth-500"
            class="inline-flex text-white ring-1 ring-uigreen-400 bg-uigreen-700 rounded-md p-2 items-center justify-center px-6"
            >View Map</ULink
          >
        </div>
        <div class="flex w-1/2 items-center justify-end gap-4 md:w-1/5">
          <label
            class="theme-toggle relative cursor-pointer"
            @contextmenu="setSystemColorMode"
          >
            <input
              type="checkbox"
              class="sr-only"
              @change="toggleColorScheme"
            />
            <span
              class="toggle-inner block relative bg-uimuted-950 ring-1 ring-uiearth-300 rounded-full w-14 h-7 flex items-center justify-between px-2"
            >
              <!-- <UIcon
                name="i-heroicons-moon-solid"
                class="text-gray-700 dark:text-gray-700"
              />
              <UIcon name="i-heroicons-sun-solid" class="text-uiyellow-500" /> -->
              <!-- <span
                :class="{
                  'translate-x-7': colorMode.preference === 'dark',
                  'translate-x-0': colorMode.preference !== 'dark',
                }"
                class="absolute left-0 top-0 h-7 w-7 bg-uigreen-300 rounded-full shadow-md transform motion-safe:transition-all motion-safe:duration-300"
              /> -->
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
          <UButton
            variant="ghost"
            class="ltablet:hidden flex items-center justify-center lg:hidden"
            @click="isMenuOpen = !isMenuOpen"
          >
            <div class="space-y-1.5">
              <span
                :class="isMenuOpen ? 'w-2' : 'w-6'"
                class="bg-uiearth-600 block h-0.5 motion-safe:transition-all motion-safe:duration-300"
              />
              <span
                class="w-6 bg-uiearth-600 block h-0.5 motion-safe:transition-all motion-safe:duration-300"
              />
              <span
                :class="isMenuOpen ? 'w-4' : 'w-6'"
                class="bg-uiearth-600 block h-0.5 motion-safe:transition-all motion-safe:duration-300"
              />
            </div>
          </UButton>
        </div>
      </div>
    </div>
    <div class="stat-bg overflow-y-auto p-4 pt-40 sm:pt-40">
      <slot />
    </div>
  </div>
</template>
