import { player } from "@/core/state/player";
import { GAME_EVENT, dispatch } from "@/core/events";
import { bigCrunchReset } from "@/core/prestige/big-crunch";
import { NORMAL_CHALLENGE_CONFIGS } from "./normal-configs";
import { resetChallengeTransient } from "./index";
import { Currency } from "@/core/currency";

import { Decimal } from "@/core/decimal";
import { EffectState } from "@/core/mechanic";

class NormalChallengeState extends EffectState {
  constructor(config) {
    super();
    this.config = config;
    this.id = config.id;
    this.bit = 1 << config.id;
  }

  get isRunning() {
    return player.challenge.normal.current === this.id;
  }

  // Overrides EffectState. Effects are active while the challenge is running.
  get isEffectActive() {
    return this.isRunning;
  }

  effect() {
    return this.config.effect?.();
  }

  get isCompleted() {
    return (player.challenge.normal.completedBits & this.bit) !== 0;
  }

  get isUnlocked() {
    return Currency.infinities.value.gte(this.config.lockedAt);
  }

  // C1 has no best time entry
  get bestTime() {
    return this.id === 1
      ? null
      : player.challenge.normal.bestTimes[this.id - 2];
  }

  // Completion goal. All normal challenges use the antimatter cap.
  get goal() {
    return Decimal.dNumberMax;
  }

  get canComplete() {
    return Currency.antimatter.value.gte(this.goal);
  }

  start() {
    if (this.isRunning) return;
    if (this.id === 1) return; // C1 auto-completes on first crunch
    bigCrunchReset({ force: true, enteringChallenge: true });
    player.challenge.normal.current = this.id;
    resetChallengeTransient();
  }

  restart() {
    if (!this.isRunning) return;
    bigCrunchReset({ force: true, enteringChallenge: true });
    resetChallengeTransient();
  }

  exit() {
    if (!this.isRunning) return;
    bigCrunchReset({ force: true, enteringChallenge: false });
    player.challenge.normal.current = 0;
    resetChallengeTransient();
  }

  complete() {
    player.challenge.normal.completedBits |= this.bit;
    dispatch(GAME_EVENT.NORMAL_CHALLENGE_COMPLETED, this.id);
  }
}

const ALL = NORMAL_CHALLENGE_CONFIGS.map(
  (config) => new NormalChallengeState(config),
);
const BY_ID = new Map(ALL.map((c) => [c.id, c]));

export function NormalChallenge(id) {
  return BY_ID.get(id);
}

export const NormalChallenges = {
  all: ALL,
  get current() {
    const id = player.challenge.normal.current;
    return id === 0 ? null : BY_ID.get(id);
  },
  get isRunning() {
    return player.challenge.normal.current !== 0;
  },
};
