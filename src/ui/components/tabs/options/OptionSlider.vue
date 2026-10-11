<script setup>
import RangeSlider from './RangeSlider.vue';

defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  values: { type: Array, default: null },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="option-slider">
    <div class="option-slider__label">{{ label }}</div>
    <RangeSlider
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :values="values"
      @update:model-value="$emit('update:modelValue', $event)"
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
  font-size: 1.1rem;
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
</style>