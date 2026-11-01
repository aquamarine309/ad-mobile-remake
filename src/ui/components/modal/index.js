// Promise-based modal API. Mirrors Android's AlertDialog pattern:
//   Modal.alert(text)          → Promise<undefined>
//   Modal.confirm(text)        → Promise<boolean>
//   Modal.prompt(text, def)    → Promise<string | null>

import { reactive } from "vue";

export const modalState = reactive({
  current: null, // { type, props, resolve }
});

function show(type, props) {
  return new Promise((resolve) => {
    modalState.current = { type, props, resolve };
  });
}

export const Modal = {
  alert(text, opts = {}) {
    return show("alert", { text, ...opts });
  },
  confirm(text, opts = {}) {
    return show("confirm", { text, ...opts });
  },
  prompt(text, defaultValue = "", opts = {}) {
    return show("prompt", { text, defaultValue, ...opts });
  },
  close(value) {
    const c = modalState.current;
    if (!c) return;
    modalState.current = null;
    c.resolve(value);
  },
};
