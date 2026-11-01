<script setup>
import { t } from "@/i18n";
import EffectDisplay from '@/ui/components/EffectDisplay';

defineProps({
  achievement: { type: Object, required: true },
  position: { type: Object, required: true },
  arrowOffset: { type: Number, default: 0 },
  isSecret: { type: Boolean, default: false }
});

const formattedEffect = (() => {
  return achievement.config.formatEffect(achievement.effectValue);
});
</script>

<template>
  <div
    class="achievement-tooltip"
    :class="`achievement-tooltip--${position.placement}`"
    :style="{
      left: position.left + 'px',
      top: position.top + 'px',
      '--arrow-offset': arrowOffset + 'px',
    }"
    @click.stop
  >
    <div class="achievement-tooltip__title">
      {{ achievement.name }} ({{ achievement.id }})
    </div>
    <div
      v-if="!isSecret || achievement.isUnlocked"
      class="achievement-tooltip__desc"
    >
      {{ achievement.description }}
    </div>
    <template v-if="achievement.reward">
      <div class="achievement-tooltip__desc">{{ t("reward")}}: {{ achievement.reward }}</div>
      <EffectDisplay :state="achievement" />
    </template>
  </div>
</template>

<style scoped>
.achievement-tooltip {
  --base-transform: translateX(-50%);
  position: fixed;
  z-index: 100;
  width: 24rem;
  max-width: 85vw;
  padding: var(--gap-sm) var(--gap-md);
  background: var(--color-tooltip-bg);
  border-radius: var(--radius-sm);
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.4);
  transform: var(--base-transform);
  text-align: center;
}

.achievement-tooltip--below {
  --base-transform: translateX(-50%);
  transform-origin: calc(50% + var(--arrow-offset, 0px)) top;
}

.achievement-tooltip--above {
  --base-transform: translate(-50%, -100%);
  transform-origin: calc(50% + var(--arrow-offset, 0px)) bottom;
}

.achievement-tooltip--middle {
  --base-transform: translate(-50%, -50%);
  transform-origin: center;
}


/* Arrow — a small CSS triangle pointing at the cell */
.achievement-tooltip::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  left: calc(50% + var(--arrow-offset, 0px));
  transform: translateX(-50%);
}

.achievement-tooltip--below::before {
  bottom: 100%;
  border-width: 0 0.7rem 0.7rem;
  border-color: transparent transparent var(--color-tooltip-bg);
}

.achievement-tooltip--above::before {
  top: 100%;
  border-width: 0.7rem 0.7rem 0;
  border-color: var(--color-tooltip-bg) transparent transparent;
}

.achievement-tooltip--middle::before {
  display: none;
}

.achievement-tooltip__title {
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: var(--gap-xs);
}

.achievement-tooltip__desc {
  font-size: 1.2rem;
  line-height: 1.5;
}

.achievement-tooltip-enter-active,
.achievement-tooltip-leave-active {
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;
}

.achievement-tooltip-enter-from,
.achievement-tooltip-leave-to {
  transform: var(--base-transform) scale(0);
  opacity: 0;
}
</style>