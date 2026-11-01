<script setup>
import { ref, computed, watch } from "vue";
import { Decimal } from "@/core/decimal";
import { format } from "@/core/format";
import { SecretAchievement } from "@/core/achievements";

const props = defineProps({
  autobuyer: { type: Object, required: true },
  property: { type: String, required: true },
  type: { type: String, required: true },
});

const isValid = ref(true);
const isFocused = ref(false);
const displayValue = ref("0");
let actualValue = null;

// --- Parsing Logic ---
const AutobuyerInputFunctions = {
  decimal: {
    areEqual: (value, other) => Decimal.eq(value, other),
    formatValue: (value) => format(value, 2, 2),
    copyValue: (value) => new Decimal(value),
    tryParse: (input) => {
      if (!input) return undefined;

      // Remove commas and spaces to prepare for parsing
      const cleanInput = input.replaceAll(",", "").trim().toLowerCase();
      if (!cleanInput) return undefined;

      // Must contain at least one digit
      if (!/[0-9]/u.test(cleanInput)) return undefined;

      try {
        // Break_Eternity's fromString is highly robust and natively handles:
        // Standard (123), Scientific (1e100), e-notation (e100), Mixed scientific (2.5e10.5),
        // Tetration (10^^100), etc.
        const decimal = Decimal.fromString(cleanInput);

        // b_e returns 0 for unparseable strings (like "abc").
        // We reject 0 results unless the user explicitly typed something that equals 0.
        if (decimal.eq(0) && !/^[+-]?0*(\.0*)?$/u.test(cleanInput)) {
          return undefined;
        }

        if (decimal.isNan()) return undefined;

        return decimal;
      } catch (e) {
        console.log("Parse Failed QwQ", e);
        return undefined;
      }
    },
  },
  float: {
    areEqual: (value, other) => value === other,
    formatValue: (value) => value.toString(),
    copyValue: (value) => value,
    tryParse: (input) => {
      const float = parseFloat(input);
      return isNaN(float) ? undefined : float;
    },
  },
  int: {
    areEqual: (value, other) => value === other,
    formatValue: (value) => value.toString(),
    copyValue: (value) => value,
    tryParse: (input) => {
      if (!input) return undefined;
      if (!/^\d+$/u.test(input.replaceAll(",", ""))) return undefined;
      const int = parseInt(input, 10);
      return isNaN(int) || !Number.isInteger(int) ? undefined : int;
    },
  },
};

const inputType = computed(() => (props.type === "int" ? "number" : "text"));

const validityClass = computed(() =>
  isValid.value ? "" : "autobuyer-card__input--invalid",
);

const typeFunctions = computed(() => {
  const fn = AutobuyerInputFunctions[props.type];
  if (!fn) throw new Error("Unknown autobuyer input type");
  return fn;
});

// Sync from autobuyer state to UI
function updateActualValue() {
  const stateValue = props.autobuyer[props.property];
  if (stateValue === undefined) {
    throw new Error(`The property "${props.property}" does not exist, baka`);
  }
  if (areEqual(actualValue, stateValue)) return;
  actualValue = typeFunctions.value.copyValue(stateValue);
  displayValue.value = typeFunctions.value.formatValue(actualValue);
}

function areEqual(value, other) {
  if (other === undefined || value === undefined) return false;
  return typeFunctions.value.areEqual(value, other);
}

// Watch for external changes (e.g. from game ticks)
watch(
  () => props.autobuyer[props.property],
  () => {
    if (!isFocused.value) updateActualValue();
  },
  { immediate: true },
);

function handleInput(event) {
  const input = event.target.value;
  displayValue.value = input;
  if (input.length === 0) {
    isValid.value = false;
    return;
  }
  const parsedValue = typeFunctions.value.tryParse(input);
  isValid.value = parsedValue !== undefined;
  if (isValid.value) {
    actualValue = typeFunctions.value.copyValue(parsedValue);
  }
}

function handleFocus() {
  isFocused.value = true;
}

function handleChange(event) {
  if (displayValue.value === "69") {
    SecretAchievement(28).tryUnlock(); // Assuming your achievements use tryUnlock
  }

  if (isValid.value && actualValue !== null) {
    props.autobuyer[props.property] =
      typeFunctions.value.copyValue(actualValue);
  } else {
    updateActualValue();
  }

  displayValue.value = typeFunctions.value.formatValue(actualValue);
  isValid.value = true;
  isFocused.value = false;
  event.target.blur();
}
</script>

<template>
  <input
    :value="displayValue"
    :class="validityClass"
    :type="inputType"
    class="autobuyer-card__input"
    @change="handleChange"
    @focus="handleFocus"
    @input="handleInput"
  />
</template>

<style scoped>
.autobuyer-card__input {
  width: 100%;
  background: transparent;
  border: 0.1rem solid var(--color-card-border);
  color: var(--color-text);
  text-align: left;
  font-family: inherit;
  font-size: 1.2rem;
  padding: 0.5rem 0.4rem;
  border-radius: 0.2rem;
}

.autobuyer-card__input:focus {
  outline: none;
  border-color: var(--color-unlockable);
}
</style>
