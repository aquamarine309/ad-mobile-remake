<script setup>
import { visibleSubtabs, currentSubtabKey, showSubtab } from '@/ui/tabs/state';
</script>

<template>
  <nav class="nav-bar subtab-bar">
    <button
      v-for="s in visibleSubtabs"
      :key="s.key"
      class="nav-bar__btn subtab-bar__btn"
      :class="{ 'nav-bar__btn--active': currentSubtabKey === s.key }"
      @click="showSubtab(s.key)"
    >
      {{ s.name }}
    </button>
  </nav>
</template>

<style scoped>
.subtab-bar {
  height: 4.5rem;
}

.subtab-bar__btn {
  flex: 1;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  padding: 0.7rem 0.2rem;
}
</style>