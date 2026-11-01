import { format, formatInt } from "@/core/format";
import { t } from "@/i18n";
import { GAME_EVENT } from '@/core/events';
import { AchievementTimers } from './achievement-timer';

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

export const SECRET_ACHIEVEMENT_CONFIGS = [
  {
    id: 11,
  },
  {
    id: 12,
    get description() { return t("secret_achievement_12_tooltip", formatInt(100)); }
  },
  {
    id: 13
  },
  {
    id: 14
  },
  {
    id: 15
  },
  {
    id: 16,
    get description() {
      return t("secret_achievement_16_tooltip", formatInt(10));
    }
  },
  {
    id: 17
  },
  {
    id: 18,
    get description() {
      return t("secret_achievement_18_tooltip", formatInt(1), formatInt(1e6));
    }
  },
  {
    id: 21
  },
  {
    id: 22,
    get description() { return t("secret_achievement_22_tooltip", formatInt(1e5)); },
  },
  {
    id: 23,
    get description() { 
      return t("secret_achievement_23_tooltip", formatInt(10));
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => {
      return AchievementTimers.landscape.check(isLandscape(), 600);
    }
  },
  {
    id: 24
  },
  {
    id: 25
  },
  {
    id: 26,
    get description() {
      return t("secret_achievement_26_tooltip", formatInt(10));
    },
  },
  {
    id: 27
  },
  {
    id: 28
  },
  {
    id: 31,
    get description() { return t("secret_achievement_31_tooltip", formatInt(200)) }
  },
  {
    id: 32,
    get name() { return t("secret_achievement_32_name", format(0.001, 3, 3)); },
    get description() {
      return t("secret_achievement_32_tooltip", format(0.001, 3, 3));
    }
  },
  {
    id: 33
  },
  {
    id: 34
  },
  {
    id: 35,
    get description() { return t("secret_achievement_35_tooltip", formatInt(1e5)) }
  },
  {
    id: 36
  },
  {
    id: 37
  },
  {
    id: 38
  },
  {
    id: 41
  },
  {
    id: 42
  },
  {
    id: 43
  },
  {
    id: 44,
    get description() { return t("secret_achievement_44_tooltip", formatInt(15)); }
  },
  {
    id: 45
  },
  {
    id: 46
  },
  {
    id: 47
  },
  {
    id: 48
  },
];
