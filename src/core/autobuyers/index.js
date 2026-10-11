import { D } from '@/core/decimal';
import { player } from '@/core/state/player';
import { AntimatterDimension } from '@/core/dimensions/antimatter-dimension';
import { Tickspeed } from '@/core/pre-infinity/tickspeed';
import { logic, GAME_EVENT } from '@/core/events';

// Pre-Infinity: interval is fixed. Interval upgrades come with Infinity.
const AD_INTERVALS = [500, 600, 700, 800, 900, 1000, 1100, 1200];
const AD_COST_BASE = D(1e40);
const AD_COST_MULT = D(1e10);
const TICKSPEED_INTERVAL = 500;
const TICKSPEED_COST = D(1e140);

function makeADAutobuyer(tier) {
  return {
    tier,
    get data() { return player.auto.antimatterDims[tier - 1]; },
    get interval() { return AD_INTERVALS[tier - 1]; },
    get antimatterCost() { return AD_COST_BASE.times(AD_COST_MULT.pow(tier - 1)); },
    get isBought() { return this.data.isBought; },
    get isActive() { return this.data.isActive; },
    set isActive(v) { this.data.isActive = v; },
    get mode() { return this.data.mode; },
    set mode(v) { this.data.mode = v; },

    get isUnlocked() { return this.data.isBought; },
    get canBeBought() {
      return !this.data.isBought &&
        player.records.thisInfinity.maxAM.gte(this.antimatterCost);
    },

    purchase() {
      if (!this.canBeBought) return false;
      this.data.isBought = true;
      return true;
    },

    get canTick() {
      if (!player.auto.autobuyersOn) return false;
      if (!this.data.isBought || !this.data.isActive) return false;
      if (player.records.realTimePlayed - this.data.lastTick < this.interval) return false;
      const dim = AntimatterDimension(tier);
      return dim.isAvailableForPurchase && dim.isAffordable;
    },

    tick() {
      this.data.lastTick = player.records.realTimePlayed;
      const dim = AntimatterDimension(tier);
      if (this.data.mode === '10') {
        dim.buyMax(1);
      } else {
        dim.buy();
      }
    },

    resetTick() {
      this.data.lastTick = 0;
    },
  };
}

const AD_AUTOBUYERS = Array.from({ length: 8 }, (_, i) => makeADAutobuyer(i + 1));

const TICKSPEED_AUTOBUYER = {
  get data() { return player.auto.tickspeed; },
  get interval() { return TICKSPEED_INTERVAL; },
  get antimatterCost() { return TICKSPEED_COST; },
  get isBought() { return this.data.isBought; },
  get isActive() { return this.data.isActive; },
  set isActive(v) { this.data.isActive = v; },
  get mode() { return this.data.mode; },
  set mode(v) { this.data.mode = v; },

  get isUnlocked() { return this.data.isBought; },
  get canBeBought() {
    return !this.data.isBought &&
      player.records.thisInfinity.maxAM.gte(this.antimatterCost);
  },

  purchase() {
    if (!this.canBeBought) return false;
    this.data.isBought = true;
    return true;
  },

  get canTick() {
    if (!player.auto.autobuyersOn) return false;
    if (!this.data.isBought || !this.data.isActive) return false;
    if (player.records.realTimePlayed - this.data.lastTick < this.interval) return false;
    return Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable;
  },

  tick() {
    this.data.lastTick = player.records.realTimePlayed;
    if (this.data.mode === 'max') {
      Tickspeed.buyMax();
    } else {
      Tickspeed.buy();
    }
  },

  resetTick() {
    this.data.lastTick = 0;
  },
};

export const Autobuyer = {
  antimatterDimension: tier => AD_AUTOBUYERS[tier - 1],
  antimatterDimensions: AD_AUTOBUYERS,
  tickspeed: TICKSPEED_AUTOBUYER,
};

export const Autobuyers = {
  all: () => [...AD_AUTOBUYERS, TICKSPEED_AUTOBUYER],

  unlocked() {
    return this.all().filter(a => a.isBought);
  },

  tick() {
    for (const a of this.all()) {
      if (a.canTick) a.tick();
    }
  },

  toggleAll() {
    const unlocked = this.unlocked();
    const allDisabled = unlocked.every(a => !a.isActive);
    for (const a of unlocked) a.isActive = allDisabled;
  },

  toggleADMode() {
    const allMax = AD_AUTOBUYERS.every(a => a.mode === '10');
    for (const a of AD_AUTOBUYERS) a.mode = allMax ? '1' : '10';
  },

  resetTickAll() {
    for (const a of this.all()) a.resetTick();
  },
};

// Reset autobuyer timers on DimBoost / Galaxy
logic.on(GAME_EVENT.DIMBOOST_AFTER, () => Autobuyers.resetTickAll());
logic.on(GAME_EVENT.GALAXY_RESET_AFTER, () => Autobuyers.resetTickAll());