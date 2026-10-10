import { createInitialPlayer, applyPlayer } from '@/core/state/player';
import { parseSave, deepAssign, writeSaveToStorage } from '@/core/storage/save';
import { GameLoop } from '@/core/loop/game-loop';
import { dispatch, GAME_EVENT } from '@/core/events';

export function importGame(text) {
  const loaded = parseSave(text);

  const fresh = createInitialPlayer();
  deepAssign(fresh, loaded);
  applyPlayer(fresh);

  writeSaveToStorage(fresh);

  GameLoop.stop();
  GameLoop.start();

  dispatch(GAME_EVENT.GAME_LOAD);
}