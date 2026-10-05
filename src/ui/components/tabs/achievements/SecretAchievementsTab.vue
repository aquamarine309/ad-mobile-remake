<script setup>
import AchievementGrid from './AchievementGrid.vue';
import { SecretAchievements } from '@/core/achievements';
</script>

<template>
  <div class="secret-achievements-tab">
    <div class="secret-achievements-tab__header">
      Secret Achievements are optional and give no bonuses.
    </div>
    <AchievementGrid
      :achievements="SecretAchievements.all"
      icon-prefix="s"
      :is-secret="true"
    />
  </div>
</template>

<style scoped>
.secret-achievements-tab__header {
  text-align: center;
  font-size: 1.2rem;
  padding: var(--gap-sm) var(--gap-md);
}
</style>