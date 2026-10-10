<script setup>
import { computed } from 'vue';
import { Currency } from '@/core/currency';
import { format } from '@/core/format';
import { tpHtml } from '@/i18n';

const rawAM = computed(() => Currency.antimatter.value);
const formattedAM = computed(() => format(rawAM.value, 2, 1));
</script>

<template>
  <header class="header">
    <div
      class="header__main"
      v-html="tpHtml('you_have_X_antimatter', rawAM, formattedAM)"
    />
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  padding: 1rem 0.7rem 0.6rem;
}

.header__main {
  font-size: 1.5rem;
}

.header__main :deep(.i18n-amt) {
  font-size: 1.65em;
  font-weight: bold;
}
</style>