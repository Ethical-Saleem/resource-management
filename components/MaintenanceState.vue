<script setup lang="ts">
const refresh = () => {
  window.location.reload();
};
</script>

<template>
  <div class="bg-uimuted-100 dark:bg-uimuted-900">
    <div
      class="bg-uimuted-100 dark:bg-uimuted-900 relative min-h-screen w-full overflow-x-hidden px-4 xl:px-10"
    >
      <header class="relative z-[1] mb-5 flex items-center gap-2">
        <div class="">
          <NuxtImg src="/img/rmrdc.png" />
        </div>
      </header>
      <main>
        <div class="mx-auto w-full max-w-7xl">
          <div class="relative flex justify-center !items-end min-h-[400px]">
            <div class="mx-auto w-full text-center">
              <div class="max-w-[28rem] mx-auto">
                <NuxtImg
                  src="/img/maintenance.png"
                  alt="Maintenance Icon"
                  class="relative w-full max-w-xs mx-auto z-20"
                />
              </div>
              <div class="max-w-[24rem] mx-auto">
                <h4
                  class="text-uimuted-900 dark:text-white text-3xl font-medium mt-4 mb-4"
                >
                  Maintenance !!!
                </h4>
                <p class="text-uimuted-400">
                  Our application is currently undergoing maintenance to bring
                  you necessary updates and improvements. Thank you for your
                  patience and understanding!
                </p>
                <div class="mt-4">
                  <div
                    class="text-uimuted-400/20 dark:text-uimuted-400/10 absolute inset-x-0 top-1/3 -translate-y-1/2 text-[13rem] sm:text-[20rem] font-bold"
                  >
                    <span>503</span>
                  </div>
                  <UButton
                    class="text-white w-48 mx-auto !h-12"
                    block
                    color="uiearth"
                    label="Refresh"
                    size="lg"
                    @click="refresh"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
