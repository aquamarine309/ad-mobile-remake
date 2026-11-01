import { DimBoost } from '@/core/pre-infinity/dimension-boost';
import { NormalChallenge } from '@/core/challenges/normal';
import { UpgradeableAutobuyerState, PRESTIGE_EVENT } from './autobuyer';
import { player } from '@/core/state/player';

const INTERVAL = 4000;

export class DimBoostAutobuyerState extends UpgradeableAutobuyerState {
  get data() { return player.auto.dimBoost; }
  get baseInterval() { return INTERVAL; }

  get isUnlocked() { return NormalChallenge(10).isCompleted; }
  get isBought() { return this.isUnlocked; }
  
  // Settings
  get limitDimBoosts() { return this.data.limitDimBoosts; }
  set limitDimBoosts(value) { this.data.limitDimBoosts = value; }
  
  get maxDimBoosts() { return this.data.maxDimBoosts; }
  set maxDimBoosts(value) { this.data.maxDimBoosts = value; }
  
  get limitUntilGalaxies() { return this.data.limitUntilGalaxies; }
  set limitUntilGalaxies(value) { this.data.limitUntilGalaxies = value; }
  
  get galaxies() { return this.data.galaxies; }
  set galaxies(value) { this.data.galaxies = value; }

  // Temporary placeholder until Break Infinity is implemented
  get isBuyMaxUnlocked() { return false; }
  
  get canTick() {
    if (!super.canTick) return false;
    return DimBoost.canBeBought && DimBoost.requirement.isSatisfied;
  }
  
  tick() {
    if (this.isBuyMaxUnlocked) {
      const galaxyCondition = !this.limitUntilGalaxies || player.galaxies.gte(this.galaxies);
      if (!DimBoost.canUnlockNewDimension && !galaxyCondition) return;
      DimBoost.buyMax();
      super.tick();
      return;
    }
  
    const limitCondition = !this.limitDimBoosts || DimBoost.purchasedBoosts.lt(this.maxDimBoosts);
    const galaxyCondition = this.limitUntilGalaxies && player.galaxies.gte(this.galaxies);
    
    if (limitCondition || galaxyCondition) {
      DimBoost.buy(); 
      super.tick();
    }
  }

  get resetTickOn() { return PRESTIGE_EVENT.ANTIMATTER_GALAXY; }
}