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
    auto: {
      autobuyersOn: true,
      antimatterDims: range(1, 8).map(() => ({
        isBought: false,
        isActive: true,
        lastTick: 0,
        mode: '10',          // '1' | '10'
      })),
      tickspeed: {
        isBought: false,
        isActive: true,
        lastTick: 0,
        mode: 'max',         // 'single' | 'max'
      },
    },
    records: {
      gameCreatedTime: Date.now(),
    
      totalAntimatter: D(0),
      totalTimePlayed: D(0),
      realTimePlayed: 0,
    
      thisInfinity: {
        time: D(0),
        realTime: 0,
        maxAM: D(0),
      },
      bestInfinity: {
        time: D(Number.MAX_VALUE),
        realTime: Number.MAX_VALUE,
        bestIPmin: D(0),
        bestIPminVal: D(0),
      },
    },
    dimensionBoosts: D(0),
    galaxies: D(0),
    sacrificed: D(0),
    lastUpdate: Date.now(),
    options: {
      updateRate: 50,
      offlineProgress: 'show',
      offlineTicks: 5000,
      lastTab: "dimensions",
      lastSubtabs: {},
      bottomNavSymbols: "all",
      language: "en"
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