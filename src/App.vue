<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { GameLoop } from '@/core/game-loop';
import { load, save } from '@/core/storage/save';
import AppBar from './components/layout/AppBar';
import GameHeader from './components/layout/GameHeader';
import TabContent from './components/layout/TabContent';
import TabBar from './components/layout/TabBar';
import SubtabBar from './components/layout/SubtabBar';
import FabRow from './components/layout/FabRow';
import { dispatch, GAME_EVENT } from '@/core/events';

const bottomRef = ref(null);
let observer = null;
let autosaveTimer = null;

function updateHeights() {
  if (bottomRef.value) {
    document.documentElement.style.setProperty(
      '--bottom-nav-height',
      bottomRef.value.offsetHeight + 'px'
    );
  }
}

function onBeforeUnload() { save(); }

onMounted(() => {
  const offlineMs = load();
  if (offlineMs > 10000) {
    GameLoop.simulateTime(offlineMs / 1000, {
      fast: offlineMs < 50000,
    });
  }
  dispatch(GAME_EVENT.GAME_LOAD);
  GameLoop.start();
  autosaveTimer = setInterval(save, 30000);
  window.addEventListener('beforeunload', onBeforeUnload);

  observer = new ResizeObserver(updateHeights);
  if (bottomRef.value) observer.observe(bottomRef.value);
  updateHeights();
});

onUnmounted(() => {
  GameLoop.stop();
  if (autosaveTimer) clearInterval(autosaveTimer);
  window.removeEventListener('beforeunload', onBeforeUnload);
  if (observer) observer.disconnect();
  save();
});
</script>

<template>
  <div class="app">
    <AppBar class="app__appbar" />
    <div class="app__content">
      <GameHeader />
      <TabContent />
    </div>
    <div ref="bottomRef" class="app__bottom">
      <FabRow />
      <TabBar />
      <SubtabBar />
    </div>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  width: 100%;
  max-width: 60rem;
  height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
}

.app__appbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.app__content {
  height: 100%;
  padding-top: 4.8rem;
  padding-bottom: calc(var(--bottom-nav-height, 9rem) + var(--fab-clearance, 5rem));
  overflow-y: auto;
  overscroll-behavior: contain;
}

.app__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
</style>