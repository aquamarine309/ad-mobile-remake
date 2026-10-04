import AntimatterDimensionsTab from "@/ui/components/tabs/antimatter-dimensions/AntimatterDimensionsTab";
import OptionsTab from "@/ui/components/tabs/options/OptionsTab";

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