import { player } from "@/core/state/player";
import { D } from "./decimal";
import { Achievement } from "@/core/achievements";
import { maxEffectsOf } from "@/core/mechanic";

class CurrencyState {
  constructor(get, set, startingValue = () => D(0)) {
    this._get = get;
    this._set = set;
    this._startingValue = startingValue;
  }

  get startingValue() {
    return this._startingValue();
  }

  get value() {
    return this._get();
  }
  set value(value) {
    this._set(value);
  }
  add(amount) {
    this.value = this.value.add(amount);
  }
  sub(amount) {
    this.value = this.value.minus(amount);
  }
  multiply(amount) {
    this.value = this.value.multiply(amount);
  }
  dividedBy(amount) {
    this.value = this.value.dividedBy(amount);
  }
  pow(amount) {
    this.value = this.value.pow(amount);
  }
  root(amount) {
    this.value = this.value.root(amount);
  }
  gte(amount) {
    return this.value.gte(amount);
  }
  gt(amount) {
    return this.value.gt(amount);
  }
  lte(amount) {
    return this.value.lte(amount);
  }
  lt(amount) {
    return this.value.lt(amount);
  }
  purchase(cost) {
    if (!this.gte(cost)) return false;
    this.sub(cost);
    return true;
  }

  reset() {
    this._set(this.startingValue);
  }
}

export const Currency = {
  antimatter: new CurrencyState(
    () => player.antimatter,
    (value) => {
      const old = player.antimatter;
      if (value.gt(old)) {
        const gained = value.minus(old);
        player.records.totalAntimatter =
          player.records.totalAntimatter.add(gained);
      }
      if (value.gt(player.records.thisInfinity.maxAM)) {
        player.records.thisInfinity.maxAM = value;
      }
      player.antimatter = value;
    },
    () => maxEffectsOf(D(1), Achievement(21), Achievement(37)),
  ),

  infinityPoints: new CurrencyState(
    () => player.infinity.points,
    (value) => {
      player.infinity.points = value;
      if (value.gt(player.records.thisEternity.maxIP)) {
        player.records.thisEternity.maxIP = value;
      }
    },
    () => D(0),
  ),

  infinities: new CurrencyState(
    () => player.infinity.infinities,
    (value) => {
      player.infinity.infinities = value;
    },
    () => D(0),
  ),

  matter: new CurrencyState(
    () => player.matter,
    (value) => {
      player.matter = value;
    },
    () => D(0),
  ),
};
