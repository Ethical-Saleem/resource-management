<script setup lang="ts"></script>

<template>
  <div>
    <NavHeader />
    <div class="min-h-screen -mt-24 py-20">
      <div class="stat-bg overflow-y-auto p-4 pt-32">
        <div class="grid grid-cols-12 gap-3">
          <!-- <div class="col-span-12 md:col-span-6 lg:col-span-4">
        <StateResourceChart />
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-4">
        <ClientOnly>
            <StatesResourcesChart />
        </ClientOnly>
      </div> -->
          <div class="col-span-12 md:col-span-6">
            <StateMetricsRadar />
          </div>
          <!-- <div class="col-span-12 md:col-span-6">
        <ResourceLgaMetricsChart />
      </div> -->
          <div class="col-span-12 md:col-span-6">
            <ResourceLgaMetricsEChart />
          </div>
          <div class="col-span-12 md:col-span-5">
            <ResourceMiscChart />
          </div>
          <div class="col-span-12 md:col-span-7">
            <ResourceMetricCompareChart />
          </div>
          <div class="col-span-12 md:col-span-6">
            <StateResourceCompareRadar />
          </div>
          <div class="col-span-12 md:col-span-6">
            <StateResourceBoxChart />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.stat-bg {
  position: relative;
}
.stat-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/img/map_bg.PNG");
  background-size: cover;
  background-position: center;
  opacity: 0.4; /* Adjust this value to control opacity */
  z-index: -1; /* Ensures the background is behind the content */
}
</style>
