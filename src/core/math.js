import { Decimal, D } from "./decimal";

const MAX_SAFE_LOG_COST = 9e15;

/**
 * ExponentialCostScaling provides both a max quantity and a price
 * @typedef {Object} QuantityAndPrice
 * @property {Decimal} quantity The new amount that can be bought
 * @property {Decimal} logPrice The logarithm (base 10) of the price
 */

/**
 * This is a a helper class to deal with the more common case of a cost that
 * grows exponentially (past some threshold). NOTE: this assumes that you only
 * have to pay for the highest tier when buying in bulk. That's a little bit cheaper,
 * but for the use cases this encounters, it's not a big deal.
 */
export class ExponentialCostScaling {
  /**
   * @param {Object} param configuration object with the following fields
   * @param {Decimal} param.baseCost the cost of the first purchase
   * @param {Decimal} param.baseIncrease the baseline increase in price
   * @param {Decimal} param.costScale the amount by which the cost scaling increases;
   *  e.g. if it is 10, then the ratio between successive prices goes up by 10
   * @param {Decimal} [param.purchasesBeforeScaling] the number of purchases that can
   *  be made before scaling begins. If baseCost is B, baseIncrease is C, and costScale is S,
   *  and purchasesBeforeScaling is 0, the prices will go: B, B C, B C^2 S, B C^3 S^3, etc.
   * @param {Decimal} [param.scalingCostThreshold] an alternative way of specifying
   *  when scaling begins; once the cost is >= this threshold, scaling applies. Using the same
   *  notation: B BC BC^2 .... BC^n <threshold> BC^(n+1) BC^(n+2)S BC^(n+3)S^3 etc. So, the first
   *  price past the threshold has no costScale in it, but everything past that does.
   */
  constructor(param) {
    this._baseCost = param.baseCost;
    this._baseIncrease = param.baseIncrease;
    this._costScale = param.costScale;
    this._logBaseCost = param.baseCost.log10();
    this._logBaseIncrease = param.baseIncrease.log10();
    this._logCostScale = param.costScale.log10();
    if (param.purchasesBeforeScaling !== undefined) {
      this._purchasesBeforeScaling = param.purchasesBeforeScaling;
       
    } else if (param.scalingCostThreshold !== undefined) {
      this._purchasesBeforeScaling = param.scalingCostThreshold
        .log10()
        .minus(this._logBaseCost)
        .div(this._logBaseIncrease)
        .ceil();
    } else
      throw new Error(
        "Must specify either scalingCostThreshold or purchasesBeforeScaling",
      );
    this.updateCostScale();
  }

  get costScale() {
    return this._costScale;
  }

  /**
   * @param {Decimal} value
   */
  set costScale(value) {
    this._logCostScale = value.log10();
    this._costScale = value;
    this.updateCostScale();
  }

  updateCostScale() {
    this._precalcDiscriminant = this._logBaseIncrease
      .times(2)
      .add(this._logCostScale)
      .pow(2)
      .minus(
        this._purchasesBeforeScaling
          .times(this._logBaseIncrease)
          .add(this._logBaseCost)
          .times(this._logCostScale)
          .times(8),
      );
    this._precalcCenter = this._purchasesBeforeScaling
      .minus(this._logBaseIncrease.div(this._logCostScale))
      .add(0.5);
  }

  /**
   * Calculates the cost of the next purchase
   * @param {Decimal} currentPurchases
   */
  calculateCost(currentPurchases) {
    const logMult = this._logBaseIncrease;
    const logBase = this._logBaseCost;
    const excess = currentPurchases.minus(this._purchasesBeforeScaling);
    const logCost =
      excess.sign > 0
        ? currentPurchases
            .times(logMult)
            .add(logBase)
            .add(
              excess.times(excess.add(1)).times(this._logCostScale).times(0.5),
            )
        : currentPurchases.times(logMult).add(logBase);
    return Decimal.pow10(logCost);
  }

  /**
   * Figure out how much of this can be bought.
   * This returns the maximum new number of this thing; If you have 51 and can
   * afford to buy 10 more, this will return 61. NOTE! this assumes you only
   * have to pay for the most expensive thing you get when you buy in bulk. This
   * means it's not suitable for accurate caclulation of cumulative prices if the
   * multiplier is small.
   * @param {Decimal} currentPurchases amount already possessed
   * @param {Decimal} money
   * @returns {QuantityAndPrice|null} maximum value of bought that money can buy up to
   */
  getMaxBought(currentPurchases, rawMoney, numberPerSet) {
    // We need to divide money by the number of things we need to buy per set
    // so that we don't, for example, buy all of a set of 10 dimensions
    // when we can only afford 1.
    const money = rawMoney.div(numberPerSet);
    const logMoney = money.log10();
    const logMult = this._logBaseIncrease;
    const logBase = this._logBaseCost;
    // The 1 + is because the multiplier isn't applied to the first purchase
    let newPurchases = logMoney.minus(logBase).div(logMult).add(1).floor();
    // We can use the linear method up to one purchase past the threshold, because the first purchase
    // past the threshold doesn't have cost scaling in it yet.
    if (newPurchases.gt(this._purchasesBeforeScaling)) {
      const discrim = this._precalcDiscriminant.add(
        this._logCostScale.times(logMoney).times(8),
      );
      if (discrim.sign < 0) {
        return null;
      }
      newPurchases = this._precalcCenter
        .add(discrim.sqrt().div(this._logCostScale.times(2)))
        .floor();
    }
    if (newPurchases.lte(currentPurchases)) return null;
    // There's a narrow edge case where the linear method returns > this._purchasesBeforeScaling + 1
    // but the quadratic method returns less than that. Having this be a separate check covers that
    // case:
    let logPrice;
    if (newPurchases.lte(this._purchasesBeforeScaling.add(1))) {
      logPrice = newPurchases.minus(1).times(logMult).add(logBase);
    } else {
      const pExcess = newPurchases.minus(this._purchasesBeforeScaling);
      logPrice = newPurchases
        .minus(1)
        .times(logMult)
        .add(logBase)
        .add(
          pExcess.times(pExcess.minus(1)).times(this._logCostScale).times(0.5),
        );
    }
    const l = logPrice.add(numberPerSet.log10());
    return {
      quantity: newPurchases.minus(currentPurchases),
      logPrice: l.gte(MAX_SAFE_LOG_COST) ? D(0) : l,
    };
  }

  /**
   * Determines the number of purchases that would be possible, if purchase count was continuous. Might
   * have some odd behavior right at e308, but otherwise should work. It's mostly a copy-paste from
   * getMaxBought() above but with unnecessary extra code removed.
   * @param {Decimal} money
   * @returns {Decimal} maximum value of bought that money can buy up to
   */
  getContinuumValue(rawMoney, numberPerSet) {
    // We need to divide money by the number of things we need to buy per set
    // so that we don't, for example, buy all of a set of 10 dimensions
    // when we can only afford 1. In the specific case of continuum this means,
    // for example, that 10 AM buys 2/3 of a set of 10 first dimensions rather than
    // buying the whole set of 10, which at least feels more correct.
    const money = rawMoney.div(numberPerSet);
    const logMoney = money.log10();
    const logMult = this._logBaseIncrease;
    const logBase = this._logBaseCost;
    // The 1 + is because the multiplier isn't applied to the first purchase
    let contValue = logMoney.minus(logBase).div(logMult).add(1);
    // We can use the linear method up to one purchase past the threshold, because the first purchase
    // past the threshold doesn't have cost scaling in it yet.
    if (contValue.gt(this._purchasesBeforeScaling)) {
      const discrim = this._precalcDiscriminant.add(
        this._logCostScale.times(logMoney).times(8),
      );
      if (discrim.sign < 0) {
        return D(0);
      }
      contValue = this._precalcCenter.add(
        discrim.sqrt().div(this._logCostScale.times(2)),
      );
    }
    return contValue.clampMin(0);
  }
}
