<script setup>
import { NormalChallenge } from "@/core/challenges/normal";
import { player } from "@/core/state/player";
import { t } from "@/i18n";
import { formatPercents, formatX } from "@/core/format";
import { computed } from "vue";

const isC2Running = computed(() => NormalChallenge(2).isRunning);
const c2Pow = computed(() => player.challenge.normal.c2Pow);

const isC3Running = computed(() => NormalChallenge(3).isRunning);
const c3Pow = computed(() => player.challenge.normal.c3Pow);

const isVisible = computed(() => isC2Running.value || isC3Running.value);
</script>

<template>
  <div v-if="isVisible" class="challenge-effects">
    <div v-if="isC2Running">
      {{ t("nc_name", 2) }}: {{ formatPercents(c2Pow, 2, 2) }}
    </div>
    <div v-if="isC3Running">
      {{ t("nc_name", 3) }}: {{ formatX(c3Pow, 2, 4) }}
    </div>
  </div>
</template>

<style scoped>
.challenge-effects {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  margin-top: 0.2rem;
}
</style>
