<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { stopGame } from '@/game/init';
import AppBar from './ui/components/layout/AppBar';
import GameHeader from './ui/components/layout/GameHeader';
import TabContent from './ui/components/layout/TabContent';
import TabBar from './ui/components/layout/TabBar';
import SubtabBar from './ui/components/layout/SubtabBar';
import FabRow from './ui/components/layout/FabRow';
import NotificationStack from './ui/components/layout/NotificationStack';

const bottomRef = ref(null);
let observer = null;

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
  stopGame();
  if (observer) observer.disconnect();
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
      <NotificationStack />
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