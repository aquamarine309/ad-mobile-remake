<script setup>
// Stub for now. Drawer button and news ticker will be added here later.
</script>

<template>
  <div class="app-bar">
    <button class="app-bar__drawer-btn" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="app-bar__title"></div>
  </div>
</template>

<style scoped>
.app-bar {
  display: flex;
  align-items: center;
  min-height: var(--appbar-height);
  padding: var(--safe-top) var(--gap-md) 0;
  background: var(--color-teal);
  color: var(--color-text-light);
}

.app-bar__drawer-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 2rem;
  height: 1.4rem;
  padding: 0;
  background: transparent;
  border: none;
}

.app-bar__drawer-btn > span {
  display: block;
  height: 0.2rem;
  background: var(--color-bg);
  border-radius: 0.1rem;
}

.app-bar__title {
  flex: 1;
  margin-left: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
}
</style>