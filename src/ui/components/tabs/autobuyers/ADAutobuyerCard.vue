<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { Autobuyer } from '@/core/autobuyers';
import { format } from '@/core/format';
import { t, tp } from '@/i18n';

const props = defineProps({
  tier: { type: Number, required: true },
});

const ab = computed(() => Autobuyer.antimatterDimension(props.tier));

const title = computed(() =>
  t([null, '_1st_dimension_autobuyer', '_2nd_dimension_autobuyer', '_3rd_dimension_autobuyer',
     '_4th_dimension_autobuyer', '_5th_dimension_autobuyer', '_6th_dimension_autobuyer',
     '_7th_dimension_autobuyer', '_8th_dimension_autobuyer'][props.tier])
);

const state = computed(() => {
  const a = ab.value;
  if (a.isBought) return 'bought';
  if (a.canBeBought) return 'unlockable';
  return 'locked';
});

const costText = computed(() => format(ab.value.antimatterCost, 2, 0));

const requirementText = computed(() =>
  t('autobuyer_unlock_requirement_this_eternity', costText.value)
);

const intervalText = computed(() => {
  const seconds = ab.value.interval / 1000;
  return tp('current_interval', seconds, seconds.toFixed(3));
});

const modeLabel = computed(() =>
  ab.value.mode === '10' ? t('buys_until_10', 10) : t('buys_singles')
);

function toggleActive() { ab.value.isActive = !ab.value.isActive; }
function toggleMode() { ab.value.mode = ab.value.mode === '10' ? '1' : '10'; }
function purchase() { ab.value.purchase(); }
</script>

<template>
  <div
    class="ad-card"
    :class="{ 'ad-card--unlockable': state === 'unlockable' }"
  >
    <!-- Bought -->
    <template v-if="state === 'bought'">
      <label class="ad-card__header">
        <input
          type="checkbox"
          class="ad-checkbox"
          :checked="ab.isActive"
          :disabled="!player.auto.autobuyersOn"
          @change="toggleActive"
        />
        <span class="ad-card__title">{{ title }}</span>
      </label>
      <div class="ad-card__interval">{{ intervalText }}</div>
      <button class="ad-card__mode-btn" @click="toggleMode">
        {{ modeLabel }}
      </button>
    </template>

    <!-- Unlockable -->
    <template v-else-if="state === 'unlockable'">
      <div class="ad-card__title ad-card__title--top">{{ title }}</div>
      <button class="ad-card__unlock-btn" @click="purchase">
        <i class="fas fa-lock-open"></i>
        <span>{{ t('unlock') }}</span>
      </button>
    </template>

    <!-- Locked -->
    <template v-else>
      <div class="ad-card__title ad-card__title--top">{{ title }}</div>
      <div class="ad-card__req">{{ requirementText }}</div>
    </template>
  </div>
</template>

<style scoped>
.ad-card {
  display: flex;
  flex-direction: column;
  min-height: 18rem;
  padding: 1rem 1.2rem;
  background: rgba(0, 0, 0, 0.04);
  border: 0.1rem solid rgba(0, 0, 0, 0.10);
  border-radius: 1.2rem;
  text-align: center;
  position: relative;
}

.ad-card--unlockable {
  background: rgba(0, 0, 0, 0.10);
  border-color: var(--color-unlockable);
}

/* Bought: header top, interval below, mode button bottom */
.ad-card__header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
}

.ad-card__header .ad-card__title {
  flex: 1;
  text-align: center;
}

.ad-card__interval {
  margin-top: 0.2rem;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.60);
  text-align: center;
}

.ad-card__mode-btn {
  margin-top: 0.8rem;                /* autobuyer_header_body_gap */
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

.ad-card__mode-btn:active {
  background: var(--color-good-light);
}

/* Locked / Unlockable: title top, content bottom */
.ad-card__title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #000;
  line-height: 1.2;
}

.ad-card__title--top {
  text-align: center;
}

.ad-card__req {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.60);
  white-space: pre-line;
}

.ad-card__unlock-btn {
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

.ad-card__unlock-btn:active {
  background: rgba(0, 0, 0, 0.10);
}
</style>