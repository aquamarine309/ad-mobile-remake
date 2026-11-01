import { D } from "@/core/decimal";
import { formatInt, formatX, formatPercents } from "@/core/format";
import { t } from "@/i18n";
import { player } from "@/core/state/player";

export const NORMAL_CHALLENGE_CONFIGS = [
  {
    id: 1,
    lockedAt: D(0),
    get description() {
      return t("nc1_description");
    },
    get reward() {
      return t("nc1_reward");
    },
  },
  {
    id: 2,
    lockedAt: D(0),
    get description() {
      return t("nc2_description", formatInt(3));
    },
    get reward() {
      return t("nc2_reward");
    },
    effect: () => player.challenge.normal.c2Pow,
    formatEffect: (value) => formatPercents(value, 2, 2),
  },
  {
    id: 3,
    lockedAt: D(0),
    get description() {
      return t("nc3_description");
    },
    get reward() {
      return t("nc3_reward");
    },
    effect: () => player.challenge.normal.c3Pow,
    formatEffect: (value) => formatX(value, 2, 4),
  },
  {
    id: 4,
    lockedAt: D(0),
    get description() {
      return t("nc4_description");
    },
    get reward() {
      return t("nc4_reward");
    },
  },
  {
    id: 5,
    lockedAt: D(0),
    get description() {
      return t("nc5_description", formatX(1.08, 3, 3), formatX(1.1245, 3, 3));
    },
    get reward() {
      return t("nc5_reward");
    },
  },
  {
    id: 6,
    lockedAt: D(0),
    get description() {
      return t("nc6_description", formatInt(2));
    },
    get reward() {
      return t("nc6_reward");
    },
  },
  {
    id: 7,
    lockedAt: D(0),
    get description() {
      return t(
        "nc7_description",
        formatInt(10),
        formatX(1),
        formatX(0.2, 1, 1),
        formatX(2),
      );
    },
    get reward() {
      return t("nc7_reward");
    },
  },
  {
    id: 8,
    lockedAt: D(0),
    get description() {
      return t("nc8_description");
    },
    get reward() {
      return t("nc8_reward");
    },
  },
  {
    id: 9,
    lockedAt: D(0),
    get description() {
      return t("nc9_description", formatInt(10));
    },
    get reward() {
      return t("nc9_reward");
    },
  },
  {
    id: 10,
    lockedAt: D(16),
    get description() {
      return t("nc10_description", formatInt(6));
    },
    get reward() {
      return t("nc10_reward");
    },
  },
  {
    id: 11,
    lockedAt: D(16),
    get description() {
      return t("nc11_description");
    },
    get reward() {
      return t("nc11_reward");
    },
  },
  {
    id: 12,
    lockedAt: D(16),
    get description() {
      return t("nc12_description", formatInt(2));
    },
    get reward() {
      return t("nc12_reward");
    },
  },
];
