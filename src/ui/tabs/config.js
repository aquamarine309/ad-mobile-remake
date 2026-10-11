import AntimatterDimensionsTab from "@/ui/components/tabs/antimatter-dimensions/AntimatterDimensionsTab";
import OptionsTab from "@/ui/components/tabs/options/OptionsTab";
import NormalAchievementsTab from "@/ui/components/tabs/achievements/NormalAchievementsTab";
import SecretAchievementsTab from "@/ui/components/tabs/achievements/SecretAchievementsTab";
import StatsTab from "@/ui/components/tabs/stats/StatsTab";
import AutobuyersTab from "@/ui/components/tabs/autobuyers/AutobuyersTab";

export const TABS = [
  {
    key: 'dimensions',
    symbol: '\uf1b2',   // cube
    subtabs: [
      {
        key: 'antimatter_dimensions',
        symbol: 'Ω',
        nameKey: 'tab_antimatter_dimensions_short',
        component: AntimatterDimensionsTab,
      },
    ],
  },
  {
    key: 'automation',
    symbol: '\uf085',
    subtabs: [
      {
        key: 'autobuyers',
        symbol: '\uf013',
        nameKey: 'tab_autobuyers',
        component: AutobuyersTab,
      },
    ],
  },
  {
    key: 'achievements',
    symbol: '\uf091',   // trophy
    subtabs: [
      {
        key: 'normal_achievements',
        symbol: '\uf5a2',   // trophy-alt
        nameKey: 'tab_normal_achievements_short',
        component: NormalAchievementsTab,
      },
      {
        key: 'secret_achievements',
        symbol: '?',
        nameKey: 'tab_secret_achievements_short',
        component: SecretAchievementsTab,
      },
    ],
  },
  {
    key: 'statistics',
    symbol: '\uf46d',   // clipboard-list
    subtabs: [
      {
        key: 'statistics',
        symbol: '\uf46d',
        nameKey: 'tab_statistics_short',
        component: StatsTab,
      },
    ],
  },
  {
    key: 'options',
    symbol: '\uf1de',   // sliders
    subtabs: [
      {
        key: 'options',
        symbol: '\uf1de',
        nameKey: 'tab_options',
        component: OptionsTab,
      },
    ],
  },
];