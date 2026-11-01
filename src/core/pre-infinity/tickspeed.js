import { D, Decimal } from '@/core/decimal';
import { player } from '@/core/state/player';
import { Currency } from '@/core/currency';
import { ExponentialCostScaling } from '@/core/math';
import { Galaxy } from "./galaxy";

import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { canBigCrunch } from "@/core/prestige/big-crunch";
import { timesEffectsOf } from "@/core/mechanic";
import { InfinityUpgrade } from "@/core/infinity/upgrades";
import { NormalChallenge } from "@/core/challenges/normal";
import { Achievement } from "@/core/achievements";

export const Tickspeed = {
  get isUnlocked() {
    return AntimatterDimension(2).bought.gt(0);
  },

  get isAvailableForPurchase() {
    return this.isUnlocked;
  },

  get isAffordable() {
    if (!player.break && canBigCrunch()) return false;
    return Currency.antimatter.gte(this.cost);
  },

  get cost() {
    return this.costScale.calculateCost(player.tickspeed.bought.add(player.challenge.normal.c9TickspeedCostBumps));
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: D(1000),
      baseIncrease: D(10),
      costScale: D(10),
      scalingCostThreshold: D(Number.MAX_VALUE),
    });
  },

  get totalUpgrades() {
    return player.tickspeed.bought.add(player.tickspeed.gained);
  },
  
  get base() {
    const effects = timesEffectsOf(D(1), InfinityUpgrade("galaxyBoost"));
    const BASE_AT_ZERO = NormalChallenge(5).isRunning ? [
      D(1 / 1.08),
      D(1 / 1.072),
      D(1 / 1.07632),
    ] : [
      D(1 / 1.1245),
      D(1 / 1.11888888),
      D(1 / 1.11267177),
    ];
    const g = player.galaxies;
  
    if (g.lt(3)) {
      const interval = BASE_AT_ZERO[g.toNumber()].sub(g.times(0.02).times(effects)).clampMin(0.01);
      return interval.recip();
    }
  
    const interval = D(0.8).times(D(0.965).pow(g.sub(2).times(effects).sub(2)));
    return interval.recip();
  },

  get multiplier() {
    let mult = this.base.pow(this.totalUpgrades);
    mult = Achievement(36).timesEffect(mult);
    return mult;
  },

  buy() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    this.multiplySameCosts();
    Currency.antimatter.sub(this.cost);
    player.tickspeed.bought = player.tickspeed.bought.add(1);
    player.challenge.normal.c2Pow = 0;
    return true;
  },

  buyMax() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return;
    const purchases = this.costScale.getMaxBought(
      player.tickspeed.bought.add(player.challenge.normal.c9TickspeedCostBumps),
      Currency.antimatter.value,
      D(1)
    );
    if (purchases === null) return;
    this.multiplySameCosts();
    Currency.antimatter.sub(Decimal.pow10(purchases.logPrice));
    player.tickspeed.bought = player.tickspeed.bought.add(purchases.quantity);
    player.challenge.normal.c2Pow = 0;
  },
  
  multiplySameCosts() {
    if (!NormalChallenge(9).isRunning) return;
    for (let tier = 1; tier <= 8; tier++) {
      const dimension = AntimatterDimension(tier);
      if (dimension.cost.eq(this.cost)) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
  },
  
  reset() {
    player.tickspeed.bought = D(0);
    player.challenge.normal.c9TickspeedCostBumps = D(0);
  }
};