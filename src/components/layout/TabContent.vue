<script setup>
import { currentSubtab } from '@/core/tabs';
</script>

<template>
  <main class="tab-content">
    <component :is="currentSubtab.component" />
  </main>
</template>

<style scoped>
.tab-content {
  padding: 0.5rem 0;
}
</style>