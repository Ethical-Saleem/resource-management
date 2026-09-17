<script setup lang="ts">
import type { GeoJSONData, MapLocation } from "~/types";
import { useApiClient, unwrap } from "~/composables/useApiClient";

const props = defineProps<{
  scope: "country" | "state";
  stateId?: number | null;
  locations: MapLocation[];
  selectedLocationId?: number | null;
}>();

const emit = defineEmits<{
  (e: "select-location", location: MapLocation): void;
  (e: "drill-into-state", stateId: number, stateName: string): void;
  (e: "map-ready"): void;
}>();

const mapEl = ref<HTMLDivElement | null>(null);
let map: any = null;
let L: any = null;
let boundaryLayer: any = null;
let clusterGroup: any = null;
let markerLayer: any = null;
let routeLayer: any = null;
let routeStartMarker: any = null;
let osrmRouter: any = null;
let resizeObserver: ResizeObserver | null = null;

// Matches the category palette used everywhere else in the app.
const CATEGORY_COLORS: Record<number, string> = {
  1: "#64748B", // Solid Minerals
  2: "#FC8813", // Energy
  3: "#0ABF98", // Agriculture
};

function colorFor(location: MapLocation): string {
  return (
    location.colorCode || CATEGORY_COLORS[location.categoryIds?.[0]] || "#64748B"
  );
}

function pinDivIcon(color: string, selected: boolean) {
  const size = selected ? 34 : 24;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;filter:drop-shadow(0 2px 4px rgba(15,23,42,0.35));">
      <svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"/>
      </svg>
      ${selected ? `<div style="position:absolute;inset:-8px;border-radius:9999px;background:${color}22;z-index:-1;"></div>` : ""}
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function clusterIcon(cluster: any) {
  const markers = cluster.getAllChildMarkers();
  const counts: Record<string, number> = {};
  for (const m of markers) {
    const c = m.options.__color || "#64748B";
    counts[c] = (counts[c] || 0) + 1;
  }
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const count = markers.length;
  const size = Math.min(64, Math.max(36, 28 + Math.sqrt(count) * 6));
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${dominant};border:3px solid #fff;
      box-shadow:0 4px 10px rgba(15,23,42,0.3);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-weight:700;font-family:Inter,system-ui,sans-serif;
      font-size:${size > 48 ? 15 : 12}px;">${count}</div>`,
    className: "",
    iconSize: [size, size],
  });
}

async function loadBoundary() {
  if (!map || !L) return;
  const api = useApiClient();

  if (boundaryLayer) {
    map.removeLayer(boundaryLayer);
    boundaryLayer = null;
  }

  let geo: GeoJSONData;
  if (props.scope === "country") {
    geo = unwrap<GeoJSONData>(await api.GET("/territory/fetch-map-states", {}));
  } else if (props.stateId) {
    geo = unwrap<GeoJSONData>(
      await api.GET("/territory/fetch-map-state-by-id/{stateId}", {
        params: { path: { stateId: props.stateId } },
      }),
    );
  } else {
    return;
  }

  boundaryLayer = L.geoJSON(geo, {
    style: () => ({
      color: "#CBD5E1",
      weight: 1.2,
      fillColor: "#EBEFE7",
      fillOpacity: 0.6,
    }),
    onEachFeature: (feature: any, layer: any) => {
      if (props.scope === "country") {
        layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.9, color: "#0ABF98" }));
        layer.on("mouseout", () => layer.setStyle({ fillOpacity: 0.6, color: "#CBD5E1" }));
        layer.on("click", () => {
          emit("drill-into-state", feature.properties.id, feature.properties.name);
        });
      }
    },
  }).addTo(map);

  if (boundaryLayer.getBounds().isValid()) {
    map.fitBounds(boundaryLayer.getBounds(), { padding: [24, 24] });
  }
}

function renderLocations() {
  if (!map || !L) return;

  if (clusterGroup) {
    map.removeLayer(clusterGroup);
    clusterGroup = null;
  }
  if (markerLayer) {
    map.removeLayer(markerLayer);
    markerLayer = null;
  }

  const buildMarker = (location: MapLocation) => {
    const color = colorFor(location);
    const marker = L.marker([location.lat, location.long], {
      icon: pinDivIcon(color, location.id === props.selectedLocationId),
      __color: color,
    });
    marker.on("click", () => emit("select-location", location));
    return marker;
  };

  if (props.scope === "country") {
    clusterGroup = L.markerClusterGroup({
      iconCreateFunction: clusterIcon,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
    });
    for (const location of props.locations) {
      clusterGroup.addLayer(buildMarker(location));
    }
    map.addLayer(clusterGroup);
  } else {
    markerLayer = L.layerGroup();
    for (const location of props.locations) {
      markerLayer.addLayer(buildMarker(location));
    }
    map.addLayer(markerLayer);
  }
}

onMounted(async () => {
  const leaflet = await import("leaflet");
  L = leaflet.default ?? leaflet;
  // Attaches L.markerClusterGroup onto the L we just loaded.
  await import("leaflet.markercluster");
  // Attaches L.Routing onto the L we just loaded.
  await import("leaflet-routing-machine");
  osrmRouter = L.Routing.osrmv1({
    serviceUrl: "https://router.project-osrm.org/route/v1",
    profile: "driving",
  });

  map = L.map(mapEl.value!, {
    zoomControl: false,
    attributionControl: true,
    center: [9.082, 8.6753],
    zoom: 6,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  await loadBoundary();
  renderLocations();
  emit("map-ready");

  // Leaflet measures the container's size once at creation time. If that
  // measurement happens before the surrounding flex layout has settled
  // (easy to hit here, since this component mounts inside a flex row next
  // to a filter panel that's still laying itself out), Leaflet's internal
  // panes end up sized for a stale, incorrect container height — markers
  // and tiles then render far outside the visible area. A ResizeObserver
  // keeps Leaflet's internal size in sync with the container's real size.
  resizeObserver = new ResizeObserver(() => {
    map?.invalidateSize();
  });
  resizeObserver.observe(mapEl.value!);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  map?.remove();
});

watch(
  () => [props.scope, props.stateId],
  async () => {
    clearRoute();
    await loadBoundary();
  },
);

watch(
  () => props.locations,
  () => renderLocations(),
);

watch(
  () => props.selectedLocationId,
  () => {
    clearRoute();
    renderLocations();
  },
);

function zoomIn() {
  map?.zoomIn();
}
function zoomOut() {
  map?.zoomOut();
}
function locate() {
  if (!map || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition((pos) => {
    map.setView([pos.coords.latitude, pos.coords.longitude], 12);
  });
}

function clearRoute() {
  if (routeLayer) {
    map?.removeLayer(routeLayer);
    routeLayer = null;
  }
  if (routeStartMarker) {
    map?.removeLayer(routeStartMarker);
    routeStartMarker = null;
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, (err) => {
      const message =
        err.code === err.PERMISSION_DENIED
          ? "Location access was denied. Enable it in your browser settings to get directions."
          : "Could not determine your current location.";
      reject(new Error(message));
    });
  });
}

async function showRouteTo(
  destination: { lat: number; long: number },
): Promise<{ distanceKm: number; durationMin: number }> {
  if (!map || !L || !osrmRouter) {
    throw new Error("Map is not ready yet.");
  }

  const position = await getCurrentPosition();
  const origin = L.latLng(position.coords.latitude, position.coords.longitude);
  const dest = L.latLng(destination.lat, destination.long);

  const routes = await new Promise<any[]>((resolve, reject) => {
    osrmRouter.route(
      [L.Routing.waypoint(origin), L.Routing.waypoint(dest)],
      (err: any, result: any[]) => {
        if (err || !result?.length) {
          reject(new Error("No driving route could be found to this location."));
          return;
        }
        resolve(result);
      },
    );
  });

  clearRoute();

  const route = routes[0];
  routeLayer = L.polyline(route.coordinates, {
    color: "#0A8F72",
    weight: 5,
    opacity: 0.85,
  }).addTo(map);

  routeStartMarker = L.circleMarker(origin, {
    radius: 7,
    color: "#fff",
    weight: 2,
    fillColor: "#2563EB",
    fillOpacity: 1,
  }).addTo(map);

  map.fitBounds(routeLayer.getBounds(), { padding: [32, 32] });

  return {
    distanceKm: route.summary.totalDistance / 1000,
    durationMin: route.summary.totalTime / 60,
  };
}

defineExpose({ zoomIn, zoomOut, locate, showRouteTo, clearRoute });
</script>

<template>
  <div ref="mapEl" class="absolute inset-0" />
</template>

<style>
.leaflet-container {
  font-family: "Inter", system-ui, sans-serif;
  background: #fafaf9;
}
</style>
