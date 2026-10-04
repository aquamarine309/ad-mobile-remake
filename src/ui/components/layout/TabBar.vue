<script setup>
import { visibleTabs, currentTabKey } from "@/ui/tabs/state";
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="t in visibleTabs"
      :key="t.key"
      class="tab-bar__btn"
      :class="{ 'tab-bar__btn--active': currentTabKey === t.key }"
      @click="currentTabKey = t.key"
    >
      {{ t.letter }}
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  background: #008577;
  scrollbar-width: none;
  pointer-events: auto;
}

.tab-bar::-webkit-scrollbar {
  display: none;
}

.tab-bar__btn {
  flex: 1 0 auto;
  min-width: 4rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: bold;
  color: #a0ffffff;
  background: transparent;
  border: none;
  transition-duration: 0.15s;
}

.tab-bar__btn--active {
  color: #ffffff;
  box-shadow: inset 0 -0.3rem 0 #e91e63;
}
</style>