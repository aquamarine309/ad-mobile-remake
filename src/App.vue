<script setup>
import { onMounted, onUnmounted, ref, watchEffect, computed } from 'vue';
import AppBar from './ui/components/layout/AppBar';
import GameHeader from './ui/components/layout/GameHeader';
import TabContent from './ui/components/layout/TabContent';
import TabBar from './ui/components/layout/TabBar';
import SubtabBar from './ui/components/layout/SubtabBar';
import FabRow from './ui/components/layout/FabRow';
import NotificationStack from './ui/components/layout/NotificationStack';
import BaseModal from './ui/components/modal/BaseModal';
import StartScreen from './ui/components/layout/StartScreen.vue'; 

import { player } from '@/core/state/player';
import { canBigCrunch } from '@/core/prestige/big-crunch';
import BigCrunchOverlay from '@/ui/components/prestige/BigCrunchOverlay';

const hasStarted = ref(false);
const bottomRef = ref(null);
let observer = null;

const isCrunching = computed(() => canBigCrunch());
const isLateGame = computed(() => player.records.bestInfinity.realTime <= 60e3);

function updateHeights() {
  if (bottomRef.value) {
    document.documentElement.style.setProperty(
      '--bottom-nav-height',
      bottomRef.value.offsetHeight + 'px'
    );
  }
}

onMounted(() => {
  observer = new ResizeObserver(updateHeights);
  if (bottomRef.value) observer.observe(bottomRef.value);
  updateHeights();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

watchEffect(() => {
  const t = player.options.theme;
  const html = document.documentElement;
  html.classList.toggle('theme-dark', t === 'dark' || t === 'amoled' || t === 'darkInverted');
  html.classList.toggle('theme-amoled', t === 'amoled');
  html.classList.toggle('theme-inverted', t === 'lightInverted' || t === 'darkInverted');
});
</script>

<template>
  <StartScreen v-if="!hasStarted" @started="hasStarted = true" />

  <div v-else class="app">
    <BaseModal />
    <AppBar class="app__appbar" />
    
    <div class="app__content">
      <BigCrunchOverlay v-if="isCrunching" :is-late-game="isLateGame" />
      <GameHeader v-if="!isCrunching || isLateGame" />
      <TabContent v-if="!isCrunching || isLateGame" />
    </div>
    <NotificationStack />
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
  background: var(--color-bg);
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
  padding-top: calc(var(--appbar-height) + var(--safe-top));
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
  pointer-events: none;
}
</style>