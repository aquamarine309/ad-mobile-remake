<script setup>
// Stub for now. Drawer button and news ticker will be added here later.
</script>

<template>
  <div class="app-bar">
    <button class="app-bar__drawer-btn" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="app-bar__title">Antimatter Dimensions</div>
  </div>
</template>

<style scoped>
.app-bar {
  display: flex;
  align-items: center;
  min-height: var(--appbar-height);
  padding: var(--safe-top) var(--gap-md) 0;
  background: var(--color-appbar-bg);
  color: var(--color-appbar-fg);
  box-shadow: 0 0.2rem 0.4rem var(--color-appbar-shadow);
}

.app-bar__drawer-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 2.4rem; /* Android 24dp */
  height: 1.8rem;
  padding: 0;
  background: transparent;
  border: none;
}

.app-bar__drawer-btn > span {
  display: block;
  height: 0.2rem;
  background: var(--color-appbar-fg); /* was --color-bg */
  border-radius: 0.1rem;
}

.app-bar__title {
  flex: 1;
  margin-left: 1.6rem; /* Android navigation icon → title gap */
  font-size: 1.4rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
