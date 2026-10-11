import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { DimBoost } from '@/core/pre-infinity/dimension-boost';
import { Galaxy } from '@/core/pre-infinity/galaxy';
import { player } from '@/core/state/player';

function maxAll() {
  for (let tier = 1; tier <= 8; tier++) {
    AntimatterDimension(tier).buyMax();
  }
  Tickspeed.buyMax();
}

export const FAB_BUTTONS = [
  {
    key: 'max',
    action: () => maxAll(),
    isVisible: () => true,
    isEnabled: () => false,
  },
  {
    key: 'dimboost',
    action: () => DimBoost.buyMax(),
    isVisible: () => true,
    isEnabled: () => DimBoost.requirement.isSatisfied && DimBoost.canBeBought,
  },
  {
    key: 'galaxy',
    action: () => Galaxy.buyMax(),
    isVisible: () => true,
    isEnabled: () => Galaxy.requirement.isSatisfied && Galaxy.canBeBought,
  }
];