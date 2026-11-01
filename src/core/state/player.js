import { reactive } from "vue";
import { D, Decimal } from "@/core/decimal";
import { range, repeat } from "@/core/utils";

export const CURRENT_SAVE_VERSION = 3;

const AD_BASE_INTERVALS = [500, 600, 700, 800, 900, 1000, 1100, 1200];

export function createInitialPlayer() {
  return {
    antimatter: D(10),
    dimensions: {
      antimatter: range(1, 8).map(() => ({
        bought: D(0),
        amount: D(0),
        costBumps: D(0),
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
      antimatterDims: range(1, 8).map((i) => ({
        isBought: false,
        isActive: true,
        lastTick: 0,
        mode: "10",
        interval: AD_BASE_INTERVALS[i - 1],
        cost: 1,
        bulk: 1,
      })),
      tickspeed: {
        isBought: false,
        isActive: true,
        lastTick: 0,
        mode: "max",
        interval: 500,
        cost: 1,
      },
      dimBoost: {
        isActive: true,
        lastTick: 0,
        interval: 4000,
        cost: 1,
        limitDimBoosts: false,
        maxDimBoosts: 10,
        limitUntilGalaxies: false,
        galaxies: 10,
      },
      galaxy: {
        isActive: true,
        lastTick: 0,
        interval: 20000,
        cost: 1,
        limitGalaxies: false,
        maxGalaxies: 10,
      },
      bigCrunch: {
        isActive: true,
        lastTick: 0,
        interval: 150000,
        cost: 1,
        mode: "amount", // 'amount' | 'time' | 'xHighest'
        amount: D(1),
        time: 1,
        xHighest: D(10),
        increaseWithMult: false,
      },
    },
    infinity: {
      points: D(0),
      partPoints: D(0),
      infinities: D(0),
      bankedInfinities: D(0),
      power: D(0),
      upgrades: new Set(),
      breakUpgrades: new Set(),
      rebuyables: [0, 0, 0],
      ipMultPurchases: D(0),
    },
    break: false,
    challenge: {
      normal: {
        current: 0,
        completedBits: 0,
        bestTimes: repeat(Decimal.dLayerSafeMax, 11), // C2..C12
        c2Pow: 0,
        c3Pow: D(0.01),
        c8Sacrifice: D(1),
        c9TickspeedCostBumps: D(0),
      },
    },
    matter: D(0),
    requirementChecks: {
      infinity: {
        maxAll: false,
        noSacrifice: true,
        noAD8: true,
      },
      eternity: {
        onlyAD1: true,
        onlyAD8: true,
        noAD1: true,
        noRG: true,
      },
      reality: {
        noAM: true,
        noTriads: true,
        noPurchasedTT: true,
        noInfinities: true,
        noEternities: true,
        noContinuum: true,
        maxID1: D(0),
        maxStudies: 0,
        maxGlyphs: 0,
        slowestBH: 1,
      },
      permanent: {
        emojiGalaxies: 0,
        singleTickspeed: 0,
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
        time: Decimal.dLayerSafeMax,
        realTime: Number.MAX_VALUE,
        bestIPmin: D(0),
        bestIPminVal: D(0),
      },
      thisEternity: {
        time: D(0),
        realTime: 0,
        maxIP: D(0),
        bestIPmin: D(0),
        bestIPminVal: D(0),
        bestIPminWithoutMaxAll: D(0),
      },
      bestEternity: {
        time: Decimal.dLayerSafeMax,
        realTime: Number.MAX_VALUE,
        bestEPmin: D(0),
        bestEPminVal: D(0),
      },
    },
    dimensionBoosts: D(0),
    galaxies: D(0),
    sacrificed: D(0),
    lastUpdate: Date.now(),
    options: {
      updateRate: 50,
      offlineProgress: "show",
      offlineTicks: 5000,
      lastTab: "dimensions",
      lastSubtabs: {},
      bottomNavSymbols: "all",
      language: "en",
      theme: "dark",
      orientation: "system", // 'system' | 'portrait' | 'landscape'
      retryChallenge: false,
    },
    version: CURRENT_SAVE_VERSION,
  };
}

export const player = reactive(createInitialPlayer());

import { Lazy } from "@/core/lazy";

/**
 * Replace all fields of `player` with the given object.
 * Invalidates all Lazy caches, since they may depend on any field.
 */
export function applyPlayer(fresh) {
  for (const k of Object.keys(player)) delete player[k];
  Object.assign(player, fresh);
  Lazy.invalidateAll();
}
