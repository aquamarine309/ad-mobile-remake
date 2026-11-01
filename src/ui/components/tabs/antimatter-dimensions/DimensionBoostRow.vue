<script setup>
import { DimBoost } from '@/core/pre-infinity/dimension-boost';
import { AntimatterDimension } from '@/core/dimensions/antimatter-dimension';
import { formatInt } from '@/core/format';
import { computed } from "vue";
import { t } from "@/i18n";

const count = computed(() => DimBoost.purchasedBoosts);
const tier = computed(() => DimBoost.requirement.tier);
const amount = computed(() => DimBoost.requirement.amount);
const satisfied = computed(() => DimBoost.canBeBought && DimBoost.requirement.isSatisfied);
const tierName = computed(() => AntimatterDimension(tier.value).shortName);
const buttonText = computed(() => DimBoost.unlockedByBoost);

function buy() { DimBoost.buy(); }
</script>

<template>
  <div class="boost">
    <div class="boost__title">{{ t("dimension_boost", formatInt(count)) }}</div>
    <div class="boost__req">
      {{ t("requires_X_dimension", formatInt(amount), tierName) }}
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
  color: var(--color-text-muted);
  text-align: center;
}

.boost__btn {
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.3;
  padding: 0.5rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  cursor: pointer;
  height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boost__btn:disabled {
  background: var(--color-btn-bg-disabled);
  border-color: var(--color-bad);
  cursor: default;
}
</style>