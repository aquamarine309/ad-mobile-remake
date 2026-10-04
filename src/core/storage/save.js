import { Decimal } from '@/core/decimal';
import { player, createInitialPlayer } from '@/core/state/player';
import { serialize, deserialize } from './serialize';

const SAVE_KEY = 'ad-save';

export function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serialize(player)));
    return true;
  } catch (e) {
    console.error('Save failed', e);
    return false;
  }
}

export function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    player.lastUpdate = Date.now();
    return 0;
  }
  try {
    const loaded = deserialize(JSON.parse(raw));
    const offlineMs = Math.max(0, Date.now() - (loaded.lastUpdate ?? Date.now()));

    const fresh = createInitialPlayer();
    deepAssign(fresh, loaded);
    Object.assign(player, fresh);

    return offlineMs;
  } catch (e) {
    console.error('Load failed', e);
    player.lastUpdate = Date.now();
    return 0;
  }
}

export function hardReset() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

function deepAssign(dst, src) {
  for (const k of Object.keys(src)) {
    const sv = src[k];
    if (sv !== null && typeof sv === 'object' && !Array.isArray(sv) && !(sv instanceof Decimal)) {
      if (dst[k] === null || typeof dst[k] !== 'object') dst[k] = {};
      deepAssign(dst[k], sv);
    } else {
      dst[k] = sv;
    }
  }
}
