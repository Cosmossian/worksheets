/* Capital or small letter? (added Nov 9, 2026; Dylan: "he shouldn't write CaKe")
   Checks free handwriting against the word(s) it should say, by how tall each letter is on the handwriting lines:
   small letters like a c e m n o r s u (and g p q y above the line) stay under the dashed middle line; capitals reach the top line.
   It can't tell K from k, or B from b, because both are tall. Used by lessons.js (L_pad) and fixup.html (Rainbow Write line 4).

   hcCheck(rows, text) → [{ ch, word, want: 'small'|'capital', row, x0, x1 }]
     rows: [{ pts: [[x, y], …], top, mid, base }] in reading order (one per writing row; points in the same units as the lines)
     text: what he was meant to write. Words are told apart by the gaps in his writing; if the number of gaps doesn't match,
           only the first letter of each row-start is checked, so a messy line doesn't make it guess. */
const HC_SHORT = 'acemnorsuvwxzgpqy';
// strokes → points every ~2 px along each line (a quick finger stroke leaves gaps between its points)
function hcDense(strokes) {
  const out = [];
  strokes.forEach(st => st.forEach((p, k) => {
    if (!k) return out.push(p);
    const q = st[k - 1], n = Math.max(1, Math.ceil(Math.hypot(p[0] - q[0], p[1] - q[1]) / 2));
    for (let j = 1; j <= n; j++) out.push([q[0] + (p[0] - q[0]) * j / n, q[1] + (p[1] - q[1]) * j / n]);
  }));
  return out;
}
let hcCtx = null;
function hcWidths(word) {
  if (!hcCtx) hcCtx = document.createElement('canvas').getContext('2d');
  hcCtx.font = '700 100px Andika, sans-serif';
  const fw = [...word].map(c => hcCtx.measureText(c).width), ft = fw.reduce((a, b) => a + b, 0) || 1;
  const ws = fw.map(w => 0.6 * w / ft + 0.4 / fw.length), tot = 1;   // a child's letters are more even than a font's
  let acc = 0; return ws.map(w => { const a = acc / tot; acc += w; return [a, acc / tot]; });
}
function hcWant(ch) {
  if (HC_SHORT.includes(ch)) return 'small';
  if (/[A-Z]/.test(ch) && HC_SHORT.includes(ch.toLowerCase())) return 'capital';
  return null;   // tall either way (b d f h k l t, B D F H K L T), i j (dots), numbers, marks: not checked
}
// split one row's points into words by the gaps between them
function hcSegments(row) {
  const xh = row.base - row.mid, gapMin = Math.max(14, xh * 0.6);
  const pts = row.pts.filter(([, y]) => y > row.top - xh * 1.2 && y < row.base + xh * 1.4);
  if (!pts.length) return [];
  const xs = pts.map(p => p[0]).sort((a, b) => a - b), segs = [];
  let a = xs[0], b = xs[0];
  for (const x of xs) { if (x - b > gapMin) { segs.push([a, b]); a = x; } b = x; }
  segs.push([a, b]);
  return segs.map(([x0, x1]) => ({ x0, x1, row, pts: pts.filter(([x]) => x >= x0 && x <= x1) }));
}
function hcLetter(seg, ch, r0, r1) {
  const w = seg.x1 - seg.x0, c = seg.x0 + w * (r0 + r1) / 2, half = Math.max(3, w * (r1 - r0) * 0.25);
  const inside = seg.pts.filter(([x]) => x >= c - half && x <= c + half);
  if (inside.length < 3) return null;
  // how high his ink reaches, column by column across the middle of the letter: most of it has to agree, so the edge of a tall
  // neighbor (or the dot of an i) can't make a small letter look like a capital
  const row = seg.row, cols = new Map();
  inside.forEach(([x, y]) => { const k = Math.floor(x / 3); cols.set(k, Math.min(cols.has(k) ? cols.get(k) : Infinity, y)); });
  const ups = [...cols.values()].map(y => (row.mid - y) / Math.max(1, row.mid - row.top));   // 0 = at the dashed line, 1 = at the top line
  if (ups.length < 3) return null;
  const share = t => ups.filter(u => u > t).length / ups.length, want = hcWant(ch);
  if (want === 'small' && share(0.5) >= 0.6) return { want, x0: c - half, x1: c + half };
  if (want === 'capital' && share(0.2) < 0.15) return { want, x0: c - half, x1: c + half };
  return null;
}
function hcCheck(rows, text) {
  const words = String(text || '').split(/\s+/).map(w => w.replace(/[^A-Za-z]/g, '')).filter(Boolean);
  if (!words.length) return [];
  const segs = rows.flatMap((r, ri) => hcSegments(r).map(s => ({ ...s, ri })));
  if (!segs.length) return [];
  const out = [];
  const checkWord = (seg, word, only1) => {
    const pos = hcWidths(word);
    [...word].forEach((ch, k) => {
      if (only1 && k) return;
      const f = hcLetter(seg, ch, pos[k][0], pos[k][1]);
      if (f) out.push({ ch, word, want: f.want, row: seg.ri, x0: f.x0, x1: f.x1 });
    });
  };
  if (words.length === 1) {   // one word: everything he wrote is that word
    const all = segs.filter(s => s.ri === segs[0].ri);
    const m = { x0: Math.min(...all.map(s => s.x0)), x1: Math.max(...all.map(s => s.x1)), row: all[0].row, ri: all[0].ri, pts: all.flatMap(s => s.pts) };
    checkWord(m, words[0]);
  } else if (segs.length === words.length) segs.forEach((s, k) => checkWord(s, words[k]));
  else checkWord(segs[0], words[0], true);   // can't line words up: just the first letter
  return out;
}
function hcMessage(flags) {
  const f = flags[0], small = flags.filter(x => x.want === 'small'), cap = flags.filter(x => x.want === 'capital');
  if (small.length) {
    const ls = [...new Set(small.map(x => x.ch))];
    return `Look at your ${ls.join(' and ')}. In “${small[0].word}”, ${ls.length > 1 ? 'they are small letters' : `${ls[0]} is a small letter`}. Small letters stay under the dashed line.`;
  }
  return `“${cap[0].word}” starts with a capital ${cap[0].ch}. Make it tall, all the way up to the top line.`;
}

/* ---- Eraser + Undo history for the writing pads (Nov 9, 2026, Dylan: "add an eraser option in addition to the undo button") ----
   padErase: removes the parts of his lines within r of the eraser's path (a→b), splitting lines that it cuts through.
   padTools: wires 🧽 Eraser (toggle), ↶ Undo (back one step: a line or an erase) and keeps ↺ Start over undoable.
   It listens on the canvas's parent in the capture phase, so while erasing the pad's own drawing handlers never see the touch. */
function padErase(strokes, a, b, r) {
  const d2 = (p) => { const vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy; let t = L ? ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L : 0; t = Math.max(0, Math.min(1, t)); const x = a[0] + t * vx - p[0], y = a[1] + t * vy - p[1]; return x * x + y * y; };
  const out = [], rr = r * r;
  strokes.forEach(st => {
    const pts = st.length > 1 ? hcDense([st]) : st;
    if (!pts.some(p => d2(p) < rr)) return out.push(st);   // untouched: keep the same line
    let run = [];
    pts.forEach(p => { if (d2(p) < rr) { if (run.length) out.push(run); run = []; } else run.push(p); });
    if (run.length) out.push(run);
  });
  return out;
}
function padTools({ cv, get, set, pt, redraw, radius = 16, eraseBtn, undoBtn, clearBtn, changed = () => { } }) {
  const hist = []; let erasing = false, eId = null, last = null;
  const snap = () => { hist.push(get().slice()); if (hist.length > 80) hist.shift(); };
  const host = cv.parentElement;
  host.addEventListener('pointerdown', e => {
    if (e.target !== cv) return;
    if (!erasing) return snap();   // a new line: remember the picture before it, for Undo
    e.preventDefault(); e.stopPropagation(); if (eId !== null) return;
    snap(); eId = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (er) { }
    last = pt(e); set(padErase(get(), last, last, radius)); changed(); redraw();
  }, true);
  host.addEventListener('pointermove', e => {
    if (!erasing || e.pointerId !== eId) return; e.stopPropagation();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : []; (evs.length ? evs : [e]).forEach(ev => { const p = pt(ev); set(padErase(get(), last, p, radius)); last = p; }); redraw();
  }, true);
  const end = e => { if (e.pointerId === eId) { eId = null; e.stopPropagation(); } };
  host.addEventListener('pointerup', end, true); host.addEventListener('pointercancel', end, true);
  const setMode = on => { erasing = on; if (eraseBtn) { eraseBtn.classList.toggle('on', on); eraseBtn.setAttribute('aria-pressed', on); eraseBtn.textContent = on ? '✏️ Pencil' : '🧽 Eraser'; } cv.classList.toggle('erasing', on); };
  if (eraseBtn) eraseBtn.onclick = () => setMode(!erasing);
  if (undoBtn) undoBtn.onclick = () => { if (eId !== null) return; set(hist.length ? hist.pop() : []); changed(); redraw(); };
  if (clearBtn) { const old = clearBtn.onclick; clearBtn.onclick = e => { if (get().length) snap(); setMode(false); if (old) old(e); }; }
  return { setMode, history: hist };
}
