<script setup>
import { Sacrifice } from '@/core/pre-infinity/sacrifice';
import { formatX } from '@/core/format';
import { computed } from "vue";
import { t } from "@/i18n";

const visible = computed(() => Sacrifice.isVisible);
const canSacrifice = computed(() => Sacrifice.canSacrifice);
const next = computed(() => Sacrifice.nextBoost);
const total = computed(() => Sacrifice.totalBoost);
const disabledReason = computed(() => Sacrifice.disabledCondition);

const buttonText = computed(() => {
  if (canSacrifice.value) {
    return t("sacrifice_next_multiplier", formatX(next.value, 2, 2));
  }
  return t("sacrifice_locked_text", disabledReason.value);
});

function sacrifice() { Sacrifice.sacrifice(); }
</script>

<template>
  <div v-if="visible" class="sacrifice">
    <button class="sacrifice__btn" :disabled="!canSacrifice" @click="sacrifice">
      {{ buttonText }}
    </button>
    <div class="sacrifice__total">
      {{ t("sacrifice_total_multiplier", formatX(total, 2, 2)) }}
    </div>
  </div>
</template>

<style scoped>
.sacrifice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.4rem 0.7rem;
}

.sacrifice__btn {
  min-width: 22rem;
  height: 3rem;
  font-family: inherit;
  font-size: 1.2rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  cursor: pointer;
}

.sacrifice__btn:disabled {
  background: var(--color-btn-bg-disabled);
  border-color: var(--color-bad);
  cursor: default;
}

.sacrifice__total {
  font-size: 1.1rem;
  color: var(--color-text-muted);
}
</style>