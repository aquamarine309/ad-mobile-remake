import { reactive } from 'vue';
import { D } from '@/core/decimal';
import { range, repeat } from '@/core/utils';

export function createInitialPlayer() {
  return {
    antimatter: D(10),
    dimensions: {
      antimatter: range(1, 8).map(() => ({
        bought: D(0),
        amount: D(0),
      })),
    },
    tickspeed: {
      bought: D(0),
      gained: D(0),
    },
    achievements: {
      normal: repeat(0, 17),
      secret: repeat(0, 4),
    },
    dimensionBoosts: D(0),
    galaxies: D(0),
    sacrificed: D(0),
    lastUpdate: Date.now(),
    options: {
      updateRate: 33,
      offlineProgress: true,
      offlineTicks: 5000,
      lastTab: "dimensions",
      lastSubtabs: {},
      bottomNavSymbols: 'all',
    },
  };
}

export const player = reactive(createInitialPlayer());

import { Lazy } from '@/core/lazy';

/**
 * Replace all fields of `player` with the given object.
 * Invalidates all Lazy caches, since they may depend on any field.
 */
export function applyPlayer(fresh) {
  for (const k of Object.keys(player)) delete player[k];
  Object.assign(player, fresh);
  Lazy.invalidateAll();
}