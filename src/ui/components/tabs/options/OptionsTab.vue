<script setup>
import { computed } from 'vue';
import OptionCard from './OptionCard.vue';
import { player } from '@/core/state/player';
import {
  exportSave,
  importSave
} from '@/core/storage/save';

import { resetGame } from '@/game/reset';
import { formatInt } from '@/core/format';
import { GameLoop } from '@/core/loop/game-loop';
import { t } from "@/i18n";

// --- Save & Load ---

function doExport() {
  try {
    const text = exportSave();
    prompt('Copy your save below:', text);
  } catch (e) {
    alert(`Export failed: ${e.message}`);
  }
}

function doImport() {
  const text = prompt('Paste your save string:');
  if (!text) return;
  if (!confirm('Import this save? Your current save will be overwritten.')) return;
  try {
    importSave(text);
    alert('Save imported. The page will reload.');
    location.reload();
  } catch (e) {
    alert(`Import failed: ${e.message}`);
  }
}

function doReset() {
  if (!confirm('Reset your save? This cannot be undone.')) return;
  if (!confirm('Are you really sure? All progress will be lost.')) return;
  resetGame();
}

// --- Gameplay ---

const offlineProgressLabel = computed(() =>
  player.options.offlineProgress ? 'ON' : 'OFF'
);

function toggleOfflineProgress() {
  player.options.offlineProgress = !player.options.offlineProgress;
}

function editOfflineTicks() {
  const input = prompt(
    'Max offline ticks (1000 - 1000000):',
    String(player.options.offlineTicks)
  );
  if (input === null) return;
  const n = parseInt(input, 10);
  if (!Number.isFinite(n) || n < 1000 || n > 1000000) {
    alert('Invalid value. Must be between 1000 and 1000000.');
    return;
  }
  player.options.offlineTicks = n;
}


function editUpdateRate() {
  const input = prompt(
    'Update rate in ms (16 - 1000):',
    String(player.options.updateRate)
  );
  if (input === null) return;
  const n = parseInt(input, 10);
  if (!Number.isFinite(n) || n < 16 || n > 1000) {
    alert('Invalid value. Must be between 16 and 1000.');
    return;
  }
  player.options.updateRate = n;
  GameLoop.stop();
  GameLoop.start();
}

const bottomNavSymbolsLabel = computed(() => {
  const mode = player.options.bottomNavSymbols;
  if (mode === 'all') return t('bottom_symbols_X', t('on'));
  if (mode === 'none') return t('bottom_symbols_X', t('off'));
  if (mode === 'mainOnly') return t('bottom_symbols_only_main_tabs');
  return t('bottom_symbols_only_sub_tabs');
});

const SYMBOL_MODES = ['all', 'mainOnly', 'subOnly', 'none'];

function cycleBottomNavSymbols() {
  const i = SYMBOL_MODES.indexOf(player.options.bottomNavSymbols);
  player.options.bottomNavSymbols = SYMBOL_MODES[(i + 1) % SYMBOL_MODES.length];
}
</script>

<template>
  <div class="options">
    <h2 class="options__title">{{ t("options_ui") }}</h2>
    <div class="options__grid">
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
        danger
        @click="doReset"
      />
    </div>
    <h2 class="options__title">{{ t("options_other") }}</h2>
    <div class="options__grid">
      <OptionCard
        label="Offline Progress"
        :value="offlineProgressLabel"
        @click="toggleOfflineProgress"
      />
      <OptionCard
        :label="t('max_offline_ticks', formatInt(player.options.offlineTicks))"
        @click="editOfflineTicks"
      />
      <OptionCard
        :label="t('ui_update_rate', formatInt(player.options.updateRate))"
        @click="editUpdateRate"
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