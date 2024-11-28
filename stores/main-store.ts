export enum AppState {
  maintenance = 0,
  running = 1,
}

export const useMainStore = defineStore('main-store', {
  state: () => ({
    map: null,
    mapType: 'state',
    appState: AppState.maintenance
  }),
  actions: {
    
  },
})
