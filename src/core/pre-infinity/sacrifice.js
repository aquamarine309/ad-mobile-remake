import { D, Decimal } from "@/core/decimal";
import { player } from "@/core/state/player";
import {
  AntimatterDimension,
  AntimatterDimensions,
} from "@/core/dimensions/antimatter-dimension";
import { DimBoost } from "@/core/pre-infinity/dimension-boost";
import { formatX, formatInt } from "@/core/format";
import { dispatch, GAME_EVENT } from "@/core/events";
import { t } from "@/i18n";
import { Achievement } from "@/core/achievements";
import { canBigCrunch } from "@/core/prestige/big-crunch";
import { NormalChallenge, NormalChallenges } from "@/core/challenges/normal";
import { Currency } from "@/core/currency";
import { addEffectsOf } from "@/core/mechanic";

export const Sacrifice = {
  get isVisible() {
    return Achievement(18).isUnlocked;
  },

  get sacrificeExponent() {
    let base;
    if (NormalChallenge(8).isRunning) base = D(1);
    else base = D(2);

    const preIC2 = addEffectsOf(D(1), Achievement(32));

    return base.times(preIC2);
  },

  get canSacrifice() {
    if (!this.isVisible) return false;
    if (!(player.break || !canBigCrunch())) return false;
    if (DimBoost.purchasedBoosts.lt(5)) return false;
    if (AntimatterDimension(8).amount.lte(0)) return false;
    if (this.nextBoost.lte(1)) return false;

    if (
      NormalChallenge(8).isRunning &&
      this.totalBoost.gte(Decimal.dNumberMax)
    ) {
      return false;
    }
    return true;
  },

  get disabledCondition() {
    if (canBigCrunch()) {
      if (NormalChallenges.isRunning)
        return t("sacrifice_locked_reason_reached_goal");
      return t("sacrifice_locked_reason_need_to_crunch");
    }
    if (NormalChallenge(10).isRunning) {
      return t("sacrifice_locked_reason_8th_dimension");
    }
    if (DimBoost.purchasedBoosts.lt(5)) {
      return t("sacrifice_locked_reason_dimboost", formatInt(5));
    }
    if (AntimatterDimension(8).amount.eq(0)) {
      return t("sacrifice_locked_reason_8th_dimension");
    }
    if (this.nextBoost.lte(1)) {
      return formatX(1, 2, 2);
    }
    return null;
  },

  get nextBoost() {
    const nd1 = AntimatterDimension(1).amount;
    if (nd1.eq(0)) return D(1);
    const sacrificed = player.sacrificed.clampMin(1);

    let prePower;
    if (NormalChallenge(8).isRunning) {
      const nd1Pow = nd1.pow(0.05);
      const sacPow = sacrificed.pow(0.04);
      prePower = nd1Pow
        .div(sacPow)
        .clampMin(1)
        .times(nd1Pow.div(sacrificed.add(nd1).pow(0.04)));
    } else {
      prePower = nd1.log10().div(10).div(sacrificed.log10().div(10).max(1));
    }

    return prePower.clampMin(1).pow(this.sacrificeExponent);
  },

  get totalBoost() {
    if (NormalChallenge(8).isRunning) {
      return player.challenge.normal.c8Sacrifice;
    }
    if (player.sacrificed.eq(0)) return D(1);
    const prePower = player.sacrificed.log10().div(10);
    return prePower.clampMin(1).pow(this.sacrificeExponent);
  },

  sacrifice() {
    if (!this.canSacrifice) return false;

    dispatch(GAME_EVENT.SACRIFICE_RESET_BEFORE);

    const nextBoost = this.nextBoost;

    if (NormalChallenge(8).isRunning) {
      player.challenge.normal.c8Sacrifice =
        player.challenge.normal.c8Sacrifice.times(nextBoost);
    }

    player.sacrificed = player.sacrificed.add(AntimatterDimension(1).amount);

    if (NormalChallenge(8).isRunning) {
      AntimatterDimensions.reset();
      Currency.antimatter.reset();
    } else {
      for (let tier = 1; tier <= 7; tier++) {
        AntimatterDimension(tier).resetAmount();
      }
    }

    player.requirementChecks.infinity.noSacrifice = false;

    dispatch(GAME_EVENT.SACRIFICE_RESET_AFTER);
    return true;
  },
};
