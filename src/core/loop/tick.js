import { AntimatterDimensions } from '@/core/dimensions/antimatter-dimension';
import { DeltaTime } from '@/core/time/delta-time';
import { GameSpeed } from '@/core/time/game-speed';

export function tick(realDiff) {
  DeltaTime.update(realDiff, GameSpeed.total);
  AntimatterDimensions.tick(DeltaTime.game);
}