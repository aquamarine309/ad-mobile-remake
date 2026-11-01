import { format, formatInt } from "@/core/format";

/**
 * Fields shown in the offline progress report.
 * Add entries as new resources unlock — order matters (top to bottom).
 * Each field must have a `get(playerLike)` returning a Decimal or number.
 */
export const AWAY_PROGRESS_FIELDS = [
  {
    key: "antimatter",
    labelKey: "antimatter_increased_from_X_to_Y",
    colorVar: "--color-away-antimatter",
    get: (p) => p.antimatter,
    format: (v) => format(v, 2, 2),
  },
  {
    key: "dimensionBoosts",
    labelKey: "dimension_boosts_increased_from_X_to_Y",
    colorVar: "--color-away-dimboosts",
    get: (p) => p.dimensionBoosts,
    format: (v) => formatInt(v),
  },
  {
    key: "galaxies",
    labelKey: "antimatter_galaxies_increased_from_X_to_Y",
    colorVar: "--color-away-galaxies",
    get: (p) => p.galaxies,
    format: (v) => formatInt(v),
  },
  {
    key: "infinityPoints",
    labelKey: "infinity_points_increased_from_X_to_Y",
    colorVar: "--color-away-infinity-points",
    get: (p) => p.infinity.points,
    format: (v) => format(v, 2),
  },
  {
    key: "infinities",
    labelKey: "infinities_increased_from_X_to_Y",
    colorVar: "--color-away-infinities",
    get: (p) => p.infinity.infinities,
    format: (v) => format(v, 2),
  },
];

/**
 * Diff `before` and `after` snapshots and return the lines to show.
 * Only fields that increased are included.
 */
export function buildAwayReport(before, after) {
  const lines = [];
  for (const field of AWAY_PROGRESS_FIELDS) {
    const prev = field.get(before);
    const curr = field.get(after);
    if (curr.lte(prev)) continue;
    const from = field.format(prev);
    const to = field.format(curr);
    if (from === to) continue;
    lines.push({
      key: field.key,
      labelKey: field.labelKey,
      colorVar: field.colorVar,
      from,
      to,
    });
  }
  return lines;
}
