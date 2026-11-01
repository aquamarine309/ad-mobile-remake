import { EventHub } from "./hub";
import { GAME_EVENT } from "./events";

export const logic = new EventHub();
export const ui = new EventHub();

export function dispatch(event, ...args) {
  logic.dispatch(event, ...args);
  ui.dispatch(event, ...args);
}

export { GAME_EVENT };
