import { formatInt, format, formatPercents, formatX } from "@/core/format";
import { t } from "@/i18n";
import { player } from "@/core/state/player";
import { Currency } from "@/core/currency";
import { GAME_EVENT } from "@/core/events";
import {
  AntimatterDimension,
  AntimatterDimensions,
} from "@/core/dimensions/antimatter-dimension";
import { DimBoost } from "@/core/pre-infinity/dimension-boost";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { Sacrifice } from "@/core/pre-infinity/sacrifice";
import { D } from "@/core/decimal";
import { NormalChallenge, NormalChallenges } from "@/core/challenges/normal";
import { AchievementTimers } from "./achievement-timer";
import { Autobuyer } from "@/core/autobuyers";

export const NORMAL_ACHIEVEMENT_CONFIGS = [
  {
    id: 11,
  },
  {
    id: 12,
  },
  {
    id: 13,
  },
  {
    id: 14,
  },
  {
    id: 15,
  },
  {
    id: 16,
  },
  {
    id: 17,
  },
  {
    id: 18,
  },
  {
    id: 21,
    get reward() {
      return t("achievement_21_reward", format(100));
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    effect: () => D(100),
    checkRequirement: () => true,
  },
  {
    id: 22,
    get description() {
      return t("achievement_22_tooltip", formatInt(50));
    },
  },
  {
    id: 23,
    get description() {
      return t("achievement_23_tooltip", formatInt(99));
    },
    get reward() {
      return t("achievement_23_reward", formatPercents(0.1));
    },
    effect: () => D(1.1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => AntimatterDimension(8).bought.eq(99),
  },
  {
    id: 24,
    get description() {
      return t("achievement_24_tooltip", format(1e80));
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.antimatter.value.gte(1e80),
  },
  {
    id: 25,
    get description() {
      return t("achievement_25_tooltip", formatInt(10));
    },
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    checkRequirement: () => DimBoost.totalBoosts.eq(10),
  },
  {
    id: 26,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    checkRequirement: () => true,
  },
  {
    id: 27,
    get description() {
      return t("achievement_27_tooltip", formatInt(2));
    },
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    checkRequirement: () => player.galaxies.eq(2),
  },
  {
    id: 28,
    get description() {
      return t("achievement_28_tooltip", format(1e150));
    },
    get reward() {
      return t("achievement_28_reward", formatPercents(0.1));
    },
    effect: () => D(1.1),
  },
  {
    id: 31,
    get description() {
      return t("achievement_31_tooltip", formatX(1e31));
    },
    checkRequirement: () =>
      AntimatterDimensions.all.some((x) => x.multiplier.gte(1e31)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return t("achievement_31_reward", formatPercents(0.05));
    },
    effect: () => D(1.05),
  },
  {
    id: 32,
    get description() {
      return t("achievement_32_tooltip", formatX(600));
    },
    checkRequirement: () =>
      !NormalChallenge(8).isRunning && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() {
      return t("achievement_32_reward");
    },
    effect: () => D(0.1),
  },
  {
    id: 33,
    get description() {
      return t("achievement_33_tooltip", formatInt(10));
    },
    checkRequirement: () => Currency.infinities.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
  },
  {
    id: 34,
    checkRequirement: () => AntimatterDimension(8).totalAmount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_34_reward", formatPercents(0.02));
    },
    effect: () => D(1.02),
  },
  {
    id: 35,
    get description() {
      return t("achievement_35_tooltip", formatInt(6));
    },
    checkRequirement: () => Date.now() - player.lastUpdate >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
  },
  {
    id: 36,
    get description() {
      return t("achievement_36_tooltip", formatInt(1));
    },
    checkRequirement: () => player.galaxies.eq(1),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_36_reward", format(1.02, 2, 2));
    },
    effect: () => D(1.02),
  },
  {
    id: 37,
    get description() {
      return t("achievement_37_tooltip", formatInt(2));
    },
    checkRequirement: () =>
      player.records.bestInfinity.time.lte(2 * 3600 * 1000),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_37_reward", formatInt(5000));
    },
    effect: () => D(5000),
  },
  {
    id: 38,
    checkRequirement: () => player.requirementChecks.infinity.noSacrifice,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE,
  },
  {
    id: 41,
    get description() {
      return t("achievement_41_tooltip", formatInt(16));
    },
    checkRequirement: () => player.infinity.upgrades.size >= 16,
    checkEvent: GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
    get reward() {
      return t("achievement_41_reward", formatX(2));
    },
  },
  {
    id: 42,
    get description() {
      return t("achievement_42_tooltip", format(1e63));
    },
    checkRequirement: () =>
      Currency.antimatter.gte(1e63) &&
      AntimatterDimension(1).productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 43,
    checkRequirement: () => {
      const multipliers = AntimatterDimensions.all.map((dim) => dim.multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return t(
        "achievement_43_reward",
        formatPercents(0.08),
        formatPercents(0.07),
      );
    },
  },
  {
    id: 44,
    get description() {
      return t("achievement_44_tooltip", formatInt(30));
    },
    checkRequirement: () =>
      AchievementTimers.achievement44.check(
        AntimatterDimension(1).productionPerSecond.gt(
          Currency.antimatter.value,
        ),
        30,
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    get description() {
      return t("achievement_45_tooltip", format(1e29));
    },
    checkRequirement: () => Tickspeed.multiplier.gte(1e29),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return t("achievement_45_reward", formatX(1.02, 0, 2));
    },
    effect: () => D(0.98),
  },
  {
    id: 46,
    get description() {
      return t("achievement_45_tooltip", format(1e12));
    },
    checkRequirement: () => AntimatterDimension(7).amount.gte(1e12),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 47,
    get description() {
      return t("achievement_47_tooltip", formatInt(3));
    },
    checkRequirement: () =>
      NormalChallenges.all.filter((c) => c.isCompleted).length >= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
  },
  {
    id: 48,
    get description() {
      return t("achievement_48_tooltip", formatInt(12));
    },
    checkRequirement: () => NormalChallenges.all.every((c) => c.isCompleted),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    effect: () => D(1.1),
    get reward() {
      return t("achievement_48_reward", formatPercents(0.1));
    },
  },
  {
    id: 51,
    checkRequirement: () => player.break,
    checkEvent: GAME_EVENT.BREAK_INFINITY,
  },
  {
    id: 52,
    checkRequirement: () =>
      Autobuyer.antimatterDimensions
        .concat(Autobuyer.tickspeed)
        .every((a) => a.isUnlocked && a.hasMaxedInterval),
  },
  {
    id: 53,
    checkRequirement: () =>
      [
        ...Autobuyer.antimatterDimensions,
        Autobuyer.tickspeed,
        Autobuyer.dimBoost,
        Autobuyer.galaxy,
        Autobuyer.bigCrunch,
      ].every((a) => a.isUnlocked && a.hasMaxedInterval),
  },
  {
    id: 54,
    get description() {
      return t("achievement_54_tooltip", formatInt(10));
    },
    checkRequirement: () =>
      player.records.thisInfinity.realTime <= 10 * 60 * 1000,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_54_reward", format(5e5));
    },
    effect: () => D(5e5),
  },
  {
    id: 55,
    get description() {
      return t("achievement_55_tooltip", formatInt(1));
    },
    checkRequirement: () => player.records.thisInfinity.realTime <= 60 * 1000,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_55_reward", format(5e10));
    },
    effect: () => D(5e10),
  },
  {
    id: 56,
    get description() {
      return t("achievement_56_tooltip", formatInt(3));
    },
    checkRequirement: () =>
      NormalChallenge(2).isRunning &&
      player.records.thisInfinity.realTime <= 3 * 60 * 1000,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_56_reward", formatInt(3));
    },
    effect: () =>
      Math.max(6 / (player.records.thisInfinity.realTime / 60 / 1000 + 3), 1),
    formatEffect: (value) => formatX(value, 2, 2),
  },
  {
    id: 57,
    get description() {
      return t("achievement_57_tooltip", formatInt(3));
    },
    checkRequirement: () =>
      NormalChallenge(8).isRunning &&
      player.records.thisInfinity.realTime <= 3 * 60 * 1000,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_57_reward");
    },
    effect: () => D(0.1),
  },
  {
    id: 58,
    get description() {
      return t("achievement_58_tooltip", formatInt(3));
    },
    checkRequirement: () =>
      NormalChallenge(9).isRunning &&
      player.records.thisInfinity.realTime <= 3 * 60 * 1000,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_58_reward", formatInt(10), formatPercents(0.1));
    },
    effect: () => D(1.01),
  },
  {
    id: 61,
    get description() {
      return t("achievement_61_tooltip", formatInt(512));
    },
    checkRequirement: () =>
      Autobuyer.antimatterDimensions.every((x) => x.hasMaxedBulk),
    get reward() {
      return t("achievement_61_reward");
    },
  },
  {
    id: 62,
    get description() {
      return t("achievement_62_tooltip", format(1e8));
    },
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
  },
  {
    id: 63,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 64,
    get description() {
      return t("achievement_64_tooltip", format(1e8));
    },
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_77_reward", formatPercents(0.25));
    },
    effect: () => D(1.25),
  },
  {
    id: 65,
    get description() {
      return t("achievement_65_tooltip", formatInt(3));
    },
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    get reward() {
      return t("achievement_65_reward", formatInt(3));
    },
    effect: () =>
      NormalChallenges.isRunning
        ? Math.max(
            4 / (player.records.thisInfinity.realTime / 60 / 1000 + 1),
            1,
          )
        : 1,
    formatEffect: (value) => formatX(value, 2, 2),
  },
  {
    id: 66,
    get description() {
      return t("achievement_66_tooltip", format(1e58));
    },
    checkRequirement: () => Tickspeed.multiplier.gte(1e58),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return t("achievement_66_reward", format(1.02, 0, 2));
    },
    effect: () => D(0.98),
  },
  {
    id: 67,
  },
  {
    id: 68,
    get description() {
      return t("achievement_68_tooltip", formatInt(10));
    },
    checkRequirement: () =>
      NormalChallenge(3).isRunning &&
      player.records.thisInfinity.realTime <= 10 * 1000,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return t("achievement_68_reward", formatPercents(0.5));
    },
    effect: () => D(1.5),
  },
];
