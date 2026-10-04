<script setup>
import { Currency } from "@/core/currency";
import { AntimatterDimension } from "@/core/dimensions/antimatter-dimension";
import { format } from "@/core/format";
import { computed } from "vue";

const antimatter = computed(() => format(Currency.antimatter.value, 2, 1));
const perSecond = computed(() =>
  format(AntimatterDimension(1).productionPerSecond, 2)
);
</script>

<template>
  <header class="header">
    <div class="header__main">You have {{ antimatter }} antimatter.</div>
    <div class="header__sub">
      You are getting {{ perSecond }} antimatter per second.
    </div>
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  padding: 1rem 0.7rem;
}

.header__main {
  font-size: 1.5rem;
  font-weight: bold;
}

.header__sub {
  font-size: 1.1rem;
  color: #666;
  margin-top: 0.2rem;
}
</style>