import AntimatterDimensionsTab from "@/ui/components/tabs/antimatter-dimensions/AntimatterDimensionsTab";
import OptionsTab from "@/ui/components/tabs/options/OptionsTab";
import NormalAchievementsTab from "@/ui/components/tabs/achievements/NormalAchievementsTab";
import SecretAchievementsTab from "@/ui/components/tabs/achievements/SecretAchievementsTab";
import StatsTab from "@/ui/components/tabs/stats/StatsTab";
import AutobuyersTab from "@/ui/components/tabs/autobuyers/AutobuyersTab";
import InfinityUpgradesTab from "@/ui/components/tabs/infinity-upgrades/InfinityUpgradesTab";
import NormalChallengesTab from "@/ui/components/tabs/normal-challenges/NormalChallengesTab";
import { isInfinityUnlocked } from "@/core/progress";

export const TABS = [
  {
    key: "dimensions",
    symbol: "\uf1b2", // cube
    subtabs: [
      {
        key: "antimatter_dimensions",
        symbol: "Ω",
        nameKey: "tab_antimatter_dimensions_short",
        component: AntimatterDimensionsTab,
      },
    ],
  },
  {
    key: "automation",
    symbol: "\uf085",
    subtabs: [
      {
        key: "autobuyers",
        symbol: "\uf013",
        nameKey: "tab_autobuyers",
        component: AutobuyersTab,
      },
    ],
  },
  {
    key: "challenges",
    symbol: "\uf6fc", // fa-mountain
    condition: () => isInfinityUnlocked(),
    subtabs: [
      {
        key: "normal_challenges",
        symbol: "Ω",
        nameKey: "tab_normal_challenges_short",
        component: NormalChallengesTab,
      },
    ],
  },
  {
    key: "infinity",
    symbol: "∞",
    condition: () => isInfinityUnlocked(),
    color: "var(--color-infinity)",
    subtabs: [
      {
        key: "infinity_upgrades",
        symbol: "\uf062", // fa-arrow-up
        nameKey: "tab_infinity_upgrades_short",
        component: InfinityUpgradesTab,
      },
    ],
  },
  {
    key: "achievements",
    symbol: "\uf091", // trophy
    subtabs: [
      {
        key: "normal_achievements",
        symbol: "\uf5a2", // trophy-alt
        nameKey: "tab_normal_achievements_short",
        component: NormalAchievementsTab,
      },
      {
        key: "secret_achievements",
        symbol: "?",
        nameKey: "tab_secret_achievements_short",
        component: SecretAchievementsTab,
      },
    ],
  },
  {
    key: "statistics",
    symbol: "\uf46d", // clipboard-list
    subtabs: [
      {
        key: "statistics",
        symbol: "\uf46d",
        nameKey: "tab_statistics_short",
        component: StatsTab,
      },
    ],
  },
  {
    key: "options",
    symbol: "\uf1de", // sliders
    subtabs: [
      {
        key: "options",
        symbol: "\uf1de",
        nameKey: "tab_options",
        component: OptionsTab,
      },
    ],
  },
];
