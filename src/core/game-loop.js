import { ref } from 'vue';
import { player } from './player';
import { AntimatterDimensions } from './dimensions/antimatter-dimension';
import { D } from './decimal';
import { DeltaTime } from './time/delta-time';
import { GameSpeed } from './time/game-speed';

const MAX_REAL_DIFF_MS = 8.64e7;
const HIBERNATION_THRESHOLD_MS = 60000;

export const GameLoop = {
  interval: null,
  tick: ref(0),

  start() {
    if (this.interval !== null) return;
    player.lastUpdate = Date.now();
    this.interval = setInterval(() => this._step(), player.options.updateRate);
  },

  stop() {
    if (this.interval === null) return;
    clearInterval(this.interval);
    this.interval = null;
  },

  _step() {
    const now = Date.now();
    const realDiff = Math.max(1, Math.min(now - player.lastUpdate, MAX_REAL_DIFF_MS));
    player.lastUpdate = now;

    if (realDiff > HIBERNATION_THRESHOLD_MS) {
      this.simulateTime(realDiff / 1000, { real: true });
      return;
    }

    this.update(realDiff);
  },

  maxOfflineTicks(simulatedMs, defaultTicks = player.options.offlineTicks) {
    const tickLimit = Math.min(Math.floor(simulatedMs / 33), 1e6);
    return Math.min(defaultTicks, tickLimit);
  },

  simulateTime(seconds, { real = false, fast = false } = {}) {
    if (seconds <= 0) return;

    let ticks = Math.floor(seconds * 20);
    const maxTicks = this.maxOfflineTicks(seconds * 1000);

    if (ticks > maxTicks && !fast) ticks = maxTicks;
    else if (ticks > 50 && !real && fast) ticks = 50;

    let remainingRealSeconds = seconds;
    for (let i = ticks; i > 0; i--) {
      const diffSeconds = remainingRealSeconds / i;
      this.update(1000 * diffSeconds);
      remainingRealSeconds -= diffSeconds;
    }
  },

  update(realDiff) {
    DeltaTime.update(realDiff, GameSpeed.total);
    AntimatterDimensions.tick(DeltaTime.game);
    this.tick.value++;
  },
};