/* The Study: 🪙 Money Practice (coins) and 🕒 Telling Time (clock), added Nov 28, 2026. Math.
   Loaded after social.js by index.html and do.html (dailyskills.js has the levels and the "move up" rule; load it first).
   Both are daily (they put themselves on his day Monday to Friday, see dailyskills.js); a grown-up can also assign an extra one
   at any level from the tab (that one doesn't count toward moving up).
   Every day: 1. Learn (the level's teaching screens, read out loud; later days at the same level get one "Remember" screen),
   2. Practice (5 questions with clues after a miss), 3. Check (5 questions at his level + 2 from earlier levels; only his level's
   Check questions count for moving up: 80%+ right the first time, 2 days in a row).
   Pictures are our own drawings. The coins follow the real designs (penny: Lincoln / shield; nickel: Jefferson / Monticello;
   dime: Roosevelt / torch; quarter: Washington / eagle), which are U.S. government works. Clock: short blue hour hand, long red
   minute hand on every screen. */

/* =============================== pictures =============================== */
const CK_COIN = {
  penny:   { name: 'penny',   plural: 'pennies',  cents: 1,  size: 0.785, face: '#C8743A', rim: '#8E4A1E', ink: '#6B3410', relief: '#A95A26', reeded: false, who: 'Abraham Lincoln', back: 'a shield', desc: 'brown. It’s the only brown coin' },
  nickel:  { name: 'nickel',  plural: 'nickels',  cents: 5,  size: 0.874, face: '#D5D9DE', rim: '#8D949C', ink: '#4B535C', relief: '#AEB4BB', reeded: false, who: 'Thomas Jefferson', back: 'his house, Monticello', desc: 'big and silver, with a smooth edge' },
  dime:    { name: 'dime',    plural: 'dimes',    cents: 10, size: 0.738, face: '#D5D9DE', rim: '#8D949C', ink: '#4B535C', relief: '#AEB4BB', reeded: true,  who: 'Franklin Roosevelt', back: 'a torch', desc: 'the smallest coin. It’s silver, with a bumpy edge' },
  quarter: { name: 'quarter', plural: 'quarters', cents: 25, size: 1,     face: '#D5D9DE', rim: '#8D949C', ink: '#4B535C', relief: '#AEB4BB', reeded: true,  who: 'George Washington', back: 'an eagle (some quarters have other pictures)', desc: 'the biggest coin. It’s silver, with a bumpy edge' }
};
const CK_ORDER = ['penny', 'nickel', 'dime', 'quarter'];
const CK_r1 = x => Math.round(x * 10) / 10;
const CK_BUST = 'M70 28 C52 26 42 38 43 52 L37 62 L43 64 C42 72 45 78 52 80 L54 92 L78 92 C76 84 80 76 82 66 C86 48 84 32 70 28 Z';
function CK_coin(c, side = 'heads', px = 120, attrs = '') {
  const C = CK_COIN[c], w = Math.round(px * C.size), t = (x, y, s, txt, wt = 700) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="${s}" font-weight="${wt}" fill="${C.ink}">${txt}</text>`;
  let g = `<circle cx="60" cy="60" r="58" fill="${C.rim}"/>`;
  if (C.reeded) { let p = ''; for (let i = 0; i < 90; i++) { const a = i * 4 * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a); p += `M${CK_r1(60 + 53 * ca)} ${CK_r1(60 + 53 * sa)}L${CK_r1(60 + 58 * ca)} ${CK_r1(60 + 58 * sa)}`; } g += `<path d="${p}" stroke="${C.face}" stroke-width="1.6"/>`; }
  g += `<circle cx="60" cy="60" r="52" fill="${C.face}"/><circle cx="60" cy="60" r="47" fill="none" stroke="${C.relief}" stroke-width="1.5"/>`;
  const st = `fill="${C.relief}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"`;
  if (side === 'heads') {
    const extra = { penny: `<path d="M44 66 C44 76 50 80 56 80 C58 84 62 86 66 84 C60 80 58 74 60 68 Z" fill="${C.ink}" opacity=".55"/>`,   // Lincoln's beard
      nickel: `<path d="M82 56 C88 58 92 64 90 72 C86 68 84 64 81 62 Z" ${st}/>`,   // Jefferson's ponytail
      dime: `<path d="M50 40 C56 34 64 33 70 34" fill="none" stroke="${C.ink}" stroke-width="2"/>`,
      quarter: `<path d="M83 54 L92 50 L90 58 L84 58 Z M83 58 L91 64 L85 66 Z" ${st}/>` }[c];   // Washington's hair ribbon
    const face = `<path d="${CK_BUST}" ${st}/>${extra}`;
    g += c === 'penny' ? `<g transform="translate(120 0) scale(-1 1)">${face}</g>` : face;   // Lincoln faces right; the others face left
    g += t(60, 21, 9, 'LIBERTY') + t(60, 103, 8, '2026', 600);
  } else if (c === 'penny') {
    g += `<path d="M36 32 H84 V58 C84 76 73 86 60 93 C47 86 36 76 36 58 Z" ${st}/><rect x="36" y="32" width="48" height="13" fill="${C.ink}"/>`
      + Array.from({ length: 7 }, (_, k) => `<line x1="${42 + k * 6}" y1="47" x2="${42 + k * 6}" y2="${k === 0 || k === 6 ? 72 : k === 1 || k === 5 ? 80 : 86}" stroke="${C.ink}" stroke-width="2"/>`).join('')
      + `<text x="60" y="42" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="8.5" font-weight="700" fill="${C.face}">ONE CENT</text>`;
  } else if (c === 'nickel') {
    g += `<path d="M50 49 A10 9 0 0 1 70 49 Z" ${st}/><path d="M42 58 L60 47 L78 58 Z" ${st}/><rect x="28" y="60" width="64" height="16" ${st}/>`
      + [46, 53, 60, 67, 74].map(x => `<line x1="${x}" y1="60" x2="${x}" y2="76" stroke="${C.ink}" stroke-width="2.2"/>`).join('')
      + `<rect x="24" y="76" width="72" height="5" fill="${C.ink}"/>` + t(60, 89, 6.5, 'MONTICELLO', 600) + t(60, 99, 8.5, 'FIVE CENTS');
  } else if (c === 'dime') {
    const leaves = (side2) => [0, 1, 2, 3].map(k => { const y = 80 - k * 10, x = side2 < 0 ? 47 - k * 2 : 73 + k * 2; return `<ellipse cx="${x + side2 * 4}" cy="${y}" rx="5" ry="2.6" transform="rotate(${side2 * -40} ${x + side2 * 4} ${y})" ${st}/>`; }).join('');
    g += `<path d="M48 86 C40 76 39 62 43 46" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M72 86 C80 76 81 62 77 46" fill="none" stroke="${C.ink}" stroke-width="2"/>${leaves(-1)}${leaves(1)}`
      + `<path d="M57 54 L63 54 L62 86 L58 86 Z" ${st}/><path d="M51 45 H69 L64 54 H56 Z" ${st}/><path d="M60 24 C67 32 69 39 60 45 C51 39 53 32 60 24 Z" ${st}/>` + t(60, 99, 8.5, 'ONE DIME');
  } else {   // quarter: an eagle
    g += `<path d="M58 52 C46 40 30 36 17 40 C25 46 27 50 25 54 C35 52 41 56 45 62 Z" ${st}/><path d="M62 52 C74 40 90 36 103 40 C95 46 93 50 95 54 C85 52 79 56 75 62 Z" ${st}/>`
      + `<ellipse cx="60" cy="60" rx="11" ry="15" ${st}/><circle cx="60" cy="42" r="6" ${st}/><path d="M60 41 L67 44 L60 46 Z" fill="${C.ink}"/><path d="M54 72 L60 82 L66 72 Z" ${st}/>`
      + t(60, 92, 8.5, 'QUARTER') + t(60, 101, 7.5, 'DOLLAR');
  }
  return `<svg class="ck-coin" width="${w}" height="${w}" viewBox="0 0 120 120" role="img" aria-label="${C.name}, ${side} up"${attrs}>${g}</svg>`;
}
/* a clock face. o: px, tap (numbers can be tapped: data-n), hands 'both'|'hour'|'minute'|'none', plain (the shown hand is gray, no color clue),
   hlHand ('hour'|'minute' glows), hlNum (number glows), mins (minute labels 5…55 around the outside) */
function CK_clock(h, m, o = {}) {
  const px = o.px || 260, hands = o.hands || 'both', pad = o.mins ? 26 : 0;
  let g = `<circle cx="120" cy="120" r="114" fill="#FFFFFF" stroke="#1F2937" stroke-width="7"/>`, tk = '';
  for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = big ? 95 : 101; tk += `M${CK_r1(120 + r1 * Math.sin(a))} ${CK_r1(120 - r1 * Math.cos(a))}L${CK_r1(120 + 107 * Math.sin(a))} ${CK_r1(120 - 107 * Math.cos(a))}`; }
  g += `<path d="${tk}" stroke="#475569" stroke-width="2"/>`;
  for (let n = 1; n <= 12; n++) { const a = n * 30 * Math.PI / 180, x = CK_r1(120 + 80 * Math.sin(a)), y = CK_r1(120 - 80 * Math.cos(a)), hl = o.hlNum === n;
    g += `<g${o.tap ? ` data-n="${n}" class="ck-n"` : ''}>${o.tap || hl ? `<circle cx="${x}" cy="${y}" r="19" fill="${hl ? '#FDE68A' : 'transparent'}" stroke="${hl ? '#F59E0B' : 'none'}" stroke-width="3"/>` : ''}<text x="${x}" y="${CK_r1(y + 9.5)}" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="27" font-weight="700" fill="#1F2937">${n}</text></g>`; }
  if (o.mins) for (let n = 1; n <= 12; n++) { const a = n * 30 * Math.PI / 180, x = CK_r1(120 + 132 * Math.sin(a)), y = CK_r1(120 - 132 * Math.cos(a)); g += `<text x="${x}" y="${CK_r1(y + 6)}" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="17" font-weight="700" fill="#16A34A">${n === 12 ? '0' : n * 5}</text>`; }
  const hand = (deg, len, wd, col, glow) => `<g transform="rotate(${CK_r1(deg)} 120 120)">${glow ? `<line x1="120" y1="132" x2="120" y2="${120 - len}" stroke="#FDE047" stroke-width="${wd + 10}" stroke-linecap="round" opacity=".9"/>` : ''}<line x1="120" y1="132" x2="120" y2="${120 - len}" stroke="${col}" stroke-width="${wd}" stroke-linecap="round"/><path d="M${120 - wd} ${120 - len + 10} L120 ${120 - len - 6} L${120 + wd} ${120 - len + 10} Z" fill="${col}"/></g>`;
  // the hands stop short of the numbers, so he can always see the number a hand points to
  if (hands === 'both' || hands === 'hour') g += hand(((h % 12) + m / 60) * 30, 38, 10, o.plain ? '#334155' : '#2563EB', o.hlHand === 'hour');
  if (hands === 'both' || hands === 'minute') g += hand(m * 6, 60, 6, o.plain ? '#334155' : '#DC2626', o.hlHand === 'minute');
  g += `<circle cx="120" cy="120" r="8" fill="#1F2937"/>`;
  return `<svg class="ck-clock" width="${px}" height="${px}" viewBox="${-pad} ${-pad} ${240 + pad * 2} ${240 + pad * 2}" role="img" aria-label="clock${hands === 'none' ? '' : ` showing ${CK_dig(h, m)}`}">${g}</svg>`;
}
const CK_dig = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const CK_nh = h => h % 12 + 1, CK_ph = h => (h + 10) % 12 + 1;
const CK_words = (h, m) => m === 0 ? `${h} o’clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${CK_nh(h)}` : CK_dig(h, m);
const CK_spoken = (h, m) => m === 0 ? `${h} o'clock` : `${h} ${m < 10 ? 'oh ' + m : m}`;
const CK_cents = n => `${n}¢`;
const CK_centsSay = n => `${n} cent${n === 1 ? '' : 's'}`;
const CK_cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const CK_pickOf = arr => arr[Math.floor(Math.random() * arr.length)];
const CK_side = () => Math.random() < 0.5 ? 'heads' : 'tails';
const CK_sum = cs => cs.reduce((a, c) => a + CK_COIN[c].cents, 0);
const CK_row = (cs, px = 96, sides) => `<div class="ck-row">${cs.map((c, i) => `<span class="ck-c" data-i="${i}">${CK_coin(c, sides ? sides[i] : 'heads', px)}<b class="ck-lab"></b></span>`).join('')}</div>`;

/* =============================== questions =============================== */
/* Each question: { t: type, …, lvl } — made at the start of a part (after its random seed), so a reload gives the same ones. */
const CK_FACTS = [
  { q: 'Which coin is brown?', say: 'Which coin is brown?', a: 'penny' },
  { q: 'Which coin is the smallest?', say: 'Which coin is the smallest?', a: 'dime' },
  { q: 'Which coin is the biggest?', say: 'Which coin is the biggest?', a: 'quarter' },
  { q: 'Which coin is big and silver with a smooth edge?', say: 'Which coin is big and silver, with a smooth edge?', a: 'nickel' }
];
function CK_coinGen(L) {
  const name = (pool, all = CK_ORDER) => { const c = CK_pickOf(pool); return { t: 'cname', c, side: CK_side(), opts: all }; };
  const find = (pool, all = CK_ORDER) => { const c = CK_pickOf(pool), others = all.filter(x => x !== c); let set = [c, ...others]; if (set.length < 3) set = [c, others[0], others[0]]; return { t: 'cfind', c, set: L_shuf(set).map(x => ({ c: x, side: CK_side() })) }; };
  const fact = () => ({ t: 'cfact', ...CK_pickOf(CK_FACTS), set: L_shuf(CK_ORDER).map(x => ({ c: x, side: CK_side() })) });
  const value = () => ({ t: 'cvalue', c: CK_pickOf(CK_ORDER), side: CK_side() });
  const byval = () => ({ t: 'cbyval', c: CK_pickOf(CK_ORDER), set: L_shuf(CK_ORDER).map(x => ({ c: x, side: CK_side() })) });
  const more = (less = false, dn = false) => { const pr = dn ? ['dime', 'nickel'] : L_shuf(CK_ORDER).slice(0, 2); return { t: 'cmore', less, set: L_shuf(pr).map(x => ({ c: x, side: CK_side() })) }; };
  const same = (k) => { const c = k || CK_pickOf(CK_ORDER), n = { penny: L_rand(3, 9), nickel: L_rand(2, 7), dime: L_rand(2, 6), quarter: L_rand(2, 3) }[c]; return { t: 'ccount', coins: Array(n).fill(c) }; };
  const mixed = (sorted, q = false) => {
    let cs;
    for (let tries = 0; tries < 50; tries++) {
      cs = [...(q ? ['quarter'] : []), ...Array(L_rand(q ? 0 : 1, 2)).fill('dime'), ...Array(L_rand(0, 2)).fill('nickel'), ...Array(L_rand(q ? 0 : 1, q ? 3 : 4)).fill('penny')];
      const kinds = new Set(cs).size, s = CK_sum(cs);
      if (cs.length >= 3 && cs.length <= 6 && kinds >= 2 && s <= (q ? 99 : 50)) break;
    }
    return { t: 'ccount', coins: sorted ? cs.sort((a, b) => CK_COIN[b].cents - CK_COIN[a].cents) : L_shuf(cs) };
  };
  const make = () => ({ t: 'cmake', n: CK_pickOf([6, 7, 11, 12, 15, 16, 20, 21, 26, 30, 35, 40, 50]) });
  const balanced = (a, b, n, f) => L_shuf(Array.from({ length: n }, (_, i) => f(i % 2 ? a : b)));
  return {
    1: { practice: () => [...balanced('penny', 'nickel', 3, c => ({ t: 'cname', c, side: CK_side(), opts: ['penny', 'nickel'] })), find(['penny', 'nickel'], ['penny', 'nickel']), find(['penny', 'nickel'], ['penny', 'nickel'])],
         check: () => L_shuf([...balanced('penny', 'nickel', 3, c => ({ t: 'cname', c, side: CK_side(), opts: ['penny', 'nickel'] })), find(['penny'], ['penny', 'nickel']), find(['nickel'], ['penny', 'nickel'])]) },
    2: { practice: () => [...balanced('dime', 'quarter', 3, c => ({ t: 'cname', c, side: CK_side(), opts: CK_ORDER })), find(['dime']), find(['quarter'])],
         check: () => L_shuf([...balanced('dime', 'quarter', 2, c => ({ t: 'cname', c, side: CK_side(), opts: CK_ORDER })), name(CK_ORDER), find(['dime']), find(['quarter'])]) },
    3: { practice: () => [name(CK_ORDER), fact(), find(CK_ORDER), name(CK_ORDER), fact()],
         check: () => L_shuf([name(CK_ORDER), name(CK_ORDER), find(CK_ORDER), fact(), fact()]) },
    4: { practice: () => [value(), value(), byval(), value(), byval()],
         check: () => L_shuf([value(), value(), value(), byval(), byval()]) },
    5: { practice: () => [more(false, true), more(), more(true), more(), value()],
         check: () => L_shuf([more(false, true), more(), more(), more(true), more(true, true)]) },
    6: { practice: () => L_shuf(['penny', 'nickel', 'dime', 'quarter']).map(k => same(k)),
         check: () => [same('nickel'), same('dime'), same(), same(), same()].sort(() => Math.random() - 0.5) },
    7: { practice: () => [mixed(true), mixed(true), mixed(true), mixed(true)],
         check: () => [mixed(false), mixed(false), mixed(true), mixed(false), mixed(false)] },
    8: { practice: () => [mixed(true, true), make(), mixed(true, true), make()],
         check: () => L_shuf([mixed(false, true), mixed(true, true), mixed(false, true), make(), make()]) }
  }[L];
}
function CK_clockGen(L) {
  const H = () => L_rand(1, 12);
  const hand = which => ({ t: 'khand', which: which || CK_pickOf(['hour', 'minute']), h: H(), m: L_rand(0, 11) * 5 });
  const tapnum = () => ({ t: 'ktap', n: L_rand(1, 11) });
  const fact = () => CK_pickOf([
    { t: 'kfact', q: 'Which number is at the top of the clock?', a: '12', opts: ['12', '6', '3'] },
    { t: 'kfact', q: 'Which number is at the bottom of the clock?', a: '6', opts: ['6', '12', '9'] },
    { t: 'kfact', q: 'What number comes after 12 on a clock?', a: '1', opts: ['1', '13', '11'] },
    { t: 'kfact', q: 'How many numbers are on a clock?', a: '12', opts: ['12', '10', '60'] }]);
  const read = (ms, fmt) => ({ t: 'kread', h: H(), m: CK_pickOf(ms), fmt });
  const pick = ms => ({ t: 'kpick', h: H(), m: CK_pickOf(ms) });
  const set = (ms, withMin) => ({ t: 'kset', h: H(), m: CK_pickOf(ms), withMin });
  const mins = () => ({ t: 'kmins', k: L_rand(1, 11) });
  const where = () => ({ t: 'kwhere', m: L_rand(1, 11) * 5 });
  const five = Array.from({ length: 12 }, (_, i) => i * 5), quarters = [0, 15, 30, 45];
  return {
    1: { practice: () => [hand('hour'), tapnum(), hand('minute'), fact(), tapnum()], check: () => L_shuf([hand('hour'), hand('minute'), tapnum(), tapnum(), fact()]) },
    2: { practice: () => [read([0], 'words'), read([0], 'words'), hand(), read([0], 'words'), read([0], 'words')], check: () => [1, 2, 3, 4, 5].map(() => read([0], 'words')) },
    3: { practice: () => [read([0], 'dig'), set([0], false), pick([0]), read([0], 'dig'), set([0], false)], check: () => L_shuf([read([0], 'dig'), read([0], 'dig'), set([0], false), set([0], false), pick([0])]) },
    4: { practice: () => [read([30], 'words'), read([30], 'dig'), pick([30]), read([30], 'words'), read([30], 'dig')], check: () => L_shuf([read([30], 'words'), read([30], 'dig'), read([30], 'words'), read([30], 'dig'), pick([30])]) },
    5: { practice: () => [read([0, 30], 'dig'), set([0, 30], true), pick([0, 30]), read([0, 30], 'dig'), set([30], true)], check: () => L_shuf([read([0, 30], 'dig'), read([0, 30], 'dig'), set([0, 30], true), set([30, 0], true), pick([0, 30])]) },
    6: { practice: () => [mins(), mins(), where(), mins(), where()], check: () => L_shuf([mins(), mins(), mins(), where(), where()]) },
    7: { practice: () => [read(five.filter(x => x % 15), 'dig'), read(five, 'dig'), set(five, true), read(five, 'dig'), set(five, true)], check: () => L_shuf([read(five.filter(x => x % 15), 'dig'), read(five, 'dig'), read(five, 'dig'), set(five, true), set(five, true)]) },
    8: { practice: () => [read([15, 45], 'words'), read(quarters, 'words'), set([15, 45], true), read([45], 'words'), set(five, true)], check: () => L_shuf([read([15, 45], 'words'), read([15, 30, 45], 'words'), read([45], 'words'), read(five, 'dig'), set(five, true)]) }
  }[L];
}
/* the wrong choices for reading a clock: the next hour (the half past mix-up), the hands swapped, the minute number read as minutes */
function CK_readOpts(h, m, fmt) {
  const ans = fmt === 'words' ? CK_words(h, m) : CK_dig(h, m), mh = m === 0 ? 12 : m / 5, out = [];
  const add = (hh, mm) => { if (hh < 1 || hh > 12) return; const s = fmt === 'words' ? CK_words(hh, mm) : CK_dig(hh, mm); if (s !== ans && !out.includes(s) && !/^\d+:\d\d$/.test(s) === (fmt === 'words')) out.push(s); };
  if (fmt === 'words' && m === 45) { add(h, 15); out.push(`quarter to ${h}`); }   // quarter to the hour it just passed
  if (fmt === 'words' && m === 15) { add(CK_nh(h), 15); out.push(`quarter to ${h}`); }
  if (m === 30 || m === 45 || m > 30) add(CK_nh(h), m);
  if (fmt === 'dig' && m !== 0 && mh !== m) add(h, mh);
  if (h !== mh && m !== 0) add(mh, (h * 5) % 60);
  if (m === 0) { add(CK_nh(h), 0); add(CK_ph(h), 0); if (fmt === 'dig') add(12, (h * 5) % 60); }
  if (m === 30) add(h, 0);
  add(CK_ph(h), m); add(CK_nh(h), m);
  const [key, ...rest] = [...new Set(out)].filter(x => x !== ans);   // the first one is the most common mix-up: always offered
  return L_shuf([ans, key, L_shuf(rest)[0]].filter(Boolean));
}
function CK_genFor(kind, L) { return kind === 'coins' ? CK_coinGen(L) : CK_clockGen(L); }

/* =============================== Learn screens =============================== */
/* { h: heading line, pic: html, say, anim?: async (app) => {}, recap?: true } */
function CK_learn(kind, L) {
  const two = c => `<div class="ck-two">${CK_coin(c, 'heads', 190)}${CK_coin(c, 'tails', 190)}</div><div class="ck-cap"><span>heads (front)</span><span>tails (back)</span></div>`;
  const line4 = (side = 'heads', labels = true, px = 170, vals = false) => `<div class="ck-line">${['dime', 'penny', 'nickel', 'quarter'].map(c => `<div>${CK_coin(c, side, px)}${labels ? `<b>${c}</b>` : ''}${vals ? `<i>${CK_cents(CK_COIN[c].cents)}</i>` : ''}</div>`).join('')}</div>`;
  const countAnim = (coins, steps) => async () => { const els = [...document.querySelectorAll('#ckLearn .ck-c')]; for (let i = 0; i < els.length; i++) { els[i].classList.add('on'); els[i].querySelector('.ck-lab').textContent = steps[i] + '¢'; await say(String(steps[i]), 0.85); await wait(250); } };
  const run = cs => { let s = 0; return cs.map(c => (s += CK_COIN[c].cents)); };
  const coinCount = (h, cs, sayText) => ({ h, pic: CK_row(cs, 100), say: sayText, anim: countAnim(cs, run(cs)) });
  const clk = (h, m, o = {}) => CK_clock(h, m, { px: 280, ...o });
  if (kind === 'coins') return {
    1: [{ h: 'This is a <b>penny</b>. It’s <b>brown</b>. It’s the only brown coin!', pic: two('penny'), say: 'This is a penny. It is brown. It’s the only brown coin! On the front is Abraham Lincoln. On the back is a shield.' },
        { h: 'This is a <b>nickel</b>. It’s <b>big and silver</b>, with a <b>smooth</b> edge.', pic: two('nickel'), say: 'This is a nickel. It is big and silver, and its edge is smooth. On the front is Thomas Jefferson. On the back is his house, called Monticello.' },
        { h: 'Brown? It’s a <b>penny</b>. Big and silver? It’s a <b>nickel</b>.', pic: `<div class="ck-line">${['penny', 'nickel'].map(c => `<div>${CK_coin(c, 'heads', 200)}<b>${c}</b></div>`).join('')}</div>`, say: 'Brown? It’s a penny. Big and silver? It’s a nickel.', recap: true }],
    2: [{ h: 'This is a <b>dime</b>. It’s the <b>smallest</b> coin. Its edge has little <b>bumpy</b> lines.', pic: two('dime'), say: 'This is a dime. It is silver, and it’s the smallest coin. Its edge has little bumpy lines. On the front is Franklin Roosevelt. On the back is a torch.' },
        { h: 'This is a <b>quarter</b>. It’s the <b>biggest</b> coin. Its edge is <b>bumpy</b> too.', pic: two('quarter'), say: 'This is a quarter. It is silver, and it’s the biggest coin. Its edge is bumpy too. On the front is George Washington. The back can have different pictures, like an eagle.' },
        { h: 'Smallest to biggest: <b>dime, penny, nickel, quarter</b>.', pic: line4(), say: 'Here they are from smallest to biggest: dime, penny, nickel, quarter. The dime is the smallest. The quarter is the biggest.', recap: true }],
    3: [{ h: 'Clues to tell them apart', pic: line4() + `<div class="ck-clues"><div>🟤 <b>Brown</b>? It’s a penny.</div><div>🔹 <b>Smallest</b>? It’s a dime.</div><div>🔷 <b>Biggest</b>? It’s a quarter.</div><div>⚪ <b>Big, silver, smooth edge</b>? It’s a nickel.</div></div>`, say: 'Here are the clues. Brown? It’s a penny. The smallest? It’s a dime. The biggest? It’s a quarter. Big and silver with a smooth edge? It’s a nickel.', recap: true },
        { h: 'Every coin has two sides: <b>heads</b> and <b>tails</b>. It’s the same coin either way!', pic: `<div class="ck-grid4">${CK_ORDER.map(c => `<div>${CK_coin(c, 'heads', 110)}${CK_coin(c, 'tails', 110)}<b>${c}</b></div>`).join('')}</div>`, say: 'Every coin has two sides. Heads shows a person’s face. Tails is the back. Either way, it’s the same coin!' }],
    4: [{ h: 'Coins are worth <b>cents</b>. This sign means cents: <b class="ck-sign">¢</b>', pic: `<div class="ck-two">${CK_coin('penny', 'heads', 170)}<span class="ck-big">1¢</span></div>`, say: 'Coins are worth cents. This little sign means cents. A penny is worth 1 cent.' },
        { h: 'What each coin is worth', pic: `<div class="ck-line">${CK_ORDER.map(c => `<div>${CK_coin(c, 'heads', 160)}<b>${c}</b><i>${CK_cents(CK_COIN[c].cents)}</i></div>`).join('')}</div>`, say: 'A penny is worth 1 cent. A nickel is worth 5 cents. A dime is worth 10 cents. A quarter is worth 25 cents.', recap: true },
        { h: 'Say it with me: <b>penny 1, nickel 5, dime 10, quarter 25</b>!', pic: `<div class="ck-line">${CK_ORDER.map(c => `<div>${CK_coin(c, 'heads', 120)}<i>${CK_cents(CK_COIN[c].cents)}</i></div>`).join('')}</div>`, say: 'Say it with me! Penny 1. Nickel 5. Dime 10. Quarter 25. The quarter is worth the most!' }],
    5: [{ h: 'Bigger doesn’t always mean more! The <b>dime</b> is small, but it’s worth <b>10¢</b>. The <b>nickel</b> is only worth <b>5¢</b>.', pic: `<div class="ck-line">${['dime', 'nickel'].map(c => `<div>${CK_coin(c, 'heads', 190)}<b>${c}</b><i>${CK_cents(CK_COIN[c].cents)}</i></div>`).join('')}</div>`, say: 'Bigger doesn’t always mean more! The dime is small, but it’s worth 10 cents. The nickel is bigger, but it’s only worth 5 cents. So the dime is worth more!', recap: true },
        { h: 'From <b>least</b> to <b>most</b>: penny, nickel, dime, quarter.', pic: `<div class="ck-line">${CK_ORDER.map(c => `<div>${CK_coin(c, 'heads', 150)}<i>${CK_cents(CK_COIN[c].cents)}</i></div>`).join('')}</div><div class="ck-arrow">less ➜ ➜ ➜ more</div>`, say: 'From the least to the most: penny, nickel, dime, quarter.' }],
    6: [coinCount('Count <b>pennies</b> by 1s.', ['penny', 'penny', 'penny', 'penny'], 'Count pennies by ones. Watch!'),
        { ...coinCount('Count <b>nickels</b> by 5s.', ['nickel', 'nickel', 'nickel', 'nickel'], 'Count nickels by fives. Watch!'), recap: true },
        coinCount('Count <b>dimes</b> by 10s.', ['dime', 'dime', 'dime'], 'Count dimes by tens. Watch!'),
        coinCount('Count <b>quarters</b> by 25s.', ['quarter', 'quarter', 'quarter'], 'Count quarters by twenty fives. Watch!')],
    7: [{ ...coinCount('Different coins? Start with the coin worth the <b>most</b>, then count on.', ['dime', 'dime', 'nickel', 'penny', 'penny'], 'When the coins are different, start with the coins worth the most. Then count on. Watch! Dimes by tens, then the nickel adds 5, then the pennies add 1.'), recap: true },
        coinCount('Another one: dime, nickel, nickel, penny.', ['dime', 'nickel', 'nickel', 'penny'], 'Here’s another one. Start with the dime. Watch!')],
    8: [{ ...coinCount('A <b>quarter</b>? Start with it: 25, then count on.', ['quarter', 'dime', 'nickel', 'penny'], 'If there’s a quarter, start with it. 25, then count on. Watch!'), recap: true },
        { h: 'To <b>make 30¢</b>, you can use 3 dimes… or a quarter and a nickel!', pic: `<div class="ck-make2"><div>${CK_row(['dime', 'dime', 'dime'], 90)}<b>10, 20, 30</b></div><div>${CK_row(['quarter', 'nickel'], 90)}<b>25, 30</b></div></div>`, say: 'To make 30 cents, you can use 3 dimes: 10, 20, 30. Or a quarter and a nickel: 25, 30. There’s more than one way!' }]
  }[L];
  return {
    1: [{ h: 'This is a clock. The numbers go around from <b>1</b> to <b>12</b>. The <b>12</b> is at the top.', pic: clk(12, 0, { hands: 'none' }), say: 'This is a clock. The numbers go around in a circle, from 1 all the way to 12. Watch!', anim: async () => { const box = document.getElementById('ckLearn'); for (let n = 1; n <= 12; n++) { box.innerHTML = clk(12, 0, { hands: 'none', hlNum: n }); await say(String(n), 1); } await say('The 12 is at the top. The 6 is at the bottom.', 0.9); } },
        { h: 'A clock has two hands. The <b class="hb">short hand</b> is the <b class="hb">hour hand</b>.', pic: clk(3, 0, { hands: 'hour', hlHand: 'hour' }), say: 'A clock has two hands. The short hand is the hour hand. On our clocks, it’s blue.' },
        { h: 'The <b class="mr">long hand</b> is the <b class="mr">minute hand</b>.', pic: clk(3, 0, { hlHand: 'minute' }), say: 'The long hand is the minute hand. On our clocks, it’s red.' },
        { h: '<b class="hb">Short hand: hour.</b> <b class="mr">Long hand: minute.</b>', pic: clk(10, 10), say: 'Remember: the short hand is the hour hand. The long hand is the minute hand.', recap: true }],
    2: [{ h: 'When the <b class="mr">long hand</b> points straight up to the <b>12</b>, it’s something <b>o’clock</b>.', pic: clk(3, 0, { hlHand: 'minute' }), say: 'When the long hand points straight up to the 12, it’s something o’clock.' },
        { h: 'The <b class="hb">short hand</b> tells the hour. It points to the <b>3</b>, so it’s <b>3 o’clock</b>.', pic: clk(3, 0, { hlHand: 'hour', hlNum: 3 }), say: 'Now look at the short hand to see which hour. It points to the 3, so it’s 3 o’clock.', recap: true },
        { h: 'Long hand on 12, short hand on 8: <b>8 o’clock</b>.', pic: clk(8, 0, { hlNum: 8 }), say: 'The long hand is on the 12. The short hand is on the 8. So it’s 8 o’clock.' }],
    3: [{ h: '3 o’clock is written <b>3:00</b>. First the hour, then two zeros for zero minutes.', pic: `<div class="ck-two">${clk(3, 0, { px: 240 })}<span class="ck-digital">3:00</span></div>`, say: '3 o’clock is written 3, 2 dots, 0 0. The number before the dots is the hour. The two zeros mean zero minutes.', recap: true },
        { h: 'To set <b>7:00</b>: the <b class="mr">long hand</b> on the 12, the <b class="hb">short hand</b> on the 7.', pic: `<div class="ck-two">${clk(7, 0, { px: 240, hlNum: 7 })}<span class="ck-digital">7:00</span></div>`, say: 'To set the clock to 7 o’clock, put the long hand on the 12, and the short hand on the 7.' }],
    4: [{ h: 'When the <b class="mr">long hand</b> points down to the <b>6</b>, it’s gone halfway around: <b>30 minutes</b>, or <b>half past</b>.', pic: clk(3, 30, { hlHand: 'minute', hlNum: 6 }), say: 'When the long hand points down to the 6, it has gone halfway around the clock. That’s 30 minutes. We call it half past.' },
        { h: 'The <b class="hb">short hand</b> is halfway between 3 and 4. It just passed the <b>3</b>, so it’s <b>half past 3</b>, or <b>3:30</b>.', pic: `<div class="ck-two">${clk(3, 30, { px: 250, hlHand: 'hour', hlNum: 3 })}<span class="ck-digital">3:30</span></div>`, say: 'At half past, the short hand is halfway between two numbers. The hour is the number it just passed. Here it just passed the 3, so it’s half past 3, or 3 30.', recap: true },
        { h: 'Watch out! Don’t say the next number. It’s not 4:30 yet. It’s <b>3:30</b>.', pic: clk(3, 30, { hlHand: 'hour' }), say: 'Watch out! Don’t say the next number. It is not 4 30 yet. It’s 3 30.' }],
    5: [{ h: '<b>O’clock</b>: long hand on the 12. <b>Half past</b>: long hand on the 6.', pic: `<div class="ck-two"><div>${clk(5, 0, { px: 220 })}<b class="ck-t">5:00</b></div><div>${clk(5, 30, { px: 220 })}<b class="ck-t">5:30</b></div></div>`, say: 'O’clock: the long hand is on the 12. Half past: the long hand is on the 6.', recap: true },
        { h: 'To set <b>half past</b>: long hand on the 6. Short hand just past the hour, halfway to the next number.', pic: clk(9, 30, { hlHand: 'hour' }), say: 'To set half past, put the long hand on the 6. Then put the short hand just past the hour, halfway to the next number. This is half past 9.' }],
    6: [{ h: 'The <b class="mr">long hand</b> counts minutes. Every number is <b>5 more minutes</b>.', pic: clk(12, 0, { hands: 'minute', mins: true, px: 300 }), say: 'The long hand counts minutes. Every number is 5 more minutes. Let’s count by fives!', anim: async () => { const box = document.getElementById('ckLearn'); for (let n = 1; n <= 12; n++) { box.innerHTML = clk(12, (n * 5) % 60, { hands: 'minute', mins: true, px: 300, hlNum: n }); await say(String(n * 5), 1); } }, recap: true },
        { h: 'Long hand on the <b>4</b>? Count: 5, 10, 15, <b>20 minutes</b>.', pic: clk(12, 20, { hands: 'minute', mins: true, px: 300, hlNum: 4 }), say: 'If the long hand points to the 4, count by fives: 5, 10, 15, 20. That’s 20 minutes.' }],
    7: [{ h: 'First the <b class="hb">short hand</b>: the number it just passed is the <b>hour</b>.', pic: clk(4, 20, { hlHand: 'hour', hlNum: 4 }), say: 'To tell the time, first look at the short hand. The number it just passed is the hour. Here it’s 4.' },
        { h: 'Then count the <b class="mr">long hand</b> by 5s: on the 4, that’s 5, 10, 15, <b>20</b>. It’s <b>4:20</b>.', pic: `<div class="ck-two">${clk(4, 20, { px: 250, hlHand: 'minute', mins: true })}<span class="ck-digital">4:20</span></div>`, say: 'Then count the long hand by fives. It’s on the 4: 5, 10, 15, 20. So it’s 4 20.', recap: true },
        { h: 'Short hand just past the 7. Long hand on the 9: <b>45 minutes</b>. It’s <b>7:45</b>.', pic: `<div class="ck-two">${clk(7, 45, { px: 250, mins: true })}<span class="ck-digital">7:45</span></div>`, say: 'The short hand just passed the 7. The long hand is on the 9. Count by fives to 45. It’s 7 45. See how the short hand is almost at the 8? It still says 7 until the long hand gets back to the 12.' }],
    8: [{ h: '15 minutes after the hour is <b>quarter past</b>. 4:15 is <b>quarter past 4</b>.', pic: `<div class="ck-two">${clk(4, 15, { px: 250, hlNum: 3 })}<span class="ck-digital">4:15</span></div>`, say: '15 minutes after the hour is called quarter past. 4 15 is quarter past 4. The long hand has gone a quarter of the way around.' },
        { h: '45 minutes is <b>quarter to</b> the next hour. 4:45 is <b>quarter to 5</b>.', pic: `<div class="ck-two">${clk(4, 45, { px: 250, hlNum: 9 })}<span class="ck-digital">4:45</span></div>`, say: '45 minutes is called quarter to, because it’s 15 minutes until the next hour. 4 45 is quarter to 5.', recap: true },
        { h: '<b>:00</b> o’clock · <b>:15</b> quarter past · <b>:30</b> half past · <b>:45</b> quarter to', pic: `<div class="ck-grid4">${[0, 15, 30, 45].map(m => `<div>${clk(2, m, { px: 150 })}<b>${CK_words(2, m)}</b></div>`).join('')}</div>`, say: 'O’clock, quarter past, half past, quarter to.' }]
  }[L];
}

/* =============================== the Worksheets page (index.html) =============================== */
const CK_levelOpts = kind => DK_KINDS[kind].levels.map((lv, i) => [String(i + 1), `Level ${i + 1}: ${lv.name}`]);
['coins', 'clock'].forEach(kind => {
  const K = DK_KINDS[kind];
  LT[kind] = {
    name: K.title, cls: 'math', noSchool: true, daily: true, schools: {},
    help: kind === 'coins'
      ? 'Every school day (Monday to Friday) this goes on his day by itself, in Math, like his sight words. 8 levels: penny and nickel → dime and quarter → all four coins → what each is worth → which is worth more → counting the same coins → counting mixed coins → quarters and making an amount. Each day: Learn (read out loud), Practice (clues after a miss), Check. He moves up after 2 good days in a row (80% or better on his level’s Check questions).'
      : 'Every school day (Monday to Friday) this goes on his day by itself, in Math, like his sight words. 8 levels: meet the clock (short hour hand, long minute hand) → o’clock → set the clock and write 3:00 → half past → o’clock and half past → count by 5s → time to 5 minutes → quarter past and quarter to. Each day: Learn (read out loud), Practice (clues after a miss), Check. He moves up after 2 good days in a row (80% or better on his level’s Check questions).',
    own: () => ({ level: '1' }),
    fields: () => [{ k: 'level', label: 'Level (for Try it, Print, or an extra one assigned by hand)', type: 'select', options: CK_levelOpts(kind), help: 'An extra one you assign doesn’t count toward moving up. His daily one always uses his own level (box above).' }],
    acts: () => [], act: () => { },
    title: c => `${K.title} · Level ${+c.level || 1}`,
    data: c => ({ level: +c.level || 1, daily: false }),
    check: () => '',
    panelTop: () => `<div class="ck-box" id="ckBox" data-kind="${kind}"><p class="help" style="margin:0">Loading his level…</p></div>`,
    afterPanel: () => CK_fillBox(kind)
  };
  L_IDS.push(kind);
  if (typeof L_CLASS_OF !== 'undefined') L_CLASS_OF[kind] = 'math';
});

/* the grown-up's box on the tab: on/off every school day, where he is, move him to a level, his recent days */
async function CK_fillBox(kind) {
  const box = document.getElementById('ckBox'); if (!box || box.dataset.kind !== kind) return;
  if (!document.getElementById('ckStyle')) { const st = document.createElement('style'); st.id = 'ckStyle'; st.textContent = `
    .ck-box { border:2px solid var(--study, #3C7DD9); border-radius:14px; padding:12px 14px; margin:0 0 14px; background:rgba(60,125,217,.08); }
    .ck-box h3 { margin:0 0 6px; font-size:17px; } .ck-box .ck-on { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:4px 0 10px; }
    .ck-box .ck-on button[aria-pressed="true"] { outline:3px solid #34D399; }
    .ck-box .ck-now { font-weight:700; margin:4px 0 8px; } .ck-lv { display:flex; flex-direction:column; gap:4px; margin:6px 0; }
    .ck-lv div { display:flex; gap:8px; align-items:flex-start; padding:5px 8px; border-radius:10px; border:1px solid var(--line, #334155); font-size:14px; }
    .ck-lv div.now { border-color:#F59E0B; background:rgba(245,158,11,.12); } .ck-lv div b { min-width:22px; } .ck-lv div span { flex:1; } .ck-lv small { display:block; color:var(--muted, #94A3B8); }
    .ck-lv em { font-style:normal; font-size:13px; white-space:nowrap; } .ck-hist { font-size:13px; color:var(--muted, #94A3B8); margin-top:6px; } .ck-hist span { display:inline-block; margin:2px 8px 2px 0; }`; document.head.appendChild(st); }
  const sb = typeof studySession === 'function' ? await studySession() : null;
  if (!sb) { box.innerHTML = '<p class="help" style="margin:0">Sign in to see his level and turn this on or off.</p>'; return; }
  let rout = {}, skills = {}, logs = [];
  try { const { data } = await sb.from('study_state').select('key,data').in('key', ['routines', 'skills']); (data || []).forEach(r => { if (r.key === 'routines') rout = r.data || {}; if (r.key === 'skills') skills = r.data || {}; }); } catch (e) { }
  try { const { data } = await sb.from('study_log').select('data').eq('kind', 'sheet').gte('t', new Date(Date.now() - 30 * 864e5).toISOString()); logs = (data || []).map(r => r.data).filter(d => d && DK_IDS.includes(d.tool)); } catch (e) { }   // his newest results, even before his device has counted them
  if (!document.getElementById('ckBox') || box.dataset.kind !== kind) return;
  const view = DK_update(skills, rout, logs).skills, s = DK_state(view, kind), on = DK_on(rout, kind), K = DK_KINDS[kind];
  const pending = rout[kind] && rout[kind].set && +rout[kind].set.at > ((skills[kind] || {}).setAt || 0);
  const hist = s.hist.slice(-10).reverse();
  box.innerHTML = `<h3>${K.icon} Daily ${esc(K.name)}</h3>
    <div class="ck-on"><span>Every school day (Mon–Fri) on his device:</span><button class="btn btn-small" data-ckon="1" aria-pressed="${on}">✓ On</button><button class="btn btn-small" data-ckon="0" aria-pressed="${!on}">○ Off</button></div>
    <div class="ck-now">${esc(DK_status(kind, view))}</div>
    ${pending ? '<p class="help" style="margin:0 0 6px">His device moves to this level the next time his start screen opens.</p>' : ''}
    <button class="btn btn-small" data-cktry="1">▶ Try his level</button>
    <details style="margin-top:8px"><summary>All 8 levels · move him to a level</summary><div class="ck-lv">${K.levels.map((lv, i) => { const n = i + 1, p = s.passed[n];
      return `<div class="${n === s.level ? 'now' : ''}"><b>${n}</b><span>${esc(lv.name)}<small>${esc(lv.what)}</small></span><em>${n === s.level ? '★ now' : p ? `✓ passed ${esc(new Date(p + 'T12:00').toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }))}` : ''}</em>${n === s.level ? '' : `<button class="btn btn-small" data-cklvl="${n}">Put him here</button>`}</div>`; }).join('')}</div></details>
    <div class="ck-hist">${hist.length ? 'His last days: ' + hist.map(h => `<span>${esc(new Date(h.day + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }))} · L${h.level} · ${h.right}/${h.total}${h.pct >= DK_PASS ? ' ✓' : ''}</span>`).join('') : 'No days yet. His first one shows up on the next school day.'}</div>
    <div class="assign-msg" id="ckMsg"></div>`;
  box.onclick = async e => {
    const t = e.target.closest('[data-cktry]');
    if (t) { lsSet('study-sheet-try', { id: 'try', tool: kind, title: `${K.title} · Level ${s.level}`, data: { level: s.level, daily: false } }); window.open('do.html?try=1', '_blank'); return; }
    const b = e.target.closest('[data-ckon], [data-cklvl]'); if (!b) return;
    if (b.dataset.cklvl && !confirm(`Move him to level ${b.dataset.cklvl}: ${K.levels[b.dataset.cklvl - 1].name}?`)) return;
    b.disabled = true;
    try {
      const { data } = await sb.from('study_state').select('data').eq('key', 'routines').maybeSingle();
      const R = (data && data.data) || {}; R[kind] = { ...(R[kind] || {}) };
      if (b.dataset.ckon) R[kind].on = b.dataset.ckon === '1'; else R[kind].set = { level: +b.dataset.cklvl, at: Date.now() };
      const r = await sb.from('study_state').upsert({ key: 'routines', data: R, updated_at: new Date().toISOString() }); if (r.error) throw r.error;
      lsSet('study-routines', R);
      if (typeof refreshOnDay === 'function') refreshOnDay();
      CK_fillBox(kind);
    } catch (err) { const m = document.getElementById('ckMsg'); if (m) { m.textContent = 'Couldn’t save: ' + (err.message || err); m.style.color = 'var(--warn-ink)'; } b.disabled = false; }
  };
}

/* printed page: the coin chart / clocks to read, at the picked level */
if (!L_IN_DO) {
  LT.coins.print = d => {
    const L = d.level || 1, gen = CK_coinGen(L), qs = [...gen.check(), ...gen.practice()].slice(0, 6);
    const chart = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;margin:4px 0 14px">${CK_ORDER.map(c => `<div style="border:2px solid #CBD5E1;border-radius:12px;padding:6px">${CK_coin(c, 'heads', 90)}${CK_coin(c, 'tails', 90)}<div style="font:700 24px Andika,sans-serif">${c}</div>${L >= 4 ? `<div style="font:700 22px Fredoka,sans-serif;color:#16A34A">${CK_cents(CK_COIN[c].cents)}</div>` : ''}</div>`).join('')}</div>`;
    const row = q => {
      if (q.t === 'ccount') return `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0">${q.coins.map(c => CK_coin(c, 'heads', 64)).join('')}<span style="font:400 26px Andika,sans-serif;margin-left:auto">= ______ ¢</span></div>`;
      if (q.t === 'cmake') return `<div style="font:400 26px Andika,sans-serif;margin:10px 0">Draw coins that make <b>${q.n}¢</b>: <span style="display:inline-block;width:320px;height:60px;border:2px dashed #94A3B8;border-radius:10px;vertical-align:middle"></span></div>`;
      if (q.t === 'cmore') return `<div style="display:flex;align-items:center;gap:20px;margin:8px 0;font:400 24px Andika,sans-serif">Circle the coin worth ${q.less ? 'less' : 'more'}: ${q.set.map(x => CK_coin(x.c, x.side, 80)).join('')}</div>`;
      if (q.t === 'cvalue') return `<div style="display:flex;align-items:center;gap:20px;margin:8px 0;font:400 24px Andika,sans-serif">${CK_coin(q.c, q.side, 80)} This coin is worth ______ ¢</div>`;
      return `<div style="display:flex;align-items:center;gap:20px;margin:8px 0;font:400 24px Andika,sans-serif">${CK_coin(q.c || q.a || 'penny', q.side || 'heads', 80)} This coin is a ____________.</div>`;
    };
    return L_sheetOf(nameDate() + title('Money Practice', `Level ${L}: ${DK_KINDS.coins.levels[L - 1].kid}`, star('#B45309'), star('#64748B')) + chart + qs.map(row).join(''), false, { gap: 10 });
  };
  LT.clock.print = d => {
    const L = Math.max(2, d.level || 1), ms = { 2: [0], 3: [0], 4: [30], 5: [0, 30], 6: [0, 30], 7: Array.from({ length: 12 }, (_, i) => i * 5), 8: [15, 30, 45, 0] }[L];
    const times = Array.from({ length: 6 }, () => [L_rand(1, 12), CK_pickOf(ms)]);
    return L_sheetOf(nameDate() + title('Telling Time', 'Write the time under each clock.', star('#2563EB'), star('#DC2626'))
      + `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;text-align:center">${times.map(([h, m]) => `<div>${CK_clock(h, m, { px: 190 })}<div style="font:400 30px Andika,sans-serif;margin-top:6px">____ : ____</div></div>`).join('')}</div>`
      + `<div style="font:400 20px Andika,sans-serif;margin-top:14px;color:#475569">The <b style="color:#2563EB">short blue hand</b> is the hour hand. The <b style="color:#DC2626">long red hand</b> is the minute hand.</div>`, false, { gap: 12 });
  };
}

/* =============================== on screen (do.html) =============================== */
if (L_IN_DO) {
  const st = document.createElement('style'); st.textContent = `
    .ck-stage { display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:14px; margin:6px auto; }
    .ck-two { display:flex; gap:22px; justify-content:center; align-items:center; flex-wrap:wrap; } .ck-cap { display:flex; gap:22px; justify-content:center; color:var(--muted); font:600 16px Fredoka,sans-serif; } .ck-cap span { width:190px; text-align:center; }
    .ck-line { display:flex; gap:16px; justify-content:center; align-items:flex-end; flex-wrap:wrap; } .ck-line > div { display:flex; flex-direction:column; align-items:center; gap:4px; }
    .ck-line b, .ck-grid4 b { font:700 24px Fredoka,sans-serif; } .ck-line i { font:700 30px Fredoka,sans-serif; font-style:normal; color:#4ADE80; }
    .ck-grid4 { display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:12px; align-items:end; } .ck-grid4 > div { display:flex; flex-direction:column; align-items:center; gap:4px; }
    @media (max-width:700px) { .ck-grid4 { grid-template-columns:repeat(2, minmax(0,1fr)); } }
    .ck-clues { display:grid; grid-template-columns:1fr 1fr; gap:6px 18px; font:600 20px Fredoka,sans-serif; margin-top:10px; text-align:left; }
    .ck-big { font:700 64px Fredoka,sans-serif; color:#4ADE80; } .ck-sign { font-size:1.4em; color:#4ADE80; } .ck-arrow { font:700 22px Fredoka,sans-serif; color:var(--muted); margin-top:6px; }
    .ck-digital { font:700 clamp(54px,9vw,84px) 'Courier New', monospace; background:#0F172A; color:#4ADE80; border-radius:16px; padding:6px 26px; border:4px solid #334155; letter-spacing:2px; }
    .ck-t { font:700 30px Fredoka,sans-serif; display:block; text-align:center; } .hb { color:#60A5FA; } .mr { color:#F87171; }
    .ck-row { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; align-items:center; }
    .ck-c { display:inline-flex; flex-direction:column; align-items:center; border-radius:50%; padding:4px; transition:transform .15s; }
    .ck-c .ck-lab { font:700 22px Fredoka,sans-serif; color:#4ADE80; min-height:28px; } .ck-c.on { transform:translateY(-6px); } .ck-c.on svg { filter:drop-shadow(0 0 8px #FDE047); }
    .ck-make2 { display:flex; gap:30px; justify-content:center; flex-wrap:wrap; } .ck-make2 > div { display:flex; flex-direction:column; align-items:center; gap:4px; } .ck-make2 b { font:700 22px Fredoka,sans-serif; color:#4ADE80; }
    .ck-pics { display:flex; flex-wrap:wrap; gap:16px; justify-content:center; align-items:center; width:min(900px,96vw); }
    .ck-pics button { background:var(--surface-2); border:4px solid var(--line); border-radius:22px; padding:12px; cursor:pointer; touch-action:manipulation; display:flex; align-items:center; justify-content:center; min-width:120px; min-height:120px; }
    .ck-pics button.wrong { border-color:var(--bad); background:var(--bad-bg); opacity:.75; } .ck-pics button.right { border-color:var(--good); background:var(--good-bg); }
    .ck-pics button.show, .ls-choices button.show { animation:lspulse 1s infinite; border-color:#EA580C; }
    .ck-clockwrap { display:inline-block; background:transparent; } .ck-clockwrap.tap .ck-n { cursor:pointer; } .ck-clockwrap.tap .ck-n:hover circle { fill:#E0F2FE; }
    .ck-n.wrong circle { fill:#FECACA !important; } .ck-n.right circle { fill:#BBF7D0 !important; } .ck-n.show circle { fill:#FDE68A !important; stroke:#EA580C; stroke-width:4; }
    .ck-goal { font:700 clamp(40px,7vw,64px) Fredoka,sans-serif; background:#fff; color:#1F2937; border-radius:18px; padding:2px 26px; }
    .ck-tray { display:flex; gap:14px; justify-content:center; align-items:flex-end; flex-wrap:wrap; } .ck-tray button { background:var(--surface-2); border:3px solid var(--line); border-radius:18px; padding:8px 10px; cursor:pointer; touch-action:manipulation; display:flex; flex-direction:column; align-items:center; gap:2px; color:var(--ink); font:700 18px Fredoka,sans-serif; }
    .ck-purse { min-height:120px; width:min(820px,94vw); border:3px dashed var(--field-line); border-radius:18px; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:center; padding:10px; }
    .ck-purse button { background:none; border:0; padding:0; cursor:pointer; } .ck-purse .ph { color:var(--muted); font:600 18px Fredoka,sans-serif; }
    .ck-np { display:flex; flex-direction:column; align-items:center; width:100%; }
    @media (min-width: 900px) { .ck-np { flex-direction:row; justify-content:center; gap:24px; } .ck-np > .ck-stage { flex:0 1 auto; max-width:calc(100% - 470px); } .ck-np > #io { flex:0 0 440px; display:flex; flex-direction:column; align-items:center; } .ck-np .numpad { max-width:440px; } .ck-np .message { font-size:20px; } }
    .ck-level { display:inline-block; font:700 15px Fredoka,sans-serif; color:#FDE68A; background:#3A2E0C; border:1px solid #B7791F; border-radius:999px; padding:2px 12px; margin-bottom:4px; }`;
  document.head.appendChild(st);
}
/* tap one of the choices in #io (pictures or words). Practice: a clue after a miss. Check: "try again", and after 2 misses the right one glows.
   opts: [{ v, label, html? }]. why(opt) = the clue for a wrong pick. Resolves { typed, ok, picks }. */
function CK_choose(opts, answer, { mode = 'practice', why = null, pics = false, sayOpt = false } = {}) {
  return new Promise(res => {
    const picks = [];
    $('io').innerHTML = `<div class="${pics ? 'ck-pics' : 'ls-choices row2'}" id="ch">${opts.map((o, i) => `<button data-c="${i}" aria-label="${L_esc(o.label)}">${pics ? o.html : L_esc(o.label)}</button>`).join('')}</div><div class="message" id="msg"></div>`;
    $('ch').onclick = e => {
      const b = e.target.closest('[data-c]'); if (!b || b.disabled) return;
      const o = opts[+b.dataset.c]; picks.push(o.label);
      if (sayOpt && o.say) fb(o.say, 0.95);
      if (o.v === answer) {
        $('ch').querySelectorAll('button').forEach(x => { x.disabled = true; x.classList.remove('show'); }); b.classList.add('right');
        setMsg(picks.length === 1 ? 'Yes! Right the first time!' : 'You got it!', 'good'); if (!sayOpt) fb('Yes!', 1);
        nextUp(1300).then(() => res({ typed: picks[0], ok: picks.length === 1, picks }));
        return;
      }
      b.classList.add('wrong'); b.disabled = true; shakeEl(b);
      const clue = why ? why(o) : '';
      if (mode === 'check' && picks.length < 2) { setMsg('Not quite. Look again and try again.', 'try'); fb('Not quite. Try again.', 0.95); return; }
      if (mode === 'check') $('ch').querySelectorAll('button').forEach((x, i) => { if (opts[i].v === answer) x.classList.add('show'); });
      setMsg(clue || 'Not quite. Look again.', 'try'); fb(clue || 'Not quite. Look again.', 0.92);
    };
  });
}
/* tap a number on the clock (in #ckClk). Resolves { typed, ok, picks } */
function CK_tapNum(answer, { mode = 'practice', clue = '', onTap = null } = {}) {
  return new Promise(res => {
    const wrap = $('ckClk'), picks = []; wrap.classList.add('tap');
    const msgBox = $('io'); msgBox.innerHTML = '<div class="message" id="msg"></div>';
    wrap.onclick = e => {
      const g = e.target.closest('[data-n]'); if (!g || !wrap.classList.contains('tap')) return;
      const n = +g.dataset.n; picks.push(String(n)); if (onTap) onTap(n);
      if (n === answer) {
        wrap.classList.remove('tap'); wrap.querySelectorAll('.ck-n').forEach(x => x.classList.remove('show', 'wrong')); g.classList.add('right');
        setMsg(picks.length === 1 ? 'Yes! Right the first time!' : 'You got it!', 'good'); fb('Yes!', 1);
        nextUp(1300).then(() => res({ typed: picks[0], ok: picks.length === 1, picks }));
        return;
      }
      g.classList.add('wrong'); setTimeout(() => g.classList.remove('wrong'), 900);
      if (mode === 'check' && picks.length < 2) { setMsg('Not quite. Try again.', 'try'); fb('Not quite. Try again.', 0.95); return; }
      if (mode === 'check' || picks.length >= 2) { const r = wrap.querySelector(`[data-n="${answer}"]`); if (r) r.classList.add('show'); }
      setMsg(clue || 'Not quite. Try again.', 'try'); fb(clue || 'Not quite. Try again.', 0.92);
    };
  });
}

function CK_run(kind) {
  const d = SD, L = DK_clampLvl(kind, d.level), K = DK_KINDS[kind], lv = K.levels[L - 1];
  const tagHtml = () => `<div class="ck-level">Level ${L} of ${K.levels.length}: ${L_esc(lv.kid)}</div>`;
  const qHead = (part, prompt) => tagHtml() + head(prompt);

  /* ---------- 1. Learn ---------- */
  const learn = async () => {
    const all = CK_learn(kind, L), screens = d.first !== false || !d.daily ? all : all.filter(s => s.recap);
    await each(screens.length, i => new Promise(async done => {
      const s = screens[i];
      app.innerHTML = tagHtml() + head(screens.length < all.length ? `Remember! ${s.h}` : s.h) + (screens.length > 1 ? L_count(i, screens.length, 'Page') : '')
        + `<div class="ck-stage" id="ckLearn">${s.pic}</div><div class="row acts"><button class="btn big" id="hearL">${SPK}Hear it again</button><button class="btn big primary" id="gotL" disabled>Got it →</button></div>`;
      const play = async () => { $('gotL').disabled = true; await say(s.say, 0.88); if (s.anim) { await wait(200); await s.anim(); } $('gotL').disabled = false; };
      $('hearL').onclick = () => { if (s.anim) $('ckLearn').innerHTML = s.pic; play(); };
      await play(); await wait(300);
      await new Promise(r => { $('gotL').onclick = r; });
      mark('Learn', s.h.replace(/<[^>]+>/g, ''), true, '', '', null, { text: s.say, html: s.pic }, ['got it']); items.at(-1).free = true;
      done();
    }));
    partDone(screens.length < all.length ? 'Remembered today’s level.' : `Learned: ${lv.kid.replace(/[?.!]$/, '')}.`);
  };

  /* ---------- one question ---------- */
  const ask = (q, i, n, part, mode) => new Promise(async done => {
    const finish = (r, label, answer, shown) => { mark(part, label, r.ok, r.typed, answer, null, shown, r.picks); const it = items.at(-1); it.lvl = q.lvl || L; if (q.review) it.review = true; done(); };
    const count = L_count(i, n, 'Question') + (q.review ? '<div class="ls-exact" style="background:#0C2A3A;border-color:#0E7490;color:#A5F3FC">🔁 From an earlier level</div>' : '');
    const hearBtn = `<button class="btn" id="hearQ">${SPK}Hear it again</button>`;
    const sayQ = text => { const f = () => say(text, 0.9); $('hearQ').onclick = f; f(); };
    const C = x => CK_COIN[x];
    const coinOpt = (x, px = 130) => ({ v: x.c, label: x.c, html: CK_coin(x.c, x.side, px) });
    const choiceHtml = os => Object.fromEntries(os.filter(o => o.html).map(o => [o.label, o.html.replace(/width="\d+" height="\d+"/, 'width="90" height="90"')]));
    switch (q.t) {
      case 'cname': {
        app.innerHTML = qHead(part, 'What coin is this?') + count + hearBtn + `<div class="ck-stage">${CK_coin(q.c, q.side, 220)}</div><div id="io"></div>`;
        sayQ(`What coin is this? Is it a ${q.opts.join(', or a ')}?`);
        const os = q.opts.map(c => ({ v: c, label: c }));
        const r = await CK_choose(os, q.c, { mode, why: o => `A ${o.v} is ${C(o.v).desc}. Look again!` });
        return finish(r, `What coin is this? (${q.side} up)`, q.c, { text: `What coin is this? (a ${q.c}, ${q.side} up)`, html: CK_coin(q.c, q.side, 150), choices: q.opts });
      }
      case 'cfind': case 'cfact': case 'cbyval': {
        const prompt = q.t === 'cfind' ? `Tap the <b>${q.c}</b>.` : q.t === 'cfact' ? L_esc(q.q) : `Tap the coin that is worth <b>${CK_cents(C(q.c).cents)}</b>.`;
        const spoken = q.t === 'cfind' ? `Tap the ${q.c}.` : q.t === 'cfact' ? q.say : `Tap the coin that is worth ${CK_centsSay(C(q.c).cents)}.`;
        const ans = q.t === 'cfact' ? q.a : q.c;
        app.innerHTML = qHead(part, prompt) + count + hearBtn + '<div id="io"></div>';
        sayQ(spoken);
        const os = q.set.map(x => coinOpt(x));
        const why = o => q.t === 'cbyval' ? `That’s a ${o.v}. It’s worth ${CK_centsSay(C(o.v).cents)}. Remember: penny 1, nickel 5, dime 10, quarter 25.` : `That’s a ${o.v}. ${ans === 'penny' ? 'The penny is the brown one.' : ans === 'nickel' ? 'The nickel is big and silver, with a smooth edge.' : ans === 'dime' ? 'The dime is the smallest coin.' : 'The quarter is the biggest coin.'}`;
        const r = await CK_choose(os, ans, { mode, why, pics: true });
        return finish(r, q.t === 'cfind' ? `Find the ${q.c}` : q.t === 'cfact' ? q.q : `Which coin is worth ${CK_cents(C(q.c).cents)}?`, ans, { text: spoken, choices: os.map(o => o.label), choiceHtml: choiceHtml(os) });
      }
      case 'cvalue': {
        app.innerHTML = qHead(part, 'How much is this coin worth?') + count + hearBtn + `<div class="ck-stage">${CK_coin(q.c, q.side, 210)}</div><div id="io"></div>`;
        sayQ('How much is this coin worth?');
        const os = CK_ORDER.map(c => ({ v: c, label: CK_cents(C(c).cents), say: CK_centsSay(C(c).cents) }));
        const r = await CK_choose(os, q.c, { mode, sayOpt: true, why: () => `This is a ${q.c}. Remember: penny 1, nickel 5, dime 10, quarter 25.` });
        return finish(r, `How much is a ${q.c} worth? (${q.side} up)`, CK_cents(C(q.c).cents), { text: `How much is this coin worth? (a ${q.c})`, html: CK_coin(q.c, q.side, 150), choices: os.map(o => o.label) });
      }
      case 'cmore': {
        const [a, b] = q.set, hi = C(a.c).cents > C(b.c).cents ? a.c : b.c, lo = hi === a.c ? b.c : a.c, ans = q.less ? lo : hi;
        app.innerHTML = qHead(part, `Which coin is worth <b>${q.less ? 'less' : 'more'}</b>?`) + count + hearBtn + '<div id="io"></div>';
        sayQ(`Which coin is worth ${q.less ? 'less' : 'more'}?`);
        const os = q.set.map(x => coinOpt(x, 170));
        const r = await CK_choose(os, ans, { mode, pics: true, why: o => `That’s a ${o.v}, worth ${CK_centsSay(C(o.v).cents)}. The other one is a ${o.v === hi ? lo : hi}, worth ${CK_centsSay(C(o.v === hi ? lo : hi).cents)}.${(o.v === 'nickel' && !q.less) || (o.v === 'dime' && q.less) ? ' Bigger doesn’t always mean more!' : ''}` });
        return finish(r, `Which is worth ${q.less ? 'less' : 'more'}: ${a.c} or ${b.c}?`, ans, { text: `Which coin is worth ${q.less ? 'less' : 'more'}?`, choices: os.map(o => o.label), choiceHtml: choiceHtml(os) });
      }
      case 'ccount': {
        const total = CK_sum(q.coins), sides = q.coins.map(() => 'heads');
        app.innerHTML = qHead(part, 'How much money is this? Count it!') + count + `<div class="row">${hearBtn}${mode === 'practice' ? '<button class="btn" id="ckHelp">🔢 Count with me</button>' : ''}</div><div class="ck-np"><div class="ck-stage" id="ckCoins">${CK_row(q.coins, 84, sides)}</div><div id="io"></div></div>`;
        sayQ(mode === 'practice' && new Set(q.coins).size > 1 ? 'How much money is this? Start with the coin worth the most, and count on.' : 'How much money is this? Count it!');
        let helped = false;
        if (mode === 'practice') $('ckHelp').onclick = async () => {
          if (helped === 'busy') return; helped = 'busy'; $('ckHelp').disabled = true; let s = 0;
          const els = [...document.querySelectorAll('#ckCoins .ck-c')], order = els.map((el, k) => k).sort((x, y) => C(q.coins[y]).cents - C(q.coins[x]).cents);
          for (const k of order) { s += C(q.coins[k]).cents; els[k].classList.add('on'); els[k].querySelector('.ck-lab').textContent = s + '¢'; await say(String(s), 0.85); await wait(200); }
          helped = true;
        };
        const r = await L_numpad(total, { hint: mode === 'practice' ? 'Not quite. Count again. Start with the coin worth the most!' : 'Not quite. Count again.' });
        return finish(r, `${q.coins.length} coins${helped ? ' (used Count with me)' : ''}`, String(total), { text: `How much money? ${q.coins.join(', ')} = ${total}¢${helped ? '. He used “Count with me”.' : ''}`, html: `<div style="display:flex;flex-wrap:wrap;gap:4px;max-width:520px">${q.coins.map(c => CK_coin(c, 'heads', 60)).join('')}</div>` });
      }
      case 'cmake': {
        const purse = []; let tries = 0, first = null; const attempts = [];
        app.innerHTML = qHead(part, `Make <b>${q.n}¢</b>. Tap coins to put them in the box.`) + count + hearBtn
          + `<div class="ck-goal">${q.n}¢</div><div class="ck-purse" id="ckPurse"></div><div class="ck-tray" id="ckTray">${CK_ORDER.map(c => `<button data-add="${c}">${CK_coin(c, 'heads', 84)}${c}</button>`).join('')}</div>
          <div class="message" id="msg"></div><div class="row acts"><button class="btn big" id="ckUndo">↶ Take one out</button><button class="btn big primary" id="ckCheck" disabled>Check ✓</button></div><div id="io"></div>`;
        sayQ(`Make ${CK_centsSay(q.n)}. Tap coins to put them in the box. Then tap check.`);
        const draw = () => { $('ckPurse').innerHTML = purse.length ? purse.map((c, k) => `<button data-out="${k}" aria-label="take out the ${c}">${CK_coin(c, 'heads', 70)}</button>`).join('') : '<span class="ph">Your coins go here</span>'; $('ckCheck').disabled = !purse.length; };
        draw();
        const r = await new Promise(rr => {
          $('ckTray').onclick = e => { const b = e.target.closest('[data-add]'); if (!b || purse.length >= 12) return; purse.push(b.dataset.add); fb(b.dataset.add, 1.05); draw(); };
          $('ckPurse').onclick = e => { const b = e.target.closest('[data-out]'); if (!b) return; purse.splice(+b.dataset.out, 1); draw(); };
          $('ckUndo').onclick = () => { purse.pop(); draw(); };
          $('ckCheck').onclick = () => {
            const s = CK_sum(purse), txt = `${[...purse].sort((x, y) => C(y).cents - C(x).cents).join(', ')} = ${s}¢`; attempts.push(txt); if (first === null) first = txt;
            if (s === q.n) { ['ckTray', 'ckPurse'].forEach(id => { $(id).onclick = null; }); $('ckCheck').disabled = $('ckUndo').disabled = true; setMsg(tries ? 'You made it!' : 'Yes! Right the first time!', 'good'); fb(`Yes! That makes ${CK_centsSay(q.n)}!`, 0.95); nextUp(1400).then(() => rr({ typed: first, ok: tries === 0, picks: attempts })); return; }
            tries++; shakeEl($('ckPurse'));
            if (mode === 'practice' || tries >= 2) { const m = `That makes ${s}¢. You need ${q.n}¢. ${s > q.n ? 'Take some out.' : 'Add some more.'}`; setMsg(m, 'try'); fb(`That makes ${CK_centsSay(s)}. You need ${CK_centsSay(q.n)}.`, 0.92); }
            else { setMsg('Not quite. Count your coins again.', 'try'); fb('Not quite. Count your coins again.', 0.95); }
          };
        });
        return finish(r, `Make ${q.n}¢`, `${q.n}¢`, { text: `Make ${q.n}¢ with coins. He tried: ${r.picks.join(' → ')}` });
      }
      case 'khand': {
        app.innerHTML = qHead(part, 'Which hand is this?') + count + hearBtn + `<div class="ck-stage">${CK_clock(q.h, q.m, { hands: q.which, plain: true, hlHand: q.which, px: 270 })}</div><div id="io"></div>`;
        sayQ('Look at the hand on this clock. Is it the hour hand, or the minute hand?');
        const os = [{ v: 'hour', label: 'the hour hand' }, { v: 'minute', label: 'the minute hand' }];
        const r = await CK_choose(os, q.which, { mode, why: () => 'The hour hand is short. The minute hand is long. Is this hand short or long?' });
        return finish(r, `Which hand is this? (the ${q.which} hand)`, `the ${q.which} hand`, { text: `Which hand is this? (only the ${q.which} hand was shown, in gray)`, html: CK_clock(q.h, q.m, { hands: q.which, plain: true, px: 170 }), choices: os.map(o => o.label) });
      }
      case 'kfact': {
        app.innerHTML = qHead(part, L_esc(q.q)) + count + hearBtn + `<div class="ck-stage">${CK_clock(12, 0, { hands: 'none', px: 220 })}</div><div id="io"></div>`;
        sayQ(q.q);
        const os = L_shuf(q.opts).map(x => ({ v: x, label: x }));
        const r = await CK_choose(os, q.a, { mode, why: () => 'Look at the clock and count the numbers around it.' });
        return finish(r, q.q, q.a, { text: q.q, choices: os.map(o => o.label) });
      }
      case 'ktap': case 'kwhere': {
        const ans = q.t === 'ktap' ? q.n : q.m / 5;
        const prompt = q.t === 'ktap' ? `Tap the <b>${q.n}</b> on the clock.` : `Where does the <b class="mr">long hand</b> point for <b>${q.m} minutes</b>? Tap the number.`;
        app.innerHTML = qHead(part, prompt) + count + hearBtn + `<div class="ck-stage"><div class="ck-clockwrap" id="ckClk">${CK_clock(12, 0, { hands: 'none', tap: true, px: 300 })}</div></div><div id="io"></div>`;
        sayQ(q.t === 'ktap' ? `Tap the ${q.n} on the clock.` : `Where does the long hand point for ${q.m} minutes? Count by fives and tap the number.`);
        const r = await CK_tapNum(ans, { mode, clue: q.t === 'ktap' ? `Start at the 12 and count around: 1, 2, 3… Find the ${q.n}.` : 'Count by 5s for each number: 5, 10, 15, 20…' });
        return finish(r, q.t === 'ktap' ? `Tap the ${q.n}` : `Long hand for ${q.m} minutes`, String(ans), { text: q.t === 'ktap' ? `Tap the ${q.n} on the clock.` : `Where does the long hand point for ${q.m} minutes? (the ${ans})`, html: CK_clock(12, 0, { hands: 'none', px: 170, hlNum: ans }) });
      }
      case 'kmins': {
        app.innerHTML = qHead(part, `The <b class="mr">long hand</b> points to the <b>${q.k}</b>. How many minutes is that?`) + count + hearBtn + `<div class="ck-np"><div class="ck-stage">${CK_clock(12, q.k * 5, { hands: 'minute', px: 250 })}</div><div id="io"></div></div>`;
        sayQ(`The long hand points to the ${q.k}. How many minutes is that? Count by fives.`);
        const r = await L_numpad(q.k * 5, { hint: mode === 'practice' ? 'Count by 5s for each number: 5, 10, 15…' : 'Not quite. Count by 5s again.' });
        return finish(r, `Long hand on the ${q.k}`, String(q.k * 5), { text: `The long hand points to the ${q.k}. How many minutes?`, html: CK_clock(12, q.k * 5, { hands: 'minute', px: 170 }) });
      }
      case 'kread': {
        const os = CK_readOpts(q.h, q.m, q.fmt).map(s => ({ v: s, label: s, say: s.includes(':') ? CK_spoken(...s.split(':').map(Number)) : s.replace('’', "'") }));
        const ans = q.fmt === 'words' ? CK_words(q.h, q.m) : CK_dig(q.h, q.m);
        app.innerHTML = qHead(part, 'What time is it?') + count + hearBtn + `<div class="ck-stage">${CK_clock(q.h, q.m, { px: 280 })}</div><div id="io"></div>`;
        sayQ('What time is it?');
        const clue = q.m === 0 ? 'The long hand is on the 12, so it’s o’clock. Which number does the short hand point to?' : q.m === 30 ? 'The long hand is on the 6: half past. Which number did the short hand just pass? That’s the hour.' : 'First the short hand: which number did it just pass? Then count the long hand by 5s.';
        const r = await CK_choose(os, ans, { mode, sayOpt: true, why: () => clue });
        return finish(r, `What time is it? (${CK_dig(q.h, q.m)})`, ans, { text: 'What time is it?', html: CK_clock(q.h, q.m, { px: 170 }), choices: os.map(o => o.label) });
      }
      case 'kpick': {
        const ans = CK_dig(q.h, q.m), os = CK_readOpts(q.h, q.m, 'dig').map(s => { const [hh, mm] = s.split(':').map(Number); return { v: s, label: s, html: CK_clock(hh, mm, { px: 190 }) }; });
        app.innerHTML = qHead(part, `Which clock says <b>${ans}</b>?`) + count + hearBtn + `<div class="ck-stage"><span class="ck-digital">${ans}</span></div><div id="io"></div>`;
        sayQ(`Which clock says ${CK_spoken(q.h, q.m)}?`);
        const r = await CK_choose(os, ans, { mode, pics: true, why: () => q.m === 0 ? `For ${ans}, the long hand is on the 12 and the short hand is on the ${q.h}.` : q.m === 30 ? `For ${ans}, the long hand is on the 6, and the short hand is just past the ${q.h}.` : `For ${ans}, the short hand is just past the ${q.h}.` });
        return finish(r, `Which clock says ${ans}?`, ans, { text: `Which clock says ${ans}?`, choices: os.map(o => o.label), choiceHtml: choiceHtml(os) });
      }
      case 'kset': {
        const goal = CK_dig(q.h, q.m), mAns = q.m === 0 ? 12 : q.m / 5;
        let mm = q.withMin ? null : 0, hh = null;
        const drawClk = () => { $('ckClk').innerHTML = CK_clock(hh || 12, mm == null ? 0 : mm, { hands: hh && mm != null ? 'both' : mm != null ? 'minute' : 'none', tap: true, px: 300 }); };
        app.innerHTML = qHead(part, `Make the clock say <b>${goal}</b>.`) + count + hearBtn + `<div class="ck-stage"><span class="ck-digital" style="font-size:48px">${goal}</span><div class="ck-clockwrap" id="ckClk"></div></div><p class="note" id="ckStep"></p><div id="io"></div>`;
        drawClk();
        let ok = true; const picks = [];
        if (q.withMin) {
          $('ckStep').innerHTML = 'First the <b class="mr">long hand</b>: tap the number it points to.';
          sayQ(`Make the clock say ${CK_spoken(q.h, q.m)}. First, tap where the long hand goes.`);
          const r1 = await CK_tapNum(mAns, { mode, clue: q.m === 0 ? 'For o’clock, the long hand points to the 12.' : q.m === 30 ? 'For half past, the long hand points to the 6.' : `Count by 5s to ${q.m}: 5, 10, 15… Each number is 5 more.` });
          ok = ok && r1.ok; picks.push(...r1.picks.map(p => `long hand on ${p}`)); mm = q.m; drawClk();
        } else sayQ(`Make the clock say ${CK_spoken(q.h, q.m)}.`);
        $('ckStep').innerHTML = `Now the <b class="hb">short hand</b>: tap the hour.${q.m ? ' (It goes just past that number.)' : ''}`;
        if (q.withMin) await say('Now tap where the short hand goes.', 0.9);
        const r2 = await CK_tapNum(q.h, { mode, clue: `The short hand points to the hour. ${q.m ? `For ${goal}, that’s the ${q.h}. It goes just past the ${q.h}.` : `Find the ${q.h}.`}`, onTap: n => { hh = n; drawClk(); $('ckClk').classList.add('tap'); } });
        ok = ok && r2.ok; picks.push(...r2.picks.map(p => `short hand on ${p}`)); hh = q.h; drawClk(); $('ckClk').classList.remove('tap');
        return finish({ ok, typed: picks[0], picks }, `Set the clock to ${goal}`, goal, { text: `Make the clock say ${goal}.${q.withMin ? '' : ' (The long hand was already on the 12.)'}`, html: CK_clock(q.h, q.m, { px: 170 }) });
      }
    }
    done();
  });

  /* ---------- 2. Practice ---------- */
  const practice = async () => {
    const qs = CK_genFor(kind, L).practice();
    await each(qs.length, i => ask(qs[i], i, qs.length, 'Practice', 'practice'));
    partDone(firstTry('Practice') + '.');
  };
  /* ---------- 3. Check ---------- */
  const check = async () => {
    const mine = CK_genFor(kind, L).check().map(q => ({ ...q, lvl: L }));
    const lower = Array.from({ length: L - 1 }, (_, k) => k + 1), rv = [];
    if (lower.length) { const picks = [lower.at(-1), CK_pickOf(lower)]; if (d.done) picks.push(CK_pickOf(lower)); picks.forEach(l => { const q = CK_pickOf(CK_genFor(kind, l).check()); rv.push({ ...q, lvl: l, review: true }); }); }
    const qs = [...mine]; rv.forEach((q, k) => qs.splice(Math.min(qs.length, 2 + k * 3), 0, q));   // the earlier-level ones mixed in
    await each(qs.length, i => ask(qs[i], i, qs.length, 'Check', 'check'));
    const at = items.filter(x => x.part === 'Check' && x.lvl === L && !x.review), right = at.filter(x => x.ok).length, total = at.length, pct = total ? Math.round(right / total * 100) : 0;
    extra.dk = { kind, level: L, right, total, pct, daily: !!d.daily };
    const good = pct >= DK_PASS;
    let msg = `${right} of ${total} right the first time on level ${L}.`;
    if (d.daily) {
      if (good && d.done) msg += ' You know all of it! Keep it up!';
      else if (good && (d.prevGood || 0) + 1 >= DK_NEED) msg += L < K.levels.length ? ` Great job! Next time you start level ${L + 1}! ⭐` : ' Great job! You passed the last level! ⭐';
      else if (good) msg += ' Great job! One more good day like this and you move up a level!';
      else msg += ' We’ll practice this again next time. You’re getting better!';
    }
    if (good) confetti();
    partDone(msg);
  };
  PARTS = [{ name: 'Learn', run: learn }, { name: 'Practice', run: practice }, { name: 'Check', run: check }];
  return { intro: `${d.fresh ? '⭐ New level! ' : ''}Level ${L} of ${K.levels.length}: ${lv.kid}.` };
}
LT.coins.run = () => CK_run('coins');
LT.clock.run = () => CK_run('clock');
