#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const meta = JSON.parse(readFileSync(join(dataDir, "meta.json"), "utf8"));
const projects = meta.files.flatMap((f) => JSON.parse(readFileSync(join(dataDir, f), "utf8")));

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

const headers = [
  "id",
  "name",
  "year",
  "kind",
  "org",
  "bu",
  "outcome",
  "artifact",
  "copyOrFoil",
  "confidence",
  "github",
  "oneLiner",
  "reconnectTakeaway",
  "patterns",
  "sourceUrls",
];

const lines = [headers.join(",")];
for (const p of projects) {
  lines.push(
    [
      p.id,
      p.name,
      p.year,
      p.kind,
      p.org,
      p.bu,
      p.outcome,
      p.artifact,
      p.copyOrFoil,
      p.confidence,
      p.github,
      p.oneLiner,
      p.reconnectTakeaway,
      (p.patterns || []).join("|"),
      (p.sources || []).map((s) => s.url).join("|"),
    ]
      .map(csvEscape)
      .join(","),
  );
}
writeFileSync(join(dataDir, "projects.csv"), lines.join("\n") + "\n");
console.log(`Wrote ${projects.length} rows to data/projects.csv`);
