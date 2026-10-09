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

function onClick(event) {
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
  background: #6ad477;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 0;
}

.achievement-cell--locked {
  background: #c3c3c3;
}

.achievement-cell--selected {
  z-index: 95;
}

.achievement-cell--locked-secret {
  background: #878787;
}

.achievement-cell__icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.achievement-cell--locked .achievement-cell__icon {
  filter: grayscale(100%) brightness(0.6);
  opacity: 0.7;
}

.achievement-cell__id {
  font-size: 1rem;
  font-weight: bold;
  color: #888;
}
</style>