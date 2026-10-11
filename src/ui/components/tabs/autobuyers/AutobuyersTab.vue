<script setup>
import AutobuyerToggles from './AutobuyerToggles.vue';
import ADAutobuyerCard from './ADAutobuyerCard.vue';
import TickspeedAutobuyerCard from './TickspeedAutobuyerCard.vue';
</script>

<template>
  <div class="autobuyers-tab">
    <AutobuyerToggles />
    <TickspeedAutobuyerCard />
    <div class="autobuyers-tab__grid">
      <ADAutobuyerCard v-for="tier in 8" :key="tier" :tier="tier" />
    </div>
  </div>
</template>

<style scoped>
.autobuyers-tab {
  padding: 0.6rem 0.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.autobuyers-tab__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}
</style>