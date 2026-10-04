import { reactive } from 'vue';
import { D } from '@/core/decimal';
import { range } from '@/core/utils';

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
    dimensionBoosts: D(0),
    galaxies: D(0),
    sacrificed: D(0),
    lastUpdate: Date.now(),
    options: {
      updateRate: 33,
      offlineProgress: true,
      offlineTicks: 5000,
    },
  };
}

export const player = reactive(createInitialPlayer());