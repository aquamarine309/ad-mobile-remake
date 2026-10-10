<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  values: { type: Array, default: null }
});
const emit = defineEmits(['update:modelValue']);

const isDiscrete = computed(() => Array.isArray(props.values));
const sliderMin = computed(() => isDiscrete.value ? 0 : props.min);
const sliderMax = computed(() => isDiscrete.value ? props.values.length - 1 : props.max);
const sliderStep = computed(() => isDiscrete.value ? 1 : props.step);

const sliderValue = computed(() => {
  if (isDiscrete.value) {
    const i = props.values.indexOf(props.modelValue);
    return i >= 0 ? i : 0;
  }
  return props.modelValue;
});

const fillPercent = computed(() => {
  const range = sliderMax.value - sliderMin.value;
  if (range <= 0) return 0;
  return ((sliderValue.value - sliderMin.value) / range) * 100;
});

function onInput(e) {
  const v = Number(e.target.value);
  emit('update:modelValue', isDiscrete.value ? props.values[v] : v);
}
</script>

<template>
  <input
    class="range-slider"
    type="range"
    :min="sliderMin"
    :max="sliderMax"
    :step="sliderStep"
    :value="sliderValue"
    :style="{ '--fill-percent': fillPercent + '%' }"
    @input="onInput"
  />
</template>

<style scoped>
.range-slider {
  width: 100%;
  height: 2rem;
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* Chrome / Edge / Safari */
.range-slider::-webkit-slider-runnable-track {
  height: 0.3rem;
  background: linear-gradient(
    to right,
    var(--color-slider-fill) 0,
    var(--color-slider-fill) var(--fill-percent, 0%),
    var(--color-slider-track) var(--fill-percent, 0%),
    var(--color-slider-track) 100%
  );
  border-radius: 0.15rem;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.6rem;
  height: 1.6rem;
  background: var(--color-slider-fill);
  border-radius: 50%;
  margin-top: -0.65rem;
}

/* Firefox */
.range-slider::-moz-range-track {
  height: 0.3rem;
  background: var(--color-slider-track);
  border-radius: 0.15rem;
}

.range-slider::-moz-range-progress {
  height: 0.3rem;
  background: var(--color-slider-fill);
  border-radius: 0.15rem;
}

.range-slider::-moz-range-thumb {
  width: 1.6rem;
  height: 1.6rem;
  background: var(--color-slider-fill);
  border: none;
  border-radius: 50%;
}
</style>