<script setup>
import { Galaxy } from '@/core/pre-infinity/galaxy';
import { AntimatterDimension } from '@/core/dimensions/antimatter-dimension';
import { player } from '@/core/state/player';
import { formatInt } from '@/core/format';
import { computed } from "vue";
import { t } from "@/i18n";

const title = computed(() => Galaxy.title);
const tier = computed(() => Galaxy.requirement.tier);
const amount = computed(() => Galaxy.requirement.amount);
const satisfied = computed(() => Galaxy.requirement.isSatisfied);
const tierName = computed(() => AntimatterDimension(tier.value).shortName);

function buy() { Galaxy.buy(); }
</script>

<template>
  <div class="galaxy">
    <div class="galaxy__title">
      {{ title }}
    </div>
    <div class="galaxy__req">
      {{ t("requires_X_dimension", formatInt(amount), tierName) }}
    </div>
    <button class="galaxy__btn" :disabled="!satisfied" @click="buy">
      {{ t("galaxy_button") }}
    </button>
  </div>
</template>

<style scoped>
.galaxy {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
}

.galaxy__title {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}

.galaxy__req {
  font-size: 1rem;
  color: var(--color-text-muted);
  text-align: center;
}

.galaxy__btn {
  width: 100%;
  height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.3;
  text-align: center;
  padding: 0.5rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  cursor: pointer;
}

.galaxy__btn:disabled {
  background: var(--color-btn-bg-disabled);
  border-color: var(--color-bad);
  cursor: default;
}
</style>