<script setup>
import { Galaxy } from '@/core/pre-infinity/galaxy';
import { AntimatterDimension } from '@/core/dimensions/antimatter-dimension';
import { player } from '@/core/state/player';
import { formatInt } from '@/core/format';
import { computed } from "vue";

const count = computed(() => player.galaxies);
const tier = computed(() => Galaxy.requirement.tier);
const amount = computed(() => Galaxy.requirement.amount);
const satisfied = computed(() => Galaxy.requirement.isSatisfied);
const tierName = computed(() => AntimatterDimension(tier.value).shortDisplayName);

function buy() { Galaxy.buy(); }
</script>

<template>
  <div class="galaxy">
    <div class="galaxy__title">
      Antimatter Galaxies ({{ formatInt(count) }})
    </div>
    <div class="galaxy__req">
      Requires: {{ formatInt(amount) }} {{ tierName }} Dimensions
    </div>
    <button class="galaxy__btn" :disabled="!satisfied" @click="buy">
      Reset your Dimensions and Dimension Boosts
      to increase the power of Tickspeed upgrades
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
  color: #666;
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
  color: #000;
  background: #f6f6f6;
  border: 0.1rem solid #127a20;
  border-radius: 0.4rem;
  cursor: pointer;
}

.galaxy__btn:disabled {
  background: #e3e3e3;
  border-color: #b82b3f;
  cursor: default;
}
</style>