import { player } from '@/core/state/player';
import { Currency } from '@/core/currency';
import { Achievement } from "@/core/achievements";

/** Ordered prestige events. A higher tier implies all lower ones. */
export const PRESTIGE_EVENT = {
  DIMENSION_BOOST: 1,
  ANTIMATTER_GALAXY: 2,
  INFINITY: 3,
  ETERNITY: 4,
  REALITY: 5,
};

export class AutobuyerState {
  get data() { throw new Error('abstract: data'); }
  get isUnlocked() { throw new Error('abstract: isUnlocked'); }

  get isActive() { return this.data.isActive; }
  set isActive(v) { this.data.isActive = v; }
  toggle() { this.isActive = !this.isActive; }

  get canTick() {
    if (!player.auto.autobuyersOn) return false;
    if (!this.isActive) return false;
    return this.isUnlocked;
  }

  tick() { throw new Error('abstract: tick'); }
  reset() { /* no-op */ }
}

export class IntervaledAutobuyerState extends AutobuyerState {
  get interval() { return this.data.interval; }

  get timeSinceLastTick() {
    return player.records.realTimePlayed - this.data.lastTick;
  }

  get canTick() {
    return super.canTick && this.timeSinceLastTick >= this.interval;
  }

  tick() {
    this.data.lastTick = player.records.realTimePlayed;
  }

  /** Which prestige event resets this autobuyer's timer. */
  get resetTickOn() { return undefined; }

  /**
   * `lastTick = 0` means "fire on next tick". The next tick's canTick check
   * (e.g. dim.isAffordable) filters out cases where nothing should be bought.
   */
  resetTick(prestigeEvent) {
    if (prestigeEvent >= this.resetTickOn) this.data.lastTick = 0;
  }
}

export class UpgradeableAutobuyerState extends IntervaledAutobuyerState {
  get baseInterval() { throw new Error('abstract: baseInterval'); }

  get interval() {
    // Break Infinity upgrade halving interval is not implemented yet.
    // When added: return BreakInfinityUpgrade.autobuyerSpeed.isBought
    //   ? this.data.interval / 2
    //   : this.data.interval;
    return this.data.interval;
  }

  get cost() { return this.data.cost; }

  get hasMaxedInterval() {
    return this.data.interval <= 100;
  }
  
  get canBeUpgraded() {
    return true;
  }
  
  upgradeInterval({ free = false } = {}) {
    if (!this.canBeUpgraded) return false;
    if (player.infinity.upgrades.size === 0) return false;
    if (this.hasMaxedInterval) return false;
    if (!free && !Currency.infinityPoints.gt(this.cost)) return false;
    Currency.infinityPoints.sub(this.cost);
    this.data.cost *= 2;
    this.data.interval = Math.max(this.data.interval * 0.6, 100);
    Achievement(52).tryUnlock();
    Achievement(53).tryUnlock();
    return true;
  }

  maxIntervalForFree() {
    while (!this.hasMaxedInterval) this.upgradeInterval({ free: true });
  }
}