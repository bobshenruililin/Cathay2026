function svgBars(series, { title, yLabel, caption, colors }) {
  const w = 720;
  const h = 260;
  const pad = { t: 16, r: 16, b: 48, l: 44 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const n = series[0].values.length;
  const groupW = innerW / n;
  const barW = (groupW * 0.7) / series.length;
  const labels = series[0].labels;
  let bars = "";
  series.forEach((s, si) => {
    const color = colors[si % colors.length];
    s.values.forEach((v, i) => {
      const bh = (v / max) * innerH;
      const x = pad.l + i * groupW + groupW * 0.15 + si * barW;
      const y = pad.t + innerH - bh;
      bars += `<rect x="${x}" y="${y}" width="${barW - 2}" height="${bh}" fill="${color}"></rect>`;
    });
  });
  const ticks = labels
    .map((lab, i) => {
      const x = pad.l + i * groupW + groupW / 2;
      return `<text x="${x}" y="${h - 28}" text-anchor="middle" font-size="11" fill="#5c635c">${lab}</text>`;
    })
    .join("");
  const legend = series
    .map(
      (s, i) =>
        `<span class="legend"><span style="display:inline-block;width:0.7rem;height:0.7rem;background:${colors[i]};margin-right:0.35rem;vertical-align:middle"></span>${s.name}</span>`,
    )
    .join(" · ");
  return `<figure class="figure"><h3>${title}</h3>
    <svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
      <text x="8" y="14" font-size="11" fill="#5c635c">${yLabel}</text>
      ${bars}${ticks}
    </svg>
    <p class="caption">${legend}<br>${caption}</p></figure>`;
}

const LIFESTYLE_CHAMPIONS = new Set(["cx-discovery", "gme-2021", "cathay-green", "u-explore"]);
const OPS_CHAMPIONS = new Set(["touchcx", "naar", "gingtrip", "flylab"]);

export function winnerClassChart(projects) {
  const years = [2016, 2017, 2021, 2022, 2023, 2024, 2025];
  const champs = projects.filter((p) => p.outcome === "champion");
  const series = [
    {
      name: "Lifestyle / loyalty champions",
      labels: years.map(String),
      values: years.map((y) => champs.filter((p) => p.year === y && LIFESTYLE_CHAMPIONS.has(p.id)).length),
    },
    {
      name: "Ops / inflight / cargo / hardware / employee",
      labels: years.map(String),
      values: years.map((y) => champs.filter((p) => p.year === y && OPS_CHAMPIONS.has(p.id)).length),
    },
  ];
  return svgBars(series, {
    title: "Student champions skew lifestyle; ops wins exist (Cargo 2023, trolley 2024, FlyLab 2025).",
    yLabel: "champions",
    caption: "Source: Cathay/Swire press. n = one student champion per year, plus 2025 employee FlyLab in the timeline not this stack. Small n — do not overfit.",
    colors: ["#8a8f86", "#0b5f52"],
  });
}

export function githubChart(projects) {
  const champs = projects.filter((p) => p.kind === "cathay-winner" && p.outcome === "champion");
  const parts = projects.filter((p) => p.kind === "cathay-repo" && p.id !== "reconnect");
  const series = [
    {
      name: "Public GitHub",
      labels: ["Champions in this set", "Participant repos in this set"],
      values: [
        champs.filter((p) => p.github).length,
        parts.filter((p) => p.github).length,
      ],
    },
  ];
  return svgBars(series, {
    title: "Champions in this corpus almost never ship a public repo. Participants do.",
    yLabel: "count",
    caption: "Source: gh search + this database. GME 2021 is the exception among champions listed.",
    colors: ["#0b5f52"],
  });
}

export function scoreChart(scorecard) {
  const labels = scorecard.rows.map((r) => r.label.replace(" ", "\n"));
  const clear = scorecard.rows.map((r) => 6 - r.collision);
  const series = [
    { name: "BU fit", labels, values: scorecard.rows.map((r) => r.buFit) },
    { name: "Theater", labels, values: scorecard.rows.map((r) => r.theater) },
    { name: "Adoption path", labels, values: scorecard.rows.map((r) => r.feasibility) },
    { name: "Clear lane (6 − collision)", labels, values: clear },
  ];
  return svgBars(series, {
    title: "Reconnect is strong on adoption path and BU fit; collision is high unless we pitch beside Passenger Recovery.",
    yLabel: "1–5",
    caption: "Collision inverted to “clear lane”. Scores are judgement on sourced facts, not a survey. Cite column is in the table.",
    colors: ["#0b5f52", "#4d7c73", "#8a8f86", "#8a3b12"],
  });
}

export function architectureSvg() {
  return `<figure class="figure diagram"><h3>Beside, not instead</h3>
  <svg class="chart" viewBox="0 0 720 160" role="img" aria-label="Passenger Recovery beside Reconnect">
    <rect x="16" y="24" width="280" height="112" fill="none" stroke="#1a1c19"/>
    <text x="28" y="48" font-size="14">Passenger Recovery</text>
    <text x="28" y="70" font-size="12" fill="#5c635c">mass reaccom, hours ahead</text>
    <text x="28" y="90" font-size="12" fill="#5c635c">8,000 pax / 40 min</text>
    <rect x="424" y="24" width="280" height="112" fill="none" stroke="#0b5f52"/>
    <text x="436" y="48" font-size="14" fill="#0b5f52">Reconnect desk</text>
    <text x="436" y="70" font-size="12" fill="#5c635c">last 90 min, special handling</text>
    <text x="436" y="90" font-size="12" fill="#5c635c">MCT + UM + WCH + party</text>
    <line x1="296" y1="80" x2="424" y2="80" stroke="#1a1c19"/>
    <text x="318" y="74" font-size="11">does not replace</text>
  </svg>
  <p class="caption">CX typhoon stack already exists (Rogers 2019). We fill the airborne-misconnect / PRM / UM gap on the iPad.</p></figure>`;
}
