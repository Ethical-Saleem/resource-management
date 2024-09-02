<script setup>
import L from "leaflet";

const map = ref(null);

const loadStateMapResources = async () => {
  try {
    const res = await useApi.get("/territory/fetch-map-states-resources")

    L.geoJSON(res, {
      style: {
        color: "#3388ff", // Set state border color
        weight: 2,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          `<b>${feature.properties.name}</b><br>Total Resources: ${feature.properties.resources.length}`
        );

        // layer.on("click", () => {
        //   displayLgasOnMap(feature.properties.resources);
        // });
      },
    }).addTo(map.value);
    console.log(res);
    return res
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  // Initialize the map
  map.value = L.map("map").setView([9.082, 8.6753], 6); // Nigeria's lat/lng

  // Set up the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value);
  
});

// function displayLgasOnMap(resources) {
//   resources.forEach((resource) => {
//     resource.resource.lgaResources.forEach((lgaResource) => {
//       const lgaLayer = L.geoJSON(lgaResource.lga.geometry, {
//         style: {
//           color: resource.colorCode,
//           weight: 2,
//         },
//         onEachFeature: (feature, layer) => {
//           layer.bindPopup(
//             `<b>LGA: ${lgaResource.lga.name}</b><br>Quantity: ${lgaResource.quantity}<br>Quality: ${lgaResource.quality}`
//           );
//         },
//       }).addTo(map.value);
//     });
//   });
// }
</script>

<template>
  <div class="">
    <div id="map" />
  </div>
</template>

<style scoped>
#map {
  height: 800px;
  width: 100%;
}
</style>
