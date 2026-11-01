<script setup>
import HeaderChallengeDisplay from "./HeaderChallengeDisplay";

import { computed } from "vue";
import { Currency } from "@/core/currency";
import { isInfinityUnlocked } from "@/core/progress";
import { format } from "@/core/format";
import { tpHtml } from "@/i18n";

const rawAM = computed(() => Currency.antimatter.value);
const formattedAM = computed(() => format(rawAM.value, 2, 1));

const infinityUnlocked = computed(() => isInfinityUnlocked());
const rawIP = computed(() => Currency.infinityPoints.value);
const formattedIP = computed(() => format(rawIP.value, 2));
</script>

<template>
  <header class="header">
    <HeaderChallengeDisplay />
    <div
      v-if="infinityUnlocked"
      class="header__line header__line--ip"
      v-html="tpHtml('you_have_X_infinity_points', rawIP, formattedIP)"
    />
    <div
      class="header__line header__line--am"
      v-html="tpHtml('you_have_X_antimatter', rawAM, formattedAM)"
    />
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  padding: 1rem 0.7rem 0.6rem;
}

.header__line {
  font-size: 1.4rem;
  color: var(--color-text-muted);
}

.header__line--ip {
  margin-bottom: 0.5rem;
}

.header__line :deep(.i18n-num) {
  font-weight: bold;
}

.header__line--am :deep(.i18n-num) {
  font-size: 1.65em;
  color: var(--color-antimatter);
}

.header__line--ip :deep(.i18n-num) {
  font-size: 1.25em;
  color: var(--color-infinity);
}
</style>
