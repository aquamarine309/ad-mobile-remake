import { createInitialPlayer, applyPlayer } from "@/core/state/player";
import { parseSave, deepAssign, writeSaveToStorage } from "@/core/storage/save";
import { dispatch, GAME_EVENT } from "@/core/events";
import { migrations } from "@/core/storage/migrations";
import { simulateAfterLoad } from "./init";

export async function importGame(text) {
  const loaded = parseSave(text);
  const offlineMs = Math.max(0, Date.now() - (loaded.lastUpdate ?? Date.now()));

  const fresh = createInitialPlayer();
  deepAssign(fresh, loaded);
  migrations.apply(fresh);
  applyPlayer(fresh);

  writeSaveToStorage(fresh);

  await simulateAfterLoad(offlineMs);
  dispatch(GAME_EVENT.GAME_LOAD);
}
