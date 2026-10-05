<script setup>
import { computed } from 'vue';
import OptionCard from './OptionCard.vue';
import { player } from '@/core/state/player';
import {
  exportSave,
  importSave
} from '@/core/storage/save';

import { resetGame } from '@/game/reset';
import { GameLoop } from '@/core/loop/game-loop';

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

const offlineTicksLabel = computed(() =>
  String(player.options.offlineTicks)
);

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

const updateRateLabel = computed(() => `${player.options.updateRate} ms`);

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
</script>

<template>
  <div class="options">
    <h2 class="options__title">Save &amp; Load</h2>
    <div class="options__grid">
      <OptionCard label="Export Save" value="Click" @click="doExport" />
      <OptionCard label="Import Save" value="Click" @click="doImport" />
      <OptionCard label="Reset Save" value="Click" danger @click="doReset" />
    </div>

    <h2 class="options__title">Gameplay</h2>
    <div class="options__grid">
      <OptionCard
        label="Offline Progress"
        :value="offlineProgressLabel"
        @click="toggleOfflineProgress"
      />
      <OptionCard
        label="Offline Ticks"
        :value="offlineTicksLabel"
        @click="editOfflineTicks"
      />
      <OptionCard
        label="Update Rate"
        :value="updateRateLabel"
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