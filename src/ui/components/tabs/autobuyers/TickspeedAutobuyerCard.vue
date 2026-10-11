<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { Autobuyer } from '@/core/autobuyers';
import { format } from '@/core/format';
import { t, tp } from '@/i18n';

const ab = Autobuyer.tickspeed;

const state = computed(() => {
  if (ab.isBought) return 'bought';
  if (ab.canBeBought) return 'unlockable';
  return 'locked';
});

const requirementText = computed(() =>
  t('autobuyer_unlock_requirement_this_eternity', format(ab.antimatterCost, 2, 0))
);

const intervalText = computed(() => {
  const seconds = ab.interval / 1000;
  return tp('current_interval', seconds, seconds.toFixed(3));
});

const modeLabel = computed(() =>
  ab.mode === 'max' ? t('buys_max') : t('buys_singles')
);

function toggleActive() { ab.isActive = !ab.isActive; }
function toggleMode() { ab.mode = ab.mode === 'max' ? 'single' : 'max'; }
function purchase() { ab.purchase(); }
</script>

<template>
  <div
    class="ts-card"
    :class="{ 'ts-card--unlockable': state === 'unlockable' }"
  >
    <template v-if="state === 'bought'">
      <label class="ts-card__header">
        <input
          type="checkbox"
          class="ad-checkbox"
          :checked="ab.isActive"
          :disabled="!player.auto.autobuyersOn"
          @change="toggleActive"
        >
        <span class="ts-card__title">{{ t('tickspeed_autobuyer') }}</span>
      </label>
      <div class="ts-card__interval">{{ intervalText }}</div>
      <button class="ts-card__mode-btn" @click="toggleMode">{{ modeLabel }}</button>
    </template>

    <template v-else-if="state === 'unlockable'">
      <div class="ts-card__title ts-card__title--top">{{ t('tickspeed_autobuyer') }}</div>
      <button class="ts-card__unlock-btn" @click="purchase">
        <i class="fas fa-lock-open"></i>
        <span>{{ t('unlock') }}</span>
      </button>
    </template>

    <template v-else>
      <div class="ts-card__title ts-card__title--top">{{ t('tickspeed_autobuyer') }}</div>
      <div class="ts-card__req">{{ requirementText }}</div>
    </template>
  </div>
</template>

<style scoped>
.ts-card {
  display: flex;
  flex-direction: column;
  min-height: 18rem;
  margin: 0 25%;           /* half-width centered in the flow */
  padding: 1rem 1.2rem;
  background: rgba(0, 0, 0, 0.04);
  border: 0.1rem solid rgba(0, 0, 0, 0.10);
  border-radius: 1.2rem;
  text-align: center;
}

.ts-card--unlockable {
  background: rgba(0, 0, 0, 0.10);
  border-color: var(--color-unlockable);
}

.ts-card__header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
}

.ts-card__header .ts-card__title {
  flex: 1;
  text-align: center;
}

.ts-card__interval {
  margin-top: 0.2rem;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.60);
}

.ts-card__mode-btn {
  margin-top: 0.8rem;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  background: #f2f2f2;
  border: 0.1rem solid var(--color-unlockable);
  border-radius: 0.6rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}

.ts-card__mode-btn:active {
  background: var(--color-good-light);
}

.ts-card__title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #000;
  line-height: 1.2;
}

.ts-card__title--top {
  text-align: center;
}

.ts-card__req {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.60);
  white-space: pre-line;
}

.ts-card__unlock-btn {
  align-self: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 2rem;
  margin-top: auto;
  margin-bottom: 0.4rem;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-unlockable);
  background: transparent;
  border: 0.1rem solid var(--color-unlockable);
  border-radius: 0.6rem;
  cursor: pointer;
}

.ts-card__unlock-btn:active {
  background: rgba(0, 0, 0, 0.10);
}
</style>