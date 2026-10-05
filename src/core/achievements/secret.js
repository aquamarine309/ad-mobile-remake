import { player } from '@/core/state/player';
import { AchievementState } from './achievement-state';
import { SECRET_ACHIEVEMENT_DATA } from '@/content/secret-achievements';

class SecretAchievementState extends AchievementState {
  get _bits() { return player.achievements.secret; }
}

const ALL = SECRET_ACHIEVEMENT_DATA.map(c => new SecretAchievementState(c));
const BY_ID = new Map(ALL.map(a => [a.id, a]));

export const SecretAchievements = {
  all: ALL,
  byId: BY_ID,

  get unlockedCount() {
    return ALL.filter(a => a.isUnlocked).length;
  },
};