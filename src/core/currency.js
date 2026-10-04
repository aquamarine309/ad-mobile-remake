import { player } from "./player";
import { D } from "./decimal";

class CurrencyState {
  constructor(get, set) {
    this._get = get;
    this._set = set;
  }
  
  get value() { return this._get(); }
  set value(value) { this._set(value); }
  add(amount) { this.value = this.value.add(amount); }
  sub(amount) { this.value = this.value.minus(amount); }
  gte(amount) { return this.value.gte(amount); }
  purchase(cost) {
    if (!this.gte(cost)) return false;
    this.sub(cost);
    return true;
  }
}

export const Currency = {
  antimatter: new CurrencyState(
    () => player.antimatter,
    v => {
      player.antimatter = v;
    }
  )
};