<script setup>
import { computed } from 'vue';
import { t, tp } from '@/i18n';
import { format } from '@/core/format';
import EffectDisplay from '@/ui/components/EffectDisplay';

const props = defineProps({
  upgrade: { type: Object, required: true },
});

const stateClass = computed(() => {
  const u = props.upgrade;
  if (u.isBought) return 'upgrade-cell--bought';
  if (!u.isAvailableForPurchase) return 'upgrade-cell--unavailable';
  if (!u.canBeBought) return 'upgrade-cell--unaffordable';
  return 'upgrade-cell--purchasable';
});

const desc = computed(() => props.upgrade.config.description);

const effectStr = computed(() => {
  const c = props.upgrade.config;
  if (!c.formatEffect) return '';
  const v = c.effect?.() ?? 0;
  return c.formatEffect(v);
});

const cost = computed(() => props.upgrade.cost);

function click() {
  props.upgrade.purchase();
}
</script>

<template>
  <button
    class="upgrade-cell"
    :class="stateClass"
    :disabled="!upgrade.canBeBought"
    @click="click"
  >
    <span class="upgrade-cell__desc">{{ desc }}</span>
    <EffectDisplay :state="upgrade" />
    <span v-if="!upgrade.isBought" class="upgrade-cell__cost">
      {{ tp('cost_X_infinity_points', cost, format(cost)) }}
    </span>
  </button>
</template>

<style scoped>
.upgrade-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  height: 10.8rem;
  padding: 0.5rem;                 /* start_end_padding 5dp */
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  border-radius: 1rem;             /* corner_radius_big 10dp */
  border: 0.1rem solid transparent;/* 1dp stroke */
  cursor: pointer;
  touch-action: manipulation;
  overflow: hidden;
}

.upgrade-cell__desc,
.upgrade-cell__cost {
  font-size: 1.2rem;
  line-height: 1.2;
  word-break: break-word;
}

.upgrade-cell--purchasable {
  color: var(--color-appbar-fg);
  background: var(--color-upgrade-purchasable-bg);
  border-color: var(--color-infinity-border);
}

.upgrade-cell--unavailable {
  opacity: 0.5;
}

.upgrade-cell--unaffordable,
.upgrade-cell--unavailable {
  color: #000;
  background: var(--color-upgrade-unavailable-bg);
  border-color: var(--color-border-disabled);
}

.upgrade-cell--bought {
  color: #000;
  background: var(--color-infinity);
  border-color: #000;
}
</style>