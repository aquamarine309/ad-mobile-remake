<script setup>
import { computed } from 'vue';
import { visibleSubtabs, currentSubtabKey, showSubtab } from '@/ui/tabs/state';
import { player } from '@/core/state/player';
import { t } from '@/i18n';

const useSymbol = computed(() =>
  player.options.bottomNavSymbols === 'all' ||
  player.options.bottomNavSymbols === 'subOnly'
);

function label(sub) {
  return useSymbol.value ? sub.symbol : t(sub.nameKey);
}
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
      {{ label(s) }}
    </button>
  </nav>
</template>

<style scoped>
.subtab-bar {
  min-height: 4.5rem;
  padding-bottom: var(--safe-bottom);
}

.subtab-bar__btn {
  flex: 1;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  padding: 0.7rem 0.2rem;
}
</style>