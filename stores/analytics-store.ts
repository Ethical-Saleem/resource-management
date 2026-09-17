import { useApiClient, unwrap } from "~/composables/useApiClient";

export interface StateResourceData {
  resource: { id: number; name: string, colorCode: string };
  resourceId: number;
  staeId: number;
  _sum: { totalQuantity: number, totalValue: number | null };
}

export interface StatesResourceChart {
  state: string
  resources: Array<{ name: string, quantity: number, colorCode: string }>;
}

export const useAnalyticsStore = defineStore("analytics-store", {
  state: () => ({
    stateResourceDistribution: [] as StateResourceData[],
    statesResources: [] as StatesResourceChart[],
  }),
  actions: {
    async dispatchFetchStateResourceDistribution(stateId: number) {
      try {
        const api = useApiClient();
        const data = unwrap<StateResourceData[]>(
          await api.GET("/analytics/state-resource-distribution/{id}", {
            params: { path: { id: stateId } },
          }),
        );
        this.stateResourceDistribution = data;
        return data;
      } catch (error) {
        console.log("state-dist-error", error);
        throw error;
      }
    },

    async dispatchFetchStatesResources(page: number) {
      try {
        const api = useApiClient();
        const data = unwrap<StatesResourceChart[]>(
          await api.GET("/analytics/states-resource-data", {
            params: { query: { page, limit: 10 } },
          }),
        );
        this.statesResources = data;
        return data;
      } catch (error) {
        console.log('states-resources-chart-data-error', error)
        throw error;
      }
    },

    async dispatchFetchStateLevelMetrics(resourceId: number, stateId?: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/state-metrics", {
            params: { path: { resourceId }, query: { stateId } },
          }),
        );
      } catch (error) {
        console.log('state-level-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceCompareMetrics(resourceId1: number, resourceId2: number, stateId?: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET(
            "/analytics/{resourceId1}/{resourceId2}/resource-metrics-compare",
            { params: { path: { resourceId1, resourceId2 }, query: { stateId } } },
          ),
        );
      } catch (error) {
        console.log('state-resource-compare-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceStatesCompareMetrics(resourceId: number, stateId1: number, stateId2: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/states-resource-metrics-compare", {
            params: { path: { resourceId }, query: { stateId1, stateId2 } },
          }),
        );
      } catch (error) {
        console.log('state-resource-compare-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceBarMetrics(resourceId: number, page: number, stateId?: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/resource-metrics-by-lga", {
            params: { path: { resourceId }, query: { stateId, page, pageSize: 8 } },
          }),
        );
      } catch (error) {
        console.log('resource-lga-level-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceMiscMetrics(resourceId: number, stateId?: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/resource-misc-data-metrics", {
            params: { path: { resourceId }, query: { stateId } },
          }),
        );
      } catch (error) {
        console.log('resource-misc-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceMetricsCompare(resourceId: number, page: number, size: number, stateId?: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/resource-metrics-compare", {
            params: { path: { resourceId }, query: { stateId, page, size } },
          }),
        );
      } catch (error) {
        console.log('resource-misc-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceOutliers(resourceId: number, stateId?: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/resource-outlier-by-state", {
            params: { path: { resourceId }, query: { stateId } },
          }),
        );
      } catch (error) {
        console.log('state-resource-outlier-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceHeatmap(stateId: number, resourceIds: number[]) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/resource-heatmap/{stateId}", {
            params: { path: { stateId }, query: { resourceIds: resourceIds.join(",") } },
          }),
        );
      } catch (error) {
        console.log('state-resource-outlier-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceValueMetrics(resourceId: number, stateId: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET(
            "/analytics/{resourceId}/resource-value-metrics-compare/{stateId}",
            { params: { path: { resourceId, stateId } } },
          ),
        );
      } catch (error) {
        console.log('state-resource-outlier-error', error);
        throw error;
      }
    },

    async dispatchFetchValueChainAnalysisByState(resourceId: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/{resourceId}/resource-value-chain-data", {
            params: { path: { resourceId } },
          }),
        );
      } catch (error) {
        console.log('state-value-chain-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceStates(resourceId: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/resource-states/{resourceId}", {
            params: { path: { resourceId } },
          }),
        );
      } catch (error) {
        console.log('respurce-states-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResources(stateId: number, categoryId: number) {
      try {
        const api = useApiClient();
        return unwrap<any>(
          await api.GET("/analytics/state-resources/{stateId}", {
            params: { path: { stateId }, query: { categoryId } },
          }),
        );
      } catch (error) {
        console.log('state-resources-error', error);
        throw error;
      }
    },
  },
});
