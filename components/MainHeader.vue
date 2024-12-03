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
</script>

<template>
  <div class="flex items-center justify-between h-16 bg-white dark:bg-uimuted-800 items-center gap-2 z-[1]">
    <button
      class="flex size-10 items-center justify-center ms-3"
      @click="toggleSidebar"
    >
      <div class="relative size-5 scale-90">
        <span
          class="bg-uigreen-500 absolute block h-0.5 w-full transition-all duration-300 -rotate-45 rtl:rotate-45 max-w-[75%] top-1"
        />
        <span
          class="bg-uigreen-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 opacity-0 translate-x-4 rtl:-translate-x-4"
        />
        <span
          class="bg-uigreen-500 absolute block h-0.5 w-full transition-all duration-300 rotate-45 rtl:-rotate-45 max-w-[75%] bottom-1"
        />
      </div>
    </button>
    <div class="">
      <slot />
    </div>
    <div class="flex items-center gap-2 h-16 px-2">
      <ColorScheme
        ><USelect
          v-model="$colorMode.preference"
          :options="['system', 'light', 'dark']"
      /></ColorScheme>
      <div class="group inline-flex items-center justify-center text-right">
        <div class="relative size-9 text-left">
          <UDropdown
            :items="profItems"
            :popper="{ placement: 'bottom-start' }"
            :ui="{
              divide: 'divide-uimuted-200 dark:divide-uimuted-700',
              item: { disabled: 'cursor-text opacity-80' },
            }"
          >
            <UButton
              class="inline-flex items-center justify-center rounded-full ring-1 size-9 ring-transparent group-hover:ring-uimuted-200 group-hover:ring-offset-4 dark:group-hover:ring-uimuted-700 dar:ring-offset-uimuted-900 transition-all duration-300"
            >
              <span
                class="flex items-center justify-center bg-white dark:bg-uimuted-800 border border-uimuted-200 dark:border-uimuted-700 size-9 rounded-full"
              >
                <UIcon
                  name="i-heroicons-bell"
                  class="text-uimuted-400 size-5 w-8 h-6"
                />
              </span>
            </UButton>
            <template #item="{ item }">
              <span class="truncate">{{ item.label }}</span>

              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-uimuted-400 dark:text-uimuted-500 ms-auto"
              />
            </template>
            <!-- <div class="">
            <NuxtLink
              class="border dark:border-uimuted-600 bg-white dark:bg-uimuted-700 text-uimuted-700 dark:text-uimuted-100 rounded-lg block w-full px-6 py-2 pointer-events-auto transition-all duration-300"
            >
              Logout
            </NuxtLink>
          </div> -->
          </UDropdown>
        </div>
      </div>
      <div
        class="group relative inline-flex items-center justify-center text-end z-20"
      >
        <div class="relative size-9 text-left z-20">
          <UDropdown
            :items="profItems"
            :popper="{ placement: 'bottom-start' }"
            :ui="{
              divide: 'divide-uimuted-200 dark:divide-uimuted-700',
              item: { disabled: 'cursor-text opacity-80' },
            }"
          >
            <UButton
              class="ring-1 ring-transparent group-hover:ring-uigreen-500 group-hover:ring-offset-4 dark:ring-offset-muted inline-flex size-9 items-center justify-center rounded-full transition-all duration-300"
            >
              <UAvatar
                src="https://avatars.githubusercontent.com/u/739984?v=4"
              />
            </UButton>
            <template #account>
              <div class="p-6 text-center pointer-events-none">
                <div
                  class="relative mx-auto flex size-20 items-center justify-center rounded-full"
                >
                  <NuxtImg
                    src="https://avatars.githubusercontent.com/u/739984?v=4"
                    class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  />
                </div>
                <div class="mt-3">
                  <h6
                    class="text-uimuted-800 text-sm font-medium dark:text-white"
                  >
                    John Doe
                  </h6>
                  <p class="truncate font-medium text-uimuted-400 text-xs">
                    johndoe@gmail.com
                  </p>
                </div>
              </div>
            </template>
            <template #item="{ item }">
              <span class="truncate">{{ item.label }}</span>

              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-uimuted-400 dark:text-uimuted-500 ms-auto"
              />
            </template>
            <!-- <div class="">
            <NuxtLink
              class="border dark:border-uimuted-600 bg-white dark:bg-uimuted-700 text-uimuted-700 dark:text-uimuted-100 rounded-lg block w-full px-6 py-2 pointer-events-auto transition-all duration-300"
            >
              Logout
            </NuxtLink>
          </div> -->
          </UDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
