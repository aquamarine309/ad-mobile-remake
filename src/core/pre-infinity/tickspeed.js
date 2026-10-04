import { D, Decimal } from '@/core/decimal';
import { player } from '@/core/player';
import { Currency } from '@/core/currency';
import { ExponentialCostScaling } from '@/core/math';
import { Galaxy } from "./galaxy";

import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";

export const Tickspeed = {
  get isUnlocked() {
    return AntimatterDimension(2).bought.gt(0);
  },

  get isAvailableForPurchase() {
    return this.isUnlocked;
  },

  get isAffordable() {
    return Currency.antimatter.gte(this.cost);
  },

  get cost() {
    return this.costScale.calculateCost(player.tickspeed.bought);
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
    const BASE_AT_ZERO = [
      D(1).div(1.1245),
      D(1).div(1.11888888),
      D(1).div(1.11267177),
    ];
    const g = player.galaxies;
  
    if (g.lt(3)) {
      const interval = BASE_AT_ZERO[g.toNumber()].sub(g.times(0.02)).clampMin(0.01);
      return D(1).div(interval);
    }
  
    const interval = D(0.8).times(D(0.965).pow(g.sub(4)));
    return D(1).div(interval);
  },

  get multiplier() {
    return this.base.pow(this.totalUpgrades);
  },

  buy() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    Currency.antimatter.sub(this.cost);
    player.tickspeed.bought = player.tickspeed.bought.add(1);
    return true;
  },

  buyMax() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return;
    const purchases = this.costScale.getMaxBought(
      player.tickspeed.bought,
      Currency.antimatter.value,
      D(1)
    );
    if (purchases === null) return;
    Currency.antimatter.sub(Decimal.pow10(purchases.logPrice));
    player.tickspeed.bought = player.tickspeed.bought.add(purchases.quantity);
  },
  
  reset() {
    player.tickspeed.bought = D(0);
  }
};