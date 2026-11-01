<script setup>
import { computed } from "vue";
import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { format, formatX, formatInt } from "@/core/format";
import { D } from "@/core/decimal";
import { t } from "@/i18n";
import { NormalChallenge } from "@/core/challenges/normal";
import { DimBoost } from "@/core/pre-infinity/dimension-boost";
import { isInfinityUnlocked } from "@/core/progress";

const { tier } = defineProps({
  tier: { type: Number, required: true },
});
const dimension = computed(() => AntimatterDimension(tier));
const name = computed(() => dimension.value.name);
const amount = computed(() => dimension.value.amount);
const multiplier = computed(() => dimension.value.multiplier);
const howManyCanBuy = computed(() => dimension.value.howManyCanBuy);
const cost = computed(() =>
  dimension.value.cost.times(Math.max(1, howManyCanBuy.value)),
);
const canBuy = computed(
  () => dimension.value.isAvailableForPurchase && dimension.value.isAffordable,
);
const rate = computed(() => dimension.value.rateOfChange);

const purchasedPercent = computed(() => dimension.value.boughtBefore10 * 10);
const possiblePercent = computed(
  () => (dimension.value.boughtBefore10 + dimension.value.howManyCanBuy) * 10,
);

const c6Running = computed(() => NormalChallenge(6).isRunning);
const dimBoostReached = computed(() => DimBoost.purchasedBoosts.gte(tier - 4));
const infUnlocked = computed(() => isInfinityUnlocked());
const isVisible = computed(
  () =>
    (dimBoostReached.value || infUnlocked.value) &&
    DimBoost.maxDimensionsUnlockable >= tier,
);

const costThreshold = D("ee7");
const buttonText = computed(() => {
  const lastDimension = AntimatterDimension(tier - 1);
  if (!dimBoostReached.value)
    return t("dimension_locked_dimboost", formatInt(tier - 4));
  if (tier >= 2 && lastDimension.totalAmount.eq(0)) {
    return t(
      "dimension_locked_buy_previous_dimension",
      lastDimension.shortName,
    );
  }
  const text = format(cost.value);
  if (cost.value.gte(costThreshold)) return text;
  if (tier >= 3 && c6Running.value)
    return `${text} ${AntimatterDimension(tier - 2).shortName}`;
  return t("cost_X", text);
});

function formatAmount(value) {
  if (tier === 8) return formatInt(value);
  return format(value, 2);
}

function buy() {
  dimension.value.buyUntil10();
}
</script>

<template>
  <div
    v-if="isVisible"
    class="dim-row"
    :class="{ 'dim-row--even': tier % 2 === 0 }"
  >
    <div class="dim-row__name">
      <div>{{ name }}</div>
      <div class="dim-row__mult">{{ formatX(multiplier, 2, 1) }}</div>
    </div>
    <div class="dim-row__amount">
      <div class="dim-row__amount-value">{{ formatAmount(amount, 2) }}</div>
      <div class="dim-row__rate">(+{{ format(rate.times(100), 2, 2) }}%)</div>
    </div>
    <button class="dim-row__buy" :disabled="!canBuy" @click="buy">
      <div
        v-if="canBuy"
        class="dim-row__fill-possible"
        :style="{ width: possiblePercent + '%' }"
      />
      <div
        class="dim-row__fill-purchased"
        :style="{ width: purchasedPercent + '%' }"
      />
      <span class="dim-row__buy-text">{{ buttonText }}</span>
    </button>
  </div>
</template>

<style scoped>
.dim-row {
  display: flex;
  align-items: center;
  padding: 0 0.7rem 0 0;
  margin-top: 0.3rem;
}

.dim-row__name {
  flex: 13;
  min-width: 0;
  padding-left: 0.3rem;
}

.dim-row--even {
  background: var(--color-row-even);
}

.dim-row__name > div:first-child {
  font-size: 1.1rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dim-row__mult {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-top: -0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dim-row__amount {
  flex: 20;
  text-align: center;
}

.dim-row__amount-value {
  font-size: 1.4rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dim-row__rate {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: -0.2rem;
}

.dim-row__buy {
  flex: 20;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  font-size: 1.2rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  padding: 0.5rem 0.7rem;
  cursor: pointer;
  height: 2.8rem;
  text-overflow: ellipsis;
}

.dim-row__fill-possible,
.dim-row__fill-purchased {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.dim-row__fill-possible {
  background: var(--color-dim-fill-possible);
  z-index: 0;
}

.dim-row__fill-purchased {
  background: var(--color-dim-fill-purchased);
  z-index: 1;
}

.dim-row__buy-text {
  position: relative;
  z-index: 2;
}

.dim-row__buy:disabled {
  background: var(--color-btn-bg-disabled);
  border-color: var(--color-bad);
  cursor: default;
}
</style>
