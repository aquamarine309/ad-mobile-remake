import { DeltaTime } from "@/core/time/delta-time";

class AchievementTimer {
  constructor(isRealTime) {
    this.time = 0;
    this.realTime = isRealTime;
  }

  reset() {
    this.time = 0;
  }

  advance() {
    if (this.realTime) {
      this.time += DeltaTime.real / 1000;
    } else {
      this.time += DeltaTime.game.div(1000).toNumber();
    }
  }

  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    return this.time >= duration;
  }
}

export const AchievementTimers = {
  landscape: new AchievementTimer(true),
  achievement44: new AchievementTimer(true),
};
