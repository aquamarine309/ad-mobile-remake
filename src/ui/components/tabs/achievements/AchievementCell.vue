<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  achievement: { type: Object, required: true },
  iconPrefix: { type: String, required: true },
  selected: { type: Boolean, default: false },
  isSecret: { type: Boolean, default: false },
});

const emit = defineEmits(['cell-click']);

const failed = ref(false);

const iconUrl = computed(() => {
  if (props.isSecret && !props.achievement.isUnlocked) {
    return '/achievements/achhidden.webp';
  }
  return `/achievements/${props.iconPrefix}${props.achievement.id}.webp`;
});

let s12ClickCount = 0;

function onClick(event) {
  // S11 and S12 are one-off click-based achievements. Inlined here instead of
  // making them config fields, since no other achievement uses these triggers.
  // See discussion in the achievement system design.
  const id = props.achievement.id;
  if (props.isSecret) {
    if (id === 11) props.achievement.unlock();
    else if (id === 12 && !props.achievement.isUnlocked) {
      s12ClickCount++;
      if (s12ClickCount >= 100) props.achievement.unlock();
      else if (s12ClickCount > 2) return;
    }
  }
  emit('cell-click', { ach: props.achievement, event });
}
</script>

<template>
  <button
    class="achievement-cell"
    :data-achievement-id="achievement.id"
    :class="{
      'achievement-cell--locked': !achievement.isUnlocked && !isSecret,
      'achievement-cell--locked-secret': !achievement.isUnlocked && isSecret,
      'achievement-cell--selected': selected,
    }"
    @click.stop="onClick"
  >
    <img
      v-if="!failed"
      :src="iconUrl"
      class="achievement-cell__icon"
      alt=""
      @error="failed = true"
    />
    <span v-else class="achievement-cell__id">{{ achievement.id }}</span>
  </button>
</template>

<style scoped>
.achievement-cell {
  aspect-ratio: 1;
  position: relative;
  padding: 0;
  background: var(--color-achievement-unlocked);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 0;
}

.achievement-cell--locked {
  background: var(--color-achievement-locked);
}

.achievement-cell--selected {
  z-index: 95;
}

.achievement-cell--locked-secret {
  background: var(--color-achievement-secret-locked);
}

.achievement-cell__icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.achievement-cell__id {
  font-size: 1rem;
  font-weight: bold;
  color: #888;
}
</style>