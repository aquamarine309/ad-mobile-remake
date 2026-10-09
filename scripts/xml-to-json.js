#!/usr/bin/env node
import fs from "node:fs";

const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath.replace(/\.xml$/, '.json');

if (!inputPath) {
  console.error('Usage: node xml-to-json.js <input.xml> [output.json]');
  process.exit(1);
}

const xml = fs.readFileSync(inputPath, 'utf8');
const result = {};

// ---------- <string name="...">...</string> ----------
const stringRegex = /<string\s+name="([^"]+)"[^>]*?(\/>|>([\s\S]*?)<\/string>)/g;
let match;
while ((match = stringRegex.exec(xml)) !== null) {
  const key = match[1];
  const body = match[3] ?? '';
  result[key] = transformValue(body);
}

// ---------- <plurals name="...">...</plurals> ----------
const pluralsRegex = /<plurals\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/plurals>/g;
while ((match = pluralsRegex.exec(xml)) !== null) {
  const key = match[1];
  const body = match[2];
  const forms = {};
  const itemRegex = /<item\s+quantity="([^"]+)"[^>]*>([\s\S]*?)<\/item>/g;
  let itemMatch;
  while ((itemMatch = itemRegex.exec(body)) !== null) {
    forms[itemMatch[1]] = transformValue(itemMatch[2]);
  }
  result[key] = forms;
}

// ---------- <string-array name="...">...</string-array> ----------
const arrayRegex = /<string-array\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/string-array>/g;
while ((match = arrayRegex.exec(xml)) !== null) {
  const key = match[1];
  const body = match[2];
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let itemMatch;
  while ((itemMatch = itemRegex.exec(body)) !== null) {
    items.push(transformValue(itemMatch[2]));
  }
  result[key] = items;
}

function transformValue(raw) {
  let s = raw;

  // CDATA: unwrap if the whole content is a single CDATA block
  const cdata = s.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  if (cdata) {
    s = cdata[1];
  } else {
    // Decode XML entities (ampersand last)
    s = s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
      .replace(/&amp;/g, '&');
  }

  // Android-style backslash escapes: \n \t \' \" \\ \@ \?
  s = s.replace(/\\(.)/g, (_, c) => {
    switch (c) {
      case 'n': return '\n';
      case 't': return '\t';
      case "'": return "'";
      case '"': return '"';
      case '\\': return '\\';
      case '@': return '@';
      case '?': return '?';
      default: return '\\' + c;
    }
  });

  // Android positional placeholders → {N}
  s = s
    .replace(/%%/g, '\x00PCT\x00')
    .replace(/%(\d+)\$\.(\d+)f/g, '{$1:fixed($2)}')  // %1$.2f
    .replace(/%(\d+)\$s/g, '{$1}')                    // %1$s
    .replace(/%(\d+)\$d/g, '{$1}')                    // %1$d
    .replace(/%s/g, '{1}')                            // bare %s
    .replace(/%d/g, '{1}')                            // bare %d
    .replace(/\x00PCT\x00/g, '%');

  return s;
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`Wrote ${Object.keys(result).length} entries to ${outputPath}`);