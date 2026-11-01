import { D, Decimal } from '@/core/decimal';
import { player } from '@/core/state/player';
import { NormalChallenge } from "./normal";
import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { Currency } from "@/core/currency";
import { canBigCrunch } from "@/core/prestige/big-crunch";
import { softReset, DimBoost } from "@/core/pre-infinity/dimension-boost";

/**
 * Resets challenge-specific transient state. Called when entering or leaving a challenge.
 * Extend as Infinity Challenges add their own state.
 */
export function resetChallengeTransient() {
  player.challenge.normal.c2Pow = 0;
  player.challenge.normal.c3Pow = D(0.01);
  player.challenge.normal.c8Sacrifice = D(1);
  Currency.matter.reset();
}

export function updateNormalAndInfinityChallenges(diff) {
  if (NormalChallenge(11).isRunning) {
    if (AntimatterDimension(2).amount.neq(0)) {
      Currency.matter.value = Currency.matter.value.clampMin(1);
      // These caps are values which occur at approximately e308 IP
      const cappedBase = D(1.03).add(DimBoost.totalBoosts.clampMax(400).div(200)).add
        (player.galaxies.clampMax(100).div(100));
      Currency.matter.multiply(cappedBase.pow(diff.div(20)));
    }
    if (Currency.matter.gt(Currency.antimatter.value) && NormalChallenge(11).isRunning && !canBigCrunch()) {
      softReset(D(0), { resetAD: true, resetAM: true });
    }
  }

  if (NormalChallenge(3).isRunning) {
    player.challenge.normal.c3Pow = player.challenge.normal.c3Pow.times(D(1.00038).pow(diff.div(100)))
      .clampMax(Decimal.dNumberMax);
  }

  if (NormalChallenge(2).isRunning) {
    player.challenge.normal.c2Pow = diff.div(100 * 1800).add(player.challenge.normal.c2Pow).clampMax(1).toNumber();
  }
}