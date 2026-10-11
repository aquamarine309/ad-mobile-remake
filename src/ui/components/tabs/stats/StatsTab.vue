<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { SecretAchievements } from '@/core/achievements';
import { format } from '@/core/format';
import { formatTime, formatGameTime, formatDate } from '@/core/time/timespan';
import { t, tp } from '@/i18n';

const rawTotalAM = computed(() => player.records.totalAntimatter);
const formattedTotalAM = computed(() => format(rawTotalAM.value, 2));
const totalAMText = computed(() =>
  tp('statistics_total_antimatter', rawTotalAM.value, formattedTotalAM.value)
);

const realTimeText = computed(() =>
  t('statistics_total_time_played', formatTime(player.records.realTimePlayed))
);

const startDateText = computed(() => {
  void player.records.realTimePlayed;
  const created = player.records.gameCreatedTime;
  const ago = Date.now() - created;
  return t('statistics_start_date', formatDate(created), formatTime(ago));
});

const newsText = computed(() =>
  tp('statistics_news_seen', 0, 0)
);

const secretCount = computed(() => SecretAchievements.unlockedCount);
const secretText = computed(() =>
  tp('statistics_secret_achievements', secretCount.value, secretCount.value)
);
</script>

<template>
  <div class="stats">
    <h2 class="stats__title">{{ t('statistics_general') }}</h2>
    <div class="stats__line">{{ totalAMText }}</div>
    <div class="stats__line">{{ realTimeText }}</div>
    <div class="stats__line">{{ startDateText }}</div>
    <div class="stats__line">{{ newsText }}</div>
    <div class="stats__line">{{ secretText }}</div>
  </div>
</template>

<style scoped>
.stats {
  padding: 1rem 0.7rem;
  text-align: center;
}

.stats__title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.6rem;
}

.stats__line {
  font-size: 1.2rem;
  white-space: pre-line;
  margin: 0.4rem 0;
}
</style>