<template>
    <div class="">
      <div class="relative">
        <div
          class="bg-uimuted-100 dark:bg-uimuted-900 flex flex-col ltablet:flex-row lg:flex-row min-h-screen"
        >
          <!-- <div class="ltablet:h-screen ltablet:w-20 ltablet:border-r border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 h-16 w-full bg-white lg:h-screen lg:w-20 lg:border-r"></div> -->
          <div class="ltablet:h-auto relative h-96 grow lg:h-auto">
            <div class="absolute inset-0 size-full mapboxgl-map">
              <!-- <div class="">
                <div id="map-container" class="" />
              </div> -->
              <div ref="mapContainer" class="map-container" />
            </div>
            <div class="absolute" style="display: none; visibility: hidden" />
          </div>
          <button
            class="fixed bottom-4 right-4 z-20 p-3 bg-blue-600 text-white rounded-full shadow-md lg:hidden"
            @click="toggleFilterPane"
          >
            <UIcon name="i-heroicons-adjustments-vertical" />
          </button>
          <div
            :class="[
              'h-screen w-96 ltablet:w-96 ltablet:h-screen dark:bg-uimuted-800 border-l border-uimuted-200 dark:border-uimuted-800 w-full shrink-0 lg:h-screen lg:w-96 fixed top-0 right-0 transform transition-transform duration-300',
              {
                'translate-x-full': !isFilterPaneOpen,
                'translate-x-0': isFilterPaneOpen,
              },
            ]"
            style="z-index: 9999"
          >
            <div
              class="relative z-10 flex h-16 w-full items-center justify-between px-6"
            >
              <p class="" />
              <div class="flex items-center gap-2">
                <ColorScheme
                  ><USelect
                    v-model="$colorMode.preference"
                    :options="['system', 'light', 'dark']"
                /></ColorScheme>
                <div
                  class="group inline-flex items-center justify-center text-right"
                >
                  <div class="relative size-9 text-left" />
                </div>
                <UButton
                  class="border-uimuted-200 hover:ring-uimuted-200 dark:hover:ring-uimuted-700 dark:border-uimuted-700 dark:bg-uimuted-800 dark:ring-offset-uimuted-900 flex size-9 items-center justify-center rounded-full border ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
                  icon="i-heroicons-squares-2x2"
                />
              </div>
            </div>
            <div
              class="ltablet:h-[calc(100dvh_-_64px)] nui-slimscroll h-[calc(100vh_-_492px)] overflow-y-auto p-6 lg:h-[calc(100dvh_-_64px)]"
            >
              <p class="font-medium text-lg flex items-center mb-3">
                <UIcon name="i-heroicons-funnel" class="" />
                <span class="pl-2">Filters</span>
              </p>
              <div
                class="ptablet:flex-none ptablet:grid ptablet:grid-cols-2 ptablet:pb-10 flex flex-col gap-4"
              >
                <UCard>
                  <div class="relative">
                    <div class="relative">
                      <div class="mb-3 flex items-center">
                        <UIcon name="i-heroicons-adjustments-vertical" />
                        <p class="pl-2">Map Filter</p>
                      </div>
                      <div class="">
                        <UFormGroup>
                          <USelectMenu
                            v-model="selectedFilter"
                            :options="[
                              { label: 'State', value: 'state' },
                              { label: 'LGA', value: 'lga' },
                            ]"
                            option-attribute="label"
                            value-attribute="value"
                            placeholder="-- Select --"
                          />
                        </UFormGroup>
                      </div>
                    </div>
                  </div>
                </UCard>
                <UCard>
                  <div class="relative">
                    <div class="relative">
                      <div class="mb-3 flex items-center">
                        <UIcon name="i-heroicons-adjustments-vertical" />
                        <p class="pl-2">Resource Filter</p>
                      </div>
                      <div class="">
                        <UFormGroup>
                          <USelectMenu
                            v-model="selectedResource"
                            :options="customOptions"
                            option-attribute="name"
                            value-attribute="id"
                            placeholder="-- Select --"
                          />
                        </UFormGroup>
                      </div>
                    </div>
                  </div>
                </UCard>
                <UCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import * as d3 from "d3";
  import type { GeoPath, GeoProjection } from "d3-geo";
  import type { FeatureCollection } from "geojson";
  import type { State, Lga, Resource } from "~/types";
  import { useApi } from "~/composables/useApi";
  
  // Define the types for your GeoJSON and Resource data
  interface GeoJSONData extends FeatureCollection {
    features: Array<{
      type: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
      properties: {
        name: string;
        color: string;
      };
    }>;
  }
  
  // State for the map container and selected filters
  const mapContainer = ref<HTMLDivElement | null>(null);
  const geojsonData = ref<GeoJSONData | null>(null);
  const selectedFilter = ref("state");
  const selectedResource = ref<number | string>("");
  const selectedStateOrLga = ref<State | Lga | null>(null);
  const clickedResource = ref<Resource | null>(null);
  const isModal = ref(false);
  const resourceModal = ref(false);
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  const isFilterPaneOpen = ref(false);
  
  function toggleFilterPane() {
    isFilterPaneOpen.value = !isFilterPaneOpen.value;
  }
  
  const customOptions = computed(() => {
    return [{ id: "", name: "All Resources" }, ...availableResources.value];
  });
  
  const showStateOrLga = (item: State | Lga) => {
    selectedStateOrLga.value = item;
    isModal.value = true;
    console.log("clicked-state-lga", selectedStateOrLga.value);
  };
  const closeStateOrLga = () => {
    isModal.value = false;
    selectedStateOrLga.value = null;
  };
  
  const showResourceDetails = (item: Resource) => {
    clickedResource.value = item;
    resourceModal.value = true;
    console.log("clicked-resource", clickedResource.value);
  };
  const closeResourceDetails = () => {
    resourceModal.value = false;
    clickedResource.value = null;
  };
  
  const adjustSvgSize = () => {
    if (!mapContainer.value || !svg) return;
  
    const width = mapContainer.value.clientWidth;
    const height = mapContainer.value.clientHeight;
  
    svg.attr("width", width).attr("height", height);
  
    // Update projection and path if necessary
    const projection = d3
      .geoMercator()
      .fitSize([width, height], geojsonData.value);
    const path = d3.geoPath().projection(projection);
  
    svg.selectAll("path").attr("d", path as any);
    svg
      .selectAll("circle")
      .attr("cx", (d) => projection([d.lng, d.lat])[0])
      .attr("cy", (d) => projection([d.lng, d.lat])[1]);
  };
  
  // Call this function after rendering the map
  const handleResize = () => {
    adjustSvgSize();
  };
  
  // Available resources fetched from the API
  const availableResources = ref<Resource[]>([]);
  
  // Function to draw the map using D3.js
  const drawMap = (geojsonData: GeoJSONData, resources: Resource[]) => {
    if (!mapContainer.value) return;
  
    // Clear existing SVG
    d3.select(mapContainer.value).select("svg").remove();
  
    const width = mapContainer.value.clientWidth;
    const height = mapContainer.value.clientHeight;
  
    const projection: GeoProjection = d3
      .geoMercator()
      .fitSize([width, height], geojsonData);
    const path: GeoPath = d3.geoPath().projection(projection);
  
    const svg = d3
      .select(mapContainer.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Draw states or LGAs
    svg
      .selectAll("path")
      .data(geojsonData.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d) => d.properties.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .on("click", function (event, d) {
        showStateOrLga(d);
      });
  
    // Filter resources based on selectedResource
    const filteredResources = computed(() => {
      return selectedResource.value
        ? resources.filter(
            (resource) => resource.id === Number(selectedResource.value)
          )
        : resources;
    });
  
    // Draw resources on the map
    filteredResources.value.forEach((resource) => {
      const linkedFeatures =
        selectedFilter.value === "state"
          ? resource.stateResources.map((sr) =>
              geojsonData.features.find((f) => f.properties.id === sr.stateId)
            )
          : resource.lgaResources.map((lr) =>
              geojsonData.features.find((f) => f.properties.id === lr.lgaId)
            );
  
      linkedFeatures.forEach((feature) => {
        const centroid = path.centroid(feature as any);
        svg
          .append("circle")
          .attr("cx", centroid[0])
          .attr("cy", centroid[1])
          .attr("r", 5)
          .attr("fill", resource.colorCode)
          .on("mouseover", function () {
            d3.select(this).attr("r", 8); // Enlarge the circle on hover
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", 5); // Reset the circle size
          })
          .on("click", function () {
            showResourceDetails(resource);
          });
      });
    });
  
    adjustSvgSize();
  };
  
  // Function to load GeoJSON and resource data
  const loadMapData = async () => {
    const geojsonData: GeoJSONData = await useApi.get(
      `/territory/fetch-geojson/${selectedFilter.value}`
    );
    const resources: Resource[] = await useApi.get(
      "/resource/fetch-all-resources"
    );
    availableResources.value = resources;
    drawMap(geojsonData, resources);
  };
  
  // Watch for filter changes and redraw the map
  watch([selectedFilter, selectedResource], loadMapData);
  
  // Initialize map on mount
  onMounted(async () => {
    window.addEventListener("resize", handleResize);
  
    // Initial map draw
    loadMapData();
    adjustSvgSize();
  });
  
  onBeforeUnmount(() => {
    // Clean up the resize listener when the component is destroyed
    window.removeEventListener("resize", handleResize);
  });
  </script>
  
  <style scoped>
  .map-container {
    height: 600px;
    width: 100%;
    position: relative;
  }
  </style>
  