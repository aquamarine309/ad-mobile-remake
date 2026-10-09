import { reactive } from 'vue';
import { logic, GAME_EVENT } from '@/core/events';
import { showTab, focusedAchievementId } from '@/ui/tabs/state';

let _nextId = 0;
const DEFAULT_DURATION_MS = 2000;
const LEAVE_ANIMATION_MS = 300;

const state = reactive({
  current: null,
});

const queue = [];
const onClickMap = new Map();
let hideTimer = null;
let showTimer = null;

function processQueue() {
  if (state.current !== null) return;
  if (queue.length === 0) return;

  const next = queue.shift();
  state.current = next;

  hideTimer = setTimeout(() => {
    state.current = null;
    showTimer = setTimeout(processQueue, LEAVE_ANIMATION_MS);
  }, next.duration);
}

function show(message, type, { duration = DEFAULT_DURATION_MS, onClick } = {}) {
  const id = _nextId++;
  if (onClick) onClickMap.set(id, onClick);
  queue.push({ id, message, type, duration });
  processQueue();
  return id;
}

export function dismiss(id) {
  if (state.current && state.current.id === id) {
    if (hideTimer !== null) { clearTimeout(hideTimer); hideTimer = null; }
    state.current = null;
    showTimer = setTimeout(processQueue, LEAVE_ANIMATION_MS);
  }
}

export function runOnClick(id) {
  const fn = onClickMap.get(id);
  if (fn) {
    onClickMap.delete(id);
    setTimeout(fn, 0);
  }
}

export const notifications = state;

export const notify = {
  success: (text, opts) => show(text, 'success', opts),
  error:   (text, opts) => show(text, 'error', opts),
  info:    (text, opts) => show(text, 'info', opts),
};

// --- Subscriptions ---

logic.on(GAME_EVENT.ACHIEVEMENT_UNLOCKED, ach => {
  notify.success(ach.name, {
    onClick: () => {
      showTab('achievements', ach.isSecret ? 'secret' : 'normal');
      focusedAchievementId.value = ach.id;
    },
  });
});