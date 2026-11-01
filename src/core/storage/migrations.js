import { CURRENT_SAVE_VERSION } from "@/core/state/player";
import { D } from "@/core/decimal";

// Each key is the version this patch migrates TO.
// A patch runs once, in ascending order, for saves below CURRENT_SAVE_VERSION.
// Patches mutate the player object in place. Do not import global state here.
export const migrations = {
  patches: {
    2: (player) => {
      // Add "costBumps" property to AD state
      for (let i = 0; i < 8; i++) {
        player.dimensions.antimatter[i].costBumps = D(0);
      }
    },
    3: (player) => {
      const AD_BASE_INTERVALS = [500, 600, 700, 800, 900, 1000, 1100, 1200];
      for (let i = 0; i < 8; i++) {
        player.auto.antimatterDims[i].interval = AD_BASE_INTERVALS[i];
      }
    },
  },

  apply(player) {
    let version = player.version ?? 0;
    if (version >= CURRENT_SAVE_VERSION) {
      player.version = CURRENT_SAVE_VERSION;
      return;
    }
    while (version < CURRENT_SAVE_VERSION) {
      version++;
      const patch = migrations.patches[version];
      if (patch) patch(player);
      player.version = version;
    }
  },
};
