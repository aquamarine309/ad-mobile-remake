import { D, Decimal } from './decimal';
import { player, createInitialPlayer } from './player';

const SAVE_KEY = 'ad-save';

function serialize(value) {
  if (value instanceof Decimal) return { __d: value.toString() };
  if (Array.isArray(value)) return value.map(serialize);
  if (value !== null && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = serialize(value[k]);
    return out;
  }
  return value;
}

function deserialize(value) {
  if (value === null || typeof value !== 'object') return value;
  if ('__d' in value) return D(value.__d);
  if (Array.isArray(value)) return value.map(deserialize);
  const out = {};
  for (const k of Object.keys(value)) out[k] = deserialize(value[k]);
  return out;
}

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