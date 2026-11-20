/* The Study: The Rain Catcher (added Nov 20, 2026 for the 11/20/26 school day, K12 Science "Everyday Weather: The Rain Catcher").
   Loaded after science.js by index.html and do.html.
   - Rain Catcher (raingauge): Build It (the 5 Investigate steps on screen: cap off, cut where the bottle is as wide as the base, tape,
     ruler zero where the curve stops, a mark for each centimeter, marbles, water to the zero mark, the top upside down as a funnel),
     Four Rainy Days (rain falls on 4 imaginary days; he reads the gauge and fills in the Day / Rainfall table, like the school's
     "Rain Catcher" sheet), Bar Graph (he colors each day's bar, then says which day had the most and the least rain).
   - Rain Gauge Drawing (raindraw): Label It (the unit on the marks, then fill it to 4 cm), Draw It (his own drawing), Raindrop Sizes
     (pretend blue paper with wet splotches; a ruler measures each one; then the largest and the smallest).
   The pictures and wording are our own. */

/* ---------- the rain gauge picture ---------- */
const R_U = 22;   // px per centimeter in the gauge picture
function R_gauge({ lvl = 0, max = 10, labels = true, funnel = true, marbles = true, hi = null, rain = false, cloud = false, empty = false, drag = false } = {}) {
  const U = R_U, top = (rain || cloud) ? 100 : 56, y0 = top + (max + 0.6) * U, base = y0 + 44, W = 236, H = base + 10;
  const body = `M40 ${top} V${base - 20} Q40 ${base} 62 ${base} H118 Q140 ${base} 140 ${base - 20} V${top}`;
  const wy = empty ? base + 4 : y0 - Math.max(0, lvl) * U, id = 'rg' + Math.random().toString(36).slice(2, 8);
  let g = `<defs><clipPath id="${id}"><path d="${body} Z"/></clipPath></defs>`;
  if (cloud || rain) g += `<g fill="#CBD5E1" stroke="#64748B" stroke-width="3"><path d="M30 62 Q14 44 40 38 Q46 12 78 20 Q104 6 118 32 Q148 30 144 60Z"/></g>`;
  if (rain) g += `<g class="r-rain">${Array.from({ length: 9 }, (_, i) => `<line x1="${52 + i * 10}" y1="${54 + (i % 3) * 6}" x2="${50 + i * 10}" y2="${66 + (i % 3) * 6}" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" style="animation-delay:${(i * 0.13) % 0.9}s"/>`).join('')}</g>`;
  g += `<path d="${body}" fill="#F0F9FF" fill-opacity=".9"/>`;
  g += `<rect x="38" y="${wy}" width="104" height="${base - wy + 4}" fill="#60A5FA" fill-opacity=".85" clip-path="url(#${id})"/>${empty ? '' : `<line x1="40" x2="140" y1="${wy}" y2="${wy}" stroke="#DBEAFE" stroke-width="2.5" clip-path="url(#${id})"/>`}`;
  if (marbles) g += Array.from({ length: 11 }, (_, i) => `<circle cx="${52 + (i % 6) * 15 + (i > 5 ? 7 : 0)}" cy="${base - 9 - (i > 5 ? 13 : 0)}" r="7" fill="${['#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#F87171', '#38BDF8'][i % 6]}" stroke="#1F2937" stroke-width="1.5" clip-path="url(#${id})"/>`).join('');
  g += `<line x1="40" x2="140" y1="${y0}" y2="${y0}" stroke="#1F2937" stroke-width="2" stroke-dasharray="5 4"/>`;
  for (let c = 1; c <= max; c++) {
    const y = y0 - c * U, on = hi === c;
    g += `<line x1="112" x2="140" y1="${y}" y2="${y}" stroke="${on ? '#F59E0B' : '#1F2937'}" stroke-width="${on ? 4 : 2.5}"/>`;
    if (labels === true) g += `<text x="148" y="${y + 5}" font-family="Fredoka,sans-serif" font-size="15" font-weight="700" fill="${on ? '#B45309' : '#1F2937'}">${c} cm</text>`;
    else if (labels === 'blank') g += `<rect x="148" y="${y - 8}" width="40" height="16" rx="4" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  }
  g += `<text x="148" y="${y0 + 5}" font-family="Fredoka,sans-serif" font-size="15" font-weight="700" fill="#64748B">0</text>`;
  g += `<path d="${body}" fill="none" stroke="#1E3A8A" stroke-width="4"/>`;
  if (funnel) g += `<path d="M30 ${top - 30} H150 L102 ${top + 18} H78Z" fill="#BFDBFE" fill-opacity=".85" stroke="#1E3A8A" stroke-width="4" stroke-linejoin="round"/><rect x="36" y="${top - 4}" width="108" height="10" fill="#3B82F6" opacity=".55"/>`;
  return `<svg class="r-gauge${drag ? ' drag' : ''}" id="rgSvg" viewBox="0 0 ${W} ${H}" data-y0="${y0}" data-u="${U}" aria-label="Rain gauge">${g}</svg>`;
}

/* The bottle for Build It. One picture, many states: st = { cap, cuts, split, tape, zeros, ruler, marks, next, marbles, water, flip, inTop, join, top } */
function R_bottle(st = {}) {
  const S = st.split ? -36 : 0;
  const topPiece = `<path d="M90 34 L90 70 C90 96 50 104 50 132 L170 132 C170 104 130 96 130 70 L130 34 Z" fill="#E0F2FE" fill-opacity=".9" stroke="#1E3A8A" stroke-width="4" stroke-linejoin="round"/>${st.cap !== false ? `<g id="rCap" style="cursor:pointer"><rect x="84" y="12" width="52" height="24" rx="5" fill="#2563EB" stroke="#1E3A8A" stroke-width="3"/>${[94, 104, 114, 124].map(x => `<line x1="${x}" y1="16" x2="${x}" y2="32" stroke="#1E3A8A" stroke-width="2"/>`).join('')}</g>` : ''}${st.tape ? `<rect x="48" y="124" width="124" height="10" rx="3" fill="#FDE68A" stroke="#B45309" stroke-width="1.5"/>` : ''}`;
  let topT = `translate(0 ${S})`;
  if (st.flip) topT = st.inTop ? 'translate(0 98) rotate(180 110 83)' : 'translate(0 -40) rotate(180 110 83)';
  const body = 'M50 132 L50 345 Q50 370 75 370 L145 370 Q170 370 170 345 L170 132';
  let g = `<defs><clipPath id="rBodyC"><path d="${body} Z"/></clipPath></defs>`;
  g += `<path d="${body}" fill="#F0F9FF" fill-opacity=".92"/>`;
  if (st.marbles) g += Array.from({ length: Math.min(14, st.marbles) }, (_, i) => `<circle cx="${62 + (i % 7) * 16 + (i > 6 ? 8 : 0)}" cy="${360 - (i > 6 ? 14 : 0)}" r="7.5" fill="${['#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#F87171', '#38BDF8', '#FB923C'][i % 7]}" stroke="#1F2937" stroke-width="1.5" clip-path="url(#rBodyC)"/>`).join('');
  if (st.water) g += `<rect x="48" y="${372 - st.water}" width="124" height="${st.water + 2}" fill="#60A5FA" fill-opacity=".8" clip-path="url(#rBodyC)"/>`;
  if (st.zeroLine) g += `<line x1="50" x2="170" y1="345" y2="345" stroke="#DC2626" stroke-width="2.5" stroke-dasharray="6 4"/><text x="176" y="350" font-family="Fredoka" font-size="15" font-weight="700" fill="#DC2626">0</text>`;
  for (let c = 1; c <= (st.marks || 0); c++) { const y = 345 - c * 20; g += `<line x1="140" x2="170" y1="${y}" y2="${y}" stroke="#1F2937" stroke-width="2.5"/><text x="176" y="${y + 5}" font-family="Fredoka" font-size="14" font-weight="700" fill="#1F2937">${c} cm</text>`; }
  g += `<path d="${body}" fill="none" stroke="#1E3A8A" stroke-width="4"/>`;
  if (st.tape) g += `<rect x="48" y="130" width="124" height="10" rx="3" fill="#FDE68A" stroke="#B45309" stroke-width="1.5"/>`;
  if (st.join) g += `<rect x="44" y="124" width="132" height="16" rx="4" fill="#FDE68A" stroke="#B45309" stroke-width="1.5" opacity=".95"/>`;
  if (st.ruler) g += `<g><rect x="6" y="118" width="34" height="238" rx="3" fill="#FEF3C7" stroke="#B45309" stroke-width="2"/>${Array.from({ length: 11 }, (_, c) => `<line x1="28" x2="40" y1="${345 - c * 20}" y2="${345 - c * 20}" stroke="#92400E" stroke-width="2"/><text x="20" y="${349 - c * 20}" text-anchor="middle" font-family="Fredoka" font-size="12" font-weight="700" fill="#92400E">${c}</text>`).join('')}</g>`;
  if (st.next) { const y = 345 - st.next * 20; g += `<g data-mark="${st.next}" style="cursor:pointer"><rect x="40" y="${y - 14}" width="150" height="28" fill="transparent"/><circle cx="154" cy="${y}" r="11" fill="#FACC15" stroke="#B45309" stroke-width="2.5" class="r-pulse"/></g>`; }
  if (st.top !== false) g += `<g transform="${topT}">${topPiece}</g>`;
  if (st.cuts) g += [['A', 52, 82, 138], ['B', 102, 56, 164], ['C', 132, 40, 180]].map(([k, y, x1, x2]) => `<g data-cut="${k}" style="cursor:pointer"><line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="transparent" stroke-width="28"/><line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="#DC2626" stroke-width="3" stroke-dasharray="7 5"/><text x="${x2 + 6}" y="${y + 7}" font-size="20">✂️</text></g>`).join('');
  if (st.zeros) g += [['bottom', 369], ['zero', 345], ['middle', 240]].map(([k, y]) => `<g data-zero="${k}" style="cursor:pointer"><line x1="44" x2="176" y1="${y}" y2="${y}" stroke="transparent" stroke-width="26"/><line x1="44" x2="176" y1="${y}" y2="${y}" stroke="#7C3AED" stroke-width="3" stroke-dasharray="7 5"/><circle cx="190" cy="${y}" r="9" fill="#7C3AED"/></g>`).join('');
  if (st.tapeTargets) g += st.tapeTargets.map(k => `<g data-tape="${k}" style="cursor:pointer"><rect x="40" y="${k === 'top' ? 132 - 36 - 12 : 120}" width="140" height="26" rx="6" fill="#FACC15" fill-opacity=".35" stroke="#F59E0B" stroke-width="3" stroke-dasharray="6 4" class="r-pulse"/></g>`).join('');
  return `<svg class="r-bottle" id="rB" viewBox="0 -70 230 450" aria-label="Plastic bottle">${g}</svg>`;
}

/* The bar graph: 4 days, 0–10 cm. bars = [n|null], cur = the day he's coloring (taps allowed), marks = {i: 'good'|'bad'} */
function R_graph(bars, cur = -1, marks = {}, n = bars.length) {
  const X0 = 64, CW = 92, RH = 28, Y0 = 20 + 10 * RH, W = X0 + n * CW + 16, H = Y0 + 58;
  let g = '';
  for (let r = 0; r <= 10; r++) g += `<line x1="${X0}" x2="${X0 + n * CW}" y1="${Y0 - r * RH}" y2="${Y0 - r * RH}" stroke="#CBD5E1" stroke-width="1.5"/>${r ? `<text x="${X0 - 10}" y="${Y0 - r * RH + 5}" text-anchor="end" font-family="Fredoka" font-size="15" font-weight="700" fill="#334155">${r}</text>` : ''}`;
  for (let i = 0; i < n; i++) {
    const x = X0 + i * CW, v = bars[i];
    if (i === cur) g += `<rect x="${x + 2}" y="${Y0 - 10 * RH}" width="${CW - 4}" height="${10 * RH}" fill="#FEF3C7"/>`;
    if (v) g += `<rect x="${x + 16}" y="${Y0 - v * RH}" width="${CW - 32}" height="${v * RH}" fill="${['#3C7DD9', '#0F9F8F', '#8B5CF6', '#EA580C'][i % 4]}" stroke="${marks[i] === 'bad' ? '#DC2626' : marks[i] === 'good' ? '#16A34A' : '#1F2937'}" stroke-width="${marks[i] ? 4 : 2}"/>`;
    if (i === cur) for (let r = 1; r <= 10; r++) g += `<rect data-bar="${r}" x="${x + 2}" y="${Y0 - r * RH}" width="${CW - 4}" height="${RH}" fill="transparent" style="cursor:pointer"/>`;
    g += `<text x="${x + CW / 2}" y="${Y0 + 22}" text-anchor="middle" font-family="Fredoka" font-size="16" font-weight="700" fill="#1F2937">Day ${i + 1}</text>`;
    if (marks[i]) g += `<text x="${x + CW / 2}" y="${Y0 - (v || 0) * RH - 8}" text-anchor="middle" font-size="20">${marks[i] === 'good' ? '✅' : '❌'}</text>`;
  }
  g += `<line x1="${X0}" x2="${X0}" y1="${Y0 - 10 * RH}" y2="${Y0}" stroke="#1F2937" stroke-width="3"/><line x1="${X0}" x2="${X0 + n * CW}" y1="${Y0}" y2="${Y0}" stroke="#1F2937" stroke-width="3"/>`;
  g += `<text transform="translate(16 ${Y0 - 5 * RH}) rotate(-90)" text-anchor="middle" font-family="Fredoka" font-size="15" font-weight="700" fill="#334155">Rainfall (centimeters)</text><text x="${X0 + n * CW / 2}" y="${Y0 + 48}" text-anchor="middle" font-family="Fredoka" font-size="15" font-weight="700" fill="#334155">Days</text>`;
  return `<svg class="r-graph" id="rGr" viewBox="0 0 ${W} ${H}" aria-label="Bar graph of rainfall">${g}</svg>`;
}
const R_table = (vals, cur = -1) => `<table class="r-table"><tr><th>Day</th>${vals.map((_, i) => `<td class="${i === cur ? 'now' : ''}">${i + 1}</td>`).join('')}</tr><tr><th>Rainfall</th>${vals.map((v, i) => `<td class="${i === cur ? 'now' : ''}">${v == null ? '' : `${v} cm`}</td>`).join('')}</tr></table>`;

/* Splotches of rain on blue paper. sizes in cm (whole numbers, 1–5); 40 px per cm */
const R_CM = 40, R_LET = ['A', 'B', 'C', 'D', 'E'];
function R_spots(sizes) {
  const gap = 34, total = sizes.reduce((a, d) => a + d * R_CM, 0) + gap * (sizes.length - 1), W = Math.max(640, total + 80);
  let x = (W - total) / 2;
  return { W, H: 380, spots: sizes.map((d, i) => { const r = d * R_CM / 2, cx = x + r; x += d * R_CM + gap; return { d, r, cx, cy: i % 2 ? 160 : 140, k: R_LET[i] }; }) };
}
function R_blob(cx, cy, r, seed) {
  const n = 12, pts = Array.from({ length: n }, (_, k) => { const a = k * Math.PI * 2 / n, f = k % 6 === 0 ? 1 : 1 - 0.13 * Math.abs(Math.sin(seed * 7.1 + k * 2.3)); return [cx + r * f * Math.cos(a), cy + r * f * Math.sin(a) * 0.92]; });
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).join(' ')}`;
  for (let k = 0; k < n; k++) { const m = mid(pts[k], pts[(k + 1) % n]); d += ` Q${pts[k][0]} ${pts[k][1]} ${m[0]} ${m[1]}`; }
  return d + 'Z';
}
function R_paper(sizes, { cur = -1, ruler = false, done = {}, tap = false, picked = {} } = {}) {
  const L = R_spots(sizes);
  let g = `<rect x="0" y="0" width="${L.W}" height="${L.H}" rx="14" fill="#2F62C9"/>`;
  g += Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 131) % L.W}" cy="${(i * 71) % L.H}" r="1.4" fill="#5B85DC"/>`).join('');
  L.spots.forEach((s, i) => {
    g += `<g ${tap ? `data-spot="${i}" style="cursor:pointer"` : ''}><path d="${R_blob(s.cx, s.cy, s.r, i + 1)}" fill="#1E3A8A" fill-opacity="${i === cur || picked[i] ? 0.95 : 0.75}" stroke="${picked[i] === 'good' ? '#4ADE80' : picked[i] === 'bad' ? '#F87171' : i === cur ? '#FACC15' : '#1D4ED8'}" stroke-width="${i === cur || picked[i] ? 4 : 2}"/>${tap ? `<rect x="${s.cx - s.r - 8}" y="${s.cy - s.r - 8}" width="${s.r * 2 + 16}" height="${s.r * 2 + 16}" fill="transparent"/>` : ''}`
      + `<circle cx="${s.cx}" cy="${s.cy - s.r - 22}" r="15" fill="#fff" stroke="#1E3A8A" stroke-width="2"/><text x="${s.cx}" y="${s.cy - s.r - 16}" text-anchor="middle" font-family="Fredoka" font-size="17" font-weight="700" fill="#1E3A8A">${s.k}</text>`
      + (done[i] ? `<text x="${s.cx}" y="${s.cy + 6}" text-anchor="middle" font-family="Fredoka" font-size="${s.r > 25 ? 18 : 13}" font-weight="700" fill="#fff">${done[i]} cm</text>` : '') + '</g>';
  });
  if (ruler && cur >= 0) {
    const s = L.spots[cur], x0 = s.cx - s.r, y = 268, n = s.d + 1;
    g += `<line x1="${x0}" x2="${x0}" y1="${s.cy}" y2="${y}" stroke="#FDE68A" stroke-width="2" stroke-dasharray="4 4"/><line x1="${x0 + s.d * R_CM}" x2="${x0 + s.d * R_CM}" y1="${s.cy}" y2="${y}" stroke="#FDE68A" stroke-width="2" stroke-dasharray="4 4"/>`;
    g += `<g class="r-ruler"><rect x="${x0 - 14}" y="${y}" width="${n * R_CM + 28}" height="56" rx="4" fill="#FEF3C7" stroke="#B45309" stroke-width="2"/>${Array.from({ length: n * 2 + 1 }, (_, k) => { const xx = x0 + k * R_CM / 2, big = k % 2 === 0; return `<line x1="${xx}" x2="${xx}" y1="${y}" y2="${y + (big ? 22 : 12)}" stroke="#92400E" stroke-width="${big ? 2.5 : 1.5}"/>${big ? `<text x="${xx}" y="${y + 40}" text-anchor="middle" font-family="Fredoka" font-size="16" font-weight="700" fill="#92400E">${k / 2}</text>` : ''}`; }).join('')}<text x="${x0 + n * R_CM + 4}" y="${y + 52}" text-anchor="end" font-family="Fredoka" font-size="11" fill="#92400E">cm</text></g>`;
  }
  return `<svg class="r-paper" id="rP" viewBox="0 0 ${L.W} ${L.H}" aria-label="Blue paper with raindrop splotches">${g}</svg>`;
}

/* ---------- worksheet definitions ---------- */
const R_nums = (s, lo, hi) => L_ints(s).filter(n => n >= lo && n <= hi);
function R_randDays() { const pool = L_shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]); return pool.slice(0, 4).join(', '); }
function R_randDrops() { return L_shuf([1, 2, 3, 4, 5]).slice(0, 4).join(', '); }
Object.assign(LT, {
  raingauge: {
    name: 'Rain Catcher', cls: 'science',
    help: 'Build a rain gauge on screen, step by step (cut the bottle, tape it, line up the ruler, mark each centimeter, marbles, water to the zero mark, the top as a funnel), then measure the rain on 4 pretend rainy days, fill in the table, and make a bar graph. Printed: 4 rain gauges to read, the table, and a bar graph to color.',
    schools: {
      '2026-11-20': { note: 'The Rain Catcher: the 5 Investigate steps for making a rain gauge, on screen, then the “Rain Catcher” sheet (rainfall on four imaginary days, the Day / Rainfall table and the bar graph). The rain amounts are made up, since the days are imaginary.', set: () => ({ heading: 'The Rain Catcher', build: true, days: '3, 6, 2, 8', graph: true }) }
    },
    own: () => ({ heading: 'Rain Catcher', build: false, days: R_randDays(), graph: true }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'build', label: 'Build the rain gauge first (the 5 steps)', type: 'check' },
      { k: 'days', label: 'Rain on each pretend day (cm)', type: 'text', help: '2 to 4 whole numbers from 1 to 10, like 3, 6, 2, 8.' },
      { k: 'graph', label: 'Make a bar graph', type: 'check' }
    ],
    acts: () => [['rand', '🎲 New rain amounts']],
    act: (a, c) => { if (a === 'rand') c.days = R_randDays(); },
    title: c => (c.heading || '').trim() || 'Rain Catcher',
    data: c => ({ heading: LT.raingauge.title(c), build: !!c.build, days: R_nums(c.days, 1, 10).slice(0, 4), graph: !!c.graph }),
    check: d => d.days.length >= 2 ? '' : 'Type 2 to 4 rain amounts (whole numbers from 1 to 10).'
  },
  raindraw: {
    name: 'Rain Gauge Drawing', cls: 'science',
    help: 'Label a rain gauge’s marks with centimeters and fill it to 4 cm, draw his own rain gauge, then measure raindrop splotches on pretend blue paper with a ruler and find the largest and the smallest. Printed: a blank gauge to label and fill, a drawing box, and a table for doing the raindrop activity for real on a rainy day.',
    schools: {
      '2026-11-20': { note: 'The Rain Catcher follow-up: draw a rain gauge with the marks labeled in centimeters and 4 cm of rain inside, and the raindrop activity (splotches on blue paper, measured with a ruler). The splotches are pretend, so he can do it today; try the real one on the next rainy day.', set: () => ({ heading: 'Rain Gauge Drawing', fill: 4, label: true, draw: true, drops: '3, 1, 5, 2' }) }
    },
    own: () => ({ heading: 'Rain Gauge Drawing', fill: L_rand(2, 8), label: true, draw: true, drops: R_randDrops() }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'label', label: 'Label the marks and fill it with rain', type: 'check' },
      { k: 'fill', label: 'Centimeters of rain to show', type: 'num' },
      { k: 'draw', label: 'Draw his own rain gauge', type: 'check' },
      { k: 'drops', label: 'Raindrop splotch sizes (cm)', type: 'text', help: '2 to 4 different whole numbers from 1 to 5, like 3, 1, 5, 2. Leave empty to skip the raindrops.' }
    ],
    acts: () => [['rand', '🎲 New splotches']],
    act: (a, c) => { if (a === 'rand') c.drops = R_randDrops(); },
    title: c => (c.heading || '').trim() || 'Rain Gauge Drawing',
    data: c => ({ heading: LT.raindraw.title(c), label: !!c.label, fill: Math.min(10, Math.max(1, parseInt(c.fill, 10) || 4)), draw: !!c.draw, drops: [...new Set(R_nums(c.drops, 1, 5))].slice(0, 4) }),
    check: d => (d.drops.length === 1 ? 'Type at least 2 different splotch sizes, or leave it empty.' : (d.label || d.draw || d.drops.length) ? '' : 'Pick at least one part.')
  }
});
L_IDS.push('raingauge', 'raindraw');
Object.assign(L_CLASS_OF, { raingauge: 'science', raindraw: 'science' });

/* ---------- printed pages (Worksheets page only) ---------- */
if (!L_IN_DO) {
  const gaugeP = (lvl, labels = true, h = 300) => R_gauge({ lvl, labels, empty: lvl == null }).replace('class="r-gauge"', `style="height:${h}px;width:auto"`);
  LT.raingauge.print = (d, exact) => {
    const n = d.days.length;
    return L_sheetOf(nameDate() + title(d.heading, 'Read each rain gauge. Fill in the table. Make a bar graph.', star('#38BDF8'), star('#3C7DD9'))
      + `<div style="display:flex;justify-content:space-around">${d.days.map((v, i) => `<div style="text-align:center;font:700 18px Fredoka,sans-serif">${gaugeP(v, true, 250)}<div>Day ${i + 1}</div></div>`).join('')}</div>`
      + `<table style="border-collapse:collapse;margin:4px auto;font:600 20px Fredoka,sans-serif">${['Day', 'Rainfall'].map(r => `<tr><th style="border:2px solid #1F2937;padding:8px 14px;background:#E0F2FE">${r}</th>${d.days.map(() => '<td style="border:2px solid #1F2937;width:96px;height:40px"></td>').join('')}</tr>`).join('')}</table>`
      + `<div style="text-align:center">${R_graph(Array(n).fill(null)).replace('class="r-graph"', 'style="height:330px;width:auto"')}</div>`, exact, { gap: 8 });
  };
  LT.raindraw.print = (d, exact) => {
    const parts = [];
    if (d.label) parts.push(`<div style="display:flex;gap:18px;align-items:center">${gaugeP(null, 'blank', 300)}<div style="font:600 20px Andika,sans-serif;line-height:1.5">1. Write the unit next to each mark (1 cm, 2 cm, 3 cm…).<br>2. Color in <b>${d.fill} centimeters</b> of rain.</div></div>`);
    if (d.draw) parts.push(`<div style="font:600 20px Andika,sans-serif">Draw your own rain gauge. Label the marks with cm and show ${d.fill} centimeters of rain.</div><div style="border:2px solid #94A3B8;border-radius:12px;flex:0 0 ${d.drops.length ? 230 : 420}px;min-height:${d.drops.length ? 230 : 420}px"></div>`);
    if (d.drops.length) parts.push(`<div style="font:600 19px Andika,sans-serif">On a rainy day, hold blue paper out from under an umbrella. Go inside and measure each wet splotch with your ruler.</div><table style="border-collapse:collapse;font:600 18px Fredoka,sans-serif;margin:0 auto"><tr>${['Splotch', 'A', 'B', 'C', 'D', 'E'].map(t => `<th style="border:2px solid #1F2937;padding:6px 14px;background:#E0F2FE">${t}</th>`).join('')}</tr><tr><th style="border:2px solid #1F2937;padding:6px 14px;background:#E0F2FE">Size</th>${'<td style="border:2px solid #1F2937;width:80px;height:38px;text-align:right;padding-right:6px;color:#64748B">cm</td>'.repeat(5)}</tr></table><div style="font:600 19px Andika,sans-serif;text-align:center">Largest: ______ &nbsp;&nbsp; Smallest: ______</div>`);
    return L_sheetOf(nameDate() + title(d.heading, 'Rain gauges and raindrops', star('#38BDF8'), star('#F59E0B')) + parts.join(''), exact, { gap: 10 });
  };
}

/* =====================================================================
   On screen (do.html)
   ===================================================================== */
if (L_IN_DO) {
  const st = document.createElement('style'); st.textContent = `
    .s-side .ls-choices { width:100%; } .s-side .ls-choices button { font-size:21px; padding:12px 14px; }
    .r-gauge { height:min(48vh,400px); width:auto; display:block; background:#fff; border-radius:18px; padding:6px; touch-action:none; }
    .r-gauge.drag { cursor:ns-resize; box-shadow:0 0 0 4px #FACC15; }
    .r-bottle { height:min(50vh,420px); width:auto; display:block; background:#fff; border-radius:18px; padding:6px; touch-action:manipulation; }
    .r-graph { width:min(470px,92vw); height:auto; background:#fff; border-radius:16px; padding:6px; touch-action:manipulation; }
    .s-side .row.acts { flex-wrap:nowrap; gap:10px; } .s-side .row.acts .btn.big { padding:10px 14px; font-size:18px; }
    .r-paper { width:auto; max-width:96vw; height:min(40vh,330px); border-radius:14px; touch-action:manipulation; }
    .r-table { border-collapse:collapse; background:#fff; color:#1F2937; border-radius:10px; font:700 20px Fredoka,sans-serif; }
    .r-table th, .r-table td { border:2px solid #1F2937; padding:6px 12px; min-width:58px; text-align:center; } .r-table th { background:#E0F2FE; }
    .r-table td.now { background:#FEF3C7; }
    .r-rain line { animation: rdrop .9s linear infinite; }
    @keyframes rdrop { from { transform: translateY(-16px); opacity:0; } 25% { opacity:1; } to { transform: translateY(38px); opacity:0; } }
    .r-pulse { animation: rpulse 1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes rpulse { 50% { transform: scale(1.18); } }
    .r-step { font:700 18px Fredoka,sans-serif; color:#7DD3FC; }
    .r-pour { user-select:none; -webkit-user-select:none; touch-action:none; }
    .r-pour.on { background:#1D4ED8; border-color:#93C5FD; }
    .r-ruler { animation: rslide .5s ease-out; } @keyframes rslide { from { transform: translateY(40px); opacity:0; } }
    .r-flag { max-width:70vw; height:auto; border-radius:6px; box-shadow:0 2px 10px #0006; }
  `; document.head.appendChild(st);
}
const R_first = part => { const g = items.filter(x => x.part === part && !x.free); return `${g.filter(x => x.ok).length} of ${g.length} right the first time`; };
const R_waitTap = sel => new Promise(res => { app.querySelectorAll(sel).forEach(x => x.addEventListener('click', e => res(x), { once: true })); });

/* ---------- Rain Catcher ---------- */
LT.raingauge.run = () => {
  const d = SD, days = d.days, read = days.map(() => null);
  const scr = (sub, pic, side) => { app.innerHTML = L_exactTag() + head(sub) + `<div class="s-split"><div id="pic">${pic}</div><div class="s-side">${side || ''}<div class="message" id="msg"></div><div id="io"></div></div></div>`; };
  const redraw = st => { $('pic').innerHTML = R_bottle(st); };
  const hear = t => `<button class="btn" id="hearS">${SPK}Hear it again</button>`;
  const wireHear = t => { const b = $('hearS'); if (b) b.onclick = () => say(t, 0.9); };
  const nextBtn = async (label = 'Next step →') => { $('io').insertAdjacentHTML('beforeend', `<div class="row acts"><button class="btn big primary" id="rNext">${label}</button></div>`); await new Promise(r => { $('rNext').onclick = r; }); };

  const build = async () => {
    const STEPS = 5;
    await each(STEPS, i => new Promise(async res => {
      const stepTag = `<div class="r-step">Step ${i + 1} of ${STEPS}</div>`;
      if (i === 0) {
        let t = 'Step 1. First, take the cap off the bottle. Tap the cap!';
        scr('Take the cap off. Tap the blue cap!', R_bottle({}), stepTag + hear());
        wireHear(t); say(t, 0.9);
        await R_waitTap('#rCap'); fb('Pop!', 1);
        t = 'Now we cut the top off the bottle. Cut where the bottle is just as wide as the bottom. Tap the right cut line.';
        scr('Where do we cut? Find the spot where the bottle is <b>as wide as the bottom</b>. Tap that line.', R_bottle({ cap: false, cuts: true }), stepTag + hear());
        wireHear(t); say(t, 0.9);
        const why = { A: 'That’s the skinny neck. The bottom of the bottle is much wider than that.', B: 'Close! But the bottle is still curving there. Go down to where the sides get straight.' };
        const picks = [];
        await new Promise(r => {
          const on = e => { const g = e.target.closest('[data-cut]'); if (!g) return; const k = g.dataset.cut; picks.push(k);
            if (k === 'C') { setMsg('Yes! Right where it’s as wide as the bottom.', 'good'); fb('Yes! Snip snip!', 1); $('pic').removeEventListener('click', on); r(); }
            else { setMsg(why[k], 'try'); fb(why[k], 0.95); shakeEl($('rB')); if (picks.length >= 2) $('rB').querySelector('[data-cut="C"] line:nth-child(2)').setAttribute('stroke', '#16A34A'); } };
          $('pic').addEventListener('click', on);
        });
        mark('Build It', 'Where to cut the bottle (as wide as the bottom)', picks.length === 1, { A: 'the neck', B: 'the curvy shoulder', C: 'where it’s as wide as the bottom' }[picks[0]], 'where it’s as wide as the bottom', null, { text: 'Cut the top off where the bottle is as wide as its base.' }, picks.map(k => ({ A: 'the neck', B: 'the curvy shoulder', C: 'where it’s as wide as the bottom' }[k])));
        redraw({ cap: false, split: true }); await wait(700);
        t = 'The cut edges are sharp! Cover them with tape. Tap both edges.';
        const left = new Set(['top', 'body']);
        const drawTape = () => redraw({ cap: false, split: true, tape: false, tapeTargets: [...left] });
        $('msg').textContent = ''; app.querySelector('.part-title p').innerHTML = 'The edges are sharp! Tap <b>both</b> cut edges to cover them with tape.';
        drawTape(); say(t, 0.9); wireHear(t);
        await new Promise(r => { const on = e => { const g = e.target.closest('[data-tape]'); if (!g) return; left.delete(g.dataset.tape); fb('Tape!', 1.1); if (left.size) drawTape(); else { $('pic').removeEventListener('click', on); r(); } }; $('pic').addEventListener('click', on); });
        redraw({ cap: false, split: true, tape: true });
        setMsg('Safe edges! Set the top piece aside for later.', 'good'); fb('Safe edges! We’ll use the top piece later.', 0.95);
        await nextBtn();
      } else if (i === 1) {
        const t = 'Step 2. Lay the ruler next to the bottle. The zero goes where the bottle stops curving and the sides get straight. Tap that line.';
        scr('Where does the ruler’s <b>0</b> go? Where the bottle <b>stops curving</b> and the sides get straight.', R_bottle({ top: false, tape: true, zeros: true }), stepTag + hear());
        wireHear(t); say(t, 0.9);
        const why = { bottom: 'That’s the very bottom, but it’s curvy there. Go up to where the sides get straight.', middle: 'Too high! Start lower, right where the curvy bottom ends.' }, picks = [];
        await new Promise(r => {
          const on = e => { const g = e.target.closest('[data-zero]'); if (!g) return; const k = g.dataset.zero; picks.push(k);
            if (k === 'zero') { setMsg('Yes! The 0 goes right there.', 'good'); fb('Yes! The zero goes right there.', 1); $('pic').removeEventListener('click', on); r(); }
            else { setMsg(why[k], 'try'); fb(why[k], 0.95); shakeEl($('rB')); } };
          $('pic').addEventListener('click', on);
        });
        const nm = { bottom: 'the very bottom', zero: 'where the curve stops', middle: 'the middle' };
        mark('Build It', 'Where the ruler’s zero goes', picks.length === 1, nm[picks[0]], nm.zero, null, { text: 'Set the zero mark where the bottle stops curving and becomes the same width.' }, picks.map(k => nm[k]));
        redraw({ top: false, tape: true, ruler: true, zeroLine: true });
        await nextBtn();
      } else if (i === 2) {
        const t = 'Step 3. Draw a short line for each centimeter. Tap the yellow dot to draw the next line.';
        scr('Draw a line for each <b>centimeter</b>. Tap the yellow dot!', R_bottle({ top: false, tape: true, ruler: true, zeroLine: true, next: 1 }), stepTag + hear());
        wireHear(t); say(t, 0.9);
        for (let c = 1; c <= 10; c++) {
          redraw({ top: false, tape: true, ruler: true, zeroLine: true, marks: c - 1, next: c });
          await R_waitTap('[data-mark]');
          fb(`${c} centimeter${c > 1 ? 's' : ''}`, 1.05);
        }
        redraw({ top: false, tape: true, ruler: true, zeroLine: true, marks: 10 });
        await wait(500);
        app.querySelector('.part-title p').innerHTML = 'What does <b>cm</b> stand for?'; say('Look at the labels. What does c m stand for?', 0.9);
        const r = await L_choose(L_shuf(['centimeters', 'cups', 'cookies']), 'centimeters', { row: true, hint: 'It’s a way to measure how long or how high something is.' });
        mark('Build It', 'What does cm stand for?', r.ok, r.typed, 'centimeters', null, { text: 'What does cm stand for?', choices: ['centimeters', 'cups', 'cookies'] }, r.picks);
        setMsg('cm means centimeters!', 'good');
        await nextBtn();
      } else if (i === 3) {
        let t = 'Step 4. Put a big handful of marbles in the bottom. Tap the marbles button.', marbles = 0, water = 0;
        const st = () => ({ top: false, tape: true, zeroLine: true, marks: 10, marbles, water });
        scr('Put marbles in the bottom. Tap <b>🔮 Drop in marbles</b> until the bottom is covered.', R_bottle(st()), stepTag + hear() + '<button class="btn big" id="rMarb">🔮 Drop in marbles</button>');
        wireHear(t); say(t, 0.9);
        await new Promise(r => { $('rMarb').onclick = () => { marbles = Math.min(14, marbles + 5); redraw(st()); fb('Clink clink!', 1.1); if (marbles >= 14) { $('rMarb').disabled = true; r(); } }; });
        app.querySelector('.part-title p').innerHTML = 'Why do we put marbles in the bottom?'; say('Why do we put marbles in the bottom?', 0.9);
        const ch = ['so it won’t tip over', 'to make it rain', 'to color the water'];
        const r = await L_choose(L_shuf(ch), ch[0], { hint: 'Think about a windy day. The marbles make it heavy…' });
        mark('Build It', 'Why do we put marbles in the bottom?', r.ok, r.typed, ch[0], null, { text: 'The marbles make the rain gauge heavy so it stays standing.', choices: ch }, r.picks);
        // pour water up to the zero line (y 345 = 25 px above the bottom at 370)
        t = 'Now pour water in, up to the zero line. Hold the button to pour. Let go when the water touches the red zero line.';
        const ZERO = 27;   // water height (px from the bottom, 372) that touches the zero line
        app.querySelector('.part-title p').innerHTML = 'Pour water up to the <b style="color:#F87171">0 line</b>. <b>Hold</b> 💧 to pour, let go at the line!';
        $('io').innerHTML = `<div class="row acts"><button class="btn big primary r-pour" id="rPour">💧 Hold to pour</button><button class="btn big" id="rOut" hidden>🫗 Pour a little out</button></div>`;
        setMsg(''); say(t, 0.9); wireHear(t);
        let tries = 0, timer = null;
        const done = await new Promise(r => {
          const check = () => { tries++;
            if (Math.abs(water - ZERO) <= 4) { water = ZERO; redraw(st()); setMsg('Perfect! Right at the zero line.', 'good'); fb('Perfect! Right at the zero line.', 1); $('rPour').disabled = true; $('rOut').hidden = true; return r(tries); }
            if (water < ZERO) { setMsg('A little more! The water isn’t at the line yet.', 'try'); fb('A little more!', 1); }
            else { setMsg('Oops, too much! Pour a little out.', 'try'); fb('Oops, too much!', 1); $('rOut').hidden = false; } };
          const stop = () => { if (!timer) return; clearInterval(timer); timer = null; $('rPour').classList.remove('on'); check(); };
          $('rPour').onpointerdown = e => { e.preventDefault(); if (timer || $('rPour').disabled) return; $('rPour').classList.add('on'); timer = setInterval(() => { water = Math.min(90, water + 1.2); redraw(st()); }, 60); };
          ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => $('rPour').addEventListener(ev, stop));
          $('rPour').oncontextmenu = e => e.preventDefault();
          $('rOut').onclick = () => { water = Math.max(0, water - 6); redraw(st()); fb('Glug!', 1.1); if (Math.abs(water - ZERO) <= 4) check(); };
        });
        mark('Build It', 'Pour water up to the zero line', true, '', '', null, { text: `He poured water to the zero mark (${done === 1 ? 'on the first try' : `took ${done} tries`}).` }, [done === 1 ? 'first try' : `${done} tries`]); L_free();
        await nextBtn();
      } else {
        let t = 'Step 5. Remember the top piece? Turn it upside down, like a funnel. Tap Flip it.';
        let s = { tape: true, zeroLine: true, marks: 10, marbles: 14, water: 27, flip: false, split: true };
        scr('Turn the top piece <b>upside down</b>, like a funnel.', R_bottle({ ...s, split: true }), stepTag + hear() + '<div class="row"><button class="btn big" id="rFlip">🔄 Flip it</button><button class="btn big" id="rIn" disabled>⬇️ Put it in</button><button class="btn big" id="rJoin" disabled>🩹 Tape it</button></div>');
        // keep the top piece up high before it's flipped
        const showTop = () => redraw({ ...s, cap: false, split: !s.flip });
        showTop(); wireHear(t); say(t, 0.9);
        await new Promise(r => { $('rFlip').onclick = () => { s.flip = true; showTop(); fb('Flip!', 1); $('rFlip').disabled = true; $('rIn').disabled = false; say('Now put it in the bottle.', 0.95); r(); }; });
        await new Promise(r => { $('rIn').onclick = () => { s.inTop = true; showTop(); fb('In it goes!', 1); $('rIn').disabled = true; $('rJoin').disabled = false; say('Tape the two parts together.', 0.95); r(); }; });
        await new Promise(r => { $('rJoin').onclick = () => { s.join = true; showTop(); fb('Taped!', 1); $('rJoin').disabled = true; r(); }; });
        app.querySelector('.part-title p').innerHTML = 'What does the upside-down top (the funnel) do?'; say('What does the upside down top, the funnel, do?', 0.9);
        const ch = ['catches the rain and sends it into the bottle', 'keeps the bottle from tipping over', 'makes the rain colder'];
        const r = await L_choose(L_shuf(ch), ch[0], { hint: 'A funnel is wide on top and skinny at the bottom. Where does the rain go?' });
        mark('Build It', 'What does the funnel do?', r.ok, r.typed, ch[0], null, { text: 'The funnel catches the rain and sends it into the bottle.', choices: ch }, r.picks);
        $('pic').innerHTML = R_gauge({ lvl: 0 });
        app.querySelector('.part-title p').innerHTML = 'Your rain gauge is ready! 🌧️';
        confetti(); fb('Your rain gauge is ready! Scientists use rain gauges just like this one to measure rain.', 0.95);
        await nextBtn('All done →');
      }
      res();
    }));
    partDone(R_first('Build It') + '.');
  };

  const rainDays = async () => {
    await each(days.length, i => new Promise(async res => {
      const amt = days[i], say1 = `Day ${i + 1}. Here comes the rain!`;
      app.innerHTML = L_exactTag() + head(`<b>Day ${i + 1}</b>: it’s raining! 🌧️ Watch the rain gauge.`) + `<div id="tbl">${R_table(read, i)}</div><div class="s-split"><div id="pic">${R_gauge({ lvl: 0, rain: true })}</div><div class="s-side"><div class="message" id="msg"></div><div id="io"></div></div></div>`;
      say(say1, 0.95);
      // the rain fills the gauge
      await new Promise(r => { const t0 = performance.now(), ms = 1400 + amt * 260; const step = now => { const k = Math.min(1, (now - t0) / ms); if (!$('pic')) return r(); $('pic').innerHTML = R_gauge({ lvl: amt * k, rain: k < 1 }); if (k < 1) requestAnimationFrame(step); else r(); }; requestAnimationFrame(step); });
      app.querySelector('.part-title p').innerHTML = `How many <b>centimeters</b> of rain fell on Day ${i + 1}? Find the top of the water.`;
      say(`The rain stopped. How many centimeters of rain fell on day ${i + 1}? Look at the top of the water.`, 0.9);
      const r = await L_numpad(amt, { hint: 'Find the top of the water. Which mark is it next to? Count up from 0.' });
      read[i] = amt;
      $('pic').innerHTML = R_gauge({ lvl: amt, hi: amt });
      mark('Four Rainy Days', `Day ${i + 1}: how much rain?`, r.ok, r.typed, amt, null, { text: `Day ${i + 1}: the water came up to the ${amt} cm mark.` }, r.attempts);
      $('tbl').innerHTML = R_table(read);
      $('io').innerHTML = `<div class="row acts"><button class="btn big primary" id="rEmpty">${i < days.length - 1 ? '🫗 Empty it for tomorrow →' : 'Done →'}</button></div>`;
      setMsg(`${amt} cm! Writing it in the table.`, 'good');
      if (i < days.length - 1) fb('Scientists empty the rain gauge back to zero, so it is ready for the next day.', 0.95);
      await new Promise(rr => { $('rEmpty').onclick = rr; });
      res();
    }));
    partDone(R_first('Four Rainy Days') + '.');
  };

  const graph = async () => {
    const bars = days.map(() => null), n = days.length;
    await each(n, i => new Promise(async res => {
      const want = days[i]; let picks = [], cur = null;
      app.innerHTML = L_exactTag() + head(`Color the bar for <b>Day ${i + 1}</b>. Your table says <b>${want} cm</b>. Tap the graph at ${want}.`) + L_count(i, n, 'Bar') + `<div class="s-split"><div id="gr">${R_graph(bars, i)}</div><div class="s-side">${R_table(days, i)}<div class="message" id="msg"></div><div class="row acts"><button class="btn big primary" id="gChk" disabled>Check ✓</button></div></div></div>`;
      say(`Color the bar for day ${i + 1}. Your table says ${want} centimeters. Tap the graph to make the bar.`, 0.9);
      await new Promise(r => {
        $('gr').onclick = e => { const c = e.target.closest('[data-bar]'); if (!c) return; cur = +c.dataset.bar; bars[i] = cur; $('gr').innerHTML = R_graph(bars, i); $('gChk').disabled = false; fb(String(cur), 1.1); };
        $('gChk').onclick = () => {
          picks.push(cur);
          if (cur === want) { $('gr').innerHTML = R_graph(bars, -1, { [i]: 'good' }); $('gChk').disabled = true; $('gr').onclick = null; setMsg(picks.length === 1 ? 'Yes! Right the first time!' : 'You got it!', 'good'); fb(`Yes! ${want} centimeters!`, 1); nextUp(1200).then(r); }
          else { setMsg(`That bar goes up to ${cur}. Day ${i + 1} had ${want} cm. Count up from the bottom: 1, 2, 3…`, 'try'); fb(`That bar goes up to ${cur}. Count up to ${want}.`, 0.95); shakeEl($('gr')); }
        };
      });
      mark('Bar Graph', `Day ${i + 1} bar (${want} cm)`, picks.length === 1, picks[0], want, null, { text: `Color the bar for Day ${i + 1} up to ${want} cm.` }, picks.map(String));
      res();
    }));
    const big = Math.max(...days), small = Math.min(...days), dl = days.map((_, k) => `Day ${k + 1}`);
    const qs = [['Which day had the most rain?', `Day ${days.indexOf(big) + 1}`, 'Look for the tallest bar.'], ['Which day had the least rain?', `Day ${days.indexOf(small) + 1}`, 'Look for the shortest bar.']];
    await each(qs.length, j => new Promise(async res => {
      const [q, ans, hint] = qs[j];
      app.innerHTML = L_exactTag() + head(q) + `<div class="s-split"><div>${R_graph(days)}</div><div class="s-side"><div id="io"></div></div></div>`;
      say(q, 0.9);
      const r = await L_choose(dl, ans, { row: true, hint });
      mark('Bar Graph', q, r.ok, r.typed, ans, null, { text: q, choices: dl }, r.picks); res();
    }));
    confetti(); partDone(R_first('Bar Graph') + '.');
  };

  PARTS = [];
  if (d.build) PARTS.push({ name: 'Build It', run: build });
  PARTS.push({ name: 'Four Rainy Days', run: rainDays });
  if (d.graph) PARTS.push({ name: 'Bar Graph', run: graph });
  return { intro: d.build ? 'Make your own rain gauge, then measure the rain on four pretend rainy days!' : `Measure the rain on ${days.length} pretend rainy days!` };
};

/* ---------- Rain Gauge Drawing + Raindrop Sizes ---------- */
LT.raindraw.run = () => {
  const d = SD, run = Date.now().toString(36);
  const label = async () => {
    await each(2, i => new Promise(async res => {
      if (i === 0) {
        app.innerHTML = L_exactTag() + head('This rain gauge needs labels! Which unit goes next to each mark?') + `<div class="s-split"><div id="pic">${R_gauge({ labels: 'blank', empty: true })}</div><div class="s-side"><div id="io"></div></div></div>`;
        say('This rain gauge needs labels. Which unit goes next to each mark?', 0.9);
        const ch = ['cm (centimeters)', '°F (degrees)', 'lb (pounds)'];
        const r = await L_choose(L_shuf(ch), ch[0], { hint: 'We measure how high the rain goes with a ruler. What unit is on our ruler?' });
        mark('Label It', 'Which unit goes on the marks?', r.ok, r.typed, ch[0], null, { text: 'Which unit goes on a rain gauge’s marks?', choices: ch }, r.picks);
        $('pic').innerHTML = R_gauge({ empty: true }); await wait(900);
      } else {
        const want = d.fill; let lvl = 0; const picks = [];
        app.innerHTML = L_exactTag() + head(`Show <b>${want} centimeters</b> of rain. Drag the water up or down, or use the buttons.`) + `<div class="s-split"><div id="pic"></div><div class="s-side"><div class="row" style="justify-content:center"><button class="btn big" id="dDn" aria-label="Less water">⬇️ Less</button><button class="btn big" id="dUp" aria-label="More water">⬆️ More</button></div><div class="ls-big" id="dNow" style="font-size:44px">0 cm</div><div class="message" id="msg"></div><div class="row acts"><button class="btn big primary" id="dChk">Check ✓</button></div></div></div>`;
        say(`Show ${want} centimeters of rain. Drag the water up or down.`, 0.9);
        const render = () => { $('pic').innerHTML = R_gauge({ lvl, drag: true }); $('dNow').textContent = `${lvl} cm`; };
        const setL = v => { if (v !== lvl) { lvl = v; render(); fb(String(v), 1.15); } };
        const at = e => { const sv = $('rgSvg'), r = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal, y = (e.clientY - r.top) * vb.height / r.height; return Math.max(0, Math.min(10, Math.round((+sv.dataset.y0 - y) / +sv.dataset.u))); };
        let dragging = false; const up = () => { dragging = false; };
        window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
        $('pic').onpointerdown = e => { if (!e.target.closest('#rgSvg')) return; e.preventDefault(); dragging = true; setL(at(e)); };
        $('pic').onpointermove = e => { if (dragging) setL(at(e)); };
        const draw = render; render();
        $('dUp').onclick = () => setL(Math.min(10, lvl + 1)); $('dDn').onclick = () => setL(Math.max(0, lvl - 1));
        await new Promise(r => { $('dChk').onclick = () => { picks.push(lvl);
          if (lvl === want) { $('dChk').disabled = $('dUp').disabled = $('dDn').disabled = true; $('pic').onpointerdown = $('pic').onpointermove = null; $('pic').innerHTML = R_gauge({ lvl, hi: want }); setMsg(picks.length === 1 ? 'Yes! Right the first time!' : 'You got it!', 'good'); fb(`Yes! ${want} centimeters of rain!`, 1); nextUp(1300).then(r); }
          else { setMsg(`That’s ${lvl} cm. Count the marks up from 0: 1, 2, 3… stop at ${want}.`, 'try'); fb(`That's ${lvl}. Count up to ${want}.`, 0.95); shakeEl($('pic')); } }; });
        window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        mark('Label It', `Show ${want} cm of rain`, picks.length === 1, `${picks[0]} cm`, `${want} cm`, null, { text: `Fill the rain gauge to ${want} cm.` }, picks.map(p => `${p} cm`));
      }
      res();
    }));
    partDone(R_first('Label It') + '.');
  };
  const draw = async () => {
    await each(1, () => new Promise(async res => {
      const t = `Now draw your own rain gauge! Draw the lines on the side and write c m next to each one. Then color in ${d.fill} centimeters of rain.`;
      app.innerHTML = L_exactTag() + head(`Draw your own rain gauge! Draw the marks on the side and write <b>cm</b> next to them. Color in <b>${d.fill} cm</b> of rain.`) + `<button class="btn" id="hearS">${SPK}Hear it again</button><div id="lsPad"></div>`;
      $('hearS').onclick = () => say(t, 0.9); say(t, 0.9);
      const r = await L_drawPad();
      mark('Draw It', `His rain gauge with ${d.fill} cm of rain`, true, '', '', null, { img: r.img, text: `His drawing of a rain gauge: marks labeled in cm, ${d.fill} cm of rain inside.` }, []); L_free();
      res();
    }));
    partDone('What a great rain gauge!');
  };
  const drops = async () => {
    const S = d.drops, done = {};
    await each(S.length + 1, i => new Promise(async res => {
      if (i === 0) {
        app.innerHTML = L_exactTag() + head('Raindrops are not all the same size! 💧') + `<div class="s-card"><p>On a rainy day, hold a sheet of <b>blue paper</b> out from under an umbrella.</p><p>Raindrops make wet splotches on it.</p><p>Here’s some pretend paper. Let’s measure the splotches with a ruler!</p></div>${R_paper(S)}<div class="row acts"><button class="btn big primary" id="go2">Let’s measure →</button></div>`;
        say('Did you know raindrops are not all the same size? On a rainy day, hold blue paper out from under an umbrella. The raindrops make wet splotches. Let’s measure these pretend splotches with a ruler!', 0.92);
        await new Promise(r => { $('go2').onclick = r; }); return res();
      }
      const k = i - 1, s = S[k];
      app.innerHTML = L_exactTag() + head(`How wide is splotch <b>${R_LET[k]}</b>? The 0 is at one edge. Read the ruler at the other edge.`) + L_count(k, S.length, 'Splotch') + R_paper(S, { cur: k, ruler: true, done }) + '<div id="io"></div>';
      say(`How many centimeters wide is splotch ${R_LET[k]}? Read the ruler at the other edge.`, 0.9);
      const r = await L_numpad(s, { hint: 'Start at 0 on one side. Follow the dotted line on the other side down to the ruler.' });
      done[k] = s;
      mark('Raindrop Sizes', `Splotch ${R_LET[k]} (${s} cm)`, r.ok, r.typed, s, null, { text: `Measure splotch ${R_LET[k]} with the ruler: ${s} cm.` }, r.attempts);
      res();
    }));
    const big = S.indexOf(Math.max(...S)), small = S.indexOf(Math.min(...S));
    const asks = [['largest', big, 'Which splotch is the LARGEST? Tap it!'], ['smallest', small, 'Which splotch is the SMALLEST? Tap it!']];
    await each(asks.length, j => new Promise(async res => {
      const [w, ans, q] = asks[j], picks = [], picked = {};
      app.innerHTML = L_exactTag() + head(q.replace(/(LARGEST|SMALLEST)/, m => `<b>${m.toLowerCase()}</b>`)) + `<div id="pp">${R_paper(S, { done, tap: true })}</div><div class="message" id="msg"></div>`;
      say(q.toLowerCase(), 0.9);
      await new Promise(r => { $('pp').onclick = e => { const g = e.target.closest('[data-spot]'); if (!g) return; const x = +g.dataset.spot; picks.push(R_LET[x]);
        if (x === ans) { picked[x] = 'good'; $('pp').innerHTML = R_paper(S, { done, picked }); $('pp').onclick = null; setMsg(`Yes! ${R_LET[x]} is the ${w}: ${S[x]} cm.`, 'good'); fb(`Yes! ${R_LET[x]} is the ${w}!`, 1); nextUp(1300).then(r); }
        else { picked[x] = 'bad'; $('pp').innerHTML = R_paper(S, { done, tap: true, picked }); setMsg(`${R_LET[x]} is ${S[x]} cm. Look at the numbers: which one is the ${w === 'largest' ? 'biggest' : 'smallest'}?`, 'try'); fb(`${R_LET[x]} is ${S[x]} centimeters. Look again.`, 0.95); } }; });
      mark('Raindrop Sizes', `The ${w} splotch`, picks.length === 1, picks[0], R_LET[ans], null, { text: `Which splotch is the ${w}? (${S.map((v, x) => `${R_LET[x]} ${v} cm`).join(', ')})`, choices: S.map((_, x) => R_LET[x]) }, picks);
      res();
    }));
    app.innerHTML = L_exactTag() + head('Try it for real! 🌧️') + `<div class="s-card"><p>Next time it rains, do it with real blue paper and your ruler.</p><p>Which raindrop splotch is the biggest? Which is the smallest?</p></div>`;
    fb('Next time it rains, try it for real with blue paper and your ruler!', 0.95); confetti(); await wait(1800);
    partDone(R_first('Raindrop Sizes') + '.');
  };
  PARTS = [];
  if (d.label) PARTS.push({ name: 'Label It', run: label });
  if (d.draw) PARTS.push({ name: 'Draw It', run: draw });
  if (d.drops.length) PARTS.push({ name: 'Raindrop Sizes', run: drops });
  return { intro: 'Rain gauges and raindrops!' };
};
