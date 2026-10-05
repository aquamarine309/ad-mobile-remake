import { createInitialPlayer, applyPlayer } from '@/core/state/player';
import { save } from '@/core/storage/save';
import { GameLoop } from '@/core/loop/game-loop';
import { dispatch, GAME_EVENT } from '@/core/events';

export function resetGame() {
  applyPlayer(createInitialPlayer());
  save();
  GameLoop.stop();
  GameLoop.start();
  dispatch(GAME_EVENT.GAME_LOAD);
}