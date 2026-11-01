import { ref } from 'vue';
import { player } from '@/core/state/player';

export const HOLD_DELAY_MS = 0;
export const STICKY_THRESHOLD_MS = 500;

const held = new Map();       // key -> { startTime, action, vibrated }
let sticky = null;            // { key, action } | null
export const stickyKey = ref(null);

function canSticky() {
  return player.infinity.infinities.gt(0);
}

function vibrate() {
  navigator.vibrate?.(50);
}

export const InputHold = {
  begin(key, { action }) {
    if (held.has(key)) return;
    held.set(key, { startTime: Date.now(), action, vibrated: false });
  },

  end(key) {
    const entry = held.get(key);
    if (!entry) return;
    held.delete(key);

    const heldMs = Date.now() - entry.startTime;
    const wasSticky = sticky?.key === key;

    if (heldMs >= STICKY_THRESHOLD_MS && canSticky()) {
      // Long-press: set or replace sticky
      sticky = { key, action: entry.action };
      stickyKey.value = key;
    } else if (wasSticky) {
      // Short-tap on the sticky button: cancel sticky
      sticky = null;
      stickyKey.value = null;
    }
    // Short-tap on a non-sticky button: no change to sticky
  },

  clear() {
    held.clear();
    sticky = null;
    stickyKey.value = null;
  },
};

export function tickInputHold() {
  const now = Date.now();

  for (const [, entry] of held) {
    // Vibrate once when the hold crosses the sticky threshold
    if (!entry.vibrated && canSticky() && now - entry.startTime >= STICKY_THRESHOLD_MS) {
      entry.vibrated = true;
      vibrate();
    }
    if (now - entry.startTime < HOLD_DELAY_MS) continue;
    entry.action();
  }

  // Sticky keeps firing after release, unless the button is being held again
  if (sticky && !held.has(sticky.key)) {
    sticky.action();
  }
}