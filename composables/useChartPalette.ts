/**
 * Deterministic chart color assignment.
 *
 * Backend analytics endpoints used to generate a fresh `Math.random()` hex
 * color per state/resource on every request — colors reshuffled on every
 * reload and had no accessibility guarantee. Colors are now assigned here,
 * client-side, from a fixed categorical order (never cycled per render), so
 * the same entity always gets the same color and the palette is validated
 * for colorblind-safe adjacent contrast.
 *
 * Palette is the dataviz skill's validated default categorical order
 * (8 hues, CVD Delta E >= 8 adjacent, normal-vision Delta E >= 15 adjacent).
 */

export const CATEGORICAL_PALETTE = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
] as const;

/** Fixed semantic colors for the app's 3 resource categories — matches the
 * map legend and mockup exactly, so a category always reads the same color
 * everywhere in the app. */
export const CATEGORY_COLORS: Record<number, string> = {
  1: "#64748B", // Solid Minerals
  2: "#FC8813", // Energy
  3: "#0ABF98", // Agriculture
};

export const STATUS_COLORS = {
  good: "#007C67",
  warning: "#FC8813",
  critical: "#B3261E",
} as const;

/** The two colors used for any "A vs B" comparison (state1/state2,
 * resource1/resource2) — always the same two slots, in the same order. */
export const COMPARISON_PAIR = [CATEGORICAL_PALETTE[0], CATEGORICAL_PALETTE[1]] as const;

/** Deterministic color for the Nth series in a category-less comparison
 * (e.g. states picked for a box plot). Cycles past 8 series — real usage
 * here never compares more than a handful of states at once. */
export function colorForIndex(index: number): string {
  return CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length];
}

/** Sequential single-hue ramp for magnitude (heatmap cells, etc.) — one hue,
 * light to dark, matching the mockup's teal heatmap gradient. `t` is 0..1. */
export function sequentialColor(t: number, hex = "#0ABF98"): string {
  const clamped = Math.max(0, Math.min(1, t));
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const alpha = 0.12 + clamped * 0.83;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const useChartPalette = () => ({
  categorical: CATEGORICAL_PALETTE,
  categoryColors: CATEGORY_COLORS,
  status: STATUS_COLORS,
  comparisonPair: COMPARISON_PAIR,
  colorForIndex,
  sequentialColor,
  hexToRgba,
});
