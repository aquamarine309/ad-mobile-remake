<script setup>
import { t } from "@/i18n";
import {
  INFINITY_UPGRADE_GRID,
  InfinityUpgrade,
} from "@/core/infinity/upgrades";
import UpgradeCell from "./UpgradeCell";
import { Achievement } from "@/core/achievements";
import { computed } from "vue";
import { formatPostBreak } from "@/core/format";

const sections = [
  {
    headerKeys: ["column1", "column2"],
    cols: [INFINITY_UPGRADE_GRID[0], INFINITY_UPGRADE_GRID[1]],
  },
  {
    headerKeys: ["column3", "column4"],
    cols: [INFINITY_UPGRADE_GRID[2], INFINITY_UPGRADE_GRID[3]],
  },
];

const ipMultUpgrade = InfinityUpgrade("ipMult");
const ipOfflineMult = InfinityUpgrade("ipOffline");
const hasDLC = computed(() => Achievement(41).isUnlocked);
</script>

<template>
  <div class="infinity-upgrades">
    <!-- ipMult section -->
    <p class="infinity-upgrades__info">{{ t("infinity_upgrades_info") }}</p>
    <div v-if="hasDLC" class="ip-mult-section">
      <p class="infinity-upgrades__info">
        {{
          t(
            "ip_mult_info",
            formatPostBreak("1e3000000"),
            formatPostBreak("1e6000000"),
          )
        }}
      </p>
      <div class="ip-mult-grid">
        <UpgradeCell :upgrade="ipMultUpgrade" />
        <UpgradeCell :upgrade="ipOfflineMult" />
      </div>
    </div>

    <!-- 4x4 Grid Sections -->
    <div v-for="(section, si) in sections" :key="si" class="infinity-section">
      <div v-for="(col, ci) in section.cols" :key="ci" class="infinity-column">
        <div class="infinity-column__header">
          {{ t(section.headerKeys[ci]) }}
        </div>
        <UpgradeCell v-for="u in col" :key="u.config.id" :upgrade="u" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.infinity-upgrades {
  padding: 0.5rem 0.7rem 1rem;
}

.infinity-upgrades__info {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 0.6rem;
  margin-top: 1rem;
}

/* ipMult section styles */
.ip-mult-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.ip-mult-buyer-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.ip-mult-buyer-btn {
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  background: var(--color-btn-bg);
  border: 0.1rem solid var(--color-card-border);
  border-radius: var(--radius-sm);
  padding: 0.6rem;
  cursor: pointer;
  text-align: center;
}

.ip-mult-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.infinity-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.infinity-section:last-child {
  margin-bottom: 0;
}

.infinity-column {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.infinity-column__header {
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  padding: 0.4rem 0;
}

@media (orientation: landscape) {
  .infinity-upgrades {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    max-width: 100rem;
    margin: 0 auto;
  }

  .infinity-upgrades__info {
    grid-column: 1 / -1;
  }

  .ip-mult-section {
    grid-column: 1 / -1;
  }

  .ip-mult-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .ip-mult-grid > :first-child {
    grid-column: span 2;
  }

  .upgrade-cell-placeholder {
    grid-column: span 2;
  }

  .infinity-section {
    display: contents;
  }

  .infinity-column {
    margin-bottom: 0;
  }
}
</style>
