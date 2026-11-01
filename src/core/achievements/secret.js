import { player } from '@/core/state/player';
import { AchievementState } from './achievement-state';
import { SECRET_ACHIEVEMENT_CONFIGS } from './secret-configs';

class SecretAchievementState extends AchievementState {
  get _bits() { return player.achievements.secret; }
  get isSecret() { return true; }
}

const ALL = SECRET_ACHIEVEMENT_CONFIGS.map(c => new SecretAchievementState(c));
const BY_ID = new Map(ALL.map(a => [a.id, a]));

export const SecretAchievements = {
  all: ALL,
  byId: BY_ID,

  get unlockedCount() {
    return ALL.filter(a => a.isUnlocked).length;
  },
};