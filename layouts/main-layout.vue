<script setup lang="ts">
const sidebarOpen = useState("sidebarOpen");
const toggleSidebarClose = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div class="">
    <div class="bg-uimuted-100 dark:bg-uimuted-900 pb-20 font-poppins">
      <MainSidebar />
      <div
        :class="[
          'fixed start-0 top-0 block lg:hidden bg-uimuted-800 dark:bg-uimuted-900 size-full z-[59] transition-opacity duration-300',
          sidebarOpen
            ? 'opacity-50 dark:opacity-75'
            : 'opacity-0 pointer-events-none',
        ]"
        role="button"
        @click="toggleSidebarClose"
      />
      <div
        :class="[
          'relative transition-all duration-300 overflow-hidden',
          sidebarOpen
            ? 'lg:max-w-[calc(100%_-_250px)] lg:ms-[250px]'
            : 'lg:max-w-full lg:ms-0',
        ]"
      >
        <!-- Fixed Header -->
        <div
          :class="[
            'fixed top-0 z-[1] w-full border-b border-uimuted-200 dark:border-uimuted-700 bg-white dark:bg-uimuted-800 transition-all duration-300',
            sidebarOpen
              ? 'lg:max-w-[calc(100%_-_250px)]'
              : 'lg:max-w-full lg:ms-0',
          ]"
        >
          <MainHeader @toggle-sidebar="toggleSidebarClose">
            <slot name="view-controls" />
          </MainHeader>
        </div>

        <!-- Main Content -->
        <div
          class="relative min-h-screen bg-uimuted-100 dark:bg-uimuted-900 transition-all duration-300 px-4 md:px-8"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
