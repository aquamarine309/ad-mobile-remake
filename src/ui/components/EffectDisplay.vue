<script setup>
import { computed } from 'vue';
import { t } from '@/i18n';

const { state } = defineProps({
  state: { type: Object, required: true },
});

const isCapped = computed(() => {
  const cap = state.config.cap;
  if (!cap) return false;
  const capValue = cap();
  return state.effect().gte(capValue);
});

const effectStr = computed(() => {
  const format = state.config.formatEffect;
  const value = state.effect();
  return format(value);
});

const label = computed(() => t(isCapped.value ? 'capped' : 'currently'));
</script>

<template>
  <span v-if="state.config.formatEffect" class="effect-display">
    {{ label }}: {{ effectStr }}
  </span>
</template>