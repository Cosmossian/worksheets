/* The Study: daily 🪙 Money and 🕒 Telling Time (added Nov 28, 2026).
   Dylan: "He's having trouble with money, identifying quarters, pennies, nickels, and dimes and what they are. Can you create a daily
   thing for him (like his sight words) (that automatically gets set to his daily work monday through friday until I say otherwise)…
   In addition… something in that same vein to teach him about an analog clock how to tell time on it?"

   This file is shared by spell.html (his start screen puts them on his day), do.html (runs them, with skills.js) and index.html
   (the grown-up's box on the Money / Telling Time tabs, Review Child's Day). Only plain data and logic here, all names start with DK_,
   so it can load next to spell.html's own code.

   - Both go on his day by themselves every Monday to Friday (Math), until a grown-up turns them off.
     Study state "routines" (grown-up writes it): { coins: { on, set: { level, at } }, clock: {…} }. No row yet = both on.
   - Each has 8 levels. He starts at level 1 and moves up after 2 good days in a row at his level (80% or better on that level's
     Check questions; the best try of a day counts). A grown-up can move him to any level (routines.<kind>.set; newest wins).
     Study state "skills" (his device writes it): { coins: { level, since, hist: [{id, day, t, level, right, total, pct}], passed: {n: day}, up }, clock: {…} }.
   - The day's assignment is virtual (like the Friday ones): id <kind>-auto-<YYYY-MM-DD>, saved on his device as study-dk-auto for do.html. */

const DK_KINDS = {
  coins: {
    name: 'Money', title: '🪙 Money Practice', icon: '🪙',
    levels: [
      { name: 'Penny and nickel', kid: 'Meet the penny and the nickel', what: 'Learns the penny and the nickel (both sides): the brown one is the penny, the big silver one with a smooth edge is the nickel. Names them and finds them in a row of coins.' },
      { name: 'Dime and quarter', kid: 'Meet the dime and the quarter', what: 'Adds the dime (smallest, bumpy edge) and the quarter (biggest, bumpy edge). Names all four; finds the dime and the quarter.' },
      { name: 'All four coins', kid: 'Tell all four coins apart', what: 'All four coins, heads or tails up, plus the clues: color, size, smooth or bumpy edge.' },
      { name: 'What each coin is worth', kid: 'How much is each coin worth?', what: 'Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢, and the ¢ sign. Picture → value and value → coin.' },
      { name: 'Which is worth more?', kid: 'Which coin is worth more?', what: 'Compares two coins. The tricky one: the dime is smaller than the nickel but worth more.' },
      { name: 'Count the same coins', kid: 'Count coins that are the same', what: 'Counts groups of one kind: pennies by 1s, nickels by 5s, dimes by 10s, quarters by 25s.' },
      { name: 'Count mixed coins', kid: 'Count different coins together', what: 'Dimes, nickels and pennies together: start with the biggest and count on (10, 20, 25, 26…). Up to 50¢.' },
      { name: 'Quarters + make an amount', kid: 'Count with quarters and make an amount', what: 'Counts mixes with a quarter (up to 99¢) and taps coins to make an amount (like 30¢).' }
    ]
  },
  clock: {
    name: 'Telling Time', title: '🕒 Telling Time', icon: '🕒',
    levels: [
      { name: 'Meet the clock', kid: 'Meet the clock', what: 'The numbers 1 to 12 go around (12 at the top, 6 at the bottom). The short blue hand is the hour hand; the long red hand is the minute hand.' },
      { name: 'O’clock', kid: 'Tell time to the hour', what: 'Long hand on the 12 = o’clock; the short hand says which hour. Reads “3 o’clock”.' },
      { name: 'Set the clock + write it', kid: 'Set the clock and write the time', what: 'Writes o’clock times as 3:00, picks the clock for a time, and sets the short hand himself.' },
      { name: 'Half past', kid: 'Tell time to the half hour', what: 'Long hand on the 6 = 30 minutes = half past. The short hand is halfway, so the hour is the number it just passed (the common mix-up is saying the next hour).' },
      { name: 'O’clock and half past', kid: 'O’clock and half past together', what: 'Mixed :00 and :30. Sets both hands himself.' },
      { name: 'Count by 5s', kid: 'Count by 5s around the clock', what: 'Each number is 5 more minutes for the long hand (on the 4 = 20 minutes). Finds where the long hand goes for 25 minutes.' },
      { name: 'Time to 5 minutes', kid: 'Tell time to 5 minutes', what: 'Reads times like 4:20 and 7:45 (hour hand first, then count the long hand by 5s), and sets them.' },
      { name: 'Quarter past and quarter to', kid: 'Quarter past and quarter to', what: 'Quarter past (15), half past (30), quarter to (45, almost the next hour), and setting any 5-minute time.' }
    ]
  }
};
const DK_IDS = Object.keys(DK_KINDS);
const DK_PASS = 80;   // % right the first time on the level's own Check questions
const DK_NEED = 2;    // good days in a row to move up
const DK_ymd = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
const DK_weekday = ds => { const g = new Date(ds + 'T12:00:00').getDay(); return g > 0 && g < 6; };
const DK_max = kind => DK_KINDS[kind].levels.length;
const DK_clampLvl = (kind, n) => Math.min(Math.max(1, Math.round(+n) || 1), DK_max(kind));
const DK_on = (rout, kind) => !(rout && rout[kind] && rout[kind].on === false);
function DK_state(skills, kind) {
  const s = (skills && skills[kind]) || {};
  return { level: DK_clampLvl(kind, s.level || 1), since: s.since || 0, setAt: s.setAt || 0, hist: Array.isArray(s.hist) ? s.hist : [], passed: s.passed || {}, up: s.up || null, done: !!s.done };
}
/* the days at his level since it started, best try of each day, oldest first */
function DK_daysAt(s, level = s.level) {
  const by = {};
  s.hist.filter(h => h.level === level && h.t >= s.since).forEach(h => { if (!by[h.day] || h.pct > by[h.day].pct) by[h.day] = h; });
  return Object.values(by).sort((a, b) => a.day.localeCompare(b.day));
}
/* good days in a row at the end (before day `before`, if given) */
function DK_goodRun(s, before = '') {
  const days = DK_daysAt(s).filter(d => !before || d.day < before);
  let n = 0; for (let i = days.length - 1; i >= 0 && days[i].pct >= DK_PASS; i--) n++;
  return n;
}
/* Fold his finished results into his progress. results = sheet-log records. A grown-up's level pick (routines) wins if it's newer.
   Returns { skills, changed, ups: [{kind, from, to}] }. Only daily ones count (data.daily → extra.dk.daily); extra ones assigned by hand don't. */
function DK_update(skills, rout, results) {
  const out = JSON.parse(JSON.stringify(skills || {})), ups = []; let changed = false;
  DK_IDS.forEach(kind => {
    const s = DK_state(out, kind), set = rout && rout[kind] && rout[kind].set;
    if (set && +set.at > s.setAt) { s.level = DK_clampLvl(kind, set.level); s.setAt = +set.at; s.since = +set.at; s.up = null; s.done = false; changed = true; }
    const seen = new Set(s.hist.map(h => h.id));
    (results || []).filter(r => r && r.tool === kind && r.extra && r.extra.dk && r.extra.dk.daily && !seen.has(String(r.id)) && r.t > s.setAt)
      .sort((a, b) => a.t - b.t).forEach(r => {
        const d = r.extra.dk, h = { id: String(r.id), day: DK_ymd(r.t), t: r.t, level: +d.level, right: +d.right || 0, total: +d.total || 0, pct: +d.pct || 0 };
        s.hist.push(h); changed = true;
        if (h.level !== s.level || h.t < s.since) return;
        if (DK_goodRun(s) >= DK_NEED) {
          s.passed[s.level] = h.day;
          if (s.level < DK_max(kind)) { ups.push({ kind, from: s.level, to: s.level + 1 }); s.up = { from: s.level, to: s.level + 1, day: h.day }; s.level++; s.since = h.t + 1; }
          else s.done = true;   // the last level: he keeps practicing it (mixed review)
        }
      });
    s.hist = s.hist.slice(-80);
    out[kind] = s;
  });
  return { skills: out, changed, ups };
}
/* the day's assignment (virtual; his device saves it as study-dk-auto for do.html) */
function DK_assignment(kind, ds, skills) {
  const s = DK_state(skills, kind), L = s.level, K = DK_KINDS[kind];
  const first = !s.hist.some(h => h.level === L && h.t >= s.since && h.day < ds);   // first day at this level: all the Learn screens
  return { id: `${kind}-auto-${ds}`, tool: kind, title: K.title, day: ds, at: Date.now(), auto: true, dk: true,
    data: { level: L, daily: true, first, fresh: first && L > 1, prevGood: Math.min(DK_goodRun(s, ds), DK_NEED - 1), done: s.done } };
}
/* one line for a grown-up: "Level 3 of 8: All four coins · 1 good day so far (needs 2 in a row)" */
function DK_status(kind, skills, ds = DK_ymd(Date.now())) {
  const s = DK_state(skills, kind), L = s.level, lv = DK_KINDS[kind].levels[L - 1], g = DK_goodRun(s);
  const tail = s.done ? 'last level passed: he keeps practicing it' : g ? `${g} good day${g > 1 ? 's' : ''} in a row (needs ${DK_NEED} to move up)` : `needs ${DK_NEED} good days in a row (${DK_PASS}%+) to move up`;
  return `Level ${L} of ${DK_max(kind)}: ${lv.name} · ${tail}`;
}
