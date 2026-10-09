<script setup>
import { notifications, dismiss, runOnClick } from '@/ui/notifications';

function onNotificationClick() {
  const item = notifications.current;
  if (!item) return;
  dismiss(item.id);
  runOnClick(item.id);
}
</script>

<template>
  <div class="notification-stack">
    <Transition name="notification">
      <button
        v-if="notifications.current"
        :key="notifications.current.id"
        class="notification"
        :class="`notification--${notifications.current.type}`"
        @click="onNotificationClick"
      >
        {{ notifications.current.message }}
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.notification-stack {
  position: absolute;
  bottom: var(--bottom-nav-height, 9rem);
  left: 0;
  right: 0;
  z-index: var(--z-notification);
  pointer-events: none;
}

.notification {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  padding: 1.3rem 1.5rem;
  cursor: pointer;
  pointer-events: auto;
  text-align: center;
  box-sizing: border-box;
  border: none;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.25);
}

.notification--success {
  background-color: #ffdf00;
}

.notification--info {
  background-color: #44c0e2;
}

.notification--error {
  background-color: #ffaa22;
}

/* Enter: jump up from below the screen */
.notification-enter-active {
  animation: notification-enter 0.4s ease-out both;
}

@keyframes notification-enter {
  0% {
    transform: translateY(calc(100% + var(--bottom-nav-height, 9rem)));
  }
  70% {
    transform: translateY(-0.4rem);
  }
  100% {
    transform: translateY(0);
  }
}

.notification-leave-active {
  transition: transform 0.3s ease-in;
}

.notification-leave-to {
  transform: translateY(calc(100% + var(--bottom-nav-height, 9rem)));
}
</style>