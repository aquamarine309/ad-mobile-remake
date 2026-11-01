import { computed, ref } from "vue";
import { TABS } from "./config";
import { player } from "@/core/state/player";

const DEFAULT_TAB_KEY = TABS[0].key;

function findTab(key) {
  return TABS.find((t) => t.key === key);
}

function isVisible(entry) {
  return entry !== undefined && (entry.condition?.() ?? true);
}

// currentTab is declared before currentSubtabKey because the latter reads it.
export const currentTabKey = computed({
  get() {
    const key = player.options.lastTab;
    const tab = findTab(key);
    return isVisible(tab) ? key : DEFAULT_TAB_KEY;
  },
  set(key) {
    if (isVisible(findTab(key))) player.options.lastTab = key;
  },
});

export const currentTab = computed(
  () => findTab(currentTabKey.value) ?? TABS[0],
);

export const currentSubtabKey = computed({
  get() {
    const tab = currentTab.value;
    const stored = player.options.lastSubtabs?.[tab.key];
    if (tab.subtabs.some((s) => s.key === stored && isVisible(s)))
      return stored;
    return tab.subtabs.find(isVisible)?.key ?? tab.subtabs[0].key;
  },
  set(key) {
    const tab = currentTab.value;
    if (tab.subtabs.some((s) => s.key === key && isVisible(s))) {
      player.options.lastSubtabs ??= {};
      player.options.lastSubtabs[tab.key] = key;
    }
  },
});

export const visibleTabs = computed(() => TABS.filter(isVisible));

export const visibleSubtabs = computed(() =>
  currentTab.value.subtabs.filter(isVisible),
);

export const currentSubtab = computed(
  () =>
    currentTab.value.subtabs.find((s) => s.key === currentSubtabKey.value) ??
    currentTab.value.subtabs[0],
);

export function showTab(key, subtabKey) {
  currentTabKey.value = key;
  if (subtabKey !== undefined) {
    currentSubtabKey.value = subtabKey;
  }
}

export function showSubtab(key) {
  currentSubtabKey.value = key;
}

export const focusedAchievementId = ref(null);
