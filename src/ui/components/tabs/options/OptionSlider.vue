<script setup>
const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
});
const emit = defineEmits(['update:modelValue']);

function onInput(e) {
  emit('update:modelValue', Number(e.target.value));
}
</script>

<template>
  <div class="option-slider">
    <div class="option-slider__label">{{ label }}</div>
    <input
      class="option-slider__range"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
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