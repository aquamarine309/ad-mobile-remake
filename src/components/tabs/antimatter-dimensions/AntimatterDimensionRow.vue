<script setup>
import { computed } from "vue";
import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { format, formatX, formatInt } from "@/core/format";
import { D } from "@/core/decimal";

const { tier } = defineProps({
  tier: { type: Number, required: true }
});
const dimension = computed(() => AntimatterDimension(tier));
const name = computed(() => `${dimension.value.shortDisplayName} Dimension`);
const amount = computed(() => dimension.value.amount);
const multiplier = computed(() => dimension.value.multiplier);
const boughtBefore10 = computed(() => dimension.value.boughtBefore10);
const howManyCanBuy = computed(() => dimension.value.howManyCanBuy);
const cost = computed(() => dimension.value.cost.times(Math.max(1, howManyCanBuy.value)));
const canBuy = computed(() =>
  dimension.value.isAvailableForPurchase && dimension.value.isAffordable
);
const rate = computed(() => dimension.value.rateOfChange);

const purchasedPercent = computed(() => dimension.value.boughtBefore10 * 10);
const possiblePercent = computed(() =>
  (dimension.value.boughtBefore10 + dimension.value.howManyCanBuy) * 10
);


const costThreshold = D("ee7");
const costText = computed(() => {
  const text = format(cost.value);
  if (cost.value.gte(costThreshold)) return text;
  return `Cost: ${text}`;
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
    <button
      class="dim-row__buy"
      :disabled="!canBuy"
      @click="buy"
    >
      <div
        class="dim-row__fill-possible"
        v-if="canBuy"
        :style="{ width: possiblePercent + '%' }"
      />
      <div
        class="dim-row__fill-purchased"
        :style="{ width: purchasedPercent + '%' }"
      />
      <span class="dim-row__buy-text">{{ costText }}</span>
    </button>
  </div>
</template>

<style scoped>
.dim-row {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.7rem 0.3rem 0;
  margin-top: 0.3rem;
}

.dim-row--even {
  background: rgba(33, 150, 243, 0.27);
}

.dim-row__name {
  flex: 15;
  min-width: 0;
  padding-left: 0.3rem;
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
  color: #666;
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
  color: #666;
  margin-top: -0.2rem;
}

.dim-row__buy {
  flex: 20;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  font-size: 1.2rem;
  color: #000;
  background: #f6f6f6;
  border: 0.1rem solid #127a20;
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
  background: #c8e6c9;
  z-index: 0;
}

.dim-row__fill-purchased {
  background: #5ac467;
  z-index: 1;
}

.dim-row__buy-text {
  position: relative;
  z-index: 2;
}

.dim-row__buy:disabled {
  background: #e3e3e3;
  border-color: #b82b3f;
  cursor: default;
}
</style>