<script setup>
import AchievementGrid from "./AchievementGrid.vue";
import { SecretAchievements } from "@/core/achievements";
</script>

<template>
  <div class="secret-achievements-tab">
    <AchievementGrid
      :achievements="SecretAchievements.all"
      icon-prefix="s"
      :is-secret="true"
    />
  </div>
</template>

<style scoped></style>
