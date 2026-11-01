<script setup>
import { computed, ref, watch, nextTick } from "vue";
import { modalState, Modal } from "./index";
import { t } from "@/i18n";

const state = computed(() => modalState.current);
const inputValue = ref("");
const inputRef = ref(null);

watch(
  state,
  async (s) => {
    if (s?.type === "prompt") {
      inputValue.value = s.props.defaultValue ?? "";
      await nextTick();
      inputRef.value?.focus();
    }
  },
  { immediate: true },
);

const confirmText = computed(
  () => state.value?.props.confirmText ?? t("confirm"),
);
const cancelText = computed(() => state.value?.props.cancelText ?? t("cancel"));

function confirm() {
  const s = state.value;
  if (!s) return;
  if (s.type === "alert") Modal.close(undefined);
  else if (s.type === "confirm") Modal.close(true);
  else if (s.type === "prompt") Modal.close(inputValue.value);
}

function cancel() {
  const s = state.value;
  if (!s) return;
  if (s.type === "confirm") Modal.close(false);
  else if (s.type === "prompt") Modal.close(null);
  else Modal.close(undefined);
}

watch(
  state,
  async (s) => {
    if (s?.type === "prompt") {
      inputValue.value = s.props.defaultValue ?? "";
      await nextTick();
      inputRef.value?.focus();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="state" class="modal-scrim" @click.self="cancel">
    <div class="modal">
      <div class="modal__content">
        <div v-if="state.props.title" class="modal__title">
          {{ state.props.title }}
        </div>
        <textarea
          v-if="state.type === 'prompt'"
          ref="inputRef"
          v-model="inputValue"
          class="modal__input"
          rows="1"
        />
        <div class="modal__text">{{ state.props.text }}</div>
      </div>
      <div class="modal__actions">
        <button
          v-if="state.type !== 'alert'"
          class="modal__btn"
          @click="cancel"
        >
          {{ cancelText }}
        </button>
        <button class="modal__btn" @click="confirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-scrim {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--color-modal-scrim);
  animation: modal-fade-in 0.15s ease-out;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 56rem;
  max-height: 100%;
  background: var(--color-modal-bg);
  color: var(--color-modal-text);
  border: 0.3rem solid var(--color-modal-border);
  border-radius: 0.8rem;
  overflow: hidden;
}

/* dialog_alert.xml: padding 25dp top / 5dp bottom / 25dp sides */
.modal__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 2.5rem 2.5rem 0.5rem;
}

/* titleText: 18sp bold, marginBottom 5dp */
.modal__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* alertText: 16sp */
.modal__text {
  font-size: 1.6rem;
  line-height: 1.4;
  white-space: pre-line;
  word-break: break-word;
}

.modal__input {
  display: block;
  width: 100%;
  font-family: inherit;
  font-size: 1.6rem;
  line-height: 1.4;
  color: inherit;
  background: transparent;
  border: none;
  border-bottom: 0.1rem solid var(--color-modal-input-underline);
  border-radius: 0;
  padding: 0.6rem 0;
  margin: 0.4rem 0 0.8rem;
  max-height: 5.6rem;
  resize: none;
  outline: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Edge / IE */
}

.modal__input::-webkit-scrollbar {
  display: none; /* Chrome / Safari / Webkit */
  width: 0;
  height: 0;
}

.modal__input:focus {
  border-bottom-width: 0.2rem;
  outline: none;
}

/* Material TextButton.Dialog: 40dp height, 64dp minWidth, 20dp radius */
.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem 1.2rem;
}

.modal__btn {
  min-width: 6.4rem;
  height: 4rem;
  padding: 0 1.2rem;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--color-modal-btn-fg);
  background: transparent;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
}

.modal__btn:active {
  background: var(--color-card-fill-active);
}
</style>
