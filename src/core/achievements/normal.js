import { D } from '@/core/decimal';
import { player } from '@/core/state/player';
import { Lazy } from '@/core/lazy';
import { GAME_EVENT } from '@/core/events';
import { AchievementState } from './achievement-state';
import { ACHIEVEMENT_DATA } from '@/content/achievements';

class NormalAchievementState extends AchievementState {
  get _bits() { return player.achievements.normal; }
}

const ALL = ACHIEVEMENT_DATA.map(c => new NormalAchievementState(c));
const BY_ID = new Map(ALL.map(a => [a.id, a]));

function computeCompletedRows() {
  let count = 0;
  for (let row = 1; row <= 17; row++) {
    const rowAchs = ALL.filter(a => a.row === row);
    if (rowAchs.length > 0 && rowAchs.every(a => a.isUnlocked)) count++;
  }
  return count;
}

const _multiplier = new Lazy(() => {
  const unlockedCount = ALL.filter(a => a.isUnlocked).length;
  const completedRows = computeCompletedRows();
  return D(1.03).pow(unlockedCount).times(D(1.25).pow(completedRows));
}).invalidateOn(GAME_EVENT.ACHIEVEMENT_UNLOCKED);

export const NormalAchievements = {
  all: ALL,
  byId: BY_ID,

  get unlockedCount() {
    return ALL.filter(a => a.isUnlocked).length;
  },

  get completedRows() {
    return computeCompletedRows();
  },

  get multiplier() {
    return _multiplier.value;
  },
};