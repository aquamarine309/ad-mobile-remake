import { D, Decimal } from "@/core/decimal";
import { player } from "@/core/state/player";
import {
  AntimatterDimension,
  AntimatterDimensions,
} from "@/core/dimensions/antimatter-dimension";
import { dispatch, GAME_EVENT } from "@/core/events";
import { ta } from "@/i18n";
import { formatInt } from "@/core/format";
import { Currency } from "@/core/currency";
import { InfinityUpgrade } from "@/core/infinity/upgrades";
import { canBigCrunch } from "@/core/prestige/big-crunch";
import { resetChallengeTransient } from "@/core/challenges";
import { NormalChallenge } from "@/core/challenges/normal";

export const GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2,
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return AntimatterDimension(this.tier).totalAmount.gte(this.amount);
  }
}

export const Galaxy = {
  get baseCost() {
    return NormalChallenge(10).isRunning ? D(99) : D(80);
  },

  get costMult() {
    return NormalChallenge(10).isRunning ? D(90) : D(60);
  },

  get requiredTier() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  },

  get costScalingStart() {
    return D(100);
  },

  get remoteStart() {
    return D(800);
  },

  get remoteBase() {
    return D(1.002);
  },

  get remoteC() {
    const g = this.remoteStart.sub(1);
    const beforeDistant = g.sub(this.costScalingStart.sub(1));
    return this.baseCost
      .add(g.times(this.costMult))
      .add(beforeDistant.pow(2))
      .add(beforeDistant);
  },

  get type() {
    return this.typeAt(player.galaxies);
  },

  typeAt(galaxies) {
    if (galaxies.gte(this.remoteStart)) return GALAXY_TYPE.REMOTE;
    if (galaxies.gte(this.costScalingStart)) return GALAXY_TYPE.DISTANT;
    return GALAXY_TYPE.NORMAL;
  },

  get title() {
    return ta("galaxy_types", formatInt(player.galaxies))[this.type];
  },

  get requirement() {
    return this.requirementAt(player.galaxies);
  },

  requirementAt(galaxies) {
    const tier = this.requiredTier;
    const distantStart = this.costScalingStart;
    const remoteStart = this.remoteStart;
    const discount = InfinityUpgrade("resetBoost").effectOrDefault(D(0));

    if (galaxies.lt(distantStart)) {
      const amount = this.baseCost
        .add(galaxies.times(this.costMult))
        .minus(discount)
        .floor();
      return new GalaxyRequirement(tier, amount);
    }

    if (galaxies.lt(remoteStart)) {
      const beforeDistant = galaxies.sub(distantStart).add(1);
      const amount = this.baseCost
        .add(galaxies.times(this.costMult))
        .add(beforeDistant.pow(2))
        .add(beforeDistant)
        .minus(discount)
        .floor();
      return new GalaxyRequirement(tier, amount);
    }

    const exp = galaxies.sub(remoteStart).add(1);
    const amount = this.remoteC
      .times(this.remoteBase.pow(exp))
      .minus(discount)
      .floor();
    return new GalaxyRequirement(tier, amount);
  },

  galaxyAtAmount(target) {
    const distantStart = this.costScalingStart;
    const remoteStart = this.remoteStart;
    const distantStartAmount = this.baseCost.add(
      distantStart.sub(1).times(this.costMult),
    );

    if (target.lt(distantStartAmount)) {
      return target
        .sub(this.baseCost)
        .div(this.costMult)
        .floor()
        .add(1)
        .clampMin(0);
    }

    const remoteC = this.remoteC;
    if (target.lt(remoteC)) {
      let lo = distantStart;
      let hi = remoteStart;
      while (hi.sub(lo).gt(1)) {
        const mid = lo.add(hi).div(2).floor();
        if (this.requirementAt(mid).amount.lte(target)) lo = mid;
        else hi = mid;
      }
      return lo;
    }

    const exp = target.div(remoteC).log(this.remoteBase);
    return remoteStart.sub(1).add(exp.floor());
  },

  get canBeBought() {
    if (NormalChallenge(8).isRunning) return false;
    if (!player.break && canBigCrunch()) return false;
    return true;
  },

  buy() {
    if (!this.canBeBought) return false;
    if (!this.requirement.isSatisfied) return false;
    this.reset();
    return true;
  },

  buyMax(limit = Decimal.dLayerSafeMax) {
    if (!this.canBeBought) return false;
    const current = player.galaxies;
    if (current.gte(limit)) return false; // Already reached limit

    const maxG = this.galaxyAtAmount(
      AntimatterDimension(this.requiredTier).totalAmount,
    ).clampMax(limit);
    if (maxG.lte(current)) return false;

    player.galaxies = maxG.sub(1);
    this.reset();
    return true;
  },

  reset() {
    dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);

    player.galaxies = player.galaxies.add(1);
    player.dimensionBoosts = D(0);
    player.sacrificed = D(0);
    player.tickspeed.bought = D(0);
    AntimatterDimensions.reset();
    Currency.antimatter.reset();

    resetChallengeTransient();

    dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
  },
};
