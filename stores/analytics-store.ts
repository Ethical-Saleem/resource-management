import { useApi } from "#imports";

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
    resourceDistributionByState: [],
    resourceDistributionByLgas: [],
    stateResourceDistribution: [] as StateResourceData[],
    lgaResourceDistribution: [],
    statesResources: [] as StatesResourceChart[],
  }),
  actions: {
    async dispatchFetchStateResourceDistribution(stateId: number) {
      try {
        const data = await useApi.get(
          `/analytics/state-resource-distribution/${stateId}`
        );
        this.stateResourceDistribution = data;
        console.log("state-dist", data);
        return data;
      } catch (error) {
        console.log("state-dist-error", error);
        throw error;
      }
    },

    async dispatchFetchLgaResourceDistribution(lgaId: number) {
      try {
        const data = await useApi.get(
          `/analytics/lga-resource-distribution/${lgaId}`
        );
        this.stateResourceDistribution = data;
        console.log("lga-dist", data);
        return data;
      } catch (error) {
        console.log("lga-dist-error", error);
        throw error;
      }
    },

    async dispatchFetchStatesResources(page: number) {
      try {
        const data = await useApi.get(`/analytics/states-resource-data?page=${page}&limit=${10}`);
        this.statesResources = data;
        console.log('states-resources-chart', data);
        return data;
      } catch (error) {
        console.log('states-resources-chart-data-error', error)
        throw error;
      }
    },

    async dispatchFetchStateLevelMetrics(resourceId: number, stateId?: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/state-metrics?stateId=${stateId}`);
        console.log('state-level-metrics', data);
        return data;
      } catch (error) {
        console.log('state-level-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceCompareMetrics(resourceId1: number, resourceId2: number, stateId?: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId1}/${resourceId2}/resource-metrics-compare?stateId=${stateId}`);
        console.log('state-resource-compare-metrics', data);
        return data;
      } catch (error) {
        console.log('state-resource-compare-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceBarMetrics(resourceId: number, page: number, stateId?: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/resource-metrics-by-lga?stateId=${stateId}&page=${page}&pageSize=${8}`);
        console.log('resource-lga-level-metrics', data);
        return data;
      } catch (error) {
        console.log('resource-lga-level-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceMiscMetrics(resourceId: number, stateId?: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/resource-misc-data-metrics?stateId=${stateId}`);
        console.log('resource-misc-metrics', data);
        return data;
      } catch (error) {
        console.log('resource-misc-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchResourceMetricsCompare(resourceId: number, page: number, size: number, stateId?: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/resource-metrics-compare?stateId=${stateId}&page=${page}&size=${size}`);
        console.log('resource-misc-metrics', data);
        return data;
      } catch (error) {
        console.log('resource-misc-metrics-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceOutliers(resourceId: number, stateId?: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/resource-outlier-by-state?stateId=${stateId}`);
        console.log('state-outlier-metrics', data);
        return data;
      } catch (error) {
        console.log('state-resource-outlier-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceHeatmap(stateId: number, resourceIds: number[]) {
      try {
        const data = await useApi.get(`/analytics/resource-heatmap/${stateId}?resourceIds=${resourceIds}`);
        console.log('state-outlier-metrics', data);
        return data;
      } catch (error) {
        console.log('state-resource-outlier-error', error);
        throw error;
      }
    },

    async dispatchFetchStateResourceValueMetrics(resourceId: number, stateId: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/resource-value-metrics-compare/stateId=${stateId}`);
        console.log('state-outlier-metrics', data);
        return data;
      } catch (error) {
        console.log('state-resource-outlier-error', error);
        throw error;
      }
    },

    async dispatchFetchValueChainAnalysisByState(resourceId: number) {
      try {
        const data = await useApi.get(`/analytics/${resourceId}/resource-value-chain-data`);
        console.log('state-value-chain', data);
        return data;
      } catch (error) {
        console.log('state-value-chain-error', error);
        throw error;
      }
    },
  },
});
