// src/i18n/index.js
import { reactive } from 'vue';
import zhCN from './zh-CN.json';
import en from './en.json';

const locales = { 'zh-CN': zhCN, en };

const state = reactive({ current: 'zh-CN' });

export function setLanguage(lang) {
  if (locales[lang]) state.current = lang;
}

export function getLanguage() {
  return state.current;
}

function format(s, args) {
  return s.replace(/\{(\d+)(?::fixed\((\d+)\))?\}/g, (_, n, f) => {
    let v = args[Number(n) - 1];
    if (f !== undefined) v = Number(v).toFixed(Number(f));
    return v ?? '';
  });
}

export function t(key, ...args) {
  const s = locales[state.current]?.[key];
  if (s === undefined) {
    console.warn(`[i18n] Missing key: ${key} (${state.current})`);
    return key;
  }
  if (typeof s !== 'string') {
    console.warn(`[i18n] Key "${key}" is not a string (plurals/array?)`);
    return key;
  }
  return format(s, args);
}