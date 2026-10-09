import AntimatterDimensionsTab from "@/ui/components/tabs/antimatter-dimensions/AntimatterDimensionsTab";
import OptionsTab from "@/ui/components/tabs/options/OptionsTab";
import NormalAchievementsTab from "@/ui/components/tabs/achievements/NormalAchievementsTab";
import SecretAchievementsTab from "@/ui/components/tabs/achievements/SecretAchievementsTab";

export const TABS = [
  {
    key: 'dimensions',
    subtabs: [
      { key: 'antimatter_dimensions', component: AntimatterDimensionsTab },
    ],
  },
  {
    key: 'achievements',
    subtabs: [
      { key: 'normal_achievements', component: NormalAchievementsTab },
      { key: 'secret_achievements', component: SecretAchievementsTab },
    ],
  },
  {
    key: 'options',
    subtabs: [
      { key: 'options', component: OptionsTab },
    ],
  },
];