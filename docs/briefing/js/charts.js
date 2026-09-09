function figure(title, inner, caption) {
  return `<figure class="figure"><h3>${title}</h3>${inner}<p class="caption">${caption}</p></figure>`;
}

export function svgBars(series, { title, yLabel, caption, colors }) {
  const w = 720;
  const h = 280;
  const pad = { t: 28, r: 16, b: 56, l: 48 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const n = series[0].values.length;
  const groupW = innerW / n;
  const barW = (groupW * 0.72) / series.length;
  const labels = series[0].labels;
  let bars = "";
  series.forEach((s, si) => {
    const color = colors[si % colors.length];
    s.values.forEach((v, i) => {
      const bh = (v / max) * innerH;
      const x = pad.l + i * groupW + groupW * 0.14 + si * barW;
      const y = pad.t + innerH - bh;
      bars += `<rect x="${x}" y="${y}" width="${barW - 2}" height="${Math.max(bh, 0)}" fill="${color}"></rect>`;
      if (v > 0) {
        bars += `<text x="${x + (barW - 2) / 2}" y="${y - 4}" text-anchor="middle" font-size="11" fill="#1a1c19">${v}</text>`;
      }
    });
  });
  const ticks = labels
    .map((lab, i) => {
      const x = pad.l + i * groupW + groupW / 2;
      return `<text x="${x}" y="${h - 22}" text-anchor="middle" font-size="11" fill="#5c635c">${lab}</text>`;
    })
    .join("");
  const yTicks = [0, max].map((v) => {
    const y = pad.t + innerH - (v / max) * innerH;
    return `<text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#5c635c">${v}</text>`;
  });
  const legend = series
    .map(
      (s, i) =>
        `<span class="legend"><span class="swatch" style="background:${colors[i]}"></span>${s.name}</span>`,
    )
    .join(" · ");
  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
      <text x="8" y="16" font-size="11" fill="#5c635c">${yLabel}</text>
      ${yTicks.join("")}${bars}${ticks}
    </svg>`;
  return figure(title, svg, `${legend}<br>${caption}`);
}

export function hBars(rows, { title, xLabel, caption, color }) {
  const w = 720;
  const rowH = 28;
  const pad = { t: 8, r: 48, b: 28, l: 200 };
  const h = pad.t + pad.b + rows.length * rowH;
  const innerW = w - pad.l - pad.r;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const bars = rows
    .map((r, i) => {
      const y = pad.t + i * rowH;
      const bw = (r.value / max) * innerW;
      return `<text x="${pad.l - 8}" y="${y + 16}" text-anchor="end" font-size="12" fill="#1a1c19">${r.label}</text>
        <rect x="${pad.l}" y="${y + 4}" width="${bw}" height="16" fill="${color}"></rect>
        <text x="${pad.l + bw + 6}" y="${y + 16}" font-size="12" fill="#1a1c19">${r.value}</text>`;
    })
    .join("");
  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
      <text x="${pad.l}" y="${h - 8}" font-size="11" fill="#5c635c">${xLabel}</text>${bars}
    </svg>`;
  return figure(title, svg, caption);
}

export function scatter(points, { title, xLabel, yLabel, caption }) {
  const w = 720;
  const h = 340;
  const pad = { t: 24, r: 120, b: 48, l: 56 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const xOf = (v) => pad.l + ((v - 1) / 4) * innerW;
  const yOf = (v) => pad.t + innerH - ((v - 1) / 4) * innerH;
  const grid = [1, 2, 3, 4, 5]
    .map(
      (v) =>
        `<line x1="${xOf(v)}" y1="${pad.t}" x2="${xOf(v)}" y2="${pad.t + innerH}" stroke="#d8d3c8"/>
         <line x1="${pad.l}" y1="${yOf(v)}" x2="${pad.l + innerW}" y2="${yOf(v)}" stroke="#d8d3c8"/>
         <text x="${xOf(v)}" y="${h - 28}" text-anchor="middle" font-size="11" fill="#5c635c">${v}</text>
         <text x="${pad.l - 10}" y="${yOf(v) + 4}" text-anchor="end" font-size="11" fill="#5c635c">${v}</text>`,
    )
    .join("");
  const dots = points
    .map((p) => {
      const fill = p.accent ? "#0b5f52" : "#1a1c19";
      return `<circle cx="${xOf(p.x)}" cy="${yOf(p.y)}" r="6" fill="${fill}"></circle>
        <text x="${xOf(p.x) + 10}" y="${yOf(p.y) + 4}" font-size="12" fill="#1a1c19">${p.label}</text>`;
    })
    .join("");
  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
      ${grid}${dots}
      <text x="${pad.l + innerW / 2}" y="${h - 8}" text-anchor="middle" font-size="12" fill="#5c635c">${xLabel}</text>
      <text x="16" y="${pad.t + innerH / 2}" font-size="12" fill="#5c635c" transform="rotate(-90 16 ${pad.t + innerH / 2})">${yLabel}</text>
    </svg>`;
  return figure(title, svg, caption);
}
