import { D } from '../decimal';

export const GameSpeed = {
  devSpeed: D(100),

  get total() {
    let factor = this.devSpeed;
    return factor;
  },
};