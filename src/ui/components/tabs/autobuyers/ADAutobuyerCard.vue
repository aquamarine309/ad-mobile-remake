<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { Autobuyer } from '@/core/autobuyers';
import { format, formatPercents, formatX } from '@/core/format';
import { isInfinityUnlocked } from "@/core/progress";
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
const requirementText = computed(() => t('autobuyer_unlock_requirement_this_eternity', costText.value));

const intervalText = computed(() => {
  const seconds = ab.value.interval / 1000;
  return tp('current_interval', seconds, seconds.toFixed(3));
});

const modeLabel = computed(() =>
  ab.value.mode === '10' ? t('buys_until_10', 10) : t('buys_singles')
);

const canAffordUpgrade = computed(() => player.infinity.points.gte(ab.value.cost));

function toggleActive() { ab.value.isActive = !ab.value.isActive; }
function toggleMode() { ab.value.toggleMode(); }
function purchase() { ab.value.purchase(); }
function upgradeInterval() { ab.value.upgradeInterval(); }
function upgradeBulk() { ab.value.upgradeBulk(); }
</script>

<template>
  <div
    class="autobuyer-card"
    :class="{ 'autobuyer-card--unlockable': state === 'unlockable' }"
  >
    <template v-if="state === 'bought'">
      <label class="autobuyer-card__header">
        <input
          type="checkbox"
          class="ad-checkbox"
          :class="{ 'ad-checkbox--disabled': !player.auto.autobuyersOn }"
          :checked="ab.isActive"
          @change="toggleActive"
        />
        <span class="autobuyer-card__title">{{ title }}</span>
      </label>
      <div class="autobuyer-card__interval">{{ intervalText }}</div>
      
      <button
        class="autobuyer-card__mode-btn" @click="toggleMode"
        :class="{ 'autobuyer-card__mode-btn--disabled': ab.mode === '1' }"
      >
        {{ modeLabel }}
      </button>
  
      <template v-if="isInfinityUnlocked()">
        <template v-if="ab.canBeUpgraded">
          <!-- Interval Upgrade -->
          <button
            v-if="!ab.hasMaxedInterval"
            class="autobuyer-card__mode-btn"
            :class="{ 'autobuyer-card__mode-btn--disabled': !canAffordUpgrade }"
            @click="upgradeInterval"
          >
            <span>{{ t('autobuyer_interval_reduction', formatPercents(0.4)) }}</span>
            <span>{{ tp('cost_X_infinity_points', ab.cost, format(ab.cost, 2, 0)) }}</span>
          </button>
    
          <!-- Bulk Upgrade -->
          <button
            v-else-if="!ab.hasUnlimitedBulk"
            class="autobuyer-card__mode-btn"
            :class="{ 'autobuyer-card__mode-btn--disabled': !canAffordUpgrade }"
            @click="upgradeBulk"
          >
            <span v-if="ab.bulk == ab.bulkCap">
              {{ t("X_bulk_buy_capped", formatX(ab.bulk, 2, 0)) }}
            </span>
            <template v-else>
              <span>
                {{ t('X_bulk_buy', `${formatX(ab.bulk, 2, 0)} ➜ ${formatX(ab.bulk * 2, 2, 0)}`) }}
              </span>
              <span>{{ tp('cost_X_infinity_points', ab.cost, format(ab.cost, 2, 0)) }}</span>
            </template>
          </button>
        </template>
        <template v-else>
          <button class="autobuyer-card__mode-btn autobuyer-card__mode-btn--disabled" disabled>
            {{ t('complete_challenge_to_upgrade_interval') }}
          </button>
        </template>
      </template>
    </template>

    <!-- Unlockable -->
    <template v-else-if="state === 'unlockable'">
      <div class="autobuyer-card__title autobuyer-card__title--top">{{ title }}</div>
      <button class="autobuyer-card__unlock-btn" @click="purchase">
        <i class="fas fa-lock-open"></i>
        <span>{{ t('unlock') }}</span>
      </button>
    </template>

    <!-- Locked -->
    <template v-else>
      <div class="autobuyer-card__title autobuyer-card__title--top">{{ title }}</div>
      <div class="autobuyer-card__req">{{ requirementText }}</div>
    </template>
  </div>
</template>