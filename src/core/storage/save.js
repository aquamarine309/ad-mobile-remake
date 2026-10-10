import { Decimal } from '../decimal';
import { player, createInitialPlayer, applyPlayer } from '../state/player';
import { serialize, deserialize } from './serialize';
import { encodeSave, decodeSave } from './serializer';

const SAVE_KEY = 'ad-save';

// --- Persistent storage ---

export function save() {
  try {
    const json = JSON.stringify(serialize(player));
    localStorage.setItem(SAVE_KEY, encodeSave(json));
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
    const json = decodeSave(raw);
    const loaded = deserialize(JSON.parse(json));
    const offlineMs = Math.max(0, Date.now() - (loaded.lastUpdate ?? Date.now()));

    const fresh = createInitialPlayer();
    deepAssign(fresh, loaded);
    applyPlayer(fresh);

    return offlineMs;
  } catch (e) {
    console.error('Load failed', e);
    player.lastUpdate = Date.now();
    return 0;
  }
}

// --- Export / Import ---

export function exportSave() {
  return encodeSave(JSON.stringify(serialize(player)));
}

export function parseSave(text) {
  const json = decodeSave(text.trim());
  const loaded = deserialize(JSON.parse(json));
  if (loaded === null || typeof loaded !== 'object') {
    throw new Error('Save data is not an object');
  }
  if (typeof loaded.lastUpdate !== 'number') {
    throw new Error('Save is missing required fields');
  }
  return loaded;
}

export function deepAssign(dst, src) {
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

export function writeSaveToStorage(playerObject) {
  localStorage.setItem(SAVE_KEY, encodeSave(JSON.stringify(serialize(playerObject))));
}