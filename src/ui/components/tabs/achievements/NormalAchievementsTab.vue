<script setup>
import { computed } from 'vue';
import AchievementGrid from './AchievementGrid.vue';
import { NormalAchievements } from '@/core/achievements';
import { formatX } from '@/core/format';
import { t } from "@/i18n";

const multiplierText = computed(() => formatX(NormalAchievements.multiplier, 2, 3));
</script>

<template>
  <div class="normal-achievements-tab">
    <div class="normal-achievements-tab__header">
      {{ t("achievement_multiplier_to") }}
      {{ multiplierText }}
    </div>
    <AchievementGrid
      :achievements="NormalAchievements.all"
      icon-prefix="c"
      :show-completed-row-background="true"
    />
  </div>
</template>

<style scoped>
.normal-achievements-tab__header {
  text-align: center;
  font-size: 1.2rem;
  padding: var(--gap-sm) var(--gap-md);
}
</style>