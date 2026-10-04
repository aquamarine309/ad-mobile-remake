import { D, Decimal } from './decimal';

const SMALL = D('1e-300');
const SCI_UPPER = D('1e1e9');
const THREE_LAYER_UPPER = D('1e9e15');

export function format(value, places = 0, placesUnder1000 = 0) {
  const num = D(value);

  if (!num.isFinite()) return 'Infinite';
  if (isNaN(num.sign) || isNaN(num.layer) || isNaN(num.mag)) return 'NaN';
  if (num.sign < 0) return '-' + format(num.neg(), places, placesUnder1000);
  if (num.eq(0)) return (0).toFixed(placesUnder1000);

  if (num.lt(SMALL)) return formatVerySmall(num, placesUnder1000);
  if (num.lt(1000)) return num.toNumber().toFixed(placesUnder1000);

  if (value.layer >= 5) {
    let mag = value.mag;
    let layer = value.layer;
    while (parseFloat(mag.toFixed(places)) >= 10) {
      mag = Math.log10(mag);
      layer++;
    }
    return `${mag.toFixed(places)}F${formatInt(layer)}`;
  }

  if (num.gte(THREE_LAYER_UPPER)) {
    return `e${format(num.log10(), places, places)}`;
  }

  if (num.gte(SCI_UPPER)) {
    const E = num.log10().floor();
    const A = num.div(Decimal.pow10(E));
    const C = E.log10().floor();
    let Bnum = E.div(Decimal.pow10(C)).toNumber();
    Bnum = Math.round(Bnum * 1000) / 1000;
    let Cnum = C;
    if (Bnum >= 10) {
      Bnum = 1;
      Cnum = Cnum.add(1);
    }
    return `${A.toNumber().toFixed(places)}e${Bnum.toFixed(3)}e${formatExponent(Cnum)}`;
  }

  return formatScientific(num, places);
}

function formatScientific(num, places) {
  const exp = num.log10().floor();
  let m = num.div(Decimal.pow10(exp)).toNumber().toFixed(places);
  if (parseFloat(m) >= 10) {
    return `${(1).toFixed(places)}e${formatExponent(exp.add(1))}`;
  }
  return `${m}e${formatExponent(exp)}`;
}

function formatVerySmall(num, places) {
  const inverted = Decimal.recip(num);
  const formatted = format(inverted, places, places);
  return formatted.replace(/e(\d)/, 'e-$1');
}

function formatExponent(exp) {
  const n = exp.toNumber();
  if (n < 100000) return n.toString();
  if (n < 1e9) return n.toLocaleString('en-US');
  return format(exp, 2, 2);
}

export function formatX(value, places, placesUnder1000) {
  return `×${format(value, places, placesUnder1000)}`;
}

export function formatPow(value, places, placesUnder1000) {
  return `^${format(value, places, placesUnder1000)}`;
}

export function formatPercents(value, places, placesUnder1000) {
  return `${format(D(value).times(100), places, placesUnder1000)}%`;
}

export function formatInt(value, placesAboveE9 = 0) {
  if (value instanceof Decimal && value.lt(1e9)) return value.toNumber().toLocaleString('en-US');
  if (typeof value === "number" && value < 1e9) return value.toLocaleString('en-US');
  return format(value, placesAboveE9);
}