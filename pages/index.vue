<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="fixed inset-0 flex overflow-hidden">
    <div class="map-bg flex flex-1 w-full min-w-0">
      <div class="flex-col items-stretch relative w-full flex-1 flex">
        <div class="p-4 flex-1 flex flex-col overflow-y-auto">
          <div ref="mapContainer" class="map-container" />
        </div>

        <div class="absolute top-2 left-2 z-10 flex flex-col space-y-2">
          <UButton
            id="zoomInButton"
            size="sm"
            class="text-white rounded-md shadow-md hover:bg-gray-200"
            icon="i-heroicons-plus"
          />
          <UButton
            id="zoomOutButton"
            size="sm"
            class="text-white rounded-md shadow-md hover:bg-gray-200"
            icon="i-heroicons-minus"
          />
        </div>
      </div>
      <div class="absolute" style="display: none; visibility: hidden" />
    </div>
    <UButton
      class="fixed bottom-4 right-4 z-20 text-white rounded-full shadow-md lg:hidden"
      variant="outline"
      @click="openMobileBar"
    >
      <UIcon name="i-heroicons-adjustments-vertical" />
    </UButton>
    <div
      class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 lg:w-[300px] flex-shrink-0 hidden lg:flex"
    >
      <div
        class="h-[4rem] flex-shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent"
      >
        <p class="" />
        <div class="flex items-center gap-2">
          <ColorScheme
            ><USelect
              v-model="$colorMode.preference"
              :options="['system', 'light', 'dark']"
          /></ColorScheme>
          <div class="group inline-flex items-center justify-center text-right">
            <div class="relative size-9 text-left" />
          </div>
          <UDropdown :items="items" >
            <UButton
              class="border-uimuted-200 block hover:ring-uimuted-200 dark:hover:ring-uimuted-700 dark:border-uimuted-700 dark:bg-uimuted-800 dark:ring-offset-uimuted-900 flex size-9 items-center justify-center rounded-full border ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
              icon="i-heroicons-squares-2x2"
            />
          </UDropdown>
        </div>
      </div>
      <div class="p-4 flex-1 flex flex-col overflow-y-auto">
        <p class="font-medium text-lg flex items-center mb-3">
          <UIcon name="i-heroicons-funnel" class="" />
          <span class="pl-2">Filters</span>
        </p>
        <div
          class="ptablet:flex-none ptablet:grid ptablet:grid-cols-2 ptablet:pb-10 flex flex-col gap-4"
        >
          <UCard class="ring-1 ring-primary-400 dark:ring-primary-500">
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
          <UCard class="ring-1 ring-primary-400 dark:ring-primary-500">
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

    <div>
      <UModal v-model="isModal" prevent-close>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <h4>Territory Data</h4>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="closeStateOrLga"
            />
          </div>
          <div class="">
            <p>Territory Name: {{ selectedStateOrLga?.name }}</p>
          </div>
        </div>
      </UModal>
    </div>
    <MapSidePanel
      :selected-filter="selectedFilter"
      :selected-resource="selectedResource"
      :custom-options="customOptions"
      @update-filter="onFilterUpdate"
      @update-resource="onResourceUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import type { GeoPath, GeoProjection } from "d3-geo";
import type {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import type { GeoPermissibleObjects } from "d3";
import type { State, Lga, Resource } from "~/types";
import { useApi } from "~/composables/useApi";
import MapSidePanel from "~/components/MapSidepanel.vue";

// Define the types for your GeoJSON and Resource data
type GeoJsonFeature = Feature<Geometry, GeoJsonProperties>;
interface GeoJSONData extends FeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
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
// const isFilterPaneOpen = ref(false);

const items = [
  [
    {
      label: "Resource Table",
      icon: "i-heroicons-table-cells-20-solid",
      to: '/resource-data',
    },
    {
      label: "Resource Statistics",
      icon: "i-heroicons-chart-bar-20-solid",
      to: '/resource-statistics'
    },
  ],
];

const slideOver = useSlideover();

const openMobileBar = () => {
  slideOver.open(MapSidePanel, {
    selectedFilter: selectedFilter.value,
    selectedResource: selectedResource.value,
    customOptions: customOptions,
  });
};

const onFilterUpdate = (newFilter: string) => {
  selectedFilter.value = newFilter;
  console.log('newFilter', newFilter)
  loadMapData(); // Optionally load map data immediately
};

// Handle resource updates from the slideover
const onResourceUpdate = (newResource: string | number) => {
  selectedResource.value = newResource;
  // loadMapData(); // Optionally load map data immediately
};

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
// const closeResourceDetails = () => {
//   resourceModal.value = false;
//   clickedResource.value = null;
// };

const adjustSvgSize = () => {
  if (!mapContainer.value || !svg || !geojsonData.value) return;

  const width = mapContainer.value.clientWidth;
  const height = mapContainer.value.clientHeight;

  svg.attr("width", width).attr("height", height);

  // Update projection and path if necessary
  const projection: GeoProjection = d3
    .geoMercator()
    .fitSize([width, height], geojsonData.value);
  const path: GeoPath<GeoPermissibleObjects> = d3
    .geoPath()
    .projection(projection);

  svg.selectAll("path").attr("d", path as never);
  svg.selectAll("circle");
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

  const g = svg.append("g"); // Group for zooming

  // Draw states or LGAs
  g.selectAll("path")
    .data(geojsonData.features)
    .enter()
    .append("path")
    .attr("d", (d: GeoJsonFeature) => path(d as GeoPermissibleObjects) || "")
    .attr("opacity", 0.4)
    // .attr("fill", "#46fc54")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on("click", (event, d: any) => {
      showStateOrLga(d);
    })
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 0.7); // Highlight the tile on hover

      // Get the centroid of the hovered feature
      const centroid = path.centroid(d);

      // Append a text element at the centroid
      g.append("text")
        .attr("x", centroid[0])
        .attr("y", centroid[1])
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#ffffff")
        .attr("class", "hover-label") // Class for the hover label
        .text(d?.properties?.name); // Assuming 'name' is the property containing the name of the state or LGA
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 0.5); // Reset opacity

      // Remove the hover label when the mouse moves away
      g.selectAll(".hover-label").remove();
    });

  // Filter resources based on selectedResource
  const filteredResources = computed(() => {
    return selectedResource.value
      ? resources.filter(
          (resource) => resource.id === Number(selectedResource.value)
        )
      : resources;
  });

  console.log('filteredRes', filteredResources.value);

  // Draw resources on the map
  filteredResources.value.forEach((resource) => {
    const linkedFeatures =
      selectedFilter.value === "state"
        ? resource.stateResources.map((sr) =>
            geojsonData.features.find((f) => f?.properties?.id === sr.stateId)
          )
        : resource.lgaResources.map((lr) =>
            geojsonData.features.find((f) => f?.properties?.id === lr.lgaId)
          );

    linkedFeatures.forEach((feature) => {
      if (!feature) return;

      const centroid = path.centroid(
        feature as unknown as GeoPermissibleObjects
      );
      const allResourcesInFeature = resources.filter((r) =>
        selectedFilter.value === "state"
          ? r.stateResources.some(
              (sr) => sr.stateId === feature?.properties?.id
            )
          : r.lgaResources.some((lr) => lr.lgaId === feature?.properties?.id)
      );

      console.log('all-resources-feature', allResourcesInFeature);

      // Calculate positions around the centroid
      const radius = 15; // Distance from the centroid
      const angleStep = (2 * Math.PI) / allResourcesInFeature.length;

      allResourcesInFeature.forEach((res, index) => {
        const angle = index * angleStep;
        const x = centroid[0] + radius * Math.cos(angle);
        const y = centroid[1] + radius * Math.sin(angle);

        g.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .attr("fill", res.colorCode)
          .on("mouseover", function () {
            d3.select(this).attr("r", 9); // Enlarge the circle on hover
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", 6); // Reset the circle size
          })
          .on("click", function () {
            showResourceDetails(res);
          });
      });
    });
  });

  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 8]) // Set min and max zoom levels
    .on("zoom", (event) => {
      g.attr("transform", event.transform); // Apply zoom and pan transform to the group
    });

  svg.call(zoom); // Apply zoom behavior to the SVG

  // Zoom in and out controls
  const zoomIn = () => {
    svg.transition().call(zoom.scaleBy, 1.2); // Zoom in by 20%
  };

  const zoomOut = () => {
    svg.transition().call(zoom.scaleBy, 0.8); // Zoom out by 20%
  };

  // Assuming you have buttons for zoom controls in your template
  const zoomInButton = document.querySelector("#zoomInButton");
  const zoomOutButton = document.querySelector("#zoomOutButton");

  if (zoomInButton) {
    zoomInButton.addEventListener("click", zoomIn);
  }

  if (zoomOutButton) {
    zoomOutButton.addEventListener("click", zoomOut);
  }

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
  console.log(geojsonData);
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
  height: 700px;
  width: 100%;
  position: relative;
}
.map-bg {
  position: relative;
}
.map-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/img/map_bg_3.PNG");
  background-size: cover;
  background-position: center;
  opacity: 0.4; /* Adjust this value to control opacity */
  z-index: -1; /* Ensures the background is behind the content */
}
</style>
