import { D } from "@/core/decimal";
import { player } from "@/core/state/player";
import { AntimatterDimensions } from "@/core/dimensions/antimatter-dimension";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { dispatch, GAME_EVENT } from "@/core/events";
import { Currency } from "@/core/currency";
import {
  skipResetsIfPossible,
  InfinityUpgrade,
} from "@/core/infinity/upgrades";
import { NormalChallenge, NormalChallenges } from "@/core/challenges/normal";
import { timesEffectsOf } from "@/core/mechanic";

export function infinityGoal() {
  return D(Number.MAX_VALUE);
}

export function canBigCrunch() {
  return player.antimatter.gte(infinityGoal());
}

export function totalIPMult() {
  return timesEffectsOf(D(1), InfinityUpgrade("ipMult"));
}

export function gainedInfinityPoints() {
  return totalIPMult();
}

export function gainedInfinities() {
  return D(1);
}

export function bigCrunchReset({
  force = false,
  enteringChallenge = false,
} = {}) {
  const canCrunch = canBigCrunch();
  if (!canCrunch && !force) return;

  if (canCrunch) {
    dispatch(GAME_EVENT.BIG_CRUNCH_BEFORE);
    // Rewards
    player.infinity.points = player.infinity.points.add(gainedInfinityPoints());
    player.infinity.infinities =
      player.infinity.infinities.add(gainedInfinities());
    handleChallengeCompletion({ enteringChallenge });
    // Records
    const ip = gainedInfinityPoints();
    const realMinutes = Math.max(
      player.records.thisInfinity.realTime / 60000,
      0.0005,
    );
    const currentIPmin = ip.div(realMinutes);

    if (currentIPmin.gt(player.records.thisEternity.bestIPmin)) {
      player.records.thisEternity.bestIPmin = currentIPmin;
      player.records.thisEternity.bestIPminVal = ip;
    }
    if (!player.requirementChecks.infinity.maxAll) {
      player.records.thisEternity.bestIPminWithoutMaxAll =
        player.records.thisEternity.bestIPminWithoutMaxAll.max(currentIPmin);
    }
    player.records.bestInfinity.time = player.records.bestInfinity.time.min(
      player.records.thisInfinity.time,
    );
    player.records.bestInfinity.realTime = Math.min(
      player.records.bestInfinity.realTime,
      player.records.thisInfinity.realTime,
    );
  }

  // Reset
  player.dimensionBoosts = D(0);
  player.galaxies = D(0);
  if (!enteringChallenge) {
    skipResetsIfPossible();
  }
  player.records.thisInfinity.maxAM = D(0);
  player.records.thisInfinity.time = D(0);
  player.records.thisInfinity.realTime = 0;

  AntimatterDimensions.reset();
  player.sacrificed = D(0);
  Tickspeed.reset();
  Currency.antimatter.reset();

  player.requirementChecks.infinity.maxAll = false;
  player.requirementChecks.infinity.noSacrifice = true;
  player.requirementChecks.infinity.noAD8 = true;

  dispatch(GAME_EVENT.BIG_CRUNCH_AFTER);
}

function handleChallengeCompletion({ enteringChallenge = false } = {}) {
  const current = NormalChallenges.current;
  if (current) {
    // Complete (if first time) and record best time
    if (!current.isCompleted) current.complete();
    const idx = current.id - 2; // C1 has no best time
    if (idx >= 0) {
      const t = player.records.thisInfinity.time;
      if (t.lt(player.challenge.normal.bestTimes[idx])) {
        player.challenge.normal.bestTimes[idx] = t;
      }
    }
    if (!enteringChallenge && !player.options.retryChallenge) {
      player.challenge.normal.current = 0;
    }
  } else {
    // C1: first crunch outside any challenge
    const c1 = NormalChallenge(1);
    if (!c1.isCompleted) c1.complete();
  }
}
