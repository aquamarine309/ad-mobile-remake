<script setup>
import AntimatterDimensionRow from "./AntimatterDimensionRow";
import TickspeedRow from "./TickspeedRow";
import DimensionalSacrificeRow from "./DimensionalSacrificeRow";
import DimensionBoostRow from "./DimensionBoostRow";
import AntimatterGalaxyRow from "./AntimatterGalaxyRow";
</script>

<template>
  <div class="dimensions-tab">
    <TickspeedRow />
    <DimensionalSacrificeRow />
    <AntimatterDimensionRow v-for="tier in 8" :key="tier" :tier="tier" />
    <div class="prestige-row">
      <DimensionBoostRow />
      <AntimatterGalaxyRow />
    </div>
  </div>
</template>

<style scoped>
.prestige-row {
  display: flex;
  gap: 0.6rem;
  padding: 0.6rem 0.7rem;
  margin-top: 0.6rem;
  border-top: 0.2rem solid #000;
}
</style>