<script setup>
import { visibleTabs, currentTabKey, showTab } from "@/ui/tabs/state";
</script>

<template>
  <nav class="nav-bar tab-bar">
    <button
      v-for="t in visibleTabs"
      :key="t.key"
      class="nav-bar__btn tab-bar__btn"
      :class="{ 'nav-bar__btn--active': currentTabKey === t.key }"
      @click="showTab(t.key)"
    >
      {{ t.letter }}
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
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
  font-size: 1.6rem;
}
</style>