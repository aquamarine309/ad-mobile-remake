<script setup>
import { computed } from 'vue';
import { t, tp } from '@/i18n';
import { formatInt } from '@/core/format';
import { formatTimeShort } from '@/core/time/timespan';
import EffectDisplay from "@/ui/components/EffectDisplay";

const props = defineProps({
  challenge: { type: Object, required: true },
});

// 'locked' | 'start' | 'running' | 'completed'
const state = computed(() => {
  const c = props.challenge;
  if (c.isRunning) return 'running';
  if (c.isCompleted) return 'completed';
  if (c.isUnlocked) return 'start';
  return 'locked';
});

const description = computed(() => {
  const c = props.challenge;
  if (c.isUnlocked) return c.config.description;
  return tp('infinity_X_times_to_unlock', c.config.lockedAt, formatInt(c.config.lockedAt));
});

const bottomText = computed(() => {
  const c = props.challenge;
  return `${t("reward")}: ${c.config.reward}`;
});

const label = computed(() => {
  switch (state.value) {
    case 'running':   return t('running');
    case 'completed': return t('completed');
    case 'locked':    return t('locked');
    default:          return t('start');
  }
});

function onClick() {
  console.log(state.value)
  if (state.value !== 'start' && state.value !== "completed") return;
  props.challenge.start();
}
</script>

<template>
  <div class="nc-box-container">
    <div class="nc-box__title">{{ t("nc_name_short", challenge.id) }}</div>
    <div class="nc-box" :class="`nc-box--${state}`">
      <div class="nc-box__desc">
        <div>{{ description }}</div>
        <EffectDisplay
          v-if="state === 'running'"
          :state="challenge"
        />
      </div>
      <button
        class="nc-box__btn"
        :class="`nc-box__btn--${state}`"
        @click="onClick"
      >
        {{ label }}
      </button>
      <div class="nc-box__bottom">{{ bottomText }}</div>
    </div>
  </div>
</template>

<style scoped>
.nc-box {
  display: flex;
  flex-direction: column;
  min-height: 16rem;
  padding: 0.3rem;
  background: var(--color-btn-bg);
  border: 0.2rem solid var(--color-challenge-border);
  border-radius: var(--radius-sm);
}

.nc-box__title {
  margin-top: 0.5rem;
  font-weight: bold;
  font-size: 1.3rem;
}

.nc-box__desc {
  flex: 18 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2;
  padding: 0 0.2rem;
  min-height: 0;
  flex-direction: column;
}

.nc-box__btn {
  flex: 8 1 0;
  margin: 0.3rem auto;
  font-family: inherit;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: var(--radius-lg);
  border: 0.3rem solid transparent;
  cursor: pointer;
  touch-action: manipulation;
  transition-duration: 0.15s;
  width: 70%;
  min-height: 0;
}

.nc-box__btn--start {
  color: var(--color-challenge-btn-color);
  background: var(--color-challenge-btn-default);
  border-color: var(--color-challenge-btn-border);
}

.nc-box__btn--running {
  color: var(--color-challenge-btn-color-completed);
  background: var(--color-challenge-running-bg);
  border-color: var(--color-challenge-btn-border);
  cursor: default;
}

.nc-box__btn--completed {
  color: var(--color-challenge-btn-color-completed);
  background: var(--color-challenge-completed);
  border-color: var(--color-challenge-btn-border);
  cursor: default;
}

.nc-box__btn--locked {
  color: var(--color-challenge-btn-color);
  background: var(--color-challenge-locked-bg);
  border-color: var(--color-challenge-locked-border);
  cursor: default;
}

.nc-box__btn:disabled {
  cursor: default;
  opacity: 1;
}

.nc-box__bottom {
  flex: 10 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2;
  padding: 0 0.2rem;
  min-height: 0;
}
</style>