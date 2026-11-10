import { D, Decimal } from "@/core/decimal";
import { player } from "@/core/state/player";
import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { Achievement } from "@/core/achievements";
import { UpgradeableAutobuyerState, PRESTIGE_EVENT } from "./autobuyer";
import { NormalChallenge } from "@/core/challenges/normal";
import { Currency } from "@/core/currency";

const BASE_INTERVALS = [500, 600, 700, 800, 900, 1000, 1100, 1200];
const COST_BASE = D(1e40);
const COST_MULT = D(1e10);

export class AntimatterDimensionAutobuyerState extends UpgradeableAutobuyerState {
  constructor(tier) {
    super();
    this.tier = tier;
  }

  get data() {
    return player.auto.antimatterDims[this.tier - 1];
  }
  get baseInterval() {
    return BASE_INTERVALS[this.tier - 1];
  }
  get antimatterCost() {
    return COST_BASE.times(COST_MULT.pow(this.tier - 1));
  }

  get isUnlocked() {
    return (
      this.data.isBought ||
      player.records.thisInfinity.maxAM.gte(this.antimatterCost)
    );
  }
  get isBought() {
    return this.data.isBought;
  }

  get canBeBought() {
    return (
      !this.data.isBought &&
      player.records.thisInfinity.maxAM.gte(this.antimatterCost)
    );
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.data.isBought = true;
    return true;
  }

  get mode() {
    return this.data.mode;
  }
  set mode(v) {
    this.data.mode = v;
  }
  toggleMode() {
    this.mode = this.mode === "10" ? "1" : "10";
  }

  get canTick() {
    if (!super.canTick) return false;
    if (!this.data.isBought) return false;
    const dim = AntimatterDimension(this.tier);
    return dim.isAvailableForPurchase && dim.isAffordable;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.DIMENSION_BOOST;
  }

  get bulk() {
    return this.hasUnlimitedBulk
      ? Number.MAX_VALUE
      : Math.min(this.data.bulk, this.bulkCap);
  }

  get hasUnlimitedBulk() {
    return Achievement(61).isUnlocked;
  }

  get bulkCap() {
    return 512;
  }

  get hasMaxedBulk() {
    return this.data.bulk >= this.bulkCap;
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return false;
    if (!Currency.infinityPoints.gte(this.cost)) return false;
    Currency.infinityPoints.sub(this.cost);
    this.data.bulk = Math.min(this.data.bulk * 2, this.bulkCap);
    this.data.cost = Math.ceil(2.4 * this.data.cost);
    Achievement(61).tryUnlock();
    return true;
  }

  get canBeUpgraded() {
    return NormalChallenge(this.tier).isCompleted;
  }

  tick() {
    super.tick();
    const dim = AntimatterDimension(this.tier);
    if (this.mode === "10") dim.buyMax(this.bulk);
    else dim.buy();
  }
}
