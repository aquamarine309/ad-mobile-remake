import { D } from "../decimal";

export const DeltaTime = {
  real: 0,
  game: D(0),
  tickCount: 0,

  update(realMs, gameSpeed) {
    this.real = realMs;
    this.game = D(realMs).times(gameSpeed);
    this.tickCount++;
  },
};
