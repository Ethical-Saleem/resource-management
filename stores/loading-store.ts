export const useLoadingStore = defineStore("loading-store", () => {
  const isLoading = ref(true);

  const showLoading = () => {
    isLoading.value = true;
  };

  const hideLoading = () => {
    isLoading.value = false;
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
});
