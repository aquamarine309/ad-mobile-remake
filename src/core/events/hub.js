export class EventHub {
  constructor() {
    this._handlers = new Map();
  }

  on(event, fn, target) {
    let handlers = this._handlers.get(event);
    if (!handlers) {
      handlers = [];
      this._handlers.set(event, handlers);
    }
    handlers.push({ fn, target });
  }

  off(event, fn) {
    const handlers = this._handlers.get(event);
    if (!handlers) return;
    const i = handlers.findIndex((h) => h.fn === fn);
    if (i >= 0) handlers.splice(i, 1);
  }

  offAll(target) {
    for (const handlers of this._handlers.values()) {
      const kept = handlers.filter((h) => h.target !== target);
      handlers.length = 0;
      handlers.push(...kept);
    }
  }

  dispatch(event, ...args) {
    const handlers = this._handlers.get(event);
    if (!handlers) return;
    for (const { fn } of handlers) fn(...args);
  }
}
