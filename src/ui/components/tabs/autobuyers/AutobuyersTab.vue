<script setup>
import { computed } from 'vue';
import { t } from '@/i18n';
import { NormalChallenge } from '@/core/challenges/normal';
import ADAutobuyerCard from './ADAutobuyerCard.vue';
import TickspeedAutobuyerCard from './TickspeedAutobuyerCard.vue';
import DimensionBoostAutobuyerCard from './DimensionBoostAutobuyerCard.vue';
import GalaxyAutobuyerCard from './GalaxyAutobuyerCard.vue';
import BigCrunchAutobuyerCard from './BigCrunchAutobuyerCard.vue';
import AutobuyerToggles from "./AutobuyerToggles";

const isDimBoostUnlocked = computed(() => NormalChallenge(10).isCompleted);
const isGalaxyUnlocked = computed(() => NormalChallenge(11).isCompleted);
const isBigCrunchUnlocked = computed(() => NormalChallenge(12).isCompleted);
</script>

<template>
  <div class="autobuyers-tab">
    <AutobuyerToggles />
    
    <div class="autobuyer-row">
      <BigCrunchAutobuyerCard v-if="isBigCrunchUnlocked" class="row-item" />
      <DimensionBoostAutobuyerCard v-if="isDimBoostUnlocked" class="row-item" />
    </div>
    
    <div class="autobuyer-row">
      <GalaxyAutobuyerCard v-if="isGalaxyUnlocked" class="row-item" />
      <TickspeedAutobuyerCard class="row-item" />
    </div>    
    
    <div class="ad-grid">
      <ADAutobuyerCard v-for="tier in 8" :key="tier" :tier="tier" />
    </div>
  </div>
</template>

<style scoped>
.autobuyers-tab {
  padding: 0.5rem 0.7rem 1rem;
}

.autobuyers-tab__title {
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  margin: 1.5rem 0 0.8rem;
}

.ad-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.autobuyer-row {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.row-item {
  flex: 0 0 calc(50% - 0.4rem); 
  max-width: calc(50% - 0.4rem);
}

:deep(.ts-card-wrapper) {
  margin: 0;
  width: 100%;
}

@media (orientation: landscape) {
  .ad-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>