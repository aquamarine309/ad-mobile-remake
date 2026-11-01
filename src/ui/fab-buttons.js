import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { DimBoost } from "@/core/pre-infinity/dimension-boost";
import { Galaxy } from "@/core/pre-infinity/galaxy";
import { player } from "@/core/state/player";
import { isInfinityUnlocked } from "@/core/progress";
import { bigCrunchReset } from "@/core/prestige/big-crunch";

function maxAll() {
  for (let tier = 1; tier <= 8; tier++) {
    AntimatterDimension(tier).buyMax();
  }
  Tickspeed.buyMax();
}

export const FAB_BUTTONS = [
  {
    key: "max",
    action: () => {
      player.requirementChecks.infinity.maxAll = true;
      maxAll();
    },
    isVisible: () => true,
    isEnabled: () => false,
  },
  {
    key: "dimboost",
    action: () => DimBoost.buy(),
    isVisible: () => true,
    isEnabled: () => DimBoost.requirement.isSatisfied && DimBoost.canBeBought,
  },
  {
    key: "galaxy",
    action: () => Galaxy.buy(),
    isVisible: () => true,
    isEnabled: () => Galaxy.requirement.isSatisfied && Galaxy.canBeBought,
  },
  {
    key: "crunch",
    action: () => bigCrunchReset(),
    isVisible: () => isInfinityUnlocked(),
    isEnabled: () => false,
  },
];
