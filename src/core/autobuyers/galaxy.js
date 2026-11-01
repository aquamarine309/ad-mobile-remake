import { player } from '@/core/state/player';
import { Galaxy } from '@/core/pre-infinity/galaxy';
import { NormalChallenge } from '@/core/challenges/normal';
import { UpgradeableAutobuyerState, PRESTIGE_EVENT } from './autobuyer';
import { D, Decimal } from '@/core/decimal';

const INTERVAL = 1000;

export class GalaxyAutobuyerState extends UpgradeableAutobuyerState {
  get data() { return player.auto.galaxy; }
  get baseInterval() { return INTERVAL; }

  get isUnlocked() { return NormalChallenge(11).isCompleted; }
  get isBought() { return this.isUnlocked; }
  
  get limitGalaxies() { return this.data.limitGalaxies; }
  set limitGalaxies(value) { this.data.limitGalaxies = value; }
  
  get maxGalaxies() { return this.data.maxGalaxies; }
  set maxGalaxies(value) { this.data.maxGalaxies = value; }

  get canTick() {
    if (!super.canTick) return false;
    return Galaxy.canBeBought && Galaxy.requirement.isSatisfied;
  }
  
  tick() {
    const limit = this.limitGalaxies ? D(this.maxGalaxies) : Decimal.dLayerSafeMax;
    if (player.galaxies.gte(limit)) return;
    
    super.tick();
    Galaxy.buyMax(limit);
  }
  
  get resetTickOn() { return PRESTIGE_EVENT.INFINITY; }
}