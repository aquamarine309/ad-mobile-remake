import { D } from '@/core/decimal';
import { player } from '@/core/state/player';
import { AntimatterDimension } from '@/core/dimensions/antimatter-dimension';
import { DimBoost } from './dimension-boost';
import { formatX, formatInt } from "@/core/format";
import { dispatch, GAME_EVENT } from '@/core/events';

export const Sacrifice = {
  get isVisible() {
    return DimBoost.purchasedBoosts.gte(5);
  },

  get sacrificeExponent() {
    return D(2);
  },

  get canSacrifice() {
    return this.isVisible
      && AntimatterDimension(8).amount.gt(0)
      && this.nextBoost.gt(1);
  },
  
  get disabledCondition() {
    if (DimBoost.purchasedBoosts.lt(5)) {
      return `Requires ${formatInt(5)} Dimension Boosts`;
    }
    if (AntimatterDimension(8).amount.eq(0)) {
      return "No AD8";
    }
    if (this.nextBoost.lte(1)) {
      return `${formatX(1)} multiplier`;
    }
    return null;
  },

  get nextBoost() {
    const nd1 = AntimatterDimension(1).amount;
    if (nd1.eq(0)) return D(1);
    const sacrificed = player.sacrificed.clampMin(1);
    const prePower = nd1.log10().div(10).div(sacrificed.log10().div(10).max(1));
    return prePower.clampMin(1).pow(this.sacrificeExponent);
  },

  get totalBoost() {
    if (player.sacrificed.eq(0)) return D(1);
    const prePower = player.sacrificed.log10().div(10);
    return prePower.clampMin(1).pow(this.sacrificeExponent);
  },

  sacrifice() {
    if (!this.canSacrifice) return false;
  
    dispatch(GAME_EVENT.SACRIFICE_RESET_BEFORE);
  
    player.sacrificed = player.sacrificed.add(AntimatterDimension(1).amount);
    for (let tier = 1; tier <= 7; tier++) {
      AntimatterDimension(tier).amount = D(0);
    }
  
    dispatch(GAME_EVENT.SACRIFICE_RESET_AFTER);
    return true;
  },
};