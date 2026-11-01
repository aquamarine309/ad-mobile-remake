import { D } from "../decimal";

export const GameSpeed = {
  devSpeed: D(1),

  get total() {
    let factor = this.devSpeed;
    return factor;
  },
};
