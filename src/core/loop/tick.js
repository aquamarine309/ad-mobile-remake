import { AntimatterDimensions } from '@/core/dimensions/antimatter-dimension';
import { DeltaTime } from '@/core/time/delta-time';
import { GameSpeed } from '@/core/time/game-speed';
import { dispatch, GAME_EVENT } from '@/core/events';

export function tick(realDiff) {
  dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  DeltaTime.update(realDiff, GameSpeed.total);
  AntimatterDimensions.tick(DeltaTime.game);
  dispatch(GAME_EVENT.GAME_TICK_AFTER);
}