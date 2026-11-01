import { player } from '@/core/state/player';
import { logic, GAME_EVENT } from '@/core/events';
import { PRESTIGE_EVENT } from './autobuyer';
import { AntimatterDimensionAutobuyerState } from './antimatter-dimension';
import { TickspeedAutobuyerState } from './tickspeed';
import { DimBoostAutobuyerState } from './dimboost';
import { GalaxyAutobuyerState } from './galaxy';
import { BigCrunchAutobuyerState } from './big-crunch';

const AD_AUTOBUYERS = [1, 2, 3, 4, 5, 6, 7, 8]
  .map(t => new AntimatterDimensionAutobuyerState(t));

export const Autobuyer = {
  antimatterDimension: t => AD_AUTOBUYERS[t - 1],
  antimatterDimensions: AD_AUTOBUYERS,
  tickspeed: new TickspeedAutobuyerState(),
  dimBoost: new DimBoostAutobuyerState(),
  galaxy: new GalaxyAutobuyerState(),
  bigCrunch: new BigCrunchAutobuyerState(),
};

export const Autobuyers = {
  all: [
    ...AD_AUTOBUYERS,
    Autobuyer.tickspeed,
    Autobuyer.dimBoost,
    Autobuyer.galaxy,
    Autobuyer.bigCrunch,
  ],

  /** Autobuyers whose unlock condition is currently satisfied. */
  get unlocked() {
    return this.all.filter(a => a.isUnlocked);
  },

  tick() {
    if (!player.auto.autobuyersOn) return;
    for (const a of this.all) {
      if (a.canTick) a.tick();
    }
  },

  toggleAll() {
    const unlocked = this.unlocked;
    const allOff = unlocked.every(a => !a.isActive);
    for (const a of unlocked) a.isActive = allOff;
  },

  toggleADMode() {
    const allMax = AD_AUTOBUYERS.every(a => a.mode === '10');
    for (const a of AD_AUTOBUYERS) a.mode = allMax ? '1' : '10';
  },

  resetTick(prestigeEvent) {
    for (const a of this.all) a.resetTick(prestigeEvent);
  },
};

logic.on(GAME_EVENT.DIMBOOST_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.DIMENSION_BOOST));
logic.on(GAME_EVENT.GALAXY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.ANTIMATTER_GALAXY));
logic.on(GAME_EVENT.BIG_CRUNCH_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.INFINITY));