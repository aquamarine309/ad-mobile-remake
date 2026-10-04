<script setup>
import { DimBoost } from '@/core/pre-infinity/dimension-boost';
import { AntimatterDimension } from '@/core/dimensions/antimatter-dimension';
import { formatInt } from '@/core/format';
import { computed } from "vue";

const count = computed(() => DimBoost.purchasedBoosts);
const tier = computed(() => DimBoost.requirement.tier);
const amount = computed(() => DimBoost.requirement.amount);
const satisfied = computed(() => DimBoost.requirement.isSatisfied);
const tierName = computed(() => AntimatterDimension(tier.value).shortDisplayName);
const buttonText = computed(() => DimBoost.unlockedByBoost);

function buy() { DimBoost.buy(); }
</script>

<template>
  <div class="boost">
    <div class="boost__title">Dimension Boost ({{ formatInt(count) }})</div>
    <div class="boost__req">
      Requires: {{ formatInt(amount) }} {{ tierName }} Dimensions
    </div>
    <button class="boost__btn" :disabled="!satisfied" @click="buy">
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
.boost {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
}

.boost__title {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}

.boost__req {
  font-size: 1rem;
  color: #666;
  text-align: center;
}

.boost__btn {
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.3;
  padding: 0.5rem;
  color: #000;
  background: #f6f6f6;
  border: 0.1rem solid #127a20;
  border-radius: 0.4rem;
  cursor: pointer;
  height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boost__btn:disabled {
  background: #e3e3e3;
  border-color: #b82b3f;
  cursor: default;
}
</style>