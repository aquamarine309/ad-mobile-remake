import { logic, dispatch, GAME_EVENT } from '@/core/events';

export class AchievementState {
  constructor(config) {
    this.config = config;
    this._row = Math.floor(config.id / 10);
    this._column = config.id % 10;
    this._bitmask = 1 << (this._column - 1);

    if (config.checkEvent !== undefined) {
      const events = Array.isArray(config.checkEvent) ? config.checkEvent : [config.checkEvent];
      for (const e of events) logic.on(e, () => this.tryUnlock());
    }
  }

  get id() { return this.config.id; }
  get name() { return this.config.name; }
  get description() { return this.config.description; }
  get row() { return this._row; }
  get column() { return this._column; }

  get _bits() { throw new Error('AchievementState._bits is abstract'); }

  get isUnlocked() {
    return (this._bits[this._row - 1] & this._bitmask) !== 0;
  }

  tryUnlock() {
    if (this.isUnlocked) return;
    if (this.config.checkRequirement !== undefined && !this.config.checkRequirement()) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    this._bits[this._row - 1] |= this._bitmask;
    dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED, this);
  }
}