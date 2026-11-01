/**
 * Run `fn` `initialIter` times, yielding periodically.
 * `fn(remaining)` receives the number of ticks left *including* the current
 * one. A `controller` object can be passed to allow external code to shorten
 * the simulation mid-flight (used by the offline modal's Speed up / Skip).
 *
 * The controller is assigned to `controller.value` on start and cleared to
 * null when done. Its fields (`done`, `maxIter`, `remaining`) are updated
 * after each batch so Vue can track them.
 */
export async function runBatched(
  fn,
  initialIter,
  { batchSize = 1, maxTime = 30, sleepTime = 1, onProgress, controller } = {},
) {
  let done = 0;
  let maxIter = initialIter;
  let remaining = initialIter;

  const ctl = {
    done,
    maxIter,
    remaining,
    speedUp() {
      const next = Math.max(500, Math.floor(remaining / 2));
      maxIter -= remaining - next;
      remaining = next;
    },
    skip() {
      maxIter -= remaining - 10;
      remaining = 10;
    },
  };
  if (controller) controller.value = ctl;

  while (remaining > 0) {
    const t0 = Date.now();
    while (remaining > 0 && Date.now() - t0 < maxTime) {
      for (let i = 0; i < batchSize && remaining > 0; i++) {
        fn(remaining);
        remaining--;
        done++;
      }
    }
    ctl.done = done;
    ctl.maxIter = maxIter;
    ctl.remaining = remaining;
    onProgress?.(done, maxIter);
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, sleepTime));
    }
  }

  if (controller) controller.value = null;
}
