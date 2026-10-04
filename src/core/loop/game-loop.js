import { ref } from 'vue';
import { player } from '@/core/state/player';
import { tick } from './tick';
import { simulateTime } from './simulate-time';

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
      simulateTime(realDiff / 1000, { real: true });
      return;
    }

    this.update(realDiff);
  },

  update(realDiff) {
    tick(realDiff);
    this.tick.value++;
  },
};