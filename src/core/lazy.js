import { logic } from './events';

export class Lazy {
  constructor(getValue) {
    this._getValue = getValue;
    this._value = undefined;
  }

  get value() {
    if (this._value === undefined) {
      this._value = this._getValue();
    }
    return this._value;
  }

  invalidate() {
    this._value = undefined;
  }

  invalidateOn(...events) {
    for (const event of events) {
      logic.on(event, () => this.invalidate());
    }
    return this;
  }
}