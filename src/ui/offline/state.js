// NOTE: This module registers EventHub subscribers at import time.
// It must be reachable from App.vue's static import graph so that the
// subscriptions are live before initGame() dispatches any events.
// Do not lazy-load OfflineProgressModal or this module.

import { ref } from "vue";
import { ui, GAME_EVENT } from "@/core/events";
import { buildAwayReport } from "@/core/loop/away-progress";

/**
 * null when hidden. Otherwise one of:
 *  { phase: 'progress', startedAt, doneTicks, totalTicks }
 *  { phase: 'report', seconds, lines }
 *
 * The object is mutated in place during the progress phase so that Vue's
 * reactivity only triggers updates for changed fields. This matters when
 * the offline simulation runs millions of ticks.
 */
export const offlineModal = ref(null);

ui.on(GAME_EVENT.OFFLINE_PROGRESS_TICK, ({ done, total }) => {
  let m = offlineModal.value;
  if (m?.phase !== "progress") {
    m = {
      phase: "progress",
      startedAt: Date.now(),
      doneTicks: 0,
      totalTicks: 0,
    };
    offlineModal.value = m;
  }
  m.doneTicks = done;
  m.totalTicks = total;
});

ui.on(GAME_EVENT.OFFLINE_PROGRESS_DONE, ({ seconds, before, after }) => {
  offlineModal.value = {
    phase: "report",
    seconds,
    lines: buildAwayReport(before, after),
  };
});

export function dismissOfflineModal() {
  offlineModal.value = null;
}

/**
 * Set by init.js when offline simulation starts, cleared when it finishes.
 * Holds { done, maxIter, remaining, speedUp(), skip() } or null.
 */
export const offlineController = ref(null);
