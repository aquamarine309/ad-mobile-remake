<script setup>
import { computed } from "vue";
import AntimatterDimensionRow from "./AntimatterDimensionRow";
import TickspeedRow from "./TickspeedRow";
import DimensionalSacrificeRow from "./DimensionalSacrificeRow";
import DimensionBoostRow from "./DimensionBoostRow";
import AntimatterGalaxyRow from "./AntimatterGalaxyRow";
import ChallengeEffects from "./ChallengeEffects";
import {
  AntimatterDimension,
  AntimatterDimensions,
} from "@/core/dimensions/antimatter-dimension";
import { Sacrifice } from "@/core/pre-infinity/sacrifice";
import { format, formatX } from "@/core/format";
import { tp, t } from "@/i18n";

const rawPerSecond = computed(() => AntimatterDimension(1).productionPerSecond);
const formattedPerSecond = computed(() => format(rawPerSecond.value, 2));

const buyTen = computed(() => AntimatterDimensions.buyTenMultiplier);
const sacrificeVisible = computed(() => Sacrifice.isVisible);
const sacrificeTotal = computed(() => Sacrifice.totalBoost);
</script>

<template>
  <div class="dimensions-tab">
    <div class="per-second">
      {{
        tp(
          "you_are_getting_X_antimatter_per_second",
          rawPerSecond,
          formattedPerSecond,
        )
      }}
    </div>
    <TickspeedRow />
    <ChallengeEffects />
    <DimensionalSacrificeRow />
    <div class="mult-row">
      {{ t("buy_ten_multiplier", formatX(buyTen, 1, 1))
      }}<template v-if="sacrificeVisible">
        |
        {{
          t("sacrifice_total_multiplier", formatX(sacrificeTotal, 2, 2))
        }}</template
      >
    </div>
    <AntimatterDimensionRow v-for="tier in 8" :key="tier" :tier="tier" />
    <div class="prestige-row">
      <DimensionBoostRow />
      <AntimatterGalaxyRow />
    </div>
  </div>
</template>

<style scoped>
.per-second {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  margin-top: 0.2rem;
}

.mult-row {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
}

.prestige-row {
  display: flex;
  gap: 0.6rem;
  padding: 0.6rem 0.7rem;
  margin-top: 0.6rem;
}
</style>
