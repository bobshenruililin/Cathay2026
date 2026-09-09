import { renderReport } from "./render.js";
import { bindExplorer } from "./explorer.js";
import { bindSlides } from "./slides.js";

const status = document.getElementById("status");

async function readJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

export async function loadBriefing() {
  const meta = await readJson("./data/meta.json");
  const patternDoc = await readJson("./data/patterns.json");
  const scorecard = await readJson("./data/scorecard.json");
  const learnings = await readJson("./data/learnings.json");
  const lists = await Promise.all(meta.files.map((f) => readJson(`./data/${f}`)));
  const projects = lists.flat();
  return {
    meta,
    patterns: patternDoc.patterns,
    projects,
    scorecard,
    learnings,
  };
}

try {
  status.hidden = false;
  status.textContent = "Loading…";
  const data = await loadBriefing();
  status.hidden = true;
  renderReport(data);
  bindExplorer(data);
  bindSlides();
} catch (err) {
  status.hidden = false;
  status.textContent =
    "Serve this folder to load data: python3 -m http.server 4173 --directory docs/briefing  (" +
    String(err) +
    ")";
}
