import { DimensionState } from "./dimension";
import { player } from "@/core/state/player";
import { ExponentialCostScaling } from "@/core/math";
import { Decimal, D, BREAK_INFINITY_MAX } from "@/core/decimal";
import { Currency } from "@/core/currency";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { DimBoost } from "@/core/pre-infinity/dimension-boost";
import { Sacrifice } from "@/core/pre-infinity/sacrifice";
import { Achievement, NormalAchievements } from "@/core/achievements";
import { InfinityUpgrade } from "@/core/infinity/upgrades";
import { infinityGoal, canBigCrunch } from "@/core/prestige/big-crunch";
import { NormalChallenge } from "@/core/challenges/normal";
import { timesEffectsOf } from "@/core/mechanic";
import { t, ta } from "@/i18n";
import { computed } from "vue";

const BASE_COSTS = [10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
const BASE_COST_MULTIPLIERS = [1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];

const C6_BASE_COSTS = [10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
const C6_BASE_COST_MULTIPLIERS = [
  1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4,
];

class AntimatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    this._baseCost = D(BASE_COSTS[tier - 1]);
    this._baseCostMultiplier = D(BASE_COST_MULTIPLIERS[tier - 1]);
    this._c6BaseCost = D(C6_BASE_COSTS[tier - 1]);
    this._c6BaseCostMultiplier = D(C6_BASE_COST_MULTIPLIERS[tier - 1]);

    // Create computed caches for heavy calculations
    this._multiplier = computed(() => this.calculateMultiplier());
    this._productionPerSecond = computed(() =>
      this.calculateProductionPerSecond(),
    );
  }

  get name() {
    return t(`_${this.shortDisplayName}_ad`);
  }
  get shortName() {
    return ta("dimension_names_short")[this.tier - 1];
  }

  get costScale() {
    const c6Running = NormalChallenge(6).isRunning;
    return new ExponentialCostScaling({
      baseCost: c6Running ? this._c6BaseCost : this._baseCost,
      baseIncrease: c6Running
        ? this._c6BaseCostMultiplier
        : this._baseCostMultiplier,
      costScale: D(10),
      scalingCostThreshold: D(Number.MAX_VALUE),
    });
  }

  /**
   * @returns {Decimal}
   */
  get costBumps() {
    return this.data.costBumps;
  }

  /**
   * @param {Decimal} value
   */
  set costBumps(value) {
    this.data.costBumps = value;
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(
      this.bought.div(10).add(this.costBumps).floor(),
    );
  }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    if (this.bought.gte(Number.MAX_SAFE_INTEGER)) return 0;
    return this.bought.toNumber() % 10;
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return 10 - this.boughtBefore10;
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return 0;
    if (this.bought.gte(Number.MAX_SAFE_INTEGER)) return 10;
    const ratio = this.currencyAmount.dividedBy(this.cost).floor().toNumber();
    return Math.min(ratio, this.remainingUntil10);
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8) {
      return D(0);
    }

    const toGain = AntimatterDimension(tier + 1).productionPerSecond;
    return toGain.times(10).dividedBy(this.amount.max(1));
  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    if (this.tier >= 3 && NormalChallenge(6).isRunning) {
      return AntimatterDimension(this.tier - 2).totalAmount;
    }
    return Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    if (this.tier >= 3 && NormalChallenge(6).isRunning) {
      AntimatterDimension(this.tier - 2).amount = value;
    }
    Currency.antimatter.value = value;
  }

  /**
   * @returns {Decimal}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) return D(0);
    return this.costScale.getContinuumValue(this.currencyAmount, D(10));
  }

  /**
   * @returns {Decimal}
   */
  get continuumAmount() {
    return D(0);
  }

  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordable() {
    if (!player.break && canBigCrunch()) return false;
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && canBigCrunch()) return false;
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (this.tier === 1) return true;
    if (AntimatterDimension(this.tier - 1).amount.lte(0)) return false;
    return (
      DimBoost.maxDimensionsUnlockable >= this.tier &&
      DimBoost.purchasedBoosts.gte(this.tier - 4)
    );
  }

  reset() {
    this.amount = D(0);
    this.bought = D(0);
    this.costBumps = D(0);
  }

  resetAmount() {
    this.amount = D(0);
  }

  get multiplier() {
    return this._multiplier.value;
  }

  calculateMultiplier() {
    if (this.tier > 6 && NormalChallenge(10).isRunning) return D(1);
    let mult = AntimatterDimensions.buyTenMultiplier.pow(
      this.bought.div(10).floor(),
    );
    mult = mult.times(DimBoost.multiplierToNDTier(this.tier));
    mult = mult.times(NormalAchievements.multiplier);
    mult = timesEffectsOf(
      mult,
      InfinityUpgrade("timeMult"),
      InfinityUpgrade("timeMult2"),
      InfinityUpgrade("unspentBonus"),
    );

    if (this.tier === 1) {
      mult = timesEffectsOf(mult, Achievement(28), Achievement(31));
    }

    if (this.tier === 8) {
      mult = mult.times(Sacrifice.totalBoost);
      mult = timesEffectsOf(mult, Achievement(23));
    } else {
      mult = Achievement(34).timesEffect(mult);
    }

    if (Achievement(43).isEffectActive) {
      mult = mult.times(1 + 0.01 * this.tier);
    }

    if (this.tier === 1 || this.tier === 8) {
      mult = InfinityUpgrade("18Mult").timesEffect(mult);
    } else if (this.tier === 2 || this.tier === 7) {
      mult = InfinityUpgrade("27Mult").timesEffect(mult);
    } else if (this.tier === 3 || this.tier === 6) {
      mult = InfinityUpgrade("36Mult").timesEffect(mult);
    } else if (this.tier === 4 || this.tier === 5) {
      mult = InfinityUpgrade("45Mult").timesEffect(mult);
    }

    return mult;
  }

  get cappedProduction() {
    return player.break ? BREAK_INFINITY_MAX : D("1e315");
  }

  get productionPerSecond() {
    return this._productionPerSecond.value;
  }

  calculateProductionPerSecond() {
    const tier = this.tier;
    const amount = this.totalAmount;
    let production = amount.times(this.multiplier);
    production = production.times(Tickspeed.multiplier);
    if (this.tier >= 2) {
      production = production.times(0.1);
    }
    if (NormalChallenge(2).isRunning) {
      production = production.times(player.challenge.normal.c2Pow);
    }
    if (tier === 1 && NormalChallenge(3).isRunning) {
      production = production.times(player.challenge.normal.c3Pow);
    }
    if (NormalChallenge(12).isRunning) {
      if (tier === 2) production = production.pow(1.6);
      else if (tier === 4) production = production.pow(1.4);
      else if (tier === 6) production = production.pow(1.2);
    }
    return production.clampMax(this.cappedProduction);
  }

  buy() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    this.currencyAmount = this.currencyAmount.minus(this.cost);
    if (this.boughtBefore10 === 9) {
      this.challengeCostBump();
    }
    this.bought = this.bought.add(1);
    this.amount = this.amount.add(1);
    if (this.tier === 1 && this.amount.gte(1e150)) Achievement(28).unlock();
    AntimatterDimensions.onBuyDimension(this.tier);
    return true;
  }

  buyUntil10() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    const amount = this.howManyCanBuy;
    this.currencyAmount = this.currencyAmount.minus(this.cost.times(amount));
    this.challengeCostBump();
    this.bought = this.bought.add(amount);
    this.amount = this.amount.add(amount);
    AntimatterDimensions.onBuyDimension(this.tier);
    return true;
  }

  buyMax(bulk = Infinity) {
    if (
      !this.isAvailableForPurchase ||
      this.currencyAmount.lt(this.costUntil10)
    )
      return false;
    let bulkLeft = bulk;
    if (this.remainingUntil10 > 0 && this.remainingUntil10 < 10) {
      this.buyUntil10();
      bulkLeft--;
    }

    if (bulkLeft <= 0) return;

    const currentGroups = this.bought.div(10).floor();
    const maxBought = this.costScale.getMaxBought(
      currentGroups.add(this.costBumps.times(10)),
      this.currencyAmount,
      D(10),
    );
    if (maxBought === null) return true;
    this.challengeCostBump();
    const groupsToBuy = maxBought.quantity.clampMax(bulkLeft);
    this.bought = this.bought.add(groupsToBuy.times(10));
    this.amount = this.amount.add(groupsToBuy.times(10));
    this.currencyAmount = this.currencyAmount.sub(
      Decimal.pow10(maxBought.logPrice),
    );
    AntimatterDimensions.onBuyDimension(this.tier);

    return true;
  }

  challengeCostBump() {
    if (NormalChallenge(9).isRunning) {
      return this.multiplySameCosts();
    }
  }

  multiplySameCosts() {
    for (let tier = 1; tier <= 8; tier++) {
      if (tier === this.tier) continue;
      const dimension = AntimatterDimension(tier);
      if (dimension.cost.eq(this.cost)) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
    if (Tickspeed.cost.eq(this.cost)) {
      player.challenge.normal.c9TickspeedCostBumps =
        player.challenge.normal.c9TickspeedCostBumps.add(1);
    }
  }
}

export const AntimatterDimension = AntimatterDimensionState.createAccessor();

export const AntimatterDimensions = {
  all: AntimatterDimension.index.slice(1),

  onBuyDimension(tier) {
    Achievement(tier + 10).unlock();
    player.challenge.normal.c2Pow = 0;
    if (NormalChallenge(4).isRunning) {
      for (let i = 1; i < tier; i++) {
        AntimatterDimension(i).amount = D(0);
      }
    }
  },

  _buyTenMultiplier: computed(() => {
    if (NormalChallenge(7).isRunning)
      return DimBoost.totalBoosts.times(0.2).add(1).clampMax(2);
    return InfinityUpgrade("dimMult").effectOrDefault(D(2));
  }),

  get buyTenMultiplier() {
    return this._buyTenMultiplier.value;
  },

  tick(diff) {
    const hasBigCrunchGoal = !player.break;
    if (hasBigCrunchGoal && Currency.antimatter.value.gte(infinityGoal()))
      return;
    if (NormalChallenge(12).isRunning) {
      for (let tier = 8; tier >= 3; tier--) {
        AntimatterDimension(tier).produceDimensions(
          AntimatterDimension(tier - 2),
          diff,
        );
      }
      AntimatterDimension(2).produceCurrency(Currency.antimatter, diff);
    } else {
      for (let tier = 8; tier >= 2; tier--) {
        AntimatterDimension(tier).produceDimensions(
          AntimatterDimension(tier - 1),
          diff,
        );
      }
    }
    AntimatterDimension(1).produceCurrency(Currency.antimatter, diff);
    const goal = infinityGoal();
    if (hasBigCrunchGoal && Currency.antimatter.value.gt(goal)) {
      Currency.antimatter.value = goal;
    }
  },

  reset() {
    for (let tier = 1; tier <= 8; tier++) {
      AntimatterDimension(tier).reset();
    }
  },
};
