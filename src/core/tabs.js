import { ref, computed } from 'vue';
import { TABS } from './secret-formula';

export const currentTabKey = ref('dimensions');
export const currentSubtabKey = ref('antimatter');

export const currentTab = computed(() =>
  TABS.find(t => t.key === currentTabKey.value) ?? TABS[0]
);

export const visibleTabs = computed(() =>
  TABS.filter(t => t.condition?.() ?? true)
);

export const visibleSubtabs = computed(() =>
  currentTab.value.subtabs.filter(s => s.condition?.() ?? true)
);

export const currentSubtab = computed(() =>
  currentTab.value.subtabs.find(s => s.key === currentSubtabKey.value)
  ?? currentTab.value.subtabs[0]
);

export function showTab(key) {
  currentTabKey.value = key;
  const tab = TABS.find(t => t.key === key);
  currentSubtabKey.value = tab.subtabs[0].key;
}

export function showSubtab(key) {
  currentSubtabKey.value = key;
}