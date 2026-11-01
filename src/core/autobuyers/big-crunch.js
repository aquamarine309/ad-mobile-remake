import {
  canBigCrunch,
  bigCrunchReset,
  gainedInfinityPoints,
} from "@/core/prestige/big-crunch";
import { NormalChallenge } from "@/core/challenges/normal";
import { UpgradeableAutobuyerState, PRESTIGE_EVENT } from "./autobuyer";
import { player } from "@/core/state/player";

const INTERVAL = 150000;

export class BigCrunchAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.bigCrunch;
  }
  get baseInterval() {
    return INTERVAL;
  }

  get isUnlocked() {
    return NormalChallenge(12).isCompleted;
  }
  get isBought() {
    return this.isUnlocked;
  }

  get mode() {
    return this.data.mode;
  }
  set mode(value) {
    this.data.mode = value;
  }

  get amount() {
    return this.data.amount;
  }
  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }
  set time(value) {
    this.data.time = value;
  }

  get xHighest() {
    return this.data.xHighest;
  }
  set xHighest(value) {
    this.data.xHighest = value;
  }

  get increaseWithMult() {
    return this.data.increaseWithMult;
  }
  set increaseWithMult(value) {
    this.data.increaseWithMult = value;
  }

  // Determines if the current conditions warrant a Big Crunch
  get willInfinity() {
    // Pre-Break Infinity: Only crunch when max AM is reached
    if (!player.break) {
      return canBigCrunch();
    }

    switch (this.mode) {
      case "amount":
        return gainedInfinityPoints().gte(this.amount);
      case "time":
        return player.records.thisInfinity.realTime / 1000 >= this.time;
      case "xHighest":
        return gainedInfinityPoints().gte(
          player.records.thisEternity.maxIP.times(this.xHighest),
        );
      default:
        return canBigCrunch();
    }
  }

  get canTick() {
    if (!super.canTick) return false;
    return this.willInfinity;
  }

  tick() {
    super.tick();
    if (this.willInfinity) {
      bigCrunchReset();
    }
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }
}
