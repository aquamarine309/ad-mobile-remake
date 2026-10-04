<script setup>
defineProps({
  enabled: { type: Boolean, default: true },
});
</script>

<template>
  <button
    class="o-primary-btn"
    :disabled="!enabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<style scoped>
.o-primary-btn {
  width: 100%;
  font-family: inherit;
  font-size: 1.3rem;
  color: #000;
  background: #f6f6f6;
  border: 0.1rem solid #127a20;
  border-radius: 0.4rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  transition-duration: 0.15s;
}

.o-primary-btn:not(:disabled):active {
  background: #8bc599;
}

.o-primary-btn:disabled {
  background: #e3e3e3;
  border-color: #b82b3f;
  cursor: default;
}
</style>