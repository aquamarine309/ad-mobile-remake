<script setup>
import { currentSubtab } from "@/ui/tabs/state";
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
