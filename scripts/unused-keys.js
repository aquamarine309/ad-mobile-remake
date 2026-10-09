#!/usr/bin/env node
// Scan src/ for t('...') and t("...") calls, print locale keys never referenced.
// Usage: node scripts/unused-keys.js
import fs from 'node:fs';
import path from 'node:path';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(js|vue)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const used = new Set();
const files = walk('src');
const callRegex = /\bt\(\s*['"]([^'"]+)['"]/g;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = callRegex.exec(src)) !== null) used.add(m[1]);
}

const locale = JSON.parse(fs.readFileSync('src/i18n/zh-CN.json', 'utf8'));
const unused = Object.keys(locale).filter(k => !used.has(k));

console.log(`Used keys: ${used.size}`);
console.log(`Unused keys: ${unused.length} / ${Object.keys(locale).length}`);
if (unused.length > 0 && unused.length < 100) {
  console.log('\n' + unused.join('\n'));
}