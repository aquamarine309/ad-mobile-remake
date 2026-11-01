import { GameLoop } from '@/core/loop/game-loop';
import { simulateTime } from '@/core/loop/simulate-time';
import { load, save } from '@/core/storage/save';
import { dispatch, GAME_EVENT } from '@/core/events';
import { player } from '@/core/state/player';
import { offlineController } from '@/ui/offline/state';

const AUTOSAVE_INTERVAL_MS = 30000;
const MIN_OFFLINE_MS = 10000;

let autosaveTimer = null;
let beforeUnloadHandler = null;

/**
 * Simulate offline time after loading a player object from any source
 * (startup, import, backup restore). Handles GameLoop stop/start and
 * dispatches progress events for the UI.
 *
 * Returns the { before, after, seconds } simulation result, or null if
 * no simulation happened.
 */
export async function simulateAfterLoad(offlineMs) {
  GameLoop.stop();

  let result = null;
  const shouldSimulate =
    player.options.offlineProgress !== 'disable' && offlineMs > MIN_OFFLINE_MS;

  if (shouldSimulate) {
    const seconds = offlineMs / 1000;
    result = await simulateTime(seconds, {
      fast: offlineMs < 50000,
      onProgress: (done, total) => {
        dispatch(GAME_EVENT.OFFLINE_PROGRESS_TICK, { done, total, seconds });
      },
      controller: offlineController,
    });
    dispatch(GAME_EVENT.OFFLINE_PROGRESS_DONE, { seconds, ...result });
  }

  player.lastUpdate = Date.now();
  GameLoop.start();
  return result;
}

export async function initGame() {
  const offlineMs = load();
  await simulateAfterLoad(offlineMs);

  dispatch(GAME_EVENT.GAME_LOAD);

  autosaveTimer = setInterval(save, AUTOSAVE_INTERVAL_MS);
  beforeUnloadHandler = () => save();
  window.addEventListener('beforeunload', beforeUnloadHandler);
}

export function startGameLoop() {
  dispatch(GAME_EVENT.GAME_LOAD);
  GameLoop.start();

  // Start autosave timer if not already running
  if (autosaveTimer === null) {
    autosaveTimer = setInterval(save, AUTOSAVE_INTERVAL_MS);
  }

  // Add beforeunload listener to save on exit if not already added
  if (beforeUnloadHandler === null) {
    beforeUnloadHandler = () => save();
    window.addEventListener('beforeunload', beforeUnloadHandler);
  }
}

export function stopGame() {
  GameLoop.stop();
  if (autosaveTimer !== null) {
    clearInterval(autosaveTimer);
    autosaveTimer = null;
  }
  if (beforeUnloadHandler !== null) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
}