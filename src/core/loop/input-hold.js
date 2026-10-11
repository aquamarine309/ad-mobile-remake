// Tracks buttons currently held down.
// The repeat loop runs in tick.js so it respects updateRate
// and stays in sync with the rest of the game state.

export const HOLD_DELAY_MS = 0;

const held = new Map(); // key -> { startTime, action, isEnabled }

export const InputHold = {
  begin(key, { action }) {
    if (held.has(key)) return;
    held.set(key, { startTime: Date.now(), action });
  },
  end(key) {
    held.delete(key);
  },

  clear() {
    held.clear();
  },

  entries() {
    return held.entries();
  },
};

/**
 * Called from tick(). Runs the action for every held input
 * whose hold time exceeds HOLD_DELAY_MS.
 */
export function tickInputHold() {
  if (held.size === 0) return;
  const now = Date.now();
  for (const [key, entry] of held) {
    if (now - entry.startTime < HOLD_DELAY_MS) continue;
    entry.action();
  }
}