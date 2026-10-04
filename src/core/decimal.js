import Decimal from "break_eternity.js";

export { Decimal };
export const D = Decimal.fromValue_noAlloc;

Decimal.prototype.valueOf = () => {
  throw new Error("Implicit conversion from Decimal to number");
};