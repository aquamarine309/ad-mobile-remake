#!/usr/bin/env node
// scripts/filter-locale.js
// Filter a locale JSON so it only contains keys present in the reference locale.
import fs from 'node:fs';

const [refPath, targetPath, outPath] = process.argv.slice(2);
if (!refPath || !targetPath || !outPath) {
  console.error('Usage: node filter-locale.js <ref.json> <target.json> <out.json>');
  process.exit(1);
}

const ref = JSON.parse(fs.readFileSync(refPath, 'utf8'));
const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

const out = {};
const missing = [];

for (const key of Object.keys(ref)) {
  if (key in target) {
    out[key] = target[key];
  } else {
    missing.push(key);
  }
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log(`Kept ${Object.keys(out).length} keys, dropped ${Object.keys(target).length - Object.keys(out).length}.`);
if (missing.length > 0) {
  console.warn(`Missing in target (${missing.length}): ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '...' : ''}`);
}