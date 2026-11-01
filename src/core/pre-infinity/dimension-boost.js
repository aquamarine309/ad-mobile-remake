import { D, Decimal } from '@/core/decimal';
import { player } from '@/core/state/player';
import { AntimatterDimension, AntimatterDimensions } from '@/core/dimensions/antimatter-dimension';
import { formatInt, formatX } from '@/core/format';
import { Tickspeed } from "./tickspeed";
import { dispatch, GAME_EVENT } from '@/core/events';
import { t } from "@/i18n";
import { Currency } from "@/core/currency";
import { InfinityUpgrade } from "@/core/infinity/upgrades";
import { canBigCrunch } from "@/core/prestige/big-crunch";
import { NormalChallenge } from '@/core/challenges/normal';
import { resetChallengeTransient } from "@/core/challenges";

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
    if (NormalChallenge(8).isRunning) return D(1);
    return InfinityUpgrade('resetMult').effectOrDefault(D(2));
  },

  get purchasedBoosts() {
    return player.dimensionBoosts;
  },

  get totalBoosts() {
    return player.dimensionBoosts;
  },
  
  get maxBoosts() {
    if (NormalChallenge(8).isRunning) return D(5);
    return Decimal.dLayerSafeMax;
  },

  get maxDimensionsUnlockable() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  },

  get canUnlockNewDimension() {
    return this.purchasedBoosts.add(4).lt(this.maxDimensionsUnlockable);
  },

  get canBeBought() {
    if (this.purchasedBoosts.gte(this.maxBoosts)) return false;
    if (!player.break && canBigCrunch()) return false;
    return true;
  },

  get requirement() {
    return this.bulkRequirement(D(1));
  },

  bulkRequirement(bulk) {
    const targetResets = this.purchasedBoosts.add(bulk);
    const tier = Math.min(targetResets.toNumber() + 3, this.maxDimensionsUnlockable);
    let amount = D(20);
    if (tier === 6 && NormalChallenge(10).isRunning) {
      const over = targetResets.sub(3);
      amount = amount.add(over.times(20).round());
    } else if (tier === 8) {
      const over = targetResets.sub(5);
      amount = amount.add(over.times(15).round());
    }
    amount = InfinityUpgrade("resetBoost").subEffect(amount);
    return new DimBoostRequirement(tier, amount);
  },

  multiplierToNDTier(tier) {
    return this.power.pow(this.purchasedBoosts.add(1).sub(tier)).clampMin(1);
  },
  
  get unlockedByBoost() {
    const boosts = this.purchasedBoosts;
    const max = this.maxDimensionsUnlockable;
  
    let newUnlock = '';
    if (boosts.lt(max - 4)) {
      newUnlock = t('dimboost_button_unlock_dimension',
        AntimatterDimension(boosts.toNumber() + 5).name);
    } else if (boosts.eq(4) && !NormalChallenge(10).isRunning) {
      newUnlock = t('dimboost_button_unlock_sacrifice');
    }
  
    if (NormalChallenge(8).isRunning) {
      if (boosts.gte(5)) return t("locked_reason", t("nc_name", 8));
      return t('dimboost_button_reset_dimensions', newUnlock);
    }
  
    const multText = formatX(this.power, 2, 1);
    let range = '';
    if (boosts.eq(0)) range = t('dimboost_button_boost_first_dimension', multText);
    else if (boosts.gte(max - 1)) range = t('dimboost_button_boost_all_dimension', multText);
    else range = t('dimboost_button_boost_range_of_dimension',
      multText, '1', Math.min(boosts.toNumber() + 1, 8));
    const reward = newUnlock === '' ? range : t('X_and_Y', newUnlock, range);
    return t('dimboost_button_reset_dimensions', reward);
  },

  buy() {
    if (!this.canBeBought) return false;
    if (!this.requirement.isSatisfied) return false;
    softReset(D(1));
    return true;
  },
  
  buyMax(limit = Decimal.dLayerSafeMax) {
    if (!this.canBeBought) return false;
  
    if (this.canUnlockNewDimension) {
      if (this.requirement.isSatisfied) softReset(D(1));
      return;
    }
  
    const d8 = AntimatterDimension(8).totalAmount;
    if (d8.lt(20)) return;
  
    const b0 = this.purchasedBoosts;
    if (b0.gte(limit)) return;
    
    let bulk = d8.sub(20).div(15).sub(b0).add(5).floor();
    bulk = bulk.min(limit.sub(b0));
  
    if (bulk.lt(1)) return;
    softReset(bulk);
  },
};

export function softReset(bulk = D(1), { resetAM = false, resetAD = false } = {}) {
  dispatch(GAME_EVENT.DIMBOOST_BEFORE, bulk);

  player.dimensionBoosts = player.dimensionBoosts.add(bulk).clampMax(DimBoost.maxBoosts);
  const canKeepAD = false;
  if (resetAD || !canKeepAD) {
    AntimatterDimensions.reset();
    Tickspeed.reset();
    player.sacrificed = D(0);
  }
  const canKeepAM = false;
  if (resetAM || !canKeepAM || Currency.antimatter.lt(Currency.antimatter.startingValue)) {
    Currency.antimatter.reset();
  }
  
  resetChallengeTransient();

  dispatch(GAME_EVENT.DIMBOOST_AFTER, bulk);
}