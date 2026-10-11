<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },   // [{ value, label }]
});
const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const rootRef = ref(null);
const panelAbove = ref(false);

const currentLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue);
  return opt ? opt.label : '';
});

function toggle() {
  if (open.value) {
    open.value = false;
    return;
  }
  if (rootRef.value) {
    const rect = rootRef.value.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom;
    const estHeight = Math.min(400, props.options.length * 44);
    panelAbove.value = spaceBelow < estHeight && rect.top > spaceBelow;
  }
  open.value = true;
}

function select(opt) {
  emit('update:modelValue', opt.value);
  open.value = false;
}

function onDocumentClick(e) {
  if (!open.value) return;
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick));
onUnmounted(() => document.removeEventListener('click', onDocumentClick));
</script>

<template>
  <div ref="rootRef" class="option-dropdown">
    <button class="option-dropdown__card" @click.stop="toggle">
      <span class="option-dropdown__label">{{ label }}</span>
      <span class="option-dropdown__value">{{ currentLabel }}</span>
    </button>
    <Transition name="dropdown">
      <div
        v-if="open"
        class="option-dropdown__panel"
        :class="{ 'option-dropdown__panel--above': panelAbove }"
        @click.stop
      >
        <button
          v-for="opt in options"
          :key="opt.value"
          class="option-dropdown__item"
          :class="{ 'option-dropdown__item--selected': opt.value === modelValue }"
          @click="select(opt)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.option-dropdown {
  position: relative;
  width: 100%;
}

.option-dropdown__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  width: 100%;
  min-height: 6rem;
  padding: 0.5rem 0.3rem;
  font-family: inherit;
  font-size: 1.2rem;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
}

.option-dropdown__label {
  white-space: pre-line;
  line-height: 1.2;
}

.option-dropdown__value {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.2;
}

.option-dropdown__panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--z-modal);
  max-height: 24rem;
  overflow-y: auto;
  background: var(--color-bg);
  border: 0.1rem solid var(--color-good);
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.25);
  margin-top: 0.2rem;
  transform-origin: top center;
}

.option-dropdown__panel--above {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 0.2rem;
  transform-origin: bottom center;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: transform 0.15s linear;
}

.dropdown-enter-from,
.dropdown-leave-to {
  transform: scaleY(0);
}

.option-dropdown__item {
  display: block;
  width: 100%;
  padding: 0.9rem 0.5rem;
  font-family: inherit;
  font-size: 1.2rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
}

.option-dropdown__item:active {
  background: var(--color-good-light);
}

.option-dropdown__item--selected {
  background: var(--color-good-light);
}
</style>