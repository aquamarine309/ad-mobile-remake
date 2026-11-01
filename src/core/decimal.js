import Decimal from "break_eternity.js";

export { Decimal };
export const D = Decimal.fromValue_noAlloc;

Decimal.prototype.valueOf = () => {
  throw new Error("Implicit conversion from Decimal to number");
};

export const BREAK_INFINITY_MAX = D("1e9e15");
