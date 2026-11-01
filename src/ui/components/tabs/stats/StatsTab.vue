<script setup>
import { computed } from 'vue';
import { player } from '@/core/state/player';
import { SecretAchievements } from '@/core/achievements';
import { isInfinityUnlocked } from '@/core/progress';
import { format, formatInt } from '@/core/format';
import { formatTime, formatGameTime, formatDate } from '@/core/time/timespan';
import { t, tp } from '@/i18n';
import { Decimal } from "@/core/decimal";
import { MatterScale } from './matter-scale';

// --- General ---
const rawTotalAM = computed(() => player.records.totalAntimatter);
const totalAMText = computed(() =>
  tp('statistics_total_antimatter', rawTotalAM.value, format(rawTotalAM.value, 2))
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

const scaleText = computed(() => {
  return MatterScale.estimate(player.antimatter);
});

// --- Infinity ---
const showInfinity = computed(() => isInfinityUnlocked());

const infinitiesText = computed(() =>
  tp('statistics_infinities', player.infinity.infinities, formatInt(player.infinity.infinities))
);

const showBankedInfinities = computed(() => player.infinity.bankedInfinities.gt(0));
const bankedInfinitiesText = computed(() =>
  tp('statistics_banked_infinities', player.infinity.bankedInfinities, formatInt(player.infinity.bankedInfinities))
);

const bestInfinityText = computed(() => {
  const best = player.records.bestInfinity.time;
  if (best.gte(Decimal.dLayerSafeMax)) {
    return t("statistics_no_fastest_infinity");
  }
  return t('statistics_fastest_infinity', formatGameTime(best));
});

const thisInfinityText = computed(() =>
  t('statistics_this_infinity', formatGameTime(player.records.thisInfinity.time), formatTime(player.records.thisInfinity.realTime))
);

const bestIPminText = computed(() => {
  const ipmin = player.records.thisEternity.bestIPmin;
  if (!ipmin) return t('statistics_best_ipmin_this_eternity', t('not_available'));
  return t('statistics_best_ipmin_this_eternity', format(ipmin, 2, 2));
});

const bestIPText = computed(() => {
  const ip = player.records.thisEternity.bestIPminVal;
  if (!ip) return t('statistics_best_ip_this_eternity', t('not_available'));
  return t('statistics_best_ip_this_eternity', format(ip, 2, 2));
});
</script>

<template>
  <div class="stats">
    <h2 class="stats__title">{{ t('statistics_general') }}</h2>
    <div class="stats__line">{{ totalAMText }}</div>
    <div class="stats__line">{{ realTimeText }}</div>
    <div class="stats__line">{{ startDateText }}</div>
    <div class="stats__line">{{ newsText }}</div>
    <div class="stats__line">{{ secretText }}</div>

    <div class="stats__info-scale">
      {{ scaleText }}
    </div>

    <div v-if="showInfinity" class="stats__category">
      <h2 class="stats__title stats__title--infinity">{{ t('tab_infinity') }}</h2>
      <div class="stats__line">{{ infinitiesText }}</div>
      <div v-if="showBankedInfinities" class="stats__line">{{ bankedInfinitiesText }}</div>
      <div class="stats__line">{{ bestInfinityText }}</div>
      <div class="stats__line">{{ thisInfinityText }}</div>
      <div class="stats__line">{{ bestIPminText }}</div>
      <div class="stats__line">{{ bestIPText }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  padding: 1rem 0.7rem;
  text-align: center;
}

.stats__title {
  font-size: 2rem;       /* statistics_category_text_size 20sp */
  font-weight: bold;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.stats__title--infinity {
  color: var(--color-infinity);
}

.stats__line {
  font-size: 1.2rem;     /* statistics_text_size 12sp */
  margin: 0.4rem 0;
}

.stats__info-scale {
  font-size: 1.2rem;
  margin-top: 0.8rem;
  min-height: 3.6rem;
}

.stats__category {
  margin-top: 1.5rem;    /* statistics_space_between_categories 15dp */
}
</style>