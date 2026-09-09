import { foilChart, githubChart, patternChart, scoreScatter, winnerClassChart } from "./charts-insight.js";
import {
  failureHtml,
  learnHtml,
  patternHtml,
  scoreHtml,
  timelineHtml,
  verdictHtml,
} from "./sections.js";

export function renderReport(data) {
  const { meta, patterns, projects, scorecard, learnings, insights } = data;
  document.getElementById("report").innerHTML = `
    ${verdictHtml(meta)}
    <section id="charts" class="slide">
      <h2>What the record actually shows</h2>
      ${winnerClassChart(projects)}
      ${githubChart(projects)}
      ${patternChart(patterns, projects)}
      ${foilChart(projects)}
    </section>
    ${patternHtml(patterns)}
    ${failureHtml(insights)}
    ${timelineHtml(projects)}
    <section id="scorecard" class="slide">
      <h2>Reconnect scorecard</h2>
      ${scoreScatter(scorecard)}
      ${scoreHtml(scorecard)}
    </section>
    ${learnHtml(learnings)}
    <section id="explorer" class="slide">
      <h2>Project explorer</h2>
      <p id="card-count" class="caption"></p>
      <div class="filters" id="filters"></div>
      <div class="card-grid" id="cards"></div>
    </section>
    <section id="howto" class="slide howto">
      <h2>How to use this pack</h2>
      <p>Serve the folder (Chrome will not fetch JSON from <code>file://</code>):</p>
      <p><code>python3 -m http.server 4173 --directory docs/briefing</code></p>
      <p>Then http://localhost:4173. PDF: <code>Reconnect-competitive-intel.pdf</code>.
      CSV: <code>data/projects.csv</code>. Markdown: <code>docs/competitive/</code>.
      Present: <code>#slides</code>, then ← →.</p>
    </section>`;
}
