#!/usr/bin/env node
// Search locale JSON by key pattern or value text.
// Usage:
//   node scripts/find-key.js export        → match key names containing "export"
//   node scripts/find-key.js --text 导出   → match values containing "导出"
import fs from 'node:fs';

const args = process.argv.slice(2);
const isTextSearch = args[0] === '--text';
const query = isTextSearch ? args.slice(1).join(' ') : args.join(' ');

if (!query) {
  console.error('Usage: node scripts/find-key.js <pattern>');
  console.error('       node scripts/find-key.js --text <text>');
  process.exit(1);
}

const locale = JSON.parse(fs.readFileSync('src/i18n/zh-CN.json', 'utf8'));
const needle = query.toLowerCase();

let hits = 0;
for (const [key, value] of Object.entries(locale)) {
  if (typeof value !== 'string') continue;
  const inKey = !isTextSearch && key.toLowerCase().includes(needle);
  const inValue = isTextSearch && value.toLowerCase().includes(needle);
  if (inKey || inValue) {
    console.log(`${key}\n  → ${value}\n`);
    hits++;
  }
}
console.log(`${hits} matches`);