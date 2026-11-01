// core/loop/simulate-time.js
import { player } from '@/core/state/player';
import { tick } from './tick';
import { runBatched } from './async-runner';
import { GameLoop } from './game-loop';
import { serialize } from '@/core/storage/serialize';
import { Decimal } from '@/core/decimal';

export function maxOfflineTicks(simulatedMs, defaultTicks = player.options.offlineTicks) {
  const tickLimit = Math.min(Math.floor(simulatedMs / 33), 1e6);
  return Math.min(defaultTicks, tickLimit);
}

export function cloneSnapshot(v) {
  if (v === null || typeof v !== 'object') return v;
  if (v instanceof Decimal) return v;        // immutable, safe to share
  if (Array.isArray(v)) return v.map(cloneSnapshot);
  if (v instanceof Set) return new Set(v);
  const out = {};
  for (const k of Object.keys(v)) out[k] = cloneSnapshot(v[k]);
  return out;
}

export async function simulateTime(seconds, { fast = false, onProgress, controller } = {}) {
  if (seconds <= 0) return null;

  let ticks = Math.floor(seconds * 20);
  const maxTicks = maxOfflineTicks(seconds * 1000);
  if (ticks > maxTicks) ticks = maxTicks;
  if (fast && ticks > 50) ticks = 50;

  const before = cloneSnapshot(player);

  GameLoop.stop();

  let remainingSeconds = seconds;
  const step = remaining => {
    const diff = remainingSeconds / remaining;
    tick(1000 * diff);
    remainingSeconds -= diff;
  };

  // Fast simulations run synchronously — 50 ticks won't block meaningfully
  if (fast) {
    for (let i = ticks; i > 0; i--) step(i);
  } else {
    await runBatched(step, ticks, {
      batchSize: 1, maxTime: 30, sleepTime: 1,
      onProgress,
      controller,
    });
  }

  GameLoop.start();

  return { before, after: cloneSnapshot(player), seconds };
}