import { AntimatterDimensions } from "@/core/dimensions/antimatter-dimension";
import { DeltaTime } from "@/core/time/delta-time";
import { GameSpeed } from "@/core/time/game-speed";
import { dispatch, GAME_EVENT } from "@/core/events";
import { player } from "@/core/state/player";
import { Autobuyers } from "@/core/autobuyers";
import { tickInputHold } from "@/core/loop/input-hold";
import { gainPassivePoints } from "@/core/infinity/upgrades";
import { updateNormalAndInfinityChallenges } from "@/core/challenges";

export function tick(realDiff) {
  dispatch(GAME_EVENT.GAME_TICK_BEFORE);

  DeltaTime.update(realDiff, GameSpeed.total);
  player.records.realTimePlayed += DeltaTime.real;
  player.records.totalTimePlayed = player.records.totalTimePlayed.add(
    DeltaTime.game,
  );
  player.records.thisInfinity.realTime += DeltaTime.real;
  player.records.thisInfinity.time = player.records.thisInfinity.time.add(
    DeltaTime.game,
  );

  Autobuyers.tick();
  tickInputHold();

  updateNormalAndInfinityChallenges(DeltaTime.game);
  gainPassivePoints(DeltaTime.game);

  AntimatterDimensions.tick(DeltaTime.game);
  dispatch(GAME_EVENT.GAME_TICK_AFTER);
}
