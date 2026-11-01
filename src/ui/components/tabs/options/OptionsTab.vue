<script setup>
import { computed, watch } from 'vue';
import OptionCard from './OptionCard.vue';
import OptionSlider from './OptionSlider.vue';
import OptionDropdown from './OptionDropdown.vue';
import { player } from '@/core/state/player';
import { exportSave } from '@/core/storage/save';
import { resetGame } from '@/game/reset';
import { formatInt } from '@/core/format';
import { GameLoop } from '@/core/loop/game-loop';
import { importGame } from '@/game/import';
import { t, ta, LANGUAGES } from "@/i18n";
import { SecretAchievement } from "@/core/achievements";
import { Modal } from '@/ui/components/modal';
import { lockOrientation, unlockOrientation } from '@/ui/orientation';

// --- Save & Load ---

async function doExport() {
  try {
    await Modal.alert(exportSave(), { title: t('export_to_mobile') });
  } catch (e) {
    await Modal.alert(`Export failed: ${e.message}`);
  }
}

async function doImport() {
  const text = await Modal.prompt(t('import_string'), '');
  if (!text) return;
  const ok = await Modal.confirm(t('import_warning') ?? 'Import this save? Your current save will be overwritten.');
  if (!ok) return;
  try {
    await importGame(text);
    await Modal.alert('Save imported.');
  } catch (e) {
    await Modal.alert(`Import failed: ${e.message}`);
  }
}

async function doReset() {
  if (!await Modal.confirm('Reset your save? This cannot be undone.')) return;
  if (!await Modal.confirm('Are you really sure? All progress will be lost.')) return;
  resetGame();
}

// --- Bottom nav symbols ---

const SYMBOL_MODES = ['all', 'mainOnly', 'subOnly', 'none'];

const bottomNavSymbolsLabel = computed(() => {
  const mode = player.options.bottomNavSymbols;
  if (mode === 'all') return t('bottom_symbols_X', t('on'));
  if (mode === 'none') return t('bottom_symbols_X', t('off'));
  if (mode === 'mainOnly') return t('bottom_symbols_only_main_tabs');
  return t('bottom_symbols_only_sub_tabs');
});

function cycleBottomNavSymbols() {
  const i = SYMBOL_MODES.indexOf(player.options.bottomNavSymbols);
  player.options.bottomNavSymbols = SYMBOL_MODES[(i + 1) % SYMBOL_MODES.length];
}

// --- Offline progress (3-state) ---

const OFFLINE_MODES = ['show', 'hide', 'disable'];

const offlineProgressLabel = computed(() => {
  const modes = ta('offline_progress');
  const i = OFFLINE_MODES.indexOf(player.options.offlineProgress);
  return modes[i >= 0 ? i : 0];
});

function cycleOfflineProgress() {
  const i = OFFLINE_MODES.indexOf(player.options.offlineProgress);
  player.options.offlineProgress = OFFLINE_MODES[(i + 1) % OFFLINE_MODES.length];
}

// --- Languages ---
const languageOptions = LANGUAGES.map(l => ({ value: l.code, label: l.name }));

// --- Sliders ---

const OFFLINE_TICKS_VALUES = [
  1000, 2000, 5000, 10000, 25000, 100000, 250000, 500000, 1000000,
];

const offlineTicksLabel = computed(() =>
  t('max_offline_ticks', formatInt(player.options.offlineTicks))
);

const updateRateLabel = computed(() =>
  t('ui_update_rate', formatInt(player.options.updateRate))
);

watch(() => player.options.updateRate, value => {
  GameLoop.stop();
  GameLoop.start();
  if (value === 200) SecretAchievement(31).unlock();
});

// --- Theme ---

const THEMES = ['light', 'dark', 'amoled', 'lightInverted', 'darkInverted'];

const themeLabel = computed(() => {
  return player.options.theme;
});

function cycleTheme() {
  const i = THEMES.indexOf(player.options.theme);
  player.options.theme = THEMES[(i + 1) % THEMES.length];
}

const ORIENTATION_MODES = ['system', 'portrait', 'landscape'];

const orientationLabel = computed(() => {
  const modes = ta('orientations');
  const i = ORIENTATION_MODES.indexOf(player.options.orientation);
  return `${t("orientation")}：\n${modes[i >= 0 ? i : 0]}`;
});

async function cycleOrientation() {
  const current = player.options.orientation;
  const nextIndex = (ORIENTATION_MODES.indexOf(current) + 1) % ORIENTATION_MODES.length;
  const nextMode = ORIENTATION_MODES[nextIndex];
  
  player.options.orientation = nextMode;
  
  if (nextMode === 'system') {
    await unlockOrientation();
  } else {
    await lockOrientation(nextMode);
  }
}
</script>

<template>
  <div class="options">
    <h2 class="options__title">{{ t("options_ui") }}</h2>
    <div class="options__grid">
      <OptionDropdown
        :label="t('language')"
        v-model="player.options.language"
        :options="languageOptions"
      />
      <OptionCard
        :label="themeLabel"
        @click="cycleTheme"
      />
      <OptionCard
        :label="bottomNavSymbolsLabel"
        @click="cycleBottomNavSymbols"
      />
    </div>
    <div class="options__grid">
      <OptionCard
        :label="orientationLabel"
        @click="cycleOrientation"
      />
    </div>
    <h2 class="options__title">{{ t("options_save_and_load") }}</h2>
    <div class="options__grid">
      <OptionCard
        :label="t('export_to_mobile')"
        @click="doExport"
      />
      <OptionCard
        :label="t('import_string')"
        @click="doImport"
      />
      <OptionCard
        :label="t('reset_current_save')"
        @click="doReset"
      />
    </div>

    <h2 class="options__title">{{ t("options_other") }}</h2>
    <div class="options__grid--two">
      <OptionSlider
        :label="offlineTicksLabel"
        v-model="player.options.offlineTicks"
        :values="OFFLINE_TICKS_VALUES"
      />
      <OptionSlider
        :label="updateRateLabel"
        v-model="player.options.updateRate"
        :min="50"
        :max="200"
        :step="10"
      />
    </div>
    <div class="options__grid">
      <OptionCard
        :label="offlineProgressLabel"
        @click="cycleOfflineProgress"
        :bad="player.options.offlineProgress === 'disable'"
      />
    </div>
  </div>
</template>

<style scoped>
.options {
  padding: 1rem 0.7rem;
}

.options__title {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
}

.options__title:first-child {
  margin-top: 0;
}

.options__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 1rem 0 0.5rem;
}

.options__grid--two {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 0.5rem 0;
}
</style>