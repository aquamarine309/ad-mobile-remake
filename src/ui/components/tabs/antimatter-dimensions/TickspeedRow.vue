<script setup>
import { Tickspeed } from '@/core/pre-infinity/tickspeed';
import { format, formatX } from '@/core/format';
import { computed } from "vue";
import { t } from "@/i18n";
import { isInfinityUnlocked } from '@/core/progress';

const isUnlocked = computed(() => Tickspeed.isUnlocked);
const cost = computed(() => Tickspeed.cost);
const base = computed(() => Tickspeed.base);
const multiplier = computed(() => Tickspeed.multiplier);
const canBuy = computed(() => Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable);

function buy() { Tickspeed.buy(); }
function buyMax() { Tickspeed.buyMax(); }
</script>

<template>
  <div v-if="isUnlocked || isInfinityUnlocked" class="tickspeed">
    <div class="tickspeed__label">
      {{ t("tickspeed_multiplier", formatX(base, 2, 3)) }}
    </div>
    <div class="tickspeed__buttons">
      <button class="tickspeed__btn" :disabled="!canBuy" @click="buy">
        {{ isUnlocked ? t("cost_X", format(cost)) : t("tickspeed_locked_text") }}
      </button>
      <button class="tickspeed__btn" :disabled="!canBuy" @click="buyMax">
        {{ t("buy_max") }}
      </button>
    </div>
    <div class="tickspeed__amount">
      {{ t("tickspeed", format(multiplier, 2, 3)) }}
    </div>
  </div>
</template>

<style scoped>
.tickspeed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.3rem 0.7rem;
  margin-top: 0.5rem;
}

.tickspeed__label,
.tickspeed__amount {
  font-size: 1.2rem;
  color: var(--color-text-muted);
}

.tickspeed__buttons {
  display: flex;
  gap: 0.4rem;
  margin: 0.1rem 0;
}

.tickspeed__btn {
  font-family: inherit;
  font-size: 1.2rem;
  min-width: 12rem;
  padding: 0.5rem 1rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  cursor: pointer;
}

.tickspeed__btn:disabled {
  background: var(--color-btn-bg-disabled);
  border-color: var(--color-bad);
  cursor: default;
}
</style>