import { logic, dispatch, GAME_EVENT } from '@/core/events';

import { t } from "@/i18n";
import { EffectState } from '@/core/mechanic';

export class AchievementState extends EffectState {
  constructor(config) {
    super();
    this.config = config;
    this._row = Math.floor(config.id / 10);
    this._column = config.id % 10;
    this._bitmask = 1 << (this._column - 1);

    if (config.checkEvent !== undefined) {
      const events = Array.isArray(config.checkEvent) ? config.checkEvent : [config.checkEvent];
      for (const e of events) logic.on(e, () => this.tryUnlock());
    }
  }
  
  get isEffectActive() {
    return this.isUnlocked;
  }
  
  effect() {
    return this.config.effect();
  }
  
  effects(key) {
    if (!this.isUnlocked) return undefined;
    return this.config.effects?.[key]?.();
  }

  get id() { return this.config.id; }
  get name() {
    if (this.config.name !== undefined) return this.config.name;
    const prefix = this.isSecret ? 'secret_achievement' : 'achievement';
    return t(`${prefix}_${this.id}_name`);
  }
  
  get description() {
    const description = this.config.description;
    if (description !== undefined) return description;
    const prefix = this.isSecret ? 'secret_achievement' : 'achievement';
    return t(`${prefix}_${this.id}_tooltip`);
  }
  
  get reward() { return this.config.reward; }
  
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