/* The Study: Science lessons (added Nov 9, 2026 for the 11/13/26 school day). Loaded after lessons.js by index.html and do.html.
   Four Seasons (match the season signs, then walk the Earth around the sun like the lamp-and-balloon demo), Seasonal Cycle (match the
   clues on the wheel, draw himself dressed for each season, then spin the wheel), and Quiz (any multiple-choice quiz with pictures; the
   11/13/26 one is the Seasons lesson assessment). The pictures are our own drawings, not the school's. */

/* ---------- pictures ---------- */
const S_SEASONS = ['summer', 'fall', 'winter', 'spring'];   // the order the Earth goes around the sun
const S_NAME = { summer: 'Summer', fall: 'Fall', winter: 'Winter', spring: 'Spring' };
const S_COL = { summer: '#F59E0B', fall: '#EA580C', winter: '#38BDF8', spring: '#22C55E' };
function S_art(k, size = 120) {
  const v = `width="${size}" height="${size}" viewBox="0 0 120 120"`;
  if (k === 'summer') return `<svg ${v} aria-label="Summer sun"><g stroke="#F59E0B" stroke-width="6" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${60 + 36 * Math.cos(a)}" y1="${60 + 36 * Math.sin(a)}" x2="${60 + 52 * Math.cos(a)}" y2="${60 + 52 * Math.sin(a)}"/>`; }).join('')}</g><circle cx="60" cy="60" r="28" fill="#FACC15" stroke="#F59E0B" stroke-width="4"/><circle cx="51" cy="56" r="3" fill="#92400E"/><circle cx="69" cy="56" r="3" fill="#92400E"/><path d="M49 67 Q60 76 71 67" stroke="#92400E" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  if (k === 'fall') return `<svg ${v} aria-label="Fall tree"><path d="M56 108 L58 70 L48 58 M58 74 L70 60 M60 108 L62 70" stroke="#7C4A1E" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="#EA580C"><circle cx="42" cy="44" r="16"/><circle cx="62" cy="34" r="18"/><circle cx="80" cy="48" r="15"/></g><g fill="#F59E0B"><circle cx="54" cy="52" r="11"/><circle cx="74" cy="30" r="9"/></g><g fill="#DC2626"><path d="M24 82 q6 -8 12 0 q-6 8 -12 0z"/><path d="M88 74 q6 -8 12 0 q-6 8 -12 0z"/><path d="M34 104 q6 -8 12 0 q-6 8 -12 0z"/></g><path d="M74 102 q6 -8 12 0 q-6 8 -12 0z" fill="#F59E0B"/><line x1="10" y1="110" x2="110" y2="110" stroke="#A16207" stroke-width="3"/></svg>`;
  if (k === 'winter') return `<svg ${v} aria-label="Winter snow"><path d="M4 96 Q60 80 116 98 L116 116 L4 116Z" fill="#E0F2FE" stroke="#7DD3FC" stroke-width="2"/><circle cx="60" cy="82" r="16" fill="#fff" stroke="#94A3B8" stroke-width="2"/><circle cx="60" cy="58" r="11" fill="#fff" stroke="#94A3B8" stroke-width="2"/><circle cx="56" cy="56" r="1.8" fill="#1F2937"/><circle cx="64" cy="56" r="1.8" fill="#1F2937"/><path d="M60 59 l7 2 l-7 2z" fill="#F97316"/><rect x="50" y="42" width="20" height="6" fill="#1F2937"/><rect x="54" y="32" width="12" height="11" fill="#1F2937"/>${[[18, 18], [40, 30], [92, 22], [100, 52], [22, 58], [84, 40], [30, 82], [96, 76], [70, 14], [12, 38]].map(([x, y]) => `<g stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"><line x1="${x - 5}" y1="${y}" x2="${x + 5}" y2="${y}"/><line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + 5}"/><line x1="${x - 3.5}" y1="${y - 3.5}" x2="${x + 3.5}" y2="${y + 3.5}"/><line x1="${x - 3.5}" y1="${y + 3.5}" x2="${x + 3.5}" y2="${y - 3.5}"/></g>`).join('')}</svg>`;
  if (k === 'spring') return `<svg ${v} aria-label="Spring flowers">${[[30, 52, '#EC4899'], [62, 38, '#A855F7'], [92, 56, '#F43F5E']].map(([x, y, c]) => `<line x1="${x}" y1="${y}" x2="${x}" y2="112" stroke="#16A34A" stroke-width="5"/><path d="M${x} ${y + 34} q12 -10 18 0 q-10 6 -18 0z" fill="#22C55E"/>${Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return `<circle cx="${x + 11 * Math.cos(a)}" cy="${y + 11 * Math.sin(a)}" r="8" fill="${c}"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="7" fill="#FACC15"/>`).join('')}<path d="M86 14 q6 -6 12 0 q6 -6 12 0" stroke="#64748B" stroke-width="2" fill="none"/><circle cx="16" cy="18" r="8" fill="#FDE68A"/></svg>`;
  if (k === 'sun') return S_art('summer', size);
  if (k === 'moon') return `<svg ${v} aria-label="Moon"><circle cx="60" cy="60" r="40" fill="#E5E7EB" stroke="#94A3B8" stroke-width="3"/><circle cx="46" cy="48" r="7" fill="#CBD5E1"/><circle cx="70" cy="72" r="10" fill="#CBD5E1"/><circle cx="74" cy="42" r="5" fill="#CBD5E1"/></svg>`;
  if (k === 'mars') return `<svg ${v} aria-label="Mars"><circle cx="60" cy="60" r="40" fill="#DC6B3C" stroke="#9A3412" stroke-width="3"/><circle cx="48" cy="50" r="8" fill="#B4532A"/><circle cx="72" cy="70" r="6" fill="#B4532A"/></svg>`;
  if (k === 'earth') return `<svg ${v} aria-label="Earth"><circle cx="60" cy="60" r="40" fill="#3B82F6" stroke="#1E3A8A" stroke-width="3"/><path d="M38 40 q12 -8 20 2 q-4 10 -14 8 q-8 6 -6 -10z M64 62 q14 -6 20 6 q-6 16 -18 10z" fill="#22C55E"/></svg>`;
  if (k === 'clock') return `<svg ${v} aria-label="Clock"><circle cx="60" cy="60" r="44" fill="#fff" stroke="#1E3A5F" stroke-width="5"/><line x1="60" y1="60" x2="60" y2="30" stroke="#1E3A5F" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="80" y2="70" stroke="#1E3A5F" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (k === 'calendar') return `<svg ${v} aria-label="Calendar"><rect x="18" y="24" width="84" height="80" rx="8" fill="#fff" stroke="#1E3A5F" stroke-width="4"/><rect x="18" y="24" width="84" height="20" rx="6" fill="#DC2626"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${26 + (i % 4) * 19}" y="${52 + Math.floor(i / 4) * 16}" width="12" height="10" fill="#CBD5E1"/>`).join('')}</svg>`;
  if (k === 'tilt') return `<svg ${v} aria-label="Tilted Earth getting sunlight"><circle cx="18" cy="60" r="14" fill="#FACC15"/><g stroke="#FACC15" stroke-width="3">${[44, 60, 76].map(y => `<line x1="34" y1="${y}" x2="62" y2="${y}"/>`).join('')}</g><circle cx="84" cy="60" r="26" fill="#3B82F6" stroke="#1E3A8A" stroke-width="3"/><line x1="70" y1="28" x2="98" y2="92" stroke="#1F2937" stroke-width="3"/></svg>`;
  return '';
}
// a picture for a quiz choice: by the words in it
function S_choicePic(t) {
  const x = String(t).toLowerCase();
  if (/\bsummer\b/.test(x)) return 'summer'; if (/\b(fall|autumn)\b/.test(x)) return 'fall'; if (/\bwinter\b/.test(x)) return 'winter'; if (/\bspring\b/.test(x)) return 'spring';
  if (/tip|tilt/.test(x)) return 'tilt'; if (/\bsun\b/.test(x)) return 'sun'; if (/moon/.test(x)) return 'moon'; if (/mars/.test(x)) return 'mars';
  if (/day|hour/.test(x)) return 'clock'; if (/week|year|month/.test(x)) return 'calendar'; if (/earth/.test(x)) return 'earth';
  return '';
}

/* ---------- worksheet definitions ---------- */
// "question | choice | choice | answer // why", one per line; a line starting with ! asks him to say his answer out loud first
function S_quizParse(t) {
  return String(t || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const say = l.startsWith('!'); if (say) l = l.slice(1).trim();
    const [main, why = ''] = l.split('//'), p = main.split('|').map(x => x.trim()).filter(Boolean);
    if (p.length < 4) return null;
    const ans = p[p.length - 1], choices = p.slice(1, -1);
    return { q: p[0], choices, answer: choices.find(c => c.toLowerCase() === ans.toLowerCase()) || choices[0], why: why.trim(), say };
  }).filter(Boolean);
}
Object.assign(LT, {
  seasons: {
    name: 'Four Seasons', cls: 'science',
    help: 'Season signs and a walk around the sun. On screen he drags each season’s name onto its picture, then walks the Earth around the sun (like the lamp and balloon): at each season he hears what changes and answers a question. Printed, it’s the four signs to cut out for the lamp demo.',
    schools: {
      '2026-11-13': { note: 'The “Four Seasons Signs” sheet and the lamp-and-balloon demo from the Seasons lesson. The pictures are our own drawings.', set: () => ({ heading: 'Four Seasons', match: true, walk: true }) }
    },
    own: () => ({ heading: 'Four Seasons', match: true, walk: true }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'match', label: 'Match the season signs (drag each name onto its picture)', type: 'check' },
      { k: 'walk', label: 'Walk the Earth around the sun (a fact and a question at each season)', type: 'check' }
    ],
    acts: () => [],
    title: c => (c.heading || '').trim() || 'Four Seasons',
    data: c => ({ heading: LT.seasons.title(c), match: !!c.match, walk: !!c.walk }),
    check: d => d.match || d.walk ? '' : 'Pick at least one part.'
  },
  seacycle: {
    name: 'Seasonal Cycle', cls: 'science',
    help: 'The seasonal cycle wheel. On screen he drags each season onto its clue, draws himself dressed for each season, then spins the wheel (made from his drawings) to the season it asks for. Printed, it’s the wheel to cut out.',
    schools: {
      '2026-11-13': { note: 'The “Seasonal Cycle” wheel from the Seasons lesson (the paper plate wheel), on screen. The clue sentences are our own words.', set: () => ({ heading: 'Seasonal Cycle', draw: true, spin: true }) }
    },
    own: () => ({ heading: 'Seasonal Cycle', draw: true, spin: true }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'draw', label: 'Draw himself dressed for each season', type: 'check' },
      { k: 'spin', label: 'Turn the window to each season', type: 'check' }
    ],
    acts: () => [],
    title: c => (c.heading || '').trim() || 'Seasonal Cycle',
    data: c => ({ heading: LT.seacycle.title(c), draw: !!c.draw, spin: !!c.spin }),
    check: () => ''
  },
  quiz: {
    name: 'Quiz', cls: 'science',
    help: 'A picture quiz: each question is read to him, he taps an answer, and if it’s wrong he sees the right one and why. Questions that start with ! ask him to say his answer out loud first (recorded). Grade = right the first time.',
    schools: {
      '2026-11-13': { note: 'The 7 questions of the Seasons “Lesson Assessment”, with the answer key’s answers. The wrong choices are ours.', set: () => ({ heading: 'Seasons Quiz', questions: [
        'During what season does the sun shine most directly on us, making it very warm? | spring | summer | fall | winter | summer // In summer, the sun shines most directly on us.',
        'How long does it take for the Earth to spin once on its axis? | one day (24 hours) | one week | one year | one day (24 hours) // One spin takes one day: 24 hours.',
        'What does the Earth orbit around once every 365 days? | the moon | the sun | Mars | the sun // The Earth goes around the sun once a year: 365 days.',
        '!Why is summer hotter than winter? | Our part of Earth is tipped toward the sun | The Earth is closer to the sun | The sun gets bigger in summer | Our part of Earth is tipped toward the sun // In summer our part of the Earth is tipped toward the sun, so we get more direct sunlight and it gets hotter.',
        'What season is very cold and snowy? | summer | winter | spring | winter // Winter is the cold, snowy season.',
        'The weather gets warmer and it rains more during which season? | fall | winter | spring | spring // In spring it gets warmer and rains more.',
        'The weather gets cooler and leaves change colors during which season? | spring | fall | summer | fall // In fall it gets cooler and the leaves change colors.'
      ].join('\n') }) }
    },
    own: () => ({ heading: 'My Quiz', questions: 'What season comes after winter? | spring | fall | summer | spring // Spring comes after winter.\nWhat do we see in the sky at night? | the moon | the sun | spring | the moon' }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'questions', label: 'Questions', type: 'area', rows: 8, help: 'One per line: question | choice | choice | answer // why (the why is optional). Start a line with ! to have him say his answer out loud first.' }
    ],
    acts: () => [],
    title: c => (c.heading || '').trim() || 'Quiz',
    data: c => ({ heading: LT.quiz.title(c), qs: S_quizParse(c.questions) }),
    check: d => d.qs.length ? '' : 'Type at least one question: question | choice | choice | answer'
  }
});
L_IDS.push('seasons', 'seacycle', 'quiz');
Object.assign(L_CLASS_OF, { seasons: 'science', seacycle: 'science', quiz: 'science' });

/* ---------- printed pages (Worksheets page only) ---------- */
const S_CLUE = {
  winter: 'The coldest season, with the least direct sunlight.',
  summer: 'The hottest season, with the most direct sunlight.',
  spring: 'The season after winter, when it gets warmer.',
  fall: 'The season after summer, when it gets cooler.'
};
const S_WHEEL = ['winter', 'summer', 'spring', 'fall'];   // top-left, top-right, bottom-left, bottom-right (like the school wheel)
{
  LT.seasons.print = (d, exact) => L_sheetOf(nameDate() + title(d.heading, 'Season Signs: cut them out', star('#F59E0B'), star('#38BDF8'))
    + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:2px dashed #64748B;margin-top:10px">${['fall', 'winter', 'spring', 'summer'].map(k => `<div style="border:2px dashed #64748B;padding:16px;text-align:center">${S_art(k, 250)}<div style="font:700 30px Fredoka,sans-serif">${S_NAME[k]}</div></div>`).join('')}</div>`, exact, { gap: 10 });
  LT.seacycle.print = (d, exact) => {
    const q = [[-180, -90], [-90, 0], [90, 180], [0, 90]], P = (a, r) => [200 + r * Math.cos(a * Math.PI / 180), 200 + r * Math.sin(a * Math.PI / 180)];
    const wedge = (a0, a1) => { const [x0, y0] = P(a0, 190), [x1, y1] = P(a1, 190); return `M200 200 L${x0} ${y0} A190 190 0 0 1 ${x1} ${y1}Z`; };
    const big = `<svg width="560" height="560" viewBox="0 0 400 400">${S_WHEEL.map((k, i) => { const [a0, a1] = q[i], m = (a0 + a1) / 2, [tx, ty] = P(m, 120); return `<path d="${wedge(a0, a1)}" fill="#fff" stroke="#1F2937" stroke-width="2"/><foreignObject x="${tx - 70}" y="${ty - 40}" width="140" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 13px Fredoka,sans-serif;text-align:center;color:#334155">${S_CLUE[k]}</div></foreignObject>`; }).join('')}<circle cx="200" cy="200" r="190" fill="none" stroke="#1F2937" stroke-width="2" stroke-dasharray="3 5"/></svg>`;
    const small = `<svg width="220" height="220" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="#fff" stroke="#1F2937" stroke-width="2" stroke-dasharray="3 5"/><line x1="100" y1="5" x2="100" y2="195" stroke="#1F2937" stroke-width="2"/><line x1="5" y1="100" x2="195" y2="100" stroke="#1F2937" stroke-width="2"/>${[['Winter', 52, 60], ['Summer', 148, 60], ['Spring', 52, 145], ['Fall', 148, 145]].map(([t, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka" font-size="18">${t}</text>`).join('')}</svg>`;
    return L_sheetOf(nameDate() + title(d.heading, 'Draw yourself in each season, then cut out both circles', star('#22C55E'), star('#EA580C')) + `<div style="text-align:center">${big}</div><div style="display:flex;align-items:center;gap:20px;padding-left:30px">${small}<div style="font-size:18px;color:#334155">Cut out both circles. Put the small one in the middle and push a brad through the center.</div></div>`, exact, { gap: 6 });
  };
  LT.quiz.print = (d, exact) => L_sheetOf(nameDate() + title(d.heading, 'Circle the answer', star('#3C7DD9'), star('#F59E0B'))
    + `<div style="display:flex;flex-direction:column;gap:16px;padding:6px 30px">${d.qs.map((q, i) => `<div><div style="font:600 21px Andika,sans-serif"><b>${i + 1}.</b> ${L_esc(q.q)}</div><div style="display:flex;flex-wrap:wrap;gap:10px;padding:6px 0 0 26px">${q.choices.map(c => `<span style="border:2px solid #94A3B8;border-radius:999px;padding:3px 14px;font-size:18px">${L_esc(c)}</span>`).join('')}</div></div>`).join('')}</div>`, exact, { gap: 10 });
}

/* =====================================================================
   On screen (do.html)
   ===================================================================== */
const S_css = `
  .s-signs { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; width:min(520px,94vw,72vh); }
  .s-sign { background:#fff; border:4px solid #CBD5E1; border-radius:18px; display:flex; flex-direction:column; align-items:center; padding:4px; min-height:140px; }
  .s-sign .lab { font:700 24px Fredoka,sans-serif; min-height:32px; color:#1F2937; } .s-sign.over { border-color:#FACC15; } .s-sign.good { border-color:var(--good); }
  .s-orbit { width:min(640px,96vw,58vh); background:#0B1324; border-radius:20px; display:block; }
  .s-card { background:var(--surface-2); border:2px solid var(--line); border-radius:16px; padding:10px 16px; width:min(640px,94vw); text-align:center; }
  .s-card h3 { margin:0 0 4px; font:700 26px Fredoka,sans-serif; } .s-card p { margin:4px 0; font-size:20px; }
  .s-wheel { width:min(500px,92vw,64vh); height:auto; touch-action:none; }
  .s-split { display:flex; flex-wrap:wrap; gap:14px 22px; align-items:center; justify-content:center; width:100%; }
  .s-side { display:flex; flex-direction:column; align-items:center; gap:10px; min-width:240px; max-width:360px; flex:0 1 320px; }
  .s-side .ls-bub-home { min-height:64px; } .s-wheel .q.over { stroke:#FACC15; stroke-width:6; } .s-wheel .q.good { stroke:var(--good); stroke-width:6; }
  .s-qpic svg { display:block; margin:0 auto; } .ls-choices button .s-cp { display:block; margin:0 auto 4px; }
  .s-stars { display:flex; gap:6px; justify-content:center; font-size:26px; } .s-stars .on { filter:none; } .s-stars span { filter:grayscale(1) opacity(.35); }
  .s-why { background:#1B2D47; border:2px solid var(--study); border-radius:14px; padding:10px 14px; font-size:20px; width:min(640px,94vw); }
`;
if (L_IN_DO) { const st = document.createElement('style'); st.textContent = S_css; document.head.appendChild(st); }

/* ---------- Four Seasons ---------- */
LT.seasons.run = () => {
  const d = SD;
  const match = async () => {
    const order = L_shuf(['fall', 'winter', 'spring', 'summer']), cards = L_shuf(['fall', 'winter', 'spring', 'summer']), done = new Set();
    await each(order.length, i => new Promise(async res => {
      const k = order[i];
      app.innerHTML = L_exactTag() + head('Which picture shows this season? Drag the name onto it.') + L_count(i, 4, 'Season') + `<div class="s-split"><div class="s-signs">${cards.map((c, j) => `<div class="s-sign" data-h="${j}">${S_art(c, 110)}<div class="lab">${done.has(c) ? S_NAME[c] : ''}</div></div>`).join('')}</div><div class="s-side"><div id="io"></div></div></div>`;
      const picks = await L_dragTo(S_NAME[k], '.s-sign', cards.indexOf(k), k === 'fall' ? 'Fall is when the leaves change colors and fall down.' : k === 'winter' ? 'Winter is the cold, snowy season.' : k === 'spring' ? 'Spring is when flowers grow.' : 'Summer is the hot, sunny season.', { names: cards.map(c => S_NAME[c]) });
      done.add(k);
      mark('Season Signs', `${S_NAME[k]} picture`, picks.length === 1, picks[0], S_NAME[k], null, { text: `Which picture shows ${S_NAME[k]}?`, choices: cards.map(c => S_NAME[c]), choiceHtml: Object.fromEntries(cards.map(c => [S_NAME[c], S_art(c, 70)])) }, picks);
      await wait(400); res();
    }));
    partDone(firstTry('Season Signs') + '.');
  };
  // The lamp-and-balloon demo: the sun in the middle, the season signs around it (summer at 9 o'clock, fall at 6, winter at 3, spring at
  // 12, like the lesson), the Earth tilted the same way all year. At each season: a fact and a question.
  const STOPS = [
    { k: 'summer', a: 180, fact: ['Our part of the Earth is tipped toward the sun.', 'The sunlight shines right on us, so it’s hot.', 'Days are long and nights are short.'], q: 'Is our part of the Earth tipped toward the sun, or away from it?', ch: ['toward the sun', 'away from the sun'], ans: 'toward the sun' },
    { k: 'fall', a: 90, fact: ['The sunlight hits us less directly now.', 'The weather gets cooler.', 'The days get a little shorter.'], q: 'In fall, does the weather get warmer or cooler?', ch: ['warmer', 'cooler'], ans: 'cooler' },
    { k: 'winter', a: 0, fact: ['Now our part of the Earth is tipped away from the sun.', 'We get the least direct sunlight, so it’s cold.', 'Days are the shortest and nights are the longest.'], q: 'In winter, are the days long or short?', ch: ['long', 'short'], ans: 'short' },
    { k: 'spring', a: -90, fact: ['We’re getting more direct sunlight again.', 'The weather gets warmer.', 'The days get longer.'], q: 'In spring, does it get warmer or colder?', ch: ['warmer', 'colder'], ans: 'warmer' },
    { k: 'summer', a: -180, again: true, fact: ['We’re back to summer!', 'The Earth went all the way around the sun: that takes one year.', 'Then it starts again, year after year.'], q: 'What happens after this summer?', ch: ['the seasons start again', 'the seasons stop'], ans: 'the seasons start again' }
  ];
  const scene = (ang, spin, lit) => {
    const W = 640, H = 460, cx = 320, cy = 230, rx = 200, ry = 150, P = a => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
    const [ex, ey] = P(ang), sunSide = Math.atan2(cy - ey, cx - ex) * 180 / Math.PI;
    const signs = [['summer', 180], ['fall', 90], ['winter', 0], ['spring', -90]].map(([k, a]) => { const [x, y] = [cx + (rx + 82) * Math.cos(a * Math.PI / 180), cy + (ry + 62) * Math.sin(a * Math.PI / 180)]; return `<g transform="translate(${Math.max(40, Math.min(W - 40, x)) - 34} ${Math.max(30, Math.min(H - 40, y)) - 34})" opacity="${lit === k ? 1 : 0.55}"><rect width="68" height="68" rx="12" fill="#fff" stroke="${lit === k ? S_COL[k] : '#475569'}" stroke-width="${lit === k ? 5 : 2}"/><g transform="translate(6 2) scale(.47)">${S_art(k, 120).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><text x="34" y="64" text-anchor="middle" font-family="Fredoka" font-size="11" font-weight="700" fill="#1F2937">${S_NAME[k]}</text></g>`; }).join('');
    const stars = Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % W}" cy="${(i * 53) % H}" r="${i % 3 ? 1 : 1.6}" fill="#E2E8F0" opacity=".6"/>`).join('');
    // Earth: tilted the same way all year (north pole leans toward the right); the half facing the sun is lit; a little continent spins
    const tilt = 23, R = 34, cont = ((spin % 360) + 360) % 360;
    const earth = `<g transform="translate(${ex} ${ey})"><defs><clipPath id="eC"><circle r="${R}"/></clipPath></defs><circle r="${R}" fill="#2563EB"/><g clip-path="url(#eC)" transform="rotate(${tilt})"><g transform="translate(${(cont / 360) * 4 * R - 2 * R} 0)"><path d="M-30 -18 q14 -10 24 2 q-4 12 -16 10z M6 6 q16 -6 22 8 q-8 16 -20 10z M50 -18 q14 -10 24 2 q-4 12 -16 10z M86 6 q16 -6 22 8 q-8 16 -20 10z" fill="#22C55E"/></g><line x1="0" y1="${-R - 14}" x2="0" y2="${R + 14}" stroke="#F8FAFC" stroke-width="3"/><circle cx="0" cy="${-R - 14}" r="4" fill="#F8FAFC"/><g transform="translate(0 ${-R * 0.55})"><circle r="4" fill="#FDE68A" stroke="#1F2937" stroke-width="1.5"/><line x1="0" y1="4" x2="0" y2="11" stroke="#1F2937" stroke-width="2"/></g></g><path d="M0 ${-R} A${R} ${R} 0 0 1 0 ${R}Z" transform="rotate(${sunSide + 180})" fill="#020617" opacity=".55"/><text x="0" y="${-R - 22}" text-anchor="middle" font-family="Fredoka" font-size="12" fill="#F8FAFC" transform="rotate(${tilt})">North Pole</text></g>`;
    const ux = (ex - cx) / Math.hypot(ex - cx, ey - cy), uy = (ey - cy) / Math.hypot(ex - cx, ey - cy);   // sun → Earth
    const rays = Array.from({ length: 5 }, (_, i) => { const o = (i - 2) * 11, px = -uy * o, py = ux * o; return `<line x1="${cx + ux * 48 + px}" y1="${cy + uy * 48 + py}" x2="${ex - ux * 36 + px}" y2="${ey - uy * 36 + py}" stroke="#FDE68A" stroke-width="2.5" opacity=".45" stroke-dasharray="7 6"/>`; }).join('');
    return `<svg class="s-orbit" viewBox="0 0 ${W} ${H}" aria-label="The Earth going around the sun">${stars}<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 8"/>${signs}${rays}<circle cx="${cx}" cy="${cy}" r="42" fill="#FACC15"/><circle cx="${cx}" cy="${cy}" r="54" fill="#FACC15" opacity=".25"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="Fredoka" font-size="16" font-weight="700" fill="#92400E">Sun</text>${earth}</svg>`;
  };
  const walk = async () => {
    let ang = 180, spin = 0;
    const show = (sub, card, lit) => { app.innerHTML = L_exactTag() + head(sub) + `<div id="orb">${scene(ang, spin, lit)}</div>${card}<div id="io"></div>`; };
    const move = to => new Promise(res => {   // the Earth spins (day and night) as it goes around
      const from = ang, t0 = performance.now(), ms = 2600;
      const step = now => { const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; ang = from + (to - from) * e; spin += 14; const o = $('orb'); if (o) o.innerHTML = scene(ang, spin, null); if (k < 1) requestAnimationFrame(step); else res(); };
      requestAnimationFrame(step);
    });
    show('Here is the sun, and the Earth going around it. The Earth is tilted (see the North Pole?), and it stays tilted the same way.', '<div class="s-card"><p>Every day the Earth spins once: that’s day and night. Every year it goes all the way around the sun: that’s the seasons!</p></div><div class="row acts"><button class="btn big primary" id="go">Start at summer ☀️</button></div>', null);
    say('Here is the sun, and the Earth going around it. The Earth is tilted, and it stays tilted the same way. Every year it goes all the way around the sun. That makes the seasons!', 0.92);
    await new Promise(r => { $('go').onclick = r; });
    for (let i = 0; i < STOPS.length; i++) {
      const s = STOPS[i];
      if (i) { show(`Walking to ${S_NAME[s.k].toLowerCase()}…`, '', null); await move(s.a); }
      ang = s.a;
      show(`${s.again ? 'Back to' : 'This is'} ${S_NAME[s.k].toLowerCase()}!`, `<div class="s-card" style="border-color:${S_COL[s.k]}"><h3 style="color:${S_COL[s.k]}">${S_NAME[s.k]}</h3>${s.fact.map(f => `<p>${L_esc(f)}</p>`).join('')}</div><div class="s-card" style="margin-top:8px"><b>${L_esc(s.q)}</b></div>`, s.k);
      say(`${s.again ? 'Back to' : 'This is'} ${s.k}. ${s.fact.join(' ')} ${s.q}`, 0.9);
      const r = await L_choose(s.ch, s.ans, { row: true, hint: 'Listen again: ' + s.fact[0] });
      mark('Walk Around the Sun', `${S_NAME[s.k]}${s.again ? ' (again)' : ''}: ${s.q}`, r.ok, r.typed, s.ans, null, { text: `${S_NAME[s.k]}: ${s.fact.join(' ')}`, choices: s.ch }, r.picks);
      if (i < STOPS.length - 1) { $('io').insertAdjacentHTML('beforeend', `<div class="row acts"><button class="btn big primary" id="next">Walk to ${S_NAME[STOPS[i + 1].k].toLowerCase()} →</button></div>`); await new Promise(rr => { $('next').onclick = rr; }); }
    }
    // the big question from the lesson
    show('One more question!', '<div class="s-card"><b>Days and nights happen because the Earth spins. What makes the seasons change?</b></div>', null);
    say('Days and nights happen because the Earth spins. What makes the seasons change?', 0.9);
    const ch = ['The tilted Earth going around the sun', 'The Earth spinning every day', 'The sun turning off and on'], ans = ch[0];
    const r = await L_choose(L_shuf(ch), ans, { hint: 'Think about our walk: the Earth stayed tilted while it went around the sun.' });
    mark('Walk Around the Sun', 'What makes the seasons change?', r.ok, r.typed, ans, null, { text: 'Days and nights happen because the Earth spins. What makes the seasons change?', choices: ch }, r.picks);
    partDone(firstTry('Walk Around the Sun') + '.');
  };
  PARTS = [];
  if (d.match) PARTS.push({ name: 'Season Signs', run: match });
  if (d.walk) PARTS.push({ name: 'Walk Around the Sun', run: walk });
  return { intro: 'Learn about the four seasons!' };
};

/* ---------- Seasonal Cycle wheel ---------- */
LT.seacycle.run = () => {
  const d = SD, pics = {};
  const Q = { winter: [-180, -90], summer: [-90, 0], spring: [90, 180], fall: [0, 90] };   // where each season sits on the wheel (degrees)
  const P = (a, r) => [200 + r * Math.cos(a * Math.PI / 180), 200 + r * Math.sin(a * Math.PI / 180)];
  const wedge = (a0, a1, r = 190) => { const [x0, y0] = P(a0, r), [x1, y1] = P(a1, r); return `M200 200 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}Z`; };
  const wheel = (named, opts = {}) => `<svg class="s-wheel" id="wh" viewBox="0 0 400 400">${S_WHEEL.map((k, i) => { const [a0, a1] = Q[k], m = (a0 + a1) / 2, [tx, ty] = P(m, 112);
    return `<path class="q" data-h="${i}" d="${wedge(a0, a1)}" fill="${named.has(k) ? S_COL[k] + '33' : '#fff'}" stroke="#1F2937" stroke-width="3"/>${pics[k] && opts.pics ? `<clipPath id="wc${i}"><path d="${wedge(a0, a1, 186)}"/></clipPath><image href="${pics[k]}" x="${tx - 95}" y="${ty - 80}" width="190" height="160" preserveAspectRatio="xMidYMid meet" clip-path="url(#wc${i})" pointer-events="none"/>` : ''}<foreignObject x="${tx - 72}" y="${ty - 44}" width="144" height="88" pointer-events="none"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 14px Fredoka,sans-serif;text-align:center;color:#1F2937;line-height:1.2">${opts.pics ? '' : L_esc(S_CLUE[k])}${named.has(k) ? `<div style="font:700 20px Fredoka,sans-serif;color:${S_COL[k]};margin-top:4px">${S_NAME[k]}</div>` : ''}</div></foreignObject>`; }).join('')}<circle cx="200" cy="200" r="16" fill="#94A3B8"/></svg>`;
  const clues = async () => {
    const named = new Set(), order = L_shuf(['winter', 'summer', 'spring', 'fall']);
    await each(order.length, i => new Promise(async res => {
      const k = order[i];
      app.innerHTML = L_exactTag() + head('Read each clue on the wheel. Where does this season go?') + L_count(i, 4, 'Season') + `<div class="s-split">${wheel(named)}<div class="s-side"><div id="io"></div><button class="btn" id="hearC">${SPK}Read me the clues</button></div></div>`;
      $('hearC').onclick = () => say(S_WHEEL.filter(x => !named.has(x)).map(x => S_CLUE[x]).join(' '), 0.9);
      const picks = await L_dragTo(S_NAME[k], '#wh .q', S_WHEEL.indexOf(k), 'Read the clue in that part again.', { names: S_WHEEL.map(x => S_NAME[x]) });
      named.add(k);
      mark('Match the Clues', `${S_NAME[k]}: ${S_CLUE[k]}`, picks.length === 1, picks[0], S_NAME[k], null, { text: `Where does ${S_NAME[k]} go on the wheel?`, choices: S_WHEEL.map(x => S_NAME[x]) }, picks);
      await wait(400); res();
    }));
    app.innerHTML = L_exactTag() + head('Your wheel!') + wheel(new Set(S_WHEEL)); await wait(1200);
    partDone(firstTry('Match the Clues') + '.');
  };
  const DRESS = { winter: 'Draw yourself in winter. What do you wear when it’s cold and snowy?', summer: 'Draw yourself in summer. What do you wear when it’s hot?', spring: 'Draw yourself in spring. What do you wear when it’s warm and rainy?', fall: 'Draw yourself in fall. What do you wear when it gets cooler?' };
  const draw = async () => {
    await each(4, i => new Promise(async res => {
      const k = S_SEASONS[i];
      app.innerHTML = L_exactTag() + head(DRESS[k]) + L_count(i, 4, 'Season') + `<div style="display:flex;align-items:center;gap:10px;font:700 26px Fredoka,sans-serif;color:${S_COL[k]}">${S_art(k, 56)}${S_NAME[k]}</div><div id="lsPad"></div>`;
      say(DRESS[k], 0.92);
      const r = await L_drawPad();
      pics[k] = r.img;
      mark('Draw Me', `Me in ${S_NAME[k].toLowerCase()}`, true, '', '', null, { img: r.img, text: `His drawing of himself in ${S_NAME[k].toLowerCase()}.` }, []); L_free();
      res();
    }));
    partDone('Four great pictures!');
  };
  // The wheel turns under a cover with one quarter cut out (the paper plate). He turns it with his finger (or the arrows) to the season it asks.
  const spin = async () => {
    let rot = 0;   // degrees the wheel is turned
    const winAt = -135;   // the window: the top-left quarter
    // Nov 9 (Dylan: "Is the wheel supposed to spin or the words?"): the cover with the window turns, like the top paper plate; the
    // pictures and the names circle stay put, so the window always matches the names and the words stay upright.
    const showing = () => { const a = ((winAt + rot) % 360 + 540) % 360 - 180; return S_WHEEL.find(k => { const [a0, a1] = Q[k]; return a >= a0 && a < a1; }) || 'winter'; };
    const tasks = [['summer', 'Turn the window to summer!'], ['fall', 'What comes after summer? Turn to it!'], ['winter', 'What comes after fall? Turn to it!'], ['spring', 'What comes after winter? Turn to it!']];
    const cover = `<path d="M200 200 L200 0 A200 200 0 1 1 0 200Z" fill="#334155" stroke="#0F172A" stroke-width="3"/><path d="M200 200 L200 0 A200 200 0 1 1 0 200Z" fill="url(#plate)" opacity=".5"/>`;
    const names = `<circle cx="200" cy="200" r="58" fill="#fff" stroke="#1F2937" stroke-width="3"/><line x1="200" y1="142" x2="200" y2="258" stroke="#1F2937" stroke-width="2"/><line x1="142" y1="200" x2="258" y2="200" stroke="#1F2937" stroke-width="2"/>${[['Winter', 171, 186], ['Summer', 229, 186], ['Spring', 171, 222], ['Fall', 229, 222]].map(([t, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka" font-size="13" font-weight="700" fill="#1F2937">${t}</text>`).join('')}<circle cx="200" cy="200" r="6" fill="#B45309"/>`;
    const svg = () => `<svg class="s-wheel" id="sp" viewBox="0 0 400 400"><defs><radialGradient id="plate"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#94A3B8"/></radialGradient></defs>${wheel(new Set(S_WHEEL), { pics: true }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}<g id="spinG" transform="rotate(${rot} 200 200)">${cover}</g>${names}</svg>`;
    await each(tasks.length, i => new Promise(async res => {
      const [k, q] = tasks[i]; let tries = 0; const seen = [];
      app.innerHTML = L_exactTag() + head(q + ' Turn the window with your finger, or tap the arrows.') + L_count(i, tasks.length, 'Turn') + `<div class="s-split"><div id="spWrap">${svg()}</div><div class="s-side"><div class="row" style="justify-content:center"><button class="btn big" id="ccw" aria-label="Turn left">↺</button><button class="btn big" id="cw" aria-label="Turn right">↻</button></div><button class="btn big primary" id="here">It’s ${S_NAME[k]}! ✓</button><div class="message" id="msg"></div></div></div>`;
      say(q, 0.92);
      const g = () => $('spinG'), set = a => { rot = a; g().setAttribute('transform', `rotate(${rot} 200 200)`); };
      $('cw').onclick = () => set(rot + 90); $('ccw').onclick = () => set(rot - 90);
      const sp = $('sp'); let drag = null;
      const angOf = e => { const r = sp.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
      sp.onpointerdown = e => { e.preventDefault(); drag = { a: angOf(e), r: rot, id: e.pointerId }; try { sp.setPointerCapture(e.pointerId); } catch (er) { } };
      sp.onpointermove = e => { if (!drag || e.pointerId !== drag.id) return; set(drag.r + angOf(e) - drag.a); };
      sp.onpointerup = sp.onpointercancel = e => { if (!drag || e.pointerId !== drag.id) return; drag = null; set(Math.round(rot / 90) * 90); };   // snap to a quarter
      await new Promise(rr => {
        $('here').onclick = () => {
          const now = showing(); seen.push(S_NAME[now]);
          if (now === k) { setMsg(`Yes! ${S_NAME[k]}!`, 'good'); fb(`Yes! ${S_NAME[k]}!`, 1); $('here').disabled = true; return nextUp(1100).then(rr); }
          tries++; setMsg(`That window shows ${S_NAME[now].toLowerCase()}. Keep turning!`, 'try'); fb(`That's ${now}. Keep turning!`, 1);
        };
      });
      mark('Spin the Wheel', q, tries === 0, seen[0], S_NAME[k], null, { text: q }, seen); res();
    }));
    confetti(); partDone(firstTry('Spin the Wheel') + '.');
  };
  PARTS = [{ name: 'Match the Clues', run: clues }];
  if (d.draw) PARTS.push({ name: 'Draw Me', run: draw });
  if (d.spin) PARTS.push({ name: 'Spin the Wheel', run: spin });
  return { intro: 'Make your own seasons wheel!' };
};

/* ---------- Quiz ---------- */
LT.quiz.run = () => {
  const d = SD, run = Date.now().toString(36); let stars = 0;
  const ask = async () => {
    await each(d.qs.length, i => new Promise(async res => {
      const q = d.qs[i], qp = S_choicePic(q.q), bar = `<div class="s-stars">${d.qs.map((_, j) => `<span class="${j < stars ? 'on' : ''}">⭐</span>`).join('')}</div>`;
      app.innerHTML = L_exactTag() + head(L_esc(q.q)) + L_count(i, d.qs.length, 'Question') + bar + `<button class="btn" id="hearQ">${SPK}Hear the question</button><div class="message" id="msg"></div><div id="lsSay"></div><div id="io"></div>`;
      const sq = () => say(q.q + ' ' + q.choices.join(', or '), 0.9); $('hearQ').onclick = sq;
      if (q.say) {   // say it first, then pick
        say(q.q + ' Say your answer out loud first.', 0.9); setMsg('Say your answer out loud first! 🗣️');
        await L_mic(); const r = await L_read({ minMs: 1800, label: 'I said my answer 🗣️', nudge: 'I’m listening… say your answer!' }); stopMic();
        mark('Quiz', `Said out loud: ${q.q}`, true, '', '', null, { text: `He answered out loud first: ${q.q}`, clips: L_keepClip('quiz', run, i, r.clip) }, [r.heard ? 'said it (microphone heard him)' : 'tapped the button']); L_free();
        $('lsSay').innerHTML = ''; setMsg('Now tap the best answer.');
      } else sq();
      const choices = L_shuf(q.choices), first = await new Promise(rr => {
        $('io').innerHTML = `<div class="ls-choices${choices.length <= 3 && choices.every(c => c.length < 24) ? ' row2' : ''}" id="ch">${choices.map((c, j) => { const p = S_choicePic(c); return `<button data-c="${j}">${p ? `<span class="s-cp">${S_art(p, 64)}</span>` : ''}${L_esc(c)}</button>`; }).join('')}</div>`;
        $('ch').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; $('ch').onclick = null; rr({ b, c: choices[+b.dataset.c] }); };
      });
      const ok = first.c === q.answer;
      $('ch').querySelectorAll('button').forEach(x => { x.disabled = true; if (choices[+x.dataset.c] === q.answer) x.classList.add('right'); });
      if (!ok) first.b.classList.add('wrong'); else stars++;
      setMsg(ok ? 'Yes! You got it! ⭐' : `The answer is: ${q.answer}.`, ok ? 'good' : 'try');
      if (q.why) $('io').insertAdjacentHTML('beforeend', `<div class="s-why">💡 ${L_esc(q.why)}</div>`);
      fb((ok ? 'Yes! ' : `The answer is ${q.answer}. `) + (q.why || ''), 0.9);
      mark('Quiz', q.q, ok, first.c, q.answer, null, { text: q.q, choices: q.choices, choiceHtml: Object.fromEntries(q.choices.map(c => [c, S_choicePic(c) ? S_art(S_choicePic(c), 60) : ''])) }, [first.c]);
      $('io').insertAdjacentHTML('beforeend', `<div class="row acts"><button class="btn big primary" id="nx">${i < d.qs.length - 1 ? 'Next question →' : 'See my stars →'}</button></div>`);
      await new Promise(rr => { $('nx').onclick = rr; });
      res();
    }));
    app.innerHTML = L_exactTag() + head('Quiz done!') + `<div class="s-stars" style="font-size:44px">${d.qs.map((_, j) => `<span class="${j < stars ? 'on' : ''}">⭐</span>`).join('')}</div><div class="s-card"><h3>${stars} of ${d.qs.length} right the first time!</h3></div>`;
    if (stars === d.qs.length) confetti();
    fb(`You got ${stars} of ${d.qs.length} stars!`, 0.95); await wait(1800);
    partDone(`${stars} of ${d.qs.length} right the first time.`);
  };
  PARTS = [{ name: 'Quiz', run: ask }];
  return { intro: `${d.heading}: ${d.qs.length} questions. Listen to each one and tap your answer!` };
};
