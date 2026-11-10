import { D } from "@/core/decimal";
import { player } from "@/core/state/player";
import { Tickspeed } from "@/core/pre-infinity/tickspeed";
import { UpgradeableAutobuyerState, PRESTIGE_EVENT } from "./autobuyer";
import { NormalChallenge } from "@/core/challenges/normal";

const INTERVAL = 500;
const COST = D(1e140);

export class TickspeedAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.tickspeed;
  }
  get baseInterval() {
    return INTERVAL;
  }
  get antimatterCost() {
    return COST;
  }

  get isUnlocked() {
    return (
      this.data.isBought ||
      player.records.thisInfinity.maxAM.gte(this.antimatterCost)
    );
  }
  get isBought() {
    return this.data.isBought;
  }

  get canBeBought() {
    return (
      !this.data.isBought &&
      player.records.thisInfinity.maxAM.gte(this.antimatterCost)
    );
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.data.isBought = true;
    return true;
  }

  get mode() {
    return this.data.mode;
  }
  
  set mode(v) {
    this.data.mode = v;
  }

  get canTick() {
    if (!super.canTick) return false;
    if (!this.data.isBought) return false;
    return Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable;
  }

  tick() {
    super.tick();
    if (this.mode === "max") Tickspeed.buyMax();
    else Tickspeed.buy();
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.DIMENSION_BOOST;
  }

  get canBeUpgraded() {
    return NormalChallenge(9).isCompleted;
  }

  toggleMode() {
    if (!this.canBeUpgraded) return;
    this.mode = this.mode === "max" ? "single" : "max";
  }
}
