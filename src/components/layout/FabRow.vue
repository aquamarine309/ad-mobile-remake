<script setup>
import { FAB_BUTTONS } from '@/core/secret-formula/fab-buttons';
import { onUnmounted } from 'vue';
import { computed } from "vue";

const visibleButtons = computed(() =>
  FAB_BUTTONS.filter(b => b.isVisible())
);

function isEnabled(btn) {
  return btn.isEnabled ? btn.isEnabled() : true;
}

const timers = new Map();

function stopRepeat(key) {
  const t = timers.get(key);
  if (!t) return;
  clearTimeout(t.delay);
  clearInterval(t.repeat);
  timers.delete(key);
}

function onPointerDown(btn) {
  stopRepeat(btn.key);
  btn.action();

  const interval = btn.key === 'maxAll' ? 50 : 25;
  const t = { delay: null, repeat: null };

  t.delay = setTimeout(() => {
    t.repeat = setInterval(() => {
      btn.action();
    }, interval);
  }, 200);

  timers.set(btn.key, t);
}

function onPointerUp(btn) {
  stopRepeat(btn.key);
}

onUnmounted(() => {
  for (const key of timers.keys()) stopRepeat(key);
});
</script>

<template>
  <div v-if="visibleButtons.length > 0" class="fab-row">
    <button
      v-for="btn in visibleButtons"
      :key="btn.key"
      class="fab-row__btn"
      :class="{ 'fab-row__btn--enabled': isEnabled(btn) }"
      @pointerdown="onPointerDown(btn)"
      @pointerup="onPointerUp(btn)"
      @pointerleave="onPointerUp(btn)"
      @pointercancel="onPointerUp(btn)"
      @contextmenu.prevent
    >
      {{ btn.label }}
    </button>
  </div>
</template>

<style scoped>
.fab-row {
  display: flex;
  gap: 0.6rem;
  flex-direction: row-reverse;
  padding: 0.5rem;
  pointer-events: none;
}

.fab-row__btn {
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: bold;
  color: #000;
  background: #C5DCD9;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  transition-duration: 0.15s;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  pointer-events: auto;
}

.fab-row__btn--enabled {
  text-decoration: underline;
}

.fab-row__btn:active {
  
}

.fab-row__btn:not(.fab-row__btn--enabled):active {
  transform: none;
}
</style>