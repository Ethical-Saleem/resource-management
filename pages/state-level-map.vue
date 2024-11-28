<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="fixed inset-0 flex overflow-hidden">
    <MapSidebar
      v-if="isMobileSidebarOpen"
      class="lg:hidden"
      :selected-filter="selectedFilter"
      :selected-resource="selectedResource"
      :resources="availableResources"
      :selected-resource-category="selectedResourceCategory"
      @update-filter="onFilterUpdate"
      @update-resource="onResourceUpdate"
      @update:category="(value) => onCategoryUpdate(value)"
      @click-outside="closeMobileSidebar"
    />
    <div
      :class="['map-bg', gradientClass, 'flex', 'flex-1', 'w-full', 'min-w-0']"
    >
      <div
        :class="[
          'flex-col',
          'items-stretch',
          'relative',
          'w-full',
          'flex-1',
          'flex',
        ]"
      >
        <div class="p-4 flex-1 flex flex-col overflow-y-auto">
          <div ref="mapContainer" class="map-container" />
        </div>

        <div class="absolute top-2 left-2 z-10 flex flex-col space-y-2">
          <UButton
            id="zoomInButton"
            size="sm"
            :class="buttonClass"
            class="text-white rounded-md shadow-md"
            icon="i-heroicons-plus"
          />
          <UButton
            id="zoomOutButton"
            size="sm"
            :class="buttonClass"
            class="text-white rounded-md shadow-md"
            icon="i-heroicons-minus"
          />
        </div>
      </div>
      <div class="absolute" style="display: none; visibility: hidden" />
    </div>
    <UButton
      :class="outlineButtonClass"
      class="fixed bottom-4 right-4 z-20 text-white ring-2 rounded-full shadow-md lg:hidden"
      variant="outline"
      color="uiearth"
      @click="openMobileBar"
    >
      <UIcon name="i-heroicons-adjustments-vertical" />
    </UButton>
    <div
      :class="backgroundClass"
      class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 lg:w-[300px] flex-shrink-0 hidden lg:flex"
    >
      <div
        class="h-[4rem] flex-shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent py-2"
      >
        <NuxtImg src="/img/logo_5.png" width="70" height="70" />
        <div class="flex items-center gap-2">
          <ColorScheme
            ><USelect
              v-model="$colorMode.preference"
              :options="['system', 'light', 'dark']"
          /></ColorScheme>
          <div class="group inline-flex items-center justify-center text-right">
            <div class="relative size-9 text-left" />
          </div>
          <UDropdown :items="items">
            <UButton
              :class="dropdownButtonClass"
              class="block flex size-9 items-center justify-center rounded-full border ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
              icon="i-heroicons-squares-2x2"
            />
          </UDropdown>
        </div>
      </div>
      <div class="p-4 flex-1 flex flex-col overflow-y-auto">
        <p
          :class="headerTextClass"
          class="font-medium text-lg flex items-center mb-3"
        >
          <UIcon name="i-heroicons-funnel" class="" />
          <span class="pl-2">Filters</span>
        </p>
        <div
          class="ptablet:flex-none ptablet:grid ptablet:grid-cols-2 ptablet:pb-10 flex flex-col gap-4"
        >
          <UCard :class="cardClass">
            <div class="relative">
              <div class="relative">
                <div class="mb-3 flex items-center text-uiearth-200">
                  <UIcon name="i-heroicons-adjustments-vertical" />
                  <p :class="cardTextClass" class="pl-2">Map Filter</p>
                </div>
                <div class="">
                  <UFormGroup>
                    <USelectMenu
                      v-model="selectedFilter"
                      :options="states"
                      option-attribute="name"
                      value-attribute="id"
                      placeholder="-- Select --"
                      @change="loadMapData"
                    />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </UCard>
          <UCard :class="cardClass">
            <div class="relative">
              <div class="relative">
                <div class="mb-3 flex items-center text-uiearth-200">
                  <UIcon name="i-heroicons-adjustments-vertical" />
                  <p :class="cardTextClass" class="pl-2">Resource Category</p>
                </div>
                <div class="">
                  <UFormGroup>
                    <USelectMenu
                      v-model="selectedResourceCategory"
                      :options="[
                        { id: 1, name: 'Solid Minerals' },
                        { id: 2, name: 'Energy Resource' },
                        { id: 3, name: 'Agricultural Produce' },
                      ]"
                      searchable
                      option-attribute="name"
                      value-attribute="id"
                      placeholder="-- Select --"
                      @change="loadResources"
                    />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </UCard>
          <UCard v-if="selectedResourceCategory" :class="cardClass">
            <div class="relative">
              <div class="relative">
                <div class="mb-3 flex items-center text-uiearth-200">
                  <UIcon name="i-heroicons-adjustments-vertical" />
                  <p :class="cardTextClass" class="pl-2">Resource Filter</p>
                </div>
                <div class="">
                  <UFormGroup>
                    <USelectMenu
                      v-model="selectedResource"
                      :options="customOptions"
                      searchable
                      option-attribute="name"
                      value-attribute="id"
                      placeholder="-- Select --"
                    />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </UCard>
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
import type { State, Lga, LgaResource } from "~/types";
import { useLoadingStore } from "~/stores/loading-store";
import { useApi } from "~/composables/useApi";

// Define the types for your GeoJSON and Resource data
type GeoJsonFeature = Feature<Geometry, GeoJsonProperties>;
interface GeoJSONData extends FeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

useHead({
  title: "Home",
  meta: [
    {
      name: "description",
      content: "Map showing the various resource distributions in the country",
    },
  ],
});

const loadingStore = useLoadingStore();

// State for the map container and selected filters
const mapContainer = ref<HTMLDivElement | null>(null);
const geojsonData = ref<GeoJSONData | null>(null);
const states = ref([] as State[]);
const selectedFilter = ref<number | null>(null);
const selectedResource = ref<number | string>("");
const selectedResourceCategory = ref<number | null>(null);
const selectedStateOrLga = ref<State | Lga | null>(null);
const isModal = ref(false);
const isMobileSidebarOpen = ref(false);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
// const isFilterPaneOpen = ref(false);

const openMobileBar = () => {
  isMobileSidebarOpen.value = true;
};

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false;
};

const items = [
  [
    {
      label: "Resource Table",
      icon: "i-heroicons-table-cells-20-solid",
      to: "/resource-data",
    },
    {
      label: "Resource Statistics",
      icon: "i-heroicons-chart-bar-20-solid",
      to: "/resource-statistics",
    },
  ],
];

// const slideOver = useSlideover();

// const openMobileBar = () => {
//   slideOver.open(MapSidePanel, {
//     selectedFilter: selectedFilter.value,
//     selectedResource: selectedResource.value,
//     customOptions: customOptions,
//     selectedResourceCategory: selectedResourceCategory.value,
//   });
// };

const gradientClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1: // Solid Minerals
      return "bg-solid-minerals";
    case 2: // Energy Resource
      return "bg-energy-resource";
    case 3: // Agricultural Produce
      return "bg-agricultural-produce";
    default:
      return "bg-solid-minerals"; // Default gradient
  }
});

const backgroundClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "bg-uiearth-950";
    case 2:
      return "bg-uimuted-950";
    case 3:
      return "bg-uigreen-950";
    default:
      return "bg-uimuted-950";
  }
});

const mapStrokes = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "#9c4010";
    case 2:
      return "#304159";
    case 3:
      return "#036252";
    default:
      return "#304159";
  }
});

const buttonClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "bg-uiearth-600 hover:bg-uiearth-500";
    case 2:
      return "bg-uimuted-600 hover:bg-uimuted-500";
    case 3:
      return "bg-uigreen-600 hover:bg-uigreen-500";
    default:
      return "bg-uimuted-600 hover:bg-uimuted-500";
  }
});

const outlineButtonClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "ring-uiearth-500 text-uiearth-500";
    case 2:
      return "ring-uimuted-500 text-uimuted-500";
    case 3:
      return "ring-uigreen-500 text-uigreen-500";
    default:
      return "ring-uimuted-500 text-uimuted-500";
  }
});

const dropdownButtonClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "border-uigreen-600 bg-uigreen-600 dark:bg-uigreen-600 hover:ring-uigreen-200 dark:hover:ring-uiearth-700 dark:border-uiearth-700 dark:ring-offset-uiearth-900";
    case 2:
      return "bg-uimuted-600 dark:bg-uimuted-600";
    case 3:
      return "border-uiearth-600 bg-uiearth-600 dark:bg-uiearth-600 hover:ring-uiearth-200 dark:hover:ring-uiearth-700 dark:border-uigreen-700 dark:ring-offset-uigreen-900";
    default:
      return "bg-uimuted-600 dark:bg-uimuted-600";
  }
});

const headerTextClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "text-uiearth-200";
    case 2:
      return "text-uimuted-200";
    case 3:
      return "text-uigreen-200";
    default:
      return "text-uimuted-200";
  }
});

const cardClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "ring-uigreen-400 bg-uiearth-800 dark:bg-uiearth-600 dark:ring-uigreen-500";
    case 2:
      return "ring-uimuted-400 bg-uimuted-600 dark:bg-uimuted-600";
    case 3:
      return "ring-uiearth-400 bg-uigreen-800 dark:bg-uigreen-600 dark:ring-uiearth-500";
    default:
      return "ring-uimuted-400 bg-uimuted-600 dark:bg-uimuted-600";
  }
});

const cardTextClass = computed(() => {
  switch (selectedResourceCategory.value) {
    case 1:
      return "text-uiearth-200";
    case 2:
      return "text-uimuted-200";
    case 3:
      return "text-uigreen-200";
    default:
      return "text-uimuted-200";
  }
});

const onFilterUpdate = (newFilter: number) => {
  selectedFilter.value = newFilter;
  console.log("newFilter", newFilter);
  loadMapData(); // Optionally load map data immediately
};

// Handle resource updates from the slideover
const onResourceUpdate = (newResource: string | number) => {
  selectedResource.value = newResource;
  // loadMapData(); // Optionally load map data immediately
};

const onCategoryUpdate = (value: number) => {
  selectedResourceCategory.value = value;
  loadResources();
};

const customOptions = computed(() => {
  return [{ id: "", name: "All Resources" }, ...availableResources.value];
});
const closeStateOrLga = () => {
  isModal.value = false;
  selectedStateOrLga.value = null;
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
const drawMap = (geojsonData: GeoJSONData) => {
  if (!mapContainer.value) return;

  // Clear existing canvas
  d3.select(mapContainer.value).select("canvas").remove();

  const width = mapContainer.value.clientWidth;
  const height = mapContainer.value.clientHeight;

  const canvas = d3
    .select(mapContainer.value)
    .append("canvas")
    .attr("width", width)
    .attr("height", height)
    .node() as HTMLCanvasElement;

  console.log("canvas-created", canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Failed to get canvas context");
    return;
  }
  const projection = d3.geoMercator().fitSize([width, height], geojsonData);
  const path = d3.geoPath().projection(projection).context(context);

  if (!context) return;

  // Draw states or LGAs
  const features = geojsonData.features;

  // Draw the state
  // context.beginPath();
  // path(feature as GeoPermissibleObjects);
  // context.fillStyle = "#ccc";
  // context.fill();
  // context.strokeStyle = mapStrokes.value;
  // context.lineWidth = 2;
  // context.stroke();
  features.forEach((d) => {
    context.beginPath();
    path(d as GeoPermissibleObjects);
    context.fillStyle = "#ccc";
    context.fill();
    context.strokeStyle = mapStrokes.value;
    context.lineWidth = 2;
    context.stroke();
  });


  // Setup zoom behavior
  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      const { transform } = event;
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      // Redraw the state with zoom transformation
      features.forEach((d) => {
      context.beginPath();
      path(d as GeoPermissibleObjects);
      context.fillStyle = "#ccc";
      context.fill();
      context.strokeStyle = mapStrokes.value;
      context.lineWidth = 2 / transform.k;
      context.stroke();
    });

      context.restore();
    });

  d3.select(canvas).call(zoom);

  // Zoom button controls
  const zoomIn = () => d3.select(canvas).transition().call(zoom.scaleBy, 1.2);
  const zoomOut = () => d3.select(canvas).transition().call(zoom.scaleBy, 0.8);

  document.querySelector("#zoomInButton")?.addEventListener("click", zoomIn);
  document.querySelector("#zoomOutButton")?.addEventListener("click", zoomOut);
};

const drawResources = (resources: LgaResource[]) => {
  if (!mapContainer.value || !geojsonData.value) return;

  const filteredResources = computed(() => {
    return selectedResource.value
      ? resources.filter(
          (resource) => resource.resourceId === Number(selectedResource.value)
        )
      : resources;
  });

  const width = mapContainer.value.clientWidth;
  const height = mapContainer.value.clientHeight;

    const canvas = d3.select(mapContainer.value).select("canvas").node() as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  const projection = d3.geoMercator().fitSize([width, height], geojsonData.value);

  if (!context) return;

  filteredResources.value.forEach((item) => {
      const { locationLat, locationLong } = item;
      const [x, y] = projection([locationLong, locationLat]) || [];

      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fillStyle = item.resource.colorCode;
      context.fill();

      canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (context.isPointInPath(mouseX, mouseY)) {
          d3.select(".tooltip")
            .style("visibility", "visible")
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`)
            .html(
              `<strong style="color: ${item.resource.colorCode}">${item.resource.name}</strong> <br>
               <strong>LGA:</strong> ${item.lga.name}<br>
               <strong>Lat:</strong> ${locationLat}<br>
               <strong>Long:</strong> ${locationLong}`
            );
        } else {
          d3.select(".tooltip").style("visibility", "hidden");
        }
      });
  });
};

// Function to load GeoJSON and resource data
const loadMapData = async () => {
  loadingStore.showLoading();
  try {
    const geoData: GeoJSONData = await useApi.get(
      `/territory/fetch-map-state-by-id/${selectedFilter.value}`
    );
    geojsonData.value = geoData;
    console.log("geodata", geoData);
    drawMap(geoData);
  } catch (error) {
    console.error("Error loading GeoJSON data:", error);
  } finally {
    loadingStore.hideLoading();
    console.log("loading", loadingStore.isLoading);
  }
};

const fetchStates = async () => {
  loadingStore.showLoading();
  try {
    const data = await useApi.get("/territory/fetch-all-states");
    if (data) {
      states.value = data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingStore.hideLoading();
  }
};

const loadResources = async () => {
  loadingStore.showLoading();
  try {
    if (selectedResourceCategory.value) {
      const resources: Resource[] = await useApi.get(
        `/resource/fetch-resources-data-by-state/${selectedFilter.value}/${selectedResourceCategory.value}`
      );
      availableResources.value = resources;
      drawResources(resources);
      console.log("res", resources);
    }
  } catch (error) {
    console.error("Error loading resources:", error);
  } finally {
    loadingStore.hideLoading();
  }
};

watch(selectedResourceCategory, () => {
  if (geojsonData.value) {
    drawMap(geojsonData.value); // Re-draw the map with the new stroke color
  }
});

watch([selectedFilter, selectedResource], async () => {
  await loadMapData(); // Show overlay during GeoJSON loading
  drawResources(availableResources.value);
});

watch(
  () => window?.innerWidth > 991,
  () => {
    if (isMobileSidebarOpen.value) {
      closeMobileSidebar();
    }
  }
);

// Initialize map on mount
onMounted(async () => {
  window.addEventListener("resize", handleResize);

  fetchStates();

  // Initial map draw
  // await loadMapData();
  // adjustSvgSize();
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
  /* background-image: linear-gradient(var(--tw-gradient-stops)), url("/img/map_bg_3.PNG"); */
  /* background-image: linear-gradient(
        rgba(252, 136, 19, 0.5),
        rgba(252, 136, 19, 0.5)
      ),
      url("/img/map_bg_3.PNG"); */
  background-size: cover;
  background-position: center;
  opacity: 1; /* Adjust this value to control opacity */
  z-index: -1; /* Ensures the background is behind the content */
}
</style>
