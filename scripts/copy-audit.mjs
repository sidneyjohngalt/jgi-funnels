#!/usr/bin/env node
/**
 * Copy rules check (brief: "Rules, never break"). Runs on every build.
 * Fails if on-page source text contains em or en dashes, or banned words.
 * Comments are ignored, so code notes can still explain things.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "content", "config"];
const EXT = new Set([".ts", ".tsx"]);
const RULES = [
  { re: /[–—]/, why: "em or en dash" },
  { re: /\bequity\b/i, why: 'say "contractual participation units", never "equity"' },
  { re: /\bshares?\b/i, why: 'never "shares"' },
  { re: /\bbinders?\b/i, why: 'say "organizer", never "binder"' },
  { re: /\b(guaranteed returns?|projected returns?|returns of|ROI)\b/i, why: "no returns claims" },
  { re: /\bWebinarKit\b/, why: "no supplier names on the page", onlyInJsx: true },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.has(extname(p))) out.push(p);
  }
  return out;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/.*$/gm, (m, pre) => pre + " ".repeat(m.length - pre.length))
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " "));
}

// Identifiers and imports that legitimately contain a supplier name.
const SUPPLIER_OK = /(WEBINARKIT|WebinarKit(Form|Script)|components\/WebinarKit)/;

let problems = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      for (const r of RULES) {
        if (!r.re.test(line)) continue;
        if (r.onlyInJsx && SUPPLIER_OK.test(line)) continue;
        problems++;
        console.error(`${file}:${i + 1}  ${r.why}\n    ${line.trim()}`);
      }
    });
  }
}
if (problems) {
  console.error(`\nCopy audit failed: ${problems} problem(s).`);
  process.exit(1);
}
console.log("Copy audit passed: no dashes, banned words or returns claims.");
