import { player } from "@/core/state/player";

/**
 * Progress milestone checks.
 *
 * Each predicate returns true once the player has reached that stage.
 * Higher stages imply lower ones (an Eternity unlock also counts as
 * Infinity unlocked, etc.).
 *
 * All functions accept an optional player-like object for validation
 * code that runs on imported saves before they are applied.
 */

export function isInfinityUnlocked(p = player) {
  return p.infinity.infinities.gt(0);
}

// Add these when the corresponding systems exist:
//
// export function isEternityUnlocked(p = player) {
//   return p.eternities.gt(0) || isRealityUnlocked(p);
// }
//
// export function isRealityUnlocked(p = player) {
//   return p.realities > 0;
// }
