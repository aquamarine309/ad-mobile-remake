import { D } from '@/core/decimal';
import { player } from '@/core/state/player';
import { AntimatterDimension, AntimatterDimensions } from '@/core/dimensions/antimatter-dimension';
import { formatInt, formatX } from '@/core/format';
import { Tickspeed } from "./tickspeed";
import { dispatch, GAME_EVENT } from '@/core/events';

class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return AntimatterDimension(this.tier).totalAmount.gte(this.amount);
  }
}

export const DimBoost = {
  get power() {
    return D(2);
  },

  get purchasedBoosts() {
    return player.dimensionBoosts;
  },

  get totalBoosts() {
    return player.dimensionBoosts;
  },

  get maxDimensionsUnlockable() {
    return 8;
  },

  get canUnlockNewDimension() {
    return this.purchasedBoosts.add(4).lt(this.maxDimensionsUnlockable);
  },

  get canBeBought() {
    return true;
  },

  get requirement() {
    return this.bulkRequirement(D(1));
  },

  bulkRequirement(bulk) {
    const targetResets = this.purchasedBoosts.add(bulk);
    const tier = Math.min(targetResets.toNumber() + 3, this.maxDimensionsUnlockable);
    let amount = D(20);
    if (tier === 8) {
      const over = targetResets.sub(5);
      amount = amount.add(over.times(15).round());
    }
    return new DimBoostRequirement(tier, amount);
  },

  multiplierToNDTier(tier) {
    return this.power.pow(this.purchasedBoosts.add(1).sub(tier)).clampMin(1);
  },

  get unlockedByBoost() {
    const boosts = this.purchasedBoosts;
    const max = this.maxDimensionsUnlockable;
  
    let newUnlock = "";
    if (boosts.lt(max - 4)) {
      newUnlock = `unlock the ${formatInt(boosts.toNumber() + 5)}th Dimension`;
    } else if (boosts.eq(4)) {
      newUnlock = "unlock Sacrifice";
    }
  
    const multText = `give a ${formatX(this.power, 2, 1)} multiplier`;
    let range = "to the 1st Dimension";
    if (boosts.gt(0)) range = `to Dimensions 1-${Math.min(boosts.toNumber() + 1, 8)}`;
    if (boosts.gte(max - 1)) range = "to all Dimensions";
  
    if (newUnlock === "") {
      return `Reset your Dimensions to ${multText} ${range}`;
    }
    return `Reset your Dimensions to ${newUnlock} and ${multText} ${range}`;
  },

  buy() {
    if (!this.canBeBought) return false;
    if (!this.requirement.isSatisfied) return false;
    softReset(D(1));
    return true;
  },
  
  buyMax() {
    if (!this.canBeBought) return false;
  
    if (this.canUnlockNewDimension) {
      if (this.requirement.isSatisfied) softReset(D(1));
      return;
    }
  
    const d8 = AntimatterDimension(8).totalAmount;
    if (d8.lt(20)) return;
  
    const b0 = this.purchasedBoosts;
    const bulk = d8.sub(20).div(15).sub(b0).add(5).floor();
  
    if (bulk.lt(1)) return;
    softReset(bulk);
  }
};

export function softReset(bulk) {
  dispatch(GAME_EVENT.DIMBOOST_BEFORE, bulk);

  player.dimensionBoosts = player.dimensionBoosts.add(bulk);
  AntimatterDimensions.reset();
  Tickspeed.reset();
  player.antimatter = D(10);
  player.sacrificed = D(0);

  dispatch(GAME_EVENT.DIMBOOST_AFTER, bulk);
}