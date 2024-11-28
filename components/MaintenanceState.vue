<template>
  <div class="bg-uimuted-100 dark:bg-uimuted-900">
    <div
      class="bg-uimuted-100 dark:bg-uimuted-900 relative min-h-screen w-full overflow-x-hidden px-4 xl:px-10"
    >
      <div class="mx-auto w-full max-w-7xl">
        <div class="relative flex justify-center !items-end min-h-[400px]">
          <div class="mx-auto w-full text-center">
            <div class="max-w-[28rem] mx-auto">
              <img
                src="/img/maintenance.png"
                alt="Maintenance Icon"
                class="relative w-full max-w-xs mx-auto z-20"
              >
            </div>
            <div class="max-w-[24rem] mx-auto">
              <h4
                class="text-uimuted-900 dark:text-white text-3xl font-medium mt-1 mb-4"
              >
                Maintenance !!!
              </h4>
              <p class="text-uimuted-400">
                The application is currently in maintenance. Kindly bear with us
                as we make necessary updates and fixes.
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
