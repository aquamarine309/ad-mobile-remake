<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { Autobuyer } from '@/core/autobuyers';
import { format, formatPercents } from '@/core/format';
import { isInfinityUnlocked } from "@/core/progress";
import { t, tp } from '@/i18n';

const ab = Autobuyer.tickspeed;

const state = computed(() => {
  if (ab.isBought) return 'bought';
  if (ab.canBeBought) return 'unlockable';
  return 'locked';
});

const requirementText = computed(() => t('autobuyer_unlock_requirement_this_eternity', format(ab.antimatterCost, 2, 0)));

const intervalText = computed(() => {
  const seconds = ab.interval / 1000;
  return tp('current_interval', seconds, seconds.toFixed(3));
});

const modeLabel = computed(() =>
  ab.mode === 'max' ? t('buys_max') : t('buys_singles')
);

const canAffordUpgrade = computed(() => player.infinity.points.gte(ab.cost));

function toggleActive() { ab.isActive = !ab.isActive; }
function toggleMode() { ab.toggleMode(); }
function purchase() { ab.purchase(); }
function upgradeInterval() { ab.upgradeInterval(); }
</script>

<template>
  <div class="ts-card-wrapper">
    <div
      class="autobuyer-card"
      :class="{ 'autobuyer-card--unlockable': state === 'unlockable' }"
    >
      <template v-if="state === 'bought'">
        <label class="autobuyer-card__header">
          <input
            type="checkbox"
            class="ad-checkbox"
            :checked="ab.isActive"
          :class="{ 'ad-checkbox--disabled': !player.auto.autobuyersOn }"
            @change="toggleActive"
          />
          <span class="autobuyer-card__title">{{ t('tickspeed_autobuyer') }}</span>
        </label>
        <div class="autobuyer-card__interval">{{ intervalText }}</div>
        
        <template v-if="isInfinityUnlocked()">
          <button
            v-if="ab.canBeUpgraded"
            class="autobuyer-card__mode-btn"
            :class="{ 'autobuyer-card__mode-btn--disabled': ab.mode === 'single' }"
            @click="toggleMode"
          >
            {{ modeLabel }}
          </button>
          <button
            v-else
            class="autobuyer-card__mode-btn autobuyer-card__mode-btn--disabled"
            disabled
          >
            {{ t('complete_challenge_to_change_mode') }}
          </button>
        </template>

        <template v-if="isInfinityUnlocked() && !ab.hasMaxedInterval">
          <button
            v-if="ab.canBeUpgraded"
            class="autobuyer-card__mode-btn"
            :class="{ 'autobuyer-card__mode-btn--disabled': !canAffordUpgrade }"
            @click="upgradeInterval"
          >
            <span>{{ t('autobuyer_interval_reduction', formatPercents(0.4)) }}</span>
            <span>{{ tp('cost_X_infinity_points', ab.cost, format(ab.cost, 2, 0)) }}</span>
          </button>
          <button
            v-else
            class="autobuyer-card__mode-btn autobuyer-card__mode-btn--disabled"
            disabled
          >
            {{ t('complete_challenge_to_upgrade_interval') }}
          </button>
        </template>
      </template>

      <!-- Unlockable -->
      <template v-else-if="state === 'unlockable'">
        <div class="autobuyer-card__title autobuyer-card__title--top">{{ t('tickspeed_autobuyer') }}</div>
        <button class="autobuyer-card__unlock-btn" @click="purchase">
          <i class="fas fa-lock-open"></i>
          <span>{{ t('unlock') }}</span>
        </button>
      </template>

      <!-- Locked -->
      <template v-else>
        <div class="autobuyer-card__title autobuyer-card__title--top">{{ t('tickspeed_autobuyer') }}</div>
        <div class="autobuyer-card__req">{{ requirementText }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ts-card-wrapper {
  margin: 0 25%;
}
</style>