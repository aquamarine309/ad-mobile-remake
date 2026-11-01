<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { Autobuyer } from '@/core/autobuyers';
import { format, formatPercents } from '@/core/format';
import { isInfinityUnlocked } from "@/core/progress";
import { t, tp } from '@/i18n';
import AutobuyerInput from "./AutobuyerInput";

const ab = Autobuyer.galaxy;

const state = computed(() => {
  if (ab.isBought) return 'bought';
  return 'locked';
});

const intervalText = computed(() => {
  const seconds = ab.interval / 1000;
  return tp('current_interval', seconds, seconds.toFixed(3));
});

const canAffordUpgrade = computed(() => player.infinity.points.gt(ab.cost));

function toggleActive() { ab.isActive = !ab.isActive; }
function upgradeInterval() { ab.upgradeInterval(); }
</script>

<template>
  <div class="autobuyer-card">
    <template v-if="state === 'bought'">
      <label class="autobuyer-card__header">
        <input
          type="checkbox"
          class="ad-checkbox"
          :class="{ 'ad-checkbox--disabled': !player.auto.autobuyersOn }"
          :checked="ab.isActive"
          @change="toggleActive"
        />
        <span class="autobuyer-card__title">{{ t('automatic_galaxies') }}</span>
      </label>
      <div class="autobuyer-card__interval">{{ intervalText }}</div>

      <!-- Upgrade Section -->
      <template v-if="isInfinityUnlocked()">
        <template v-if="ab.canBeUpgraded">
          <button
            v-if="!ab.hasMaxedInterval"
            class="autobuyer-card__mode-btn"
            :class="{ 'autobuyer-card__mode-btn--disabled': !canAffordUpgrade }"
            @click="upgradeInterval"
          >
            <span>{{ t('autobuyer_interval_reduction', formatPercents(0.4)) }}</span>
            <span>{{ tp('cost_X_infinity_points', ab.cost, format(ab.cost, 2, 0)) }}</span>
          </button>
        </template>
        <template v-else>
          <button class="autobuyer-card__mode-btn autobuyer-card__mode-btn--disabled" disabled>
            {{ t('complete_challenge_to_upgrade_interval') }}
          </button>
        </template>
      </template>
      
      <!-- Settings Section -->
      <div class="settings-section">
        <label class="setting-row">
          <input
            type="checkbox"
            class="ad-checkbox"
            :class="{ 'autobuyer-card__mode-btn--disabled': !canAffordUpgrade }"
            :checked="ab.limitGalaxies"
            @change="ab.limitGalaxies = !ab.limitGalaxies"
          />
          <span>{{ t('limit_galaxies_to') }}</span>
        </label>
        <AutobuyerInput :autobuyer="ab" property="maxGalaxies" type="int" />
      </div>
    </template>

    <!-- Locked -->
    <template v-else>
      <div class="autobuyer-card__title autobuyer-card__title--top">{{ t('galaxy_autobuyer') }}</div>
      <div class="autobuyer-card__req">{{ t('complete_challenge_to_unlock', 11) }}</div>
    </template>
  </div>
</template>

<style scoped>

</style>