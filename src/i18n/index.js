import zhStrings from "./zh-CN.json";
import zhPlurals from "./zh-CN.plurals.json";
import enStrings from "./en.json";
import enPlurals from "./en.plurals.json";
import jaStrings from "./ja-JP.json";
import jaPlurals from "./ja-JP.plurals.json";
import { Decimal } from "@/core/decimal";
import { player } from "@/core/state/player";

const locales = {
  "zh-CN": {
    strings: { ...zhStrings },
    plurals: zhPlurals,
  },
  en: {
    strings: { ...enStrings },
    plurals: enPlurals,
  },
  "ja-JP": {
    strings: { ...jaStrings },
    plurals: jaPlurals,
  },
};

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh-CN", name: "简体中文" },
  { code: "ja-JP", name: "日本語" },
];

export const i18nState = {
  get current() {
    return player.options.language;
  },
  set current(v) {
    player.options.language = v;
  },
};

export function setLanguage(lang) {
  if (locales[lang]) i18nState.current = lang;
}

export function getLanguage() {
  return i18nState.current;
}

function format(s, args) {
  return s.replace(/\{(\d+)(?::fixed\((\d+)\))?\}/g, (_, n, f) => {
    let v = args[Number(n) - 1];
    if (f !== undefined) {
      const n = v instanceof Decimal ? v.toNumber() : Number(v);
      v = n.toFixed(Number(f));
    }
    return v ?? "";
  });
}

export function t(key, ...args) {
  const s =
    locales[i18nState.current]?.strings?.[key] || locales.en.strings[key];
  if (typeof s !== "string") {
    console.warn(`[i18n] Missing string key: ${key}`);
    return key;
  }
  return format(s, args);
}

export function ta(key, ...args) {
  const s =
    locales[i18nState.current]?.strings?.[key] || locales.en.strings[key];
  if (typeof s !== "string") {
    console.warn(`[i18n] Missing array key: ${key}`);
    return [];
  }
  return s.split("|").map((part) => format(part, args));
}

function isOne(n) {
  if (typeof n === "number") return n === 1;
  if (n instanceof Decimal) return n.eq(1);
  return false;
}

function pickForm(n) {
  if (i18nState.current === "en") return isOne(n) ? "one" : "other";
  return "other";
}

export function tp(key, count, ...args) {
  const forms =
    locales[i18nState.current]?.plurals?.[key] || locales.en.plurals[key];
  if (!forms) {
    console.warn(`[i18n] Missing plurals key: ${key}`);
    return key;
  }
  const s = forms[pickForm(count)] ?? forms.other;
  return format(s, args);
}

export function tpHtml(key, count, ...args) {
  const forms =
    locales[i18nState.current]?.plurals?.[key] || locales.en.plurals[key];
  if (!forms) {
    console.warn(`[i18n] Missing plurals key: ${key}`);
    return key;
  }
  const s = forms[pickForm(count)] ?? forms.other;
  return s.replace(/\{(\d+)\}/g, (_, n) => {
    const v = args[Number(n) - 1];
    return `<span class="i18n-num">${v ?? ""}</span>`;
  });
}
