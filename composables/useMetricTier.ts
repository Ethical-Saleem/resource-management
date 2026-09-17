/**
 * Every metric in this app (quality, market value, environmental impact,
 * abundance, etc.) is a bare 0-10 score from the field survey — meaningful
 * to whoever designed the survey, opaque to a public reader landing on a
 * chart. This gives every such score a plain-language band (Low/Medium/High)
 * to sit next to the number, using the same 0-3 / 4-6 / 7-10 cutoffs the
 * app's own chart tooltips used to describe informally before the Phase 2/3
 * redesign — now applied consistently and visibly instead of buried in a
 * hover-only "?" popover.
 *
 * These are neutral magnitude bands, not a value judgment: "High industry
 * challenges" and "High market value" both just mean the number is in the
 * 7-10 range — whether that's good or bad news depends on the metric, which
 * this helper deliberately doesn't guess at.
 */

export type MetricTier = "Low" | "Medium" | "High";

const TIER_COLORS: Record<MetricTier, string> = {
  Low: "#64748B", // uimuted-500
  Medium: "#FC8813", // uiearth-500
  High: "#009B7D", // uigreen-600
};

export function tierFor(value: number | null | undefined): MetricTier | null {
  return tierForScale(value, 10);
}

/** Same Low/Medium/High banding, generalized to any 0..max scale (e.g. the
 * cross-resource heatmap's 0-100 normalized shares) — thirds of the range,
 * matching the 0-3 / 4-6 / 7-10 split at max=10. */
export function tierForScale(value: number | null | undefined, max: number): MetricTier | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  if (value >= max * 0.7) return "High";
  if (value >= max * 0.4) return "Medium";
  return "Low";
}

export function tierColor(tier: MetricTier | null): string {
  return tier ? TIER_COLORS[tier] : "#94A3B8";
}

/** "8.5 (High)" — for stat tiles and plain-text contexts. */
export function formatWithTier(value: number | null | undefined, digits = 1, max = 10): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const tier = tierForScale(value, max);
  return `${value.toFixed(digits)}${tier ? ` (${tier})` : ""}`;
}

/** Same pairing, split apart — for templates that style the number and the
 * tier badge differently rather than concatenating them into one string. */
export function describeMetric(value: number | null | undefined, digits = 1, max = 10) {
  const tier = tierForScale(value, max);
  return {
    value: value === null || value === undefined || Number.isNaN(value) ? "—" : value.toFixed(digits),
    tier,
    color: tierColor(tier),
  };
}

export const useMetricTier = () => ({
  tierFor,
  tierForScale,
  tierColor,
  formatWithTier,
  describeMetric,
});
