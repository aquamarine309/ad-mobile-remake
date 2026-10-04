import { GameLoop } from '@/core/loop/game-loop';
import { simulateTime } from '@/core/loop/simulate-time';
import { load, save } from '@/core/storage/save';
import { dispatch, GAME_EVENT } from '@/core/events';
import { player } from "@/core/state/player";

const AUTOSAVE_INTERVAL_MS = 30000;

let autosaveTimer = null;
let beforeUnloadHandler = null;

export function initGame() {
  const offlineMs = load();

  if (player.options.offlineProgress && offlineMs > 10000) {
    simulateTime(offlineMs / 1000, { fast: offlineMs < 50000 });
  }

  dispatch(GAME_EVENT.GAME_LOAD);
  GameLoop.start();

  autosaveTimer = setInterval(save, AUTOSAVE_INTERVAL_MS);

  beforeUnloadHandler = () => save();
  window.addEventListener('beforeunload', beforeUnloadHandler);
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
  save();
}