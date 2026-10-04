<script setup>
import { Sacrifice } from '@/core/pre-infinity/sacrifice';
import { formatX } from '@/core/format';
import { computed } from "vue";

const visible = computed(() => Sacrifice.isVisible);
const canSacrifice = computed(() => Sacrifice.canSacrifice);
const next = computed(() => Sacrifice.nextBoost);
const total = computed(() => Sacrifice.totalBoost);
const disabledReason = computed(() => Sacrifice.disabledCondition);

const buttonText = computed(() => {
  if (canSacrifice.value) {
    return `Dimensional Sacrifice (${formatX(next.value, 2, 2)})`;
  }
  return `Sacrifice Disabled (${disabledReason.value})`;
});

function sacrifice() { Sacrifice.sacrifice(); }
</script>

<template>
  <div v-if="visible" class="sacrifice">
    <button class="sacrifice__btn" :disabled="!canSacrifice" @click="sacrifice">
      {{ buttonText }}
    </button>
    <div class="sacrifice__total">
      Total Sacrifice multiplier: {{ formatX(total, 2, 2) }}
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
  color: #000;
  background: #f6f6f6;
  border: 0.1rem solid #127a20;
  border-radius: 0.4rem;
  cursor: pointer;
}

.sacrifice__btn:disabled {
  background: #e3e3e3;
  border-color: #b82b3f;
  cursor: default;
}

.sacrifice__total {
  font-size: 1.1rem;
  color: #666;
}
</style>