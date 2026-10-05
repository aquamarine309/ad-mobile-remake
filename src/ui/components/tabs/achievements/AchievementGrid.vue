<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AchievementCell from './AchievementCell.vue';
import AchievementTooltip from './AchievementTooltip.vue';

const props = defineProps({
  achievements: { type: Array, required: true },
  iconPrefix: { type: String, required: true },
  isSecret: { type: Boolean, default: false },
});

const rows = computed(() => {
  const byRow = new Map();
  for (const ach of props.achievements) {
    if (!byRow.has(ach.row)) byRow.set(ach.row, []);
    byRow.get(ach.row).push(ach);
  }
  return [...byRow.entries()]
    .sort(([a], [b]) => a - b)
    .map(([row, list]) => ({
      row,
      achievements: list.slice().sort((a, b) => a.column - b.column),
    }));
});

const selectedId = ref(null);

const selectedAchievement = computed(() =>
  selectedId.value === null
    ? null
    : props.achievements.find(a => a.id === selectedId.value) ?? null
);

const tooltipPos = ref({ left: 0, top: 0, placement: 'below' });

const TOOLTIP_WIDTH = 240;
const MARGIN = 8;

const arrowOffset = ref(0);

function onCellClick({ ach, event }) {
  if (selectedId.value === ach.id) {
    selectedId.value = null;
    return;
  }
  selectedId.value = ach.id;

  const rect = event.currentTarget.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  const cellCenterX = rect.left + rect.width / 2;
  const half = TOOLTIP_WIDTH / 2;
  let left = cellCenterX;
  left = Math.max(half + MARGIN, Math.min(left, viewportW - half - MARGIN));

  // Arrow offset: how far the cell center is from the tooltip center
  let offset = cellCenterX - left;
  // Clamp so the arrow doesn't stick out of the tooltip
  const maxOffset = half - 16;
  offset = Math.max(-maxOffset, Math.min(maxOffset, offset));
  arrowOffset.value = offset;

  // Vertical
  const spaceBelow = viewportH - rect.bottom;
  const spaceAbove = rect.top;
  const estHeight = 100;

  let top;
  let placement;
  if (spaceBelow >= estHeight + MARGIN) {
    top = rect.bottom + MARGIN;
    placement = 'below';
  } else if (spaceAbove >= estHeight + MARGIN) {
    top = rect.top - MARGIN;
    placement = 'above';
  } else {
    top = viewportH / 2;
    placement = 'middle';
  }

  tooltipPos.value = { left, top, placement };
}

function closeTooltip() {
  selectedId.value = null;
}

onMounted(() => document.addEventListener('click', closeTooltip));
onUnmounted(() => document.removeEventListener('click', closeTooltip));
</script>

<template>
  <div class="achievements-grid">
    <div
      v-for="row in rows"
      :key="row.row"
      class="achievements-grid__row"
    >
      <AchievementCell
        v-for="ach in row.achievements"
        :key="ach.id"
        :achievement="ach"
        :icon-prefix="iconPrefix"
        :selected="selectedId === ach.id"
        @cell-click="onCellClick"
        :is-secret="isSecret"
      />
    </div>

    <div
      v-if="selectedId !== null"
      class="achievements-grid__overlay"
      @click.stop="closeTooltip"
    />

    <Transition name="achievement-tooltip">
      <AchievementTooltip
        v-if="selectedAchievement"
        :achievement="selectedAchievement"
        :position="tooltipPos"
        :arrow-offset="arrowOffset"
        :is-secret="isSecret"
      />
    </Transition>
  </div>
</template>

<style scoped>
.achievements-grid {
  display: flex;
  flex-direction: column;
}

.achievements-grid__row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
}

.achievements-grid__overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.6);
}
</style>