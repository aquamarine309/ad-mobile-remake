<script setup>
import { visibleSubtabs, currentSubtabKey, showSubtab } from '@/core/tabs';
</script>

<template>
  <nav class="subtab-bar">
    <button
      v-for="s in visibleSubtabs"
      :key="s.key"
      class="subtab-bar__btn"
      :class="{ 'subtab-bar__btn--active': currentSubtabKey === s.key }"
      @click="showSubtab(s.key)"
    >
      {{ s.name }}
    </button>
  </nav>
</template>

<style>
.subtab-bar {
  display: flex;
  background: #008577;
  height: 4.5rem;
}

.subtab-bar__btn {
  flex: 1;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  padding: 0.7rem 0.2rem;
  color: #a0ffffff;
  background: transparent;
  border: none;
  transition-duration: 0.15s;
}

.subtab-bar__btn--active {
  color: #ffffff;
  box-shadow: inset 0 -0.3rem 0 #e91e63;
}
</style>
