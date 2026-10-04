import { player } from '@/core/state/player';
import { tick } from './tick';

export function maxOfflineTicks(simulatedMs, defaultTicks = player.options.offlineTicks) {
  const tickLimit = Math.min(Math.floor(simulatedMs / 33), 1e6);
  return Math.min(defaultTicks, tickLimit);
}

export function simulateTime(seconds, { real = false, fast = false } = {}) {
  if (seconds <= 0) return;

  let ticks = Math.floor(seconds * 20);
  const maxTicks = maxOfflineTicks(seconds * 1000);

  if (ticks > maxTicks && !fast) ticks = maxTicks;
  else if (ticks > 50 && !real && fast) ticks = 50;

  let remainingRealSeconds = seconds;
  for (let i = ticks; i > 0; i--) {
    const diffSeconds = remainingRealSeconds / i;
    tick(1000 * diffSeconds);
    remainingRealSeconds -= diffSeconds;
  }
}