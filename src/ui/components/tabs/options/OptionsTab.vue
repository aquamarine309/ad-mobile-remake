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

// --- Save & Load ---

function doExport() {
  try {
    prompt('Copy your save below:', exportSave());
  } catch (e) {
    alert(`Export failed: ${e.message}`);
  }
}

function doImport() {
  const text = prompt('Paste your save string:');
  if (!text) return;
  if (!confirm('Import this save? Your current save will be overwritten.')) return;
  try {
    importGame(text);
    alert('Save imported.');
  } catch (e) {
    alert(`Import failed: ${e.message}`);
  }
}

function doReset() {
  if (!confirm('Reset your save? This cannot be undone.')) return;
  if (!confirm('Are you really sure? All progress will be lost.')) return;
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

watch(() => player.options.updateRate, () => {
  GameLoop.stop();
  GameLoop.start();
});
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
        :label="bottomNavSymbolsLabel"
        @click="cycleBottomNavSymbols"
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
        bad
      />
    </div>

    <h2 class="options__title">{{ t("options_other") }}</h2>
    <div class="options__grid">
      <OptionCard
        :label="offlineProgressLabel"
        @click="cycleOfflineProgress"
        :bad="player.options.offlineProgress === 'disable'"
      />
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
}
</style>