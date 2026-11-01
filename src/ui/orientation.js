export async function lockOrientation(mode) {
  const target = mode === 'landscape' ? 'landscape' : 'portrait';
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
    await screen.orientation.lock(target);
  } catch (e) {
    console.warn("Orientation lock failed:", e);
  }
}

export async function unlockOrientation() {
  try {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  } catch (e) {
    console.warn(e);
  }
}