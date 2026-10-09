<script setup>
import { visibleTabs, currentTabKey, showTab } from "@/ui/tabs/state";
import { t } from '@/i18n';
</script>

<template>
  <nav class="nav-bar tab-bar">
    <button
      v-for="tab in visibleTabs"
      :key="tab.key"
      class="nav-bar__btn tab-bar__btn"
      :class="{ 'nav-bar__btn--active': currentTabKey === tab.key }"
      @click="showTab(tab.key)"
    >
      {{ t(`tab_${tab.key}_letter`) }}
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