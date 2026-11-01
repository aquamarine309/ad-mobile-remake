<script setup>
import { FAB_BUTTONS } from "@/ui/fab-buttons";
import { InputHold, stickyKey } from "@/core/loop/input-hold";
import { onUnmounted, computed } from "vue";
import { t } from "@/i18n";

const visibleButtons = computed(() => FAB_BUTTONS.filter((b) => b.isVisible()));

function isEnabled(btn) {
  return btn.isEnabled ? btn.isEnabled() : true;
}

function onPointerDown(btn, event) {
  try {
    event.currentTarget.setPointerCapture?.(event.pointerId);
  } catch {
    console.warn("Oh no.");
  }
  btn.action();
  InputHold.begin(btn.key, { action: btn.action });
}

function onPointerStop(btn) {
  InputHold.end(btn.key);
}

onUnmounted(() => {
  InputHold.clear();
});
</script>

<template>
  <div v-if="visibleButtons.length > 0" class="fab-row">
    <button
      v-for="btn in visibleButtons"
      :key="btn.key"
      class="fab-row__btn"
      :class="{
        'fab-row__btn--enabled': isEnabled(btn),
        'fab-row__btn--sticky': stickyKey === btn.key,
      }"
      @pointerdown="onPointerDown(btn, $event)"
      @pointerup="onPointerStop(btn)"
      @pointercancel="onPointerStop(btn)"
      @contextmenu.prevent
    >
      {{ t(`bottom_button_${btn.key}_short`) }}
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
  width: 5.6rem;
  height: 5.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--color-text);
  background: var(--color-fab-bg);
  border: none;
  border-radius: 50%;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  transition-duration: 0.15s;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  pointer-events: auto;
  position: relative;
}

.fab-row__btn--enabled {
  text-decoration: underline;
}

.fab-row__btn--sticky::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3); /* Android setToggled alpha 0.3 */
  pointer-events: none;
  border: 0.1rem solid var(--color-text);
}
</style>
