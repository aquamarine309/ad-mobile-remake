<script setup>
import { t } from '@/i18n';
import { bigCrunchReset } from '@/core/prestige/big-crunch';

const { isLateGame } = defineProps({ isLateGame: Boolean, default: false });
</script>

<template>
  <div class="big-crunch">
    <div
      v-if="!isLateGame"
      class="big-crunch__text"
    >{{ t('the_world_has_collapsed') }}</div>
    <button class="big-crunch__btn" @click="bigCrunchReset">
      {{ t('big_crunch') }}
    </button>
  </div>
</template>

<style scoped>
.big-crunch {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
}

.big-crunch__text {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.big-crunch__btn {
  font-family: inherit;
  font-size: 2.6rem;
  font-weight: bold;
  color: var(--color-infinity);
  background: var(--color-top-button-bg);
  border: 0.3rem solid var(--color-infinity-border);
  border-radius: var(--radius-sm);
  padding: 0.8rem 3rem 1rem;
  cursor: pointer;
  touch-action: manipulation;
}

.big-crunch__btn:active {
  background: var(--color-card-fill-active);
}
</style>