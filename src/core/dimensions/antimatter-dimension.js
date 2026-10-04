import { DimensionState } from "./dimension";
import { player } from "@/core/player";
import { ExponentialCostScaling } from "@/core/math";
import { Decimal, D } from "@/core/decimal";
import { Currency } from "@/core/currency";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { DimBoost } from "@/core/pre-infinity/dimension-boost";
import { Sacrifice } from "@/core/pre-infinity/sacrifice";

const BASE_COSTS = [10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
const BASE_COST_MULTIPLIERS = [1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];

class AntimatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    this._baseCost = D(BASE_COSTS[tier - 1]);
    this._baseCostMultiplier = D(BASE_COST_MULTIPLIERS[tier - 1]);
  }
  
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this._baseCost,
      baseIncrease: this._baseCostMultiplier,
      costScale: D(10),
      scalingCostThreshold: D(Number.MAX_VALUE)
    });
  }
  
  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(this.bought.div(10).floor());
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
    if (!this.isAffordable) return 0;
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
    return Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
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
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (this.tier === 1) return true;
    if (this.tier <= 4) {
      return AntimatterDimension(this.tier - 1).amount.gt(0);
    }
    return DimBoost.purchasedBoosts.gte(this.tier - 4);
  }

  reset() {
    this.amount = D(0);
    this.bought = D(0);
  }

  resetAmount() {
    this.amount = D(0);
  }
  
  get multiplier() {
    let mult = D(2).pow(this.bought.div(10).floor());
    mult = mult.times(DimBoost.multiplierToNDTier(this.tier));
    if (this.tier === 8) {
      mult = mult.times(Sacrifice.totalBoost);
    }
    return mult;
  }

  get productionPerSecond() {
    const tier = this.tier;
    const amount = this.totalAmount;
    let production = amount.times(this.multiplier);
    production = production.times(Tickspeed.multiplier);
    if (this.tier >= 2) {
      production = production.times(0.1);
    }
    return production;
  }
  
  buy() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    this.currencyAmount = this.currencyAmount.minus(this.cost);
    this.bought = this.bought.add(1);
    this.amount = this.amount.add(1);
    return true;
  }
  
  buyUntil10() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    const amount = this.howManyCanBuy;
    this.currencyAmount = this.currencyAmount.minus(this.cost.times(amount));
    this.bought = this.bought.add(amount);
    this.amount = this.amount.add(amount);
    return true;
  }

  buyMax() {
    if (!this.isAvailableForPurchase || !this.isAffordable) return false;
    if (this.remainingUntil10 > 0 && this.remainingUntil10 < 10) {
      this.buyUntil10();
    }
  
    const currentGroups = this.bought.div(10).floor();
    const maxBought = this.costScale.getMaxBought(
      currentGroups,
      this.currencyAmount,
      D(10)
    );
    if (maxBought === null) return true;
  
    const groupsToBuy = maxBought.quantity;
    this.bought = this.bought.add(groupsToBuy.times(10));
    this.amount = this.amount.add(groupsToBuy.times(10));
    this.currencyAmount = this.currencyAmount.sub(Decimal.pow10(maxBought.logPrice));
  
    return true;
  }
}

export const AntimatterDimension = AntimatterDimensionState.createAccessor();

export const AntimatterDimensions = {
  all: AntimatterDimension.index.slice(1),
  
  tick(diff) {
    for (let tier = 8; tier >= 2; tier--) {
      AntimatterDimension(tier).produceDimensions(AntimatterDimension(tier - 1), diff);
    }
    AntimatterDimension(1).produceCurrency(Currency.antimatter, diff);
  },
  
  reset() {
    for (let tier = 1; tier <= 8; tier++) {
      AntimatterDimension(tier).reset();
    }
  }
};