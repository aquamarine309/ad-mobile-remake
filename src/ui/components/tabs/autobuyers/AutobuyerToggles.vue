<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { formatInt } from '@/core/format';
import { Autobuyer, Autobuyers } from '@/core/autobuyers';
import { t } from '@/i18n';

const enabledLabel = computed(() =>
  player.auto.autobuyersOn ? t('autobuyers_enabled') : t('autobuyers_disabled')
);

const adModeLabel = computed(() => t('toggle_buy_until_10', formatInt(10)));

const allMax = computed(() => Autobuyer.antimatterDimensions.every(a => a.mode === '10'));
</script>

<template>
  <div class="autobuyer-toggles">
    <button
      class="autobuyer-toggles__btn"
      :class="{'autobuyer-toggles__btn--disabled': !player.auto.autobuyersOn }"
      @click="player.auto.autobuyersOn = !player.auto.autobuyersOn"
    >
      {{ enabledLabel }}
    </button>
    <button
      class="autobuyer-toggles__btn"
      @click="Autobuyers.toggleAll()"
    >
      {{ t('toggle_all_autobuyers') }}
    </button>
    <button
      class="autobuyer-toggles__btn"
      :class="{'autobuyer-toggles__btn--disabled': !allMax }"
      @click="Autobuyers.toggleADMode()"
    >
      {{ adModeLabel }}
    </button>
  </div>
</template>

<style scoped>
.autobuyer-toggles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.autobuyer-toggles__btn {
  min-height: 4.6rem;
  padding: 0.5rem 0.3rem;
  font-family: inherit;
  font-size: 1.4rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-unlockable);
  border-radius: 0.6rem;
  white-space: pre-line;
  line-height: 1.2;
  cursor: pointer;
  text-align: center;
}

.autobuyer-toggles__btn--disabled {
  border-color: var(--color-card-border);
}

.autobuyer-toggles__btn:active {
  background: var(--color-btn-bg-disabled);
  border-color: var(--color-unlockable);
}
</style>