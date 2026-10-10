import AntimatterDimensionsTab from "@/ui/components/tabs/antimatter-dimensions/AntimatterDimensionsTab";
import OptionsTab from "@/ui/components/tabs/options/OptionsTab";
import NormalAchievementsTab from "@/ui/components/tabs/achievements/NormalAchievementsTab";
import SecretAchievementsTab from "@/ui/components/tabs/achievements/SecretAchievementsTab";

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