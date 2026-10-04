import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { DimBoost } from '@/core/pre-infinity/dimension-boost';
import { Galaxy } from '@/core/pre-infinity/galaxy';
import { player } from '@/core/player';

function maxAll() {
  for (let tier = 1; tier <= 8; tier++) {
    AntimatterDimension(tier).buyMax();
  }
  Tickspeed.buyMax();
}

export const FAB_BUTTONS = [
  {
    key: 'maxAll',
    label: 'Max',
    tooltip: 'Max All',
    action: () => maxAll(),
    isVisible: () => true,
    isEnabled: () => false,
  },
  {
    key: 'dimBoost',
    label: 'D',
    tooltip: 'Dimension Boost',
    action: () => DimBoost.buyMax(),
    isVisible: () => player.dimensionBoosts.gt(0) || DimBoost.requirement.isSatisfied,
    isEnabled: () => DimBoost.requirement.isSatisfied && DimBoost.canBeBought,
  },
  {
    key: 'galaxy',
    label: 'G',
    tooltip: 'Antimatter Galaxy',
    action: () => Galaxy.buyMax(),
    isVisible: () => player.galaxies.gt(0) || Galaxy.requirement.isSatisfied,
    isEnabled: () => Galaxy.requirement.isSatisfied && Galaxy.canBeBought,
  }
];