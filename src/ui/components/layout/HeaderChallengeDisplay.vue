<script setup>
import { computed } from 'vue';
import { t, tp } from '@/i18n';
import { player } from '@/core/state/player';
import { NormalChallenge, NormalChallenges } from '@/core/challenges/normal';
import { showTab } from '@/ui/tabs/state';
import { isInfinityUnlocked } from "@/core/progress";
import { format } from "@/core/format";

const currentChallenge = computed(() => NormalChallenges.current);

const isVisible = computed(() => isInfinityUnlocked() || currentChallenge.value !== null);

const displayText = computed(() => {
  if (currentChallenge.value) {
    return t('challenge_display', t("nc_name", currentChallenge.value.id));
  }
  return t('challenge_display_no_active_challenges');
});

const showMatter = computed(() => NormalChallenge(11).isRunning);
const matter = computed(() => player.matter);

function onClickText() {
  if (currentChallenge.value) {
    showTab('challenges', 'normal');
  }
}

function exitChallenge() {
  if (currentChallenge.value) {
    currentChallenge.value.exit();
  }
}
</script>

<template>
  <div v-if="isVisible" class="header-challenge">
    <span
      class="header-challenge__text"
      :class="{ 'header-challenge__text--clickable': currentChallenge }"
      @click="onClickText"
    >
      {{ displayText }}
    </span>
    <span
      v-if="showMatter"
      class="header-challenge__text"
    >
      {{ tp("there_is_X_matter", matter, format(matter, 2, 2)) }}
    </span>
  </div>
</template>

<style scoped>
.header-challenge {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  color: var(--color-text-muted);
  flex-direction: column;
}
</style>