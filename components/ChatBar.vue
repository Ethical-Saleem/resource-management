<script setup lang="ts">
import { useApi } from "~/composables/useApi";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

// Conversation data
const conversation = ref([
  {
    text: "Hello! How can I assist you today?",
    isUser: false,
    isMarkdown: false,
  },
]);

const userInput = ref("");
const loading = ref(false);

// Scroll conversation to the bottom when new messages are added
const conversationContainer = ref<HTMLDivElement | null>(null);

watch(conversation, () => {
  nextTick(() => {
    conversationContainer.value?.scrollTo({
      top: conversationContainer.value.scrollHeight,
      behavior: "smooth",
    });
  });
});

// Handle user input and generate system response
// const handleUserInput = async () => {
//   if (!userInput.value.trim()) return;

//   // Add user message to conversation
//   conversation.value.push({ text: userInput.value, isUser: true });
//   if (!userInput.value.trim() || loading.value) return;

//   // Add user message to conversation
//   conversation.value.push({ text: userInput.value, isUser: true });
//   const userMessage = userInput.value;

//   // Clear input
//   userInput.value = "";
//   loading.value = true;

//   try {
//     const data = await useApi.get(`/ai?message=${userMessage}`);
//     conversation.value.push({
//       text: data || "Sorry, can't provide an answer at this time",
//       isUser: false,
//     });
//   } catch (error) {
//     console.log(error);
//     conversation.value.push({
//       text: "Error fetching response. Please try again later.",
//       isUser: false,
//     });
//   } finally {
//     loading.value = false;
//   }
// };

const handleUserInput = async () => {
  if (!userInput.value.trim()) return;

  // Add user message to conversation
  conversation.value.push({
    text: userInput.value,
    isUser: true,
    isMarkdown: false,
  });
  const userMessage = userInput.value;

  // Clear input
  userInput.value = "";
  loading.value = true;

  try {
    const response = await useApi.get(`/ai?message=${userMessage}`);

    // if (typeof response === "string") {
    // Attempt to parse string response as JSON
    try {
      const parsedResponse = JSON.parse(response);
      const aiText =
        parsedResponse.ai_response ||
        "Sorry, can't provide an answer at this time";
      conversation.value.push({
        text: aiText, // Text to be rendered as markdown
        isUser: false,
        isMarkdown: true, // Mark as markdown so we know to render it as markdown
      });
    } catch (jsonError) {
      console.log("Invalid JSON response:", jsonError);
      // If response is plain text or already a markdown string
      conversation.value.push({
        text: response.ai_response, // Text to be rendered as markdown
        isUser: false,
        isMarkdown: true,
      });
    }
    // }
    console.log(response);
  } catch (error) {
    console.log(error);
    conversation.value.push({
      text: "Error fetching response. Please try again later.",
      isUser: false,
      isMarkdown: false,
    });
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <div>
    <!-- Overlay background -->
    <div
      v-if="props.isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      @click="close"
    />

    <!-- Slideover Panel -->
    <div
      class="fixed top-0 right-0 bg-uigreen-100 dark:bg-uicream-100 h-full w-screen max-w-lg shadow-lg transform transition-transform duration-300 ease-in-out z-50"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Close button -->
      <div
        class="flex items-center justify-between px-2 border-b-2 border-double border-uiearth-800"
      >
        <div class="">
          <h4 class="text-uiearth-500 dark:text-uiearth-600">
            Chat With RMRDC GeoRes AI
          </h4>
        </div>
        <div class="flex items-center justify-end">
          <button class="p-2 text-gray-600 hover:text-gray-900" @click="close">
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>
        </div>
      </div>
      <!-- Slideover content goes here -->
      <div class="flex flex-col h-full">
        <!-- Conversation Area -->
        <div
          ref="conversationContainer"
          class="flex-1 overflow-y-auto px-4 pt-4 pb-16 space-y-4"
        >
          <div
            v-for="(message, index) in conversation"
            :key="index"
            class="flex"
          >
            <div
              :class="
                message.isUser
                  ? 'ml-auto bg-uiearth-500 text-white max-w-xs'
                  : 'mr-auto bg-uigreen-300 text-gray-800 max-w-sm overflow-x-auto'
              "
              class="p-3 rounded-lg"
            >
              <MDC v-if="message.isMarkdown" :value="message.text" />
              <span v-else>{{ message.text }}</span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-gray-200 flex items-center sticky bottom-0">
          <input
            v-model="userInput"
            placeholder="Type your message..."
            class="flex-1 p-2 border border-uiearth-300 bg-white rounded-lg focus:outline-none"
            :disabled="loading"
            @keyup.enter="handleUserInput"
          >
          <UButton
            class="ml-2 bg-uiearth-500 dark:bg-uiearth-600 text-white dark:text-white hover:bg-uiearth-600 dark:hover:bg-uiearth-700 px-4 py-2 rounded-lg"
            :disabled="loading"
            @click="handleUserInput"
          >
            <template v-if="loading">
              <!-- Wavy dots -->
              <div class="flex space-x-1">
                <span class="dot w-2 h-2 bg-white rounded-full animate-wave" />
                <span
                  class="dot w-2 h-2 bg-white rounded-full animate-wave"
                  style="animation-delay: 0.2s"
                />
                <span
                  class="dot w-2 h-2 bg-white rounded-full animate-wave"
                  style="animation-delay: 0.4s"
                />
              </div>
            </template>
            <template v-else>
              <!-- Default airplane icon -->
              <UIcon
                name="i-heroicons-paper-airplane-20-solid"
                class="w-5 h-5"
              />
            </template>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes wave {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

.dot {
  animation: wave 0.6s infinite ease-in-out;
}
</style>
