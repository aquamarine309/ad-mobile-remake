import { EffectState, addEffectsOf } from "@/core/mechanic";
import { UPGRADE_CONFIGS } from "./upgrade-configs";
import { player } from "@/core/state/player";
import { dispatch, GAME_EVENT } from "@/core/events";
import { Currency } from "@/core/currency";
import { D, Decimal } from "@/core/decimal";
import { Achievement } from "@/core/achievements";

class InfinityUpgradeState extends EffectState {
  constructor(config) {
    super();
    this.config = config;
  }

  get isBought() {
    return player.infinity.upgrades.has(this.config.id);
  }

  // Overrides EffectState getter.
  // Independent from isBought so future gating (Pelle, charged, etc.)
  // can change effect activation without touching the buy state.
  get isEffectActive() {
    return this.isBought;
  }

  effect() {
    return this.config.effect?.();
  }

  get cost() {
    return this.config.cost;
  }

  get isAvailableForPurchase() {
    return !this.config.checkRequirement || this.config.checkRequirement();
  }

  get canBeBought() {
    return (
      !this.isBought &&
      this.isAvailableForPurchase &&
      Currency.infinityPoints.value.gte(this.cost)
    );
  }

  purchase() {
    if (!this.canBeBought) return false;
    player.infinity.points = player.infinity.points.minus(this.cost);
    player.infinity.upgrades.add(this.config.id);
    if (this.config.id.startsWith("skip")) skipResetsIfPossible();
    dispatch(GAME_EVENT.INFINITY_UPGRADE_BOUGHT, this.config.id);
    return true;
  }
}

class InfinityIPMultUpgrade extends EffectState {
  constructor(config) {
    super();
    this.config = config;
  }

  get purchaseCount() {
    return player.infinity.ipMultPurchases;
  }

  set purchaseCount(value) {
    player.infinity.ipMultPurchases = value;
  }

  // costIncreaseThreshold is e3000000, so log10 is 3000000
  // e.g. e3000000.log10() = 3000000, minus 1 = 2999999
  get purchasesAtIncrease() {
    return this.config.costIncreaseThreshold.log10().sub(1);
  }

  get hasIncreasedCost() {
    return this.purchaseCount.gte(this.purchasesAtIncrease);
  }

  get costIncrease() {
    return this.hasIncreasedCost ? D(1e10) : D(10);
  }

  get cost() {
    if (this.hasIncreasedCost) {
      return this.config.costIncreaseThreshold.times(
        this.costIncrease.pow(this.purchaseCount.sub(this.purchasesAtIncrease)),
      );
    }
    return this.costIncrease.pow(this.purchaseCount.add(1));
  }

  get isCapped() {
    return this.cost.gte(this.config.costCap);
  }

  isAvailableForPurchase() {
    return true;
  }

  // Just for UI
  get isBought() {
    return this.isCapped;
  }

  get isEffectActive() {
    return this.purchaseCount.gt(0);
  }

  effect() {
    // Hardcap multiplier to 1e1000000 at 3,300,000 purchases
    if (this.purchaseCount.gte(3300000)) return D("1e1000000");
    return D(2).pow(this.purchaseCount);
  }

  get canBeBought() {
    if (!Achievement(41).isUnlocked) return false;
    if (this.isCapped) return false;
    if (!player.infinity.points.gte(this.cost)) return false;
    return true;
  }

  purchase(amount = D(1)) {
    if (!this.canBeBought) return false;

    const totalCost = this.sumGeometricSeries(
      amount,
      this.cost,
      this.costIncrease,
    );
    Currency.infinityPoints.sub(totalCost);
    this.purchaseCount = this.purchaseCount.add(amount);
    return true;
  }

  buyMax() {
    if (!this.canBeBought) return false;
    let purchasedAny = false;

    // 1. Process the shallow exponential (below threshold)
    if (!this.hasIncreasedCost) {
      const availableIP = player.infinity.points.min(
        this.config.costIncreaseThreshold,
      );
      const purchases = this.affordGeometricSeries(
        availableIP,
        this.cost,
        this.costIncrease,
      );
      if (purchases.gt(0)) {
        this.purchase(purchases);
        purchasedAny = true;
      }
    }

    // 2. Process the steeper exponential (above threshold, but below cap)
    if (this.hasIncreasedCost && !this.isCapped) {
      const availableIP = player.infinity.points.min(this.config.costCap);
      const purchases = this.affordGeometricSeries(
        availableIP,
        this.cost,
        this.costIncrease,
      );
      if (purchases.gt(0)) {
        this.purchase(purchases);
        purchasedAny = true;
      }
    }

    return purchasedAny;
  }

  // --- Decimal Geometric Series Helpers ---

  // Sum = start * (ratio^n - 1) / (ratio - 1)
  sumGeometricSeries(n, start, ratio) {
    if (n.lte(0)) return D(0);
    return start.times(ratio.pow(n).sub(1)).div(ratio.sub(1));
  }

  // n = floor(log_ratio(available * (ratio - 1) / start + 1))
  affordGeometricSeries(available, start, ratio) {
    if (available.lt(start)) return D(0);

    const val = available.times(ratio.sub(1)).div(start).add(1);
    let n = val.log(ratio).floor();

    if (n.lte(0)) return D(0);

    // Edge case: Due to decimal precision, the computed n might slightly overshoot
    if (this.sumGeometricSeries(n, start, ratio).gt(available)) {
      n = n.sub(1);
    }
    return n.max(0);
  }
}

const states = new Map();
export function InfinityUpgrade(id) {
  if (!states.has(id)) {
    const config = UPGRADE_CONFIGS.find((c) => c.id === id);
    if (!config) throw new Error(`Unknown infinity upgrade: ${id}`);

    if (id === "ipMult") {
      states.set(id, new InfinityIPMultUpgrade(config));
    } else {
      states.set(id, new InfinityUpgradeState(config));
    }
  }
  return states.get(id);
}

export const InfinityUpgrades = {
  all: UPGRADE_CONFIGS.map((c) => InfinityUpgrade(c.id)),
};

export const INFINITY_UPGRADE_GRID = [0, 1, 2, 3].map((col) =>
  [0, 1, 2, 3].map((row) =>
    InfinityUpgrades.all.find(
      (u) => u.config.col === col && u.config.row === row,
    ),
  ),
);

export function skipResetsIfPossible() {
  if (!InfinityUpgrade("skipReset1").isBought) return;
  player.dimensionBoosts = addEffectsOf(
    D(0),
    InfinityUpgrade("skipReset1"),
    InfinityUpgrade("skipReset2"),
    InfinityUpgrade("skipReset3"),
    InfinityUpgrade("skipResetGalaxy"),
  );
  player.galaxies = InfinityUpgrade("skipResetGalaxy").effectOrDefault(D(0));
}

export function gainPassivePoints(diff) {
  const time = player.records.bestInfinity.time;
  if (time.eq(Decimal.dLayerSafeMax)) return;
  const gain = InfinityUpgrade("passiveGen").effectOrDefault(D(0));
  if (gain.eq(0)) return;
  player.infinity.partPoints = player.infinity.partPoints.add(
    gain.times(diff).div(10000),
  );
  const int = player.infinity.partPoints.floor();
  if (int.eq(0)) return;
  Currency.infinityPoints.add(int);
  player.infinity.partPoints = player.infinity.partPoints.minus(int);
}
