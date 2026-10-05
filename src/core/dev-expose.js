import { player } from './state/player';
import { D, Decimal } from './decimal';
import { DeltaTime } from './time/delta-time';
import { GameSpeed } from './time/game-speed';
import { GameLoop } from './loop/game-loop';
import { AntimatterDimension } from './dimensions/antimatter-dimension';
import { Currency } from './currency';
import { save, load } from './storage/save';
import { resetGame } from "@/game/reset";
import { Achievement, NormalAchievements, SecretAchievements } from './achievements';
import { dispatch } from '@/core/events';

export function exposeDevTools() {
  if (!import.meta.env.DEV) return;

  window.ad = {
    player,
    D, Decimal,
    DeltaTime, GameSpeed, GameLoop,
    AntimatterDimension, Currency,
    save, load, resetGame,
    Achievement, NormalAchievements, SecretAchievements,
  };

  window.ad.setAM = (v) => { player.antimatter = D(v); };
  window.ad.setD8 = (v) => { AntimatterDimension(8).amount = D(v); };
  window.ad.reset = () => resetGame();
  window.ad.dispatch = (v) => dispatch(v);
}