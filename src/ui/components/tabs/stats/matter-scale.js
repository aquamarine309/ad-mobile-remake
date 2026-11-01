import { D } from "@/core/decimal";
import { format, formatInt } from "@/core/format";
import { formatGameTime } from "@/core/time/timespan";
import { ta, t } from "@/i18n";

const MICRO_OBJECTS = [
  { amount: D("1e-54"), nameIndex: 0 },
  { amount: D("1e-63"), nameIndex: 1 },
  { amount: D("1e-72"), nameIndex: 2 },
  { amount: D("4.22419e-105"), nameIndex: 3 },
];

const MACRO_OBJECTS = [
  { amount: D("2.82e-45"), nameIndex: 0, verb: "make" }, // protons
  { amount: D("1e-42"), nameIndex: 1, verb: "make" }, // nuclei
  { amount: D("7.23e-30"), nameIndex: 2, verb: "make" }, // Hydrogen atoms
  { amount: D("5e-21"), nameIndex: 3, verb: "make" }, // viruses
  { amount: D("9e-17"), nameIndex: 4, verb: "make" }, // red blood cells
  { amount: D("6.2e-11"), nameIndex: 5, verb: "make" }, // grains of sand
  { amount: D("5e-8"), nameIndex: 6, verb: "make" }, // grains of rice
  { amount: D("3.555e-6"), nameIndex: 7, verb: "fill" }, // teaspoons
  { amount: D("7.5e-4"), nameIndex: 8, verb: "fill" }, // wine bottles
  { amount: D("1"), nameIndex: 9, verb: "fill" }, // fridge-freezers
  { amount: D("2.5e3"), nameIndex: 10, verb: "fill" }, // Olympic-sized swimming pools
  { amount: D("2.6006e6"), nameIndex: 11, verb: "make" }, // Great Pyramids of Giza
  { amount: D("3.3e8"), nameIndex: 12, verb: "make" }, // Great Walls of China
  { amount: D("5e12"), nameIndex: 13, verb: "make" }, // large asteroids
  { amount: D("4.5e17"), nameIndex: 14, verb: "make" }, // dwarf planets
  { amount: D("1.08e21"), nameIndex: 15, verb: "make" }, // Earths
  { amount: D("1.53e24"), nameIndex: 16, verb: "make" }, // Jupiters
  { amount: D("1.41e27"), nameIndex: 17, verb: "make" }, // Suns
  { amount: D("5e32"), nameIndex: 18, verb: "make" }, // red giants
  { amount: D("8e36"), nameIndex: 19, verb: "make" }, // hypergiant stars
  { amount: D("1.7e45"), nameIndex: 20, verb: "make" }, // nebulas
  { amount: D("1.7e48"), nameIndex: 21, verb: "make" }, // Oort clouds
  { amount: D("3.3e55"), nameIndex: 22, verb: "make" }, // Local Bubbles
  { amount: D("3.3e61"), nameIndex: 23, verb: "make" }, // galaxies
  { amount: D("5e68"), nameIndex: 24, verb: "make" }, // Local Groups
  { amount: D("1e73"), nameIndex: 25, verb: "make" }, // Sculptor Voids
  { amount: D("3.4e80"), nameIndex: 26, verb: "make" }, // observable universes
  { amount: D("1e113"), nameIndex: 27, verb: "make" }, // Dimensions
  { amount: D(2).pow(1024), nameIndex: 28, verb: "make" }, // Infinity Dimensions
  { amount: D("1e65000"), nameIndex: 29, verb: "make" }, // Time Dimensions
];

export const MatterScale = {
  proton: D("2.82e-45"),

  estimate(matter) {
    if (matter.gt(D("1e100000"))) {
      const time = formatGameTime(matter.log10().div(3).times(1000));
      return t("statistics_scale_base_3", formatInt(3), time);
    }

    const planck = D("4.22419e-105");
    const planckedMatter = matter.times(planck);

    if (planckedMatter.gt(this.proton)) {
      const scale = this.macroScale(planckedMatter);
      const amount = format(planckedMatter.div(scale.amount), 2, 1);
      const names = ta("statistics_scale_strings");
      const name = names[scale.nameIndex];

      const key =
        scale.verb === "fill"
          ? "statistics_scale_base_1"
          : "statistics_scale_base_2";
      return t(key, name, amount);
    }

    const scale = this.microScale(matter);
    const ratio = format(this.proton.div(scale.amount).div(matter), 2, 1);
    const names = ta("statistics_scale_strings_2");
    return t("statistics_scale_base_0", ratio, names[scale.nameIndex]);
  },

  microScale(matter) {
    for (let i = 0; i < MICRO_OBJECTS.length; i++) {
      const scale = MICRO_OBJECTS[i];
      if (matter.times(scale.amount).lt(this.proton)) {
        return scale;
      }
    }
    throw new Error("Cannot determine smallest antimatter scale");
  },

  macroScale(matter) {
    const last = MACRO_OBJECTS[MACRO_OBJECTS.length - 1];
    if (matter.gte(last.amount)) return last;
    let low = 0;
    let high = MACRO_OBJECTS.length;
    while (low !== high) {
      const mid = Math.floor((low + high) / 2);
      if (MACRO_OBJECTS[mid].amount.lte(matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return MACRO_OBJECTS[high - 1];
  },
};
