<script setup>
import { ref, computed, onMounted } from 'vue';
import { t, ta, tp } from '@/i18n';
import { player } from '@/core/state/player';
import { load } from '@/core/storage/save';
import { GameLoop } from '@/core/loop/game-loop';
import { simulateTime } from '@/core/loop/simulate-time';
import { buildAwayReport } from '@/core/loop/away-progress';
import { dispatch, GAME_EVENT } from '@/core/events';
import { lockOrientation } from '@/ui/orientation';
import { offlineController } from '@/ui/offline/state';
import { formatTimeShort, formatTimeLong } from '@/core/time/timespan';
import { formatInt } from '@/core/format';
import { startGameLoop } from '@/game/init';

function finishSetup() {
  startGameLoop();
  status.value = 'ready';
}

const emit = defineEmits(['started']);

// State machine: 'loading' | 'simulating' | 'report' | 'ready'
const status = ref('loading');

// Offline progress data
const progress = ref({ done: 0, total: 0, seconds: 0 });
const reportLines = ref([]);

// Loading tips
const tips = computed(() => {
  const arr = ta('loading_tips');
  return arr && arr.length > 0 ? arr : ["Welcome to Antimatter Dimensions!"];
});
const currentTipIndex = ref(0);
const currentTip = computed(() => tips.value[currentTipIndex.value] || "");

function prevTip() {
  currentTipIndex.value = (currentTipIndex.value - 1 + tips.value.length) % tips.value.length;
}
function nextTip() {
  currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length;
}

// Start loading process on mount
onMounted(async () => {
  // 1. Load save data from localStorage
  const offlineMs = load();
  
  // 2. Check if offline simulation is needed
  const shouldSimulate = player.options.offlineProgress !== 'disable' && offlineMs > 10000;

  if (shouldSimulate) {
    status.value = 'simulating';
    const seconds = offlineMs / 1000;
    
    // 3. Run offline simulation in batches
    const result = await simulateTime(seconds, {
      fast: offlineMs < 50000,
      controller: offlineController,
      onProgress: (done, total) => {
        progress.value = { done, total, seconds };
      }
    });
    
    // 4. Simulation finished, generate report
    reportLines.value = buildAwayReport(result.before, result.after);
    status.value = 'report';
  } else {
    // No offline progress, skip to ready
    finishSetup();
  }
});


// Player clicks "Start Game"
async function handleStart() {
  if (player.options.orientation !== 'system') {
    // Use the user gesture to request fullscreen and orientation lock
    await lockOrientation(player.options.orientation).catch(() => {});
  }
  emit('started');
}
</script>

<template>
  <div class="start-screen">
    <!-- Background layer -->
    <div class="start-screen__bg"></div>

    <!-- Logo area -->
    <div class="start-screen__logo-wrap">
      <img src="@/assets/loading_reality_banner_transparent.webp" class="start-screen__logo" alt="Antimatter Dimensions" />
    </div>

    <!-- Center UI area -->
    <div class="start-screen__center">
      
      <!-- State 1: Initial loading -->
      <div v-if="status === 'loading'" class="status-box loading-box">
        <div class="loading-text">{{ t('initial_startup_tip') || "This shouldn't take longer than a second..." }}</div>
      </div>

      <!-- State 2: Simulating offline progress -->
      <div v-else-if="status === 'simulating'" class="status-box offline-box">
        <h3 class="box-title">{{ t('calculating_offline_progress') }}</h3>
        
        <div class="offline-info">
          <div>{{ formatTimeShort(progress.done * 20 * 1000) }} / {{ formatTimeShort(progress.seconds * 1000) }}</div>
          <div>{{ tp('ticks_done', progress.done, formatInt(progress.done), formatInt(progress.total)) }}</div>
          <div>{{ t('time_left_unknown') }}</div>
        </div>

        <div class="progress-bar">
          <div 
            class="progress-bar__fill" 
            :style="{ width: (progress.done / progress.total * 100) + '%' }"
          ></div>
        </div>

        <div class="offline-actions">
          <button 
            v-if="offlineController?.remaining > 500"
            class="action-btn" 
            @click="offlineController.speedUp()"
          >
            {{ t('speed_up') }}
          </button>
          <button 
            v-if="offlineController?.remaining > 10"
            class="action-btn" 
            @click="offlineController.skip()"
          >
            {{ t('skip') }}
          </button>
        </div>
      </div>

      <!-- State 3: Offline report -->
      <div v-else-if="status === 'report'" class="status-box offline-box">
        <h3 class="box-title">{{ t('while_you_were_away_for_X', formatTimeLong(progress.seconds * 1000)) }}</h3>
        
        <div class="offline-report-list">
          <div v-for="line in reportLines" :key="line.key" class="report-item">
            <div class="report-item__title" :style="{ color: `var(${line.colorVar})` }">
              {{ t(line.labelKey, line.from, line.to) }}
            </div>
          </div>
        </div>
        
        <div class="offline-actions">
          <button class="start-btn" @click="finishSetup">{{ t('confirm') }}</button>
        </div>
      </div>

      <!-- State 4: Ready to start -->
      <div v-else-if="status === 'ready'" class="status-box ready-box">
        <button class="start-btn" @click="handleStart">
          {{ t('start_game') }}
        </button>
      </div>
    </div>

    <!-- Bottom tips carousel -->
    <div class="start-screen__tips">
      <button class="tips__arrow" @click="prevTip"></button>
      <div class="tips__content">
        <div class="tips__counter">{{ currentTipIndex + 1 }} / {{ tips.length }}</div>
        <div class="tips__text">{{ currentTip }}</div>
      </div>
      <button class="tips__arrow" @click="nextTip"></button>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: #000;
  color: #fff;
  overflow: hidden;
}

/* Starry background */
.start-screen__bg {
  position: absolute;
  inset: 0;
  background: url('@/assets/loading_stars.webp') center / cover no-repeat;
  z-index: -1;
}

/* Logo area */
.start-screen__logo-wrap {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2rem;
  pointer-events: none;
}

.start-screen__logo {
  width: 85%;
  max-width: 40rem;
  object-fit: contain;
}

/* Center UI area */
.start-screen__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1.5rem;
}

/* Shared panel style */
.status-box {
  width: 100%;
  max-width: 50rem;
  border-radius: 0.4rem;
  background: rgba(0, 0, 0, 50%);
  border: 0.1rem solid #666;
  padding: 1.5rem;
}

.loading-box {
  text-align: center;
  padding: 2rem 1.5rem;
}
.loading-text {
  font-size: 1.4rem;
  color: #aaa;
}

/* Offline panel */
.box-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fff;
}
.offline-info {
  font-size: 1.4rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  color: #ccc;
}

.progress-bar {
  width: 100%;
  height: 0.4rem;
  background: #333;
  border-radius: 0.2rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.progress-bar__fill {
  height: 100%;
  background: #d81b60;
  transition: width 0.1s linear;
}

.offline-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: 0.1rem solid #666;
  color: #fff;
  font-size: 1.4rem;
  border-radius: 0.4rem;
  cursor: pointer;
  touch-action: manipulation;
}

.start-btn {
  width: 100%;
  padding: 1.2rem;
  background: transparent;
  border: 0.2rem solid #127a20;
  color: #fff;
  font-size: 1.6rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: bold;
  touch-action: manipulation;
}

/* Offline report list */
.offline-report-list {
  max-height: 35vh;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
}

.report-item {
  margin-bottom: 0.8rem;
}
.report-item__title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.report-item__values {
  font-size: 1.4rem;
  color: #ccc;
}

/* Bottom tips bar */
.start-screen__tips {
  display: flex;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.8);
  border-top: 0.1rem solid #333;
  height: 8rem;
  flex-shrink: 0;
}
.tips__arrow {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  padding: 0 1.5rem;
  cursor: pointer;
}
.tips__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.8rem 0;
}
.tips__counter {
  font-size: 1rem;
  color: #888;
}
.tips__text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  padding: 0 1rem;
  line-height: 1.3;
}
</style>