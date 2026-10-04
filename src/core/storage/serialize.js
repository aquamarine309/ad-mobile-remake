import { D, Decimal } from '../decimal';

export function serialize(value) {
  if (value instanceof Decimal) return { __d: value.toString() };
  if (Array.isArray(value)) return value.map(serialize);
  if (value !== null && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = serialize(value[k]);
    return out;
  }
  return value;
}

export function deserialize(value) {
  if (value === null || typeof value !== 'object') return value;
  if ('__d' in value) return D(value.__d);
  if (Array.isArray(value)) return value.map(deserialize);
  const out = {};
  for (const k of Object.keys(value)) out[k] = deserialize(value[k]);
  return out;
}
