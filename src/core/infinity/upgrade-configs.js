import { D, Decimal } from "@/core/decimal";
import { player } from "@/core/state/player";
import { format, formatX, formatInt, formatPercents } from "@/core/format";
import { t } from "@/i18n";
import { totalIPMult } from "@/core/prestige/big-crunch";
import { formatGameTime } from "@/core/time/timespan";
import { Achievement } from "@/core/achievements";

function infinitiesTotal() {
  return player.infinity.infinities.add(player.infinity.bankedInfinities);
}

function hasUpgrade(id) {
  return player.infinity.upgrades.has(id);
}

export const UPGRADE_CONFIGS = [
  // Column 0
  {
    id: "timeMult",
    col: 0,
    row: 0,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_0");
    },
    effect: () =>
      player.records.totalTimePlayed
        .div(2 * 60000)
        .max(1)
        .pow(0.15),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "18Mult",
    col: 0,
    row: 1,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_1");
    },
    checkRequirement: () => hasUpgrade("timeMult"),
    effect: () => infinitiesTotal().times(0.2).add(1),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "36Mult",
    col: 0,
    row: 2,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_2");
    },
    checkRequirement: () => hasUpgrade("18Mult"),
    effect: () => infinitiesTotal().times(0.2).add(1),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "resetBoost",
    col: 0,
    row: 3,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_3", formatInt(9));
    },
    effect: () => D(9),
    checkRequirement: () => hasUpgrade("36Mult"),
  },
  // Column 1
  {
    id: "dimMult",
    col: 1,
    row: 0,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_4");
    },
    effect: () => D(2.2),
    formatEffect: () => `${formatX(2)} ➜ ${formatX(2.2, 0, 1)}`,
  },
  {
    id: "27Mult",
    col: 1,
    row: 1,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_5");
    },
    checkRequirement: () => hasUpgrade("dimMult"),
    effect: () => infinitiesTotal().times(0.2).add(1),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "45Mult",
    col: 1,
    row: 2,
    cost: D(1),
    get description() {
      return t("infinity_upgrade_6");
    },
    checkRequirement: () => hasUpgrade("27Mult"),
    effect: () => infinitiesTotal().times(0.2).add(1),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "galaxyBoost",
    col: 1,
    row: 3,
    cost: D(2),
    get description() {
      return t("infinity_upgrade_7");
    },
    effect: () => D(2),
    checkRequirement: () => hasUpgrade("45Mult"),
  },
  // Column 2
  {
    id: "timeMult2",
    col: 2,
    row: 0,
    cost: D(3),
    get description() {
      return t("infinity_upgrade_8");
    },
    effect: () =>
      player.records.thisInfinity.time
        .div(4 * 60000)
        .max(1)
        .pow(0.25),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "unspentBonus",
    col: 2,
    row: 1,
    cost: D(5),
    get description() {
      return t("infinity_upgrade_9");
    },
    checkRequirement: () => hasUpgrade("timeMult2"),
    effect: () => player.infinity.points.div(2).pow(1.5).add(1),
    formatEffect: (v) => formatX(v, 2, 2),
  },
  {
    id: "resetMult",
    col: 2,
    row: 2,
    cost: D(7),
    get description() {
      return t("infinity_upgrade_10");
    },
    checkRequirement: () => hasUpgrade("unspentBonus"),
    effect: () => D(2.5),
    formatEffect: () => `${formatX(2)} ➜ ${formatX(2.5, 0, 1)}`,
  },
  {
    id: "passiveGen",
    col: 2,
    row: 3,
    cost: D(10),
    get description() {
      return t("infinity_upgrade_11", formatInt(10));
    },
    checkRequirement: () => hasUpgrade("resetMult"),
    effect: () => totalIPMult(),
    formatEffect: (value) => {
      const time = player.records.bestInfinity.time;
      if (time.eq(Decimal.dLayerSafeMax))
        return t("infinity_upgrade_11_effect", format(value, 2));
      return t(
        "infinity_upgrade_11_effect2",
        format(value, 2),
        formatGameTime(time.times(10)),
      );
    },
  },
  // Column 3
  {
    id: "skipReset1",
    col: 3,
    row: 0,
    cost: D(20),
    get description() {
      return t("infinity_upgrade_12", formatInt(1));
    },
    effect: () => D(1),
  },
  {
    id: "skipReset2",
    col: 3,
    row: 1,
    cost: D(40),
    get description() {
      return t("infinity_upgrade_13", formatInt(2));
    },
    effect: () => D(1),
    checkRequirement: () => hasUpgrade("skipReset1"),
  },
  {
    id: "skipReset3",
    col: 3,
    row: 2,
    cost: D(80),
    get description() {
      return t("infinity_upgrade_14", formatInt(3));
    },
    effect: () => D(1),
    checkRequirement: () => hasUpgrade("skipReset2"),
  },
  {
    id: "skipResetGalaxy",
    col: 3,
    row: 3,
    cost: D(300),
    get description() {
      return t("infinity_upgrade_15", formatInt(4));
    },
    effect: () => D(1),
    checkRequirement: () => hasUpgrade("skipReset3"),
  },
  // DLC
  {
    id: "ipMult",
    cost: D(0), // Managed dynamically by InfinityIPMultUpgrade
    costCap: D("1e6000000"),
    costIncreaseThreshold: D("1e3000000"),
    get description() {
      return t("infinity_upgrade_17", formatX(2));
    },
    formatEffect: (value) => formatX(value, 2),
  },
  {
    id: "ipOffline",
    cost: D(1000),
    get description() {
      return player.options.offlineProgress !== "disable"
        ? t("infinity_upgrade_16", formatPercents(0.5))
        : t("infinity_upgrade_16_b");
    },
    // The upgrade's effect is only active if offline progress is enabled
    effect: () => {
      if (player.options.offlineProgress === "disable") return D(0);
      // Assuming player.records.thisEternity.bestIPmin is implemented
      const bestIPmin = player.records.thisEternity.bestIPminWithoutMaxAll;
      return bestIPmin.times(0.5);
    },
    formatEffect: (v) => t("infinity_upgrade_16_effect", format(v, 2, 2)),
    checkRequirement: () => Achievement(41).isUnlocked,
  },
];
