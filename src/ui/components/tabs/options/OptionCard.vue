<script setup>
defineProps({
  label: { type: String, required: true },
  bad: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

<template>
  <button
    class="option-card"
    :class="{ 'option-card--bad': bad }"
    @click="$emit('click')"
  >
    <span class="option-card__label">{{ label }}</span>
  </button>
</template>

<style scoped>

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 6rem;
  padding: 0.5rem 0.3rem;
  font-family: inherit;
  font-size: 1.1rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  cursor: pointer;
  text-align: center;
}

.option-card:not(.option-card--bad):active {
  background: var(--color-good-light);
}

.option-card__label {
  white-space: pre-line;
  line-height: 1.2;
}

.option-card--bad {
  border-color: var(--color-bad);
}
</style>