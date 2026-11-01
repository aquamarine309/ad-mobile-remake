<script setup>
import { computed } from "vue";
import { t, tp } from "@/i18n";
import { offlineModal, offlineController, dismissOfflineModal } from "./state";
import { formatTimeLong } from "@/core/time/timespan";

const visible = computed(() => offlineModal.value !== null);
const phase = computed(() => offlineModal.value?.phase);
const cancelable = computed(() => phase.value === "report");

// 0..10000, matching the Android ProgressBar max
const progressValue = computed(() => {
  const m = offlineModal.value;
  if (m?.phase !== "progress" || !m.totalTicks) return 0;
  return Math.floor((m.doneTicks / m.totalTicks) * 10000);
});

// Elapsed real time since the progress phase began, as mm:ss
const elapsedStr = computed(() => {
  const m = offlineModal.value;
  if (m?.phase !== "progress") return "00:00";
  const s = Math.floor((Date.now() - m.startedAt) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
});

const totalStr = computed(() => {
  const m = offlineModal.value;
  if (m?.phase !== "progress") return "00:00";
  const s = Math.floor(m.seconds ?? 0);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
});

const progressText = computed(() => {
  const m = offlineModal.value;
  if (m?.phase !== "progress") return "";
  return `${tp("ticks_done", m.doneTicks, m.doneTicks, m.totalTicks)}`;
});

function onScrimClick() {
  if (cancelable.value) dismissOfflineModal();
}

const canSpeedUp = computed(() => offlineController.value?.remaining > 500);
const canSkip = computed(() => offlineController.value?.remaining > 10);
</script>

<template>
  <div v-if="visible" class="offline-scrim" @click.self="onScrimClick">
    <div class="offline-modal">
      <!-- Phase 1: progress -->
      <template v-if="phase === 'progress'">
        <div class="offline-modal__title">
          {{ t("calculating_offline_progress") }}
        </div>
        <div class="offline-modal__text">
          {{ t("X_time_simulated", elapsedStr, totalStr) }}
        </div>
        <div class="offline-modal__text">{{ progressText }}</div>
        <div class="offline-modal__text">{{ t("time_left_unknown") }}</div>
        <div class="offline-progress">
          <div
            class="offline-progress__fill"
            :style="{ width: progressValue / 100 + '%' }"
          />
        </div>
        <div v-if="phase === 'progress'" class="offline-actions">
          <button
            v-if="canSpeedUp"
            class="offline-modal__btn"
            @click="offlineController?.speedUp()"
          >
            {{ t("speed_up") }}
          </button>
          <span class="offline-actions__spacer" />
          <button
            v-if="canSkip"
            class="offline-modal__btn"
            @click="offlineController?.skip()"
          >
            {{ t("skip") }}
          </button>
        </div>
      </template>

      <!-- Phase 2: report -->
      <template v-else>
        <div class="offline-modal__title">
          {{
            t(
              "while_you_were_away_for_X",
              formatTimeLong(offlineModal.seconds * 1000),
            )
          }}
        </div>
        <div class="offline-modal__body">
          <div
            v-if="offlineModal.lines.length === 0"
            class="offline-modal__text"
          >
            {{ t("nothing_happened") }}
          </div>
          <div
            v-for="line in offlineModal.lines"
            :key="line.key"
            class="offline-modal__text"
            :style="{ color: `var(${line.colorVar})` }"
          >
            {{ t(line.labelKey, line.from, line.to) }}
          </div>
        </div>
        <div class="offline-modal__actions">
          <button class="offline-modal__btn" @click="dismissOfflineModal">
            {{ t("confirm") }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.offline-scrim {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--color-modal-scrim);
}

.offline-modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 56rem;
  max-height: 100%;
  padding: 2.5rem 2.5rem 1.5rem;
  background: var(--color-modal-bg);
  color: var(--color-modal-text);
  border: 0.3rem solid var(--color-modal-border);
  border-radius: 0.8rem;
}

.offline-modal__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.offline-modal__text {
  font-size: 1.6rem;
  line-height: 1.4;
  white-space: pre-line;
  word-break: break-word;
}

.offline-modal__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0.5rem 0 1rem;
}

.offline-progress {
  position: relative;
  width: 100%;
  height: 0.4rem;
  margin-top: 1rem;
  background: var(--color-slider-track);
  overflow: hidden;
}

.offline-progress__fill {
  height: 100%;
  background: var(--color-slider-fill);
  transition: width 0.1s linear;
}

.offline-modal__actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.offline-modal__btn {
  min-width: 6.4rem;
  height: 4rem;
  padding: 0 1.2rem;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--color-modal-btn-fg);
  background: transparent;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
}

.offline-modal__btn:active {
  background: var(--color-card-fill-active);
}

.offline-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.8rem;
}
.offline-actions__spacer {
  flex: 1;
}
</style>
