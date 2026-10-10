<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  values: { type: Array, required: true },
});
const emit = defineEmits(['update:modelValue']);

const index = computed(() => {
  const i = props.values.indexOf(props.modelValue);
  return i >= 0 ? i : 0;
});

function onInput(e) {
  emit('update:modelValue', props.values[Number(e.target.value)]);
}
</script>

<template>
  <div class="option-slider">
    <div class="option-slider__label">{{ label }}</div>
    <input
      class="option-slider__range"
      type="range"
      :min="0"
      :max="values.length - 1"
      :step="1"
      :value="index"
      @input="onInput"
    />
  </div>
</template>

<style scoped>

.option-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  width: 100%;
  min-height: 6rem;
  padding: 0.5rem 0.6rem;
  font-size: 1.2rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  box-sizing: border-box;
}

.option-slider__label {
  white-space: pre-line;
  line-height: 1.2;
  text-align: center;
}

.option-slider__range {
  width: 100%;
  accent-color: var(--color-good);
}
</style>