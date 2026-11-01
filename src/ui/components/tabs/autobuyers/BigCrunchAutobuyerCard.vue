<script setup>
import { computed } from "vue";
import { player } from "@/core/state/player";
import { Autobuyer } from "@/core/autobuyers";
import { format, formatPercents } from "@/core/format";
import { isInfinityUnlocked } from "@/core/progress";
import { t, tp } from "@/i18n";
import AutobuyerInput from "./AutobuyerInput";

const ab = Autobuyer.bigCrunch;

const state = computed(() => {
  if (ab.isBought) return "bought";
  return "locked";
});

const intervalText = computed(() => {
  const seconds = ab.interval / 1000;
  return tp("current_interval", seconds, format(seconds, 3, 3));
});

const canAffordUpgrade = computed(() => player.infinity.points.gt(ab.cost));

function toggleActive() {
  ab.isActive = !ab.isActive;
}
function upgradeInterval() {
  ab.upgradeInterval();
}
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
        <span class="autobuyer-card__title">{{
          t("automatic_big_crunch")
        }}</span>
      </label>
      <div class="autobuyer-card__interval">{{ intervalText }}</div>

      <!-- Settings Section -->
      <div v-if="player.break" class="settings-section">
        <label class="setting-row">
          <span>{{ t("auto_crunch_mode_amount") }}</span>
        </label>
        <AutobuyerInput :autobuyer="ab" property="amount" type="decimal" />
      </div>

      <!-- Upgrade Section -->
      <template v-if="isInfinityUnlocked()">
        <template v-if="ab.canBeUpgraded">
          <button
            v-if="!ab.hasMaxedInterval"
            class="autobuyer-card__mode-btn"
            :class="{ 'autobuyer-card__mode-btn--disabled': !canAffordUpgrade }"
            @click="upgradeInterval"
          >
            <span>{{
              t("autobuyer_interval_reduction", formatPercents(0.4))
            }}</span>
            <span>{{
              tp("cost_X_infinity_points", ab.cost, format(ab.cost, 2, 0))
            }}</span>
          </button>
        </template>
        <template v-else>
          <button
            class="autobuyer-card__mode-btn autobuyer-card__mode-btn--disabled"
            disabled
          >
            {{ t("complete_challenge_to_upgrade_interval") }}
          </button>
        </template>
      </template>
    </template>
  </div>
</template>
