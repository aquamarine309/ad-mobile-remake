<script setup>
import { computed } from "vue";
import { t } from "@/i18n";
import { NormalChallenges } from "@/core/challenges/normal";
import NormalChallengeBox from "./NormalChallengeBox.vue";
import { player } from "@/core/state/player";
import { Decimal } from "@/core/decimal";
import { format } from "@/core/format";

const challenges = NormalChallenges.all;
const current = computed(() => NormalChallenges.current);
const isRunning = computed(() => current.value !== null);
const retryChallenge = computed(() => player.options.retryChallenge);

function restart() {
  current.value?.restart();
}

function exit() {
  current.value?.exit();
}

function toggleRetry() {
  player.options.retryChallenge = !player.options.retryChallenge;
}

const inf = computed(() => format(Decimal.dNumberMax, 2));
</script>

<template>
  <div class="nc-tab">
    <div v-if="isRunning" class="nc-tab__actions">
      <button class="nc-tab__action-btn" @click="restart">
        {{ t("restart_challenge") }}
      </button>
      <button class="nc-tab__action-btn" @click="exit">
        {{ t("exit_challenge") }}
      </button>
    </div>

    <div class="nc-tab__actions">
      <button class="nc-tab__action-btn" @click="toggleRetry">
        {{
          t(
            "automatically_retry_challenges_X",
            t(retryChallenge ? "on" : "off"),
          )
        }}
      </button>
    </div>

    <p class="nc-tab__info">{{ t("normal_challenge_info", inf) }}</p>
    <p class="nc-tab__info">{{ t("antimatter_challenge_crunch_info") }}</p>

    <div class="nc-grid">
      <NormalChallengeBox v-for="c in challenges" :key="c.id" :challenge="c" />
    </div>
  </div>
</template>

<style scoped>
.nc-tab {
  padding: 0.5rem 0.7rem 1rem;
}

.nc-tab__actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.nc-tab__action-btn {
  font-family: inherit;
  font-size: 1.3rem;
  padding: 0.5rem 1.5rem;
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
  touch-action: manipulation;
}

.nc-tab__action-btn:active {
  background: var(--color-card-fill-active);
}

.nc-tab__info {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0.5rem 0;
}

.nc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
