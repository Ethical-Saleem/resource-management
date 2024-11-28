<template>
  <div class="background-slideshow">
    <div
      class="slide"
      v-for="(image, index) in images"
      :key="index"
      :style="{
        backgroundImage: `url(${image})`,
        opacity: index === currentSlide ? 1 : 0,
      }"
    />
    <!-- <div class="text-overlay">
      <h1 class="title">Landing Page Title</h1>
      <p class="description">A captivating description goes here. Highlight the key features of your platform.</p>
    </div> -->
    <div
      class="flex absolute inner flex-col flex-0 max-w-screen-lg lg:px-[32px] lg:pt-[250px] lg:pb-[200px]"
    >
      <div
        class="child flex flex-col gap-16 w-full h-full items-start justify-center self-auto shrink"
      >
        <div class="self-center text-white">
          <div class="self-center"></div>
          <div class="title-pane flex flex-col gap-4">
            <div class="text-center xl:text-start">
              <h2 class="text-base">Welcome to RMRDC</h2>
            </div>
            <div class="w-full text-center xl:text-start">
              <h1 class="text-white text-6xl">Landing Page Title</h1>
            </div>
            <div class="text-center xl:text-start">
              <p class="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
                quas similique beatae ducimus ad reiciendis harum iure dolorum
                eum aspernatur aut veniam error, porro distinctio expedita.
                Consequatur veniam saepe perferendis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const images = ref<string[]>([
  "/img/map_bg.PNG",
  "/img/map_bg_2.PNG",
  "/img/map_bg_3.PNG",
]);

const currentSlide = ref(0);

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % images.value.length;
}

onMounted(() => {
  setInterval(nextSlide, 5000); // Change image every 5 seconds
});
</script>

<style scoped>
.background-slideshow {
  position: relative;
  width: 100vw;
  min-height: 543px;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
  opacity: 0;
}

.slide:nth-of-type(1) {
  animation: zoomIn 1s ease-in-out;
}

.slide:nth-of-type(2) {
  animation: zoomIn 1s ease-in-out 1s;
}

.slide:nth-of-type(3) {
  animation: zoomIn 1s ease-in-out 2s;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.description {
  font-size: 1.2rem;
  max-width: 80%;
  margin: 0 auto;
}

@keyframes zoomIn {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
