import { AntimatterDimensions } from '@/core/dimensions/antimatter-dimension';
import { DeltaTime } from '@/core/time/delta-time';
import { GameSpeed } from '@/core/time/game-speed';
import { dispatch, GAME_EVENT } from '@/core/events';
import { player } from "@/core/state/player";

export function tick(realDiff) {
  dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  
  player.records.realTimePlayed += DeltaTime.real;
  player.records.totalTimePlayed = player.records.totalTimePlayed.add(DeltaTime.game);
  player.records.thisInfinity.realTime += DeltaTime.real;
  player.records.thisInfinity.time = player.records.thisInfinity.time.add(DeltaTime.game);
  DeltaTime.update(realDiff, GameSpeed.total);
  
  AntimatterDimensions.tick(DeltaTime.game);
  dispatch(GAME_EVENT.GAME_TICK_AFTER);
}