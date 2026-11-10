import { t } from "@/i18n";
import { format, formatInt } from "@/core/format";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Format a timestamp like Android's SimpleDateFormat("dd MMM yyyy HH:mm:ss", Locale.US).
 */
export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${day} ${month} ${year} ${hh}:${mm}:${ss}`;
}

/**
 * TimeSpan.toString(): long form for >= 10 s, short form below.
 */
export function formatTime(ms) {
  if (ms >= 10_000) return formatTimeLong(ms);
  return formatTimeShort(ms);
}

/**
 * "1 year, 2 days, ... and 5 seconds"
 */
export function formatTimeLong(ms) {
  const years = Math.floor(ms / 31536e6);
  if (years > 1e6) return `${format(years)} ${t("year_short")}`;
  const days = Math.floor(ms / 864e5) % 365;
  const hours = Math.floor(ms / 36e5) % 24;
  const minutes = Math.floor(ms / 6e4) % 60;
  const seconds = Math.floor(ms / 1000) % 60;

  const parts = [];
  if (years) parts.push(`${formatInt(years)} ${t("year_short")}`);
  if (days) parts.push(`${formatInt(days)} ${t("day_short")}`);
  if (hours) parts.push(`${formatInt(hours)} ${t("hour_short")}`);
  if (minutes) parts.push(`${formatInt(minutes)} ${t("minute_short")}`);
  if (seconds) parts.push(`${formatInt(seconds)} ${t("second_short")}`);
  if (parts.length === 0) return `0 ${t("second_short")}`;
  if (parts.length === 1) return parts[0];
  const sep = t("time_unit_separator");
  const lastSep = t("time_unit_separator_last");
  return parts.slice(0, -1).join(sep) + lastSep + parts[parts.length - 1];
}

/**
 * TimeSpan.toStringShort(): "3.45 seconds", "12 seconds", "HH:MM:SS",
 * "1.23 days", "4.5 years", etc.
 */
export function formatTimeShort(ms) {
  const totalSeconds = ms / 1000;

  if (totalSeconds > 5e-7 && totalSeconds < 1e-3) {
    return `${format(1000 * totalSeconds, 0, 3)} ${t("millisecond")}`;
  }
  if (totalSeconds < 1) {
    return `${formatInt(1000 * totalSeconds)} ${t("millisecond")}`;
  }
  if (totalSeconds < 10) {
    return `${format(totalSeconds, 0, 3)} ${t("second_short")}`;
  }
  if (totalSeconds < 60) {
    return `${format(totalSeconds, 0, 2)} ${t("second_short")}`;
  }
  const totalMinutes = ms / 6e4;
  const totalHours = ms / 36e5;
  if (totalHours < 100) {
    const sec = Math.floor(totalSeconds) % 60;
    const min = Math.floor(totalMinutes) % 60;
    const hr = Math.floor(totalHours);
    const pad = (v) => String(v).padStart(2, "0");
    if (hr === 0) return `${pad(min)}:${pad(sec)}`;
    return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
  }
  const totalDays = ms / 864e5;
  if (totalDays < 500) {
    return `${format(totalDays, 0, 2)} ${t("day_short")}`;
  }
  const totalYears = ms / 31536e6;
  return `${format(totalYears, 3, 2)} ${t("year_short")}`;
}

/**
 * Game-time version that safely handles Decimals above Number.MAX_VALUE.
 */
export function formatGameTime(decimalMs) {
  if (decimalMs.gte(Number.MAX_VALUE)) {
    return `${format(decimalMs)} ms`;
  }
  return formatTime(decimalMs.toNumber());
}
