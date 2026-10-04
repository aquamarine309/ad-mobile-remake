import AntimatterDimensionsTab from "@/components/tabs/antimatter-dimensions/AntimatterDimensionsTab"

export const TABS = [
  {
    key: 'dimensions',
    name: 'Dimensions',
    letter: "D",
    subtabs: [
      {
        key: 'antimatter',
        name: 'Antimatter',
        component: AntimatterDimensionsTab,
      }
    ],
  }
];