import AntimatterDimensionsTab from "@/ui/components/tabs/antimatter-dimensions/AntimatterDimensionsTab";
import OptionsTab from "@/ui/components/tabs/options/OptionsTab";
import NormalAchievementsTab from "@/ui/components/tabs/achievements/NormalAchievementsTab";
import SecretAchievementsTab from "@/ui/components/tabs/achievements/SecretAchievementsTab";

export const TABS = [
  {
    key: 'dimensions',
    name: 'Dimensions',
    letter: 'D',
    subtabs: [
      {
        key: 'antimatter',
        name: 'Antimatter',
        component: AntimatterDimensionsTab,
      },
    ],
  },
  {
    key: 'achievements',
    name: 'Achievements',
    letter: 'A',
    subtabs: [
      { key: 'normal', name: 'Normal', component: NormalAchievementsTab },
      { key: 'secret', name: 'Secret', component: SecretAchievementsTab },
    ],
  },
  {
    key: 'options',
    name: 'Options',
    letter: 'O',
    subtabs: [
      {
        key: 'options',
        name: 'Options',
        component: OptionsTab,
      },
    ],
  },
];