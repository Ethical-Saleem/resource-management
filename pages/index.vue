<script setup lang="ts">
const router = useRouter();

const images = ref<string[]>([
  "/img/map_bg.PNG",
  "/img/tomato-farm.jpg",
  "/img/map_bg_2.PNG",
  "/img/lithium_mining.jpg",
  "/img/map_bg_3.PNG",
  "/img/coal_mine.jpeg",
]);

const currentSlide = ref(0);

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % images.value.length;
}

onMounted(() => {
  setInterval(nextSlide, 5000); // Change image every 5 seconds
});
</script>

<template>
  <div class="">
    <header class="hero-section">
      <div
        class="slideshow"
        v-for="(image, index) in images"
        :key="index"
        :style="{
          backgroundImage: `url(${image})`,
          opacity: index === currentSlide ? 1 : 0,
        }"
      ></div>
      <!--navigation-->

      <nav class="navbar navbar-default" data-spy="affix" data-offset-top="450">
        <div class="container">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">
              <NuxtImg src="/img/rmrdc.png" class="logo" /><NuxtImg
                src="/img/rmrdc.png"
                class="logo-nav"
            /></a>
          </div>
          <ul class="nav navbar-nav navbar-right hidden">
            <li class="hidden-xs hidden-sm">
              <a href="#features">Features</a>
            </li>
            <li class="hidden-xs hidden-sm"><a href="#pricing">Pricing</a></li>
            <li class="hidden-xs hidden-sm"><a href="#reviews">Reviews</a></li>
            <li class="hidden-xs"><a href="signin.html">Sign In</a></li>
            <li><a href="signup.html" class="btn btn-nav">Sign Up</a></li>
            <li class="hidden-md hidden-lg">
              <a id="toggle"
                ><i class="fa fa-bars fa-2x"></i
                ><i class="fa fa-times fa-2x"></i
              ></a>
            </li>
          </ul>
        </div>
      </nav>

      <!--navigation end-->

      <!--mobile navigation-->

      <div class="mobile-nav-overlay hidden" id="mobile-nav-overlay">
        <nav class="mobile-nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#team">Team</a></li>
            <li class="hidden-sm"><a href="signin.html">Sign In</a></li>
          </ul>
        </nav>
      </div>

      <!--mobile navigation end-->

      <!--welcome message-->

      <section
        class="container welcome-message text-center mt-0 sm:mt-16 lg:mt-24 w-full"
      >
        <!-- <div
          class="flex flex-col lg:flex-row items-center lg:items-start justify-between mx-auto"
        >
          <div
            class="md:col-span-5 col-span-12 flex flex-col items-center lg:items-start mb-8 lg:mb-0 max-w-2xl lg:max-w-md lg:pr-8 lg:flex-grow-0 lg:flex-shrink-0"
          >
          <h3 class="text-white text-sm text-center lg:text-start text-4xl font-bold mb-4">
            Raw Materials Research and Development Council
          </h3>
            <h1
              class="text-white text-center lg:text-start text-4xl font-bold mb-4"
            >
              Elevate Your Raw Materials Management with Us
            </h1>
          </div>
          <div
            class="md:col-span-7 col-span-12 flex justify-center lg:justify-start lg:flex-grow"
          >
          </div>
        </div> -->
        <div
          class="flex flex-col lg:flex-row items-center justify-center mx-auto"
        >
          <div
            class="col-span-12 flex flex-col items-center mb-8 lg:mb-0 lg:pr-8 lg:flex-grow-0 lg:flex-shrink-0"
          >
            <h3
              class="text-white text-lg text-center lg:text-start text-4xl font-bold mb-4"
            >
              Raw Materials Research and Development Council
            </h3>
            <h1
              class="text-white text-center lg:text-start text-4xl font-bold mb-4"
            >
              Elevate Your Raw Materials Management with Us
            </h1>
            <div class="w-1/4">
              <UButton
                class="text-white"
                block
                color="uiearth"
                label="Explore"
                size="lg"
                @click="() => router.push('/map-view')"
              />
            </div>
          </div>
        </div>
      </section>

      <!--welcome message end-->
    </header>
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="md:col-sapn-11 block mx-auto">
          <div class="flex flex-col md:flex-row justify-between mx-auto gap-8">
            <div
              class="md:col-span-7 col-span-12 items-center mb-8 lg:mb-0 max-w-2xl md:max-w-md md:pr-8 md:flex-grow-0 md:flex-shrink-0"
            >
              <h4 class="text-xl text-uiearth-800 font-bold">Our motto</h4>
              <div class="mt-16">
                <p class="text-3xl">
                  Transform Your Raw Materials Data with R&D Excellence
                </p>
              </div>
            </div>
            <div
              class="md:col-span-5 col-span-12 flex justify-center lg:justify-start lg:flex-grow lg:max-w-lg"
            >
              <p class="text-sm md:text-base">
                Welcome to the Raw Materials Research and Development Council’s
                portal, your gateway to advanced categorization and database
                management. Our platform is designed to support cutting-edge
                research and development by providing comprehensive tools for
                organizing and managing raw materials data. Join us in driving
                innovation and efficiency in the raw materials sector. Explore
                our resources and elevate your materials management today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <h2 class="text-2xl mb-2 text-uiearth-800 font-bold">
            Core Features
          </h2>
          <h3 class="text-xl">
            Understanding the core pillars/functions of the portal
          </h3>
        </div>
        <div class="flex flex-row">
          <div class="md:col-span-11 text-left block mx-auto">
            <div class="flex flex-row items-center flex-wrap mb-8">
              <div
                class="w-full md:w-1/2 md:order-last flex items-center justify-center mb-4"
              >
                <NuxtImg src="/img/rs_map.PNG" width="150" height="150" />
              </div>
              <div class="w-full md:w-1/2 md:order-first text-center md:text-start mb-4">
                <div
                  class="bullet sm:absolute w-16 h-16 flex items-center justify-center rounded-full text-white bg-uiearth-800 font-bold m-auto"
                >
                  <span>1</span>
                </div>
                <h4 class="sm:ml-24 mb-4 mt-3 md:mt-0 text-lg text-uigreen-700 font-medium">
                  Intuitive Map
                </h4>
                <p class="sm:ml-24 text-lg">
                  An interactive map to show to location distribution of various
                  resources across the 36 states and F.C.T
                </p>
              </div>
            </div>
            <div class="flex flex-row items-center flex-wrap mb-8">
              <div
                class="w-full md:w-1/2 md:order-first flex items-center justify-center mb-4"
              >
                <NuxtImg src="/img/rs_map.PNG" width="150" height="150" />
              </div>
              <div class="w-full md:w-1/2 text-center md:text-start md:order-last mb-4">
                <div
                  class="bullet sm:absolute w-16 h-16 flex items-center justify-center rounded-full text-white bg-uiearth-800 font-bold m-auto"
                >
                  <span>2</span>
                </div>
                <h4 class="sm:ml-24 mb-4 mt-3 md:mt-0 text-lg text-uigreen-700 font-medium">
                  Resource Database Management
                </h4>
                <p class="sm:ml-24 text-lg">
                  An interactive map to show to location distribution of various
                  resources across the 36 states and F.C.T
                </p>
              </div>
            </div>
            <div class="flex flex-row items-center flex-wrap mb-8">
              <div
                class="w-full md:w-1/2 md:order-last flex items-center justify-center mb-4"
              >
                <NuxtImg src="/img/rs_map.PNG" width="150" height="150" />
              </div>
              <div class="w-full md:w-1/2 md:order-first text-center md:text-start mb-4">
                <div
                  class="bullet sm:absolute w-16 h-16 flex items-center justify-center rounded-full text-white bg-uiearth-800 font-bold m-auto"
                >
                  <span>3</span>
                </div>
                <h4 class="sm:ml-24 mb-4 mt-3 md:mt-0 text-lg text-uigreen-700 font-medium">
                  Intearctive Charts
                </h4>
                <p class="sm:ml-24 text-lg">
                  An interactive map to show to location distribution of various
                  resources across the 36 states and F.C.T
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.welcome-message {
  @apply relative z-10 text-white text-center;
}
.slideshow {
  @apply absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out transform;
  opacity: 0.2;
  animation: zoomIn 5s infinite alternate ease-in-out;
}
.slideshow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  animation: zoomIn 20s ease-in-out infinite alternate;
  transition: background-image 2s ease-in-out;
}
.slideshow::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Adjust opacity for the fade effect */
  z-index: 1; /* Ensure the overlay is above the background but below the text */
}
@keyframes zoomIn {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
