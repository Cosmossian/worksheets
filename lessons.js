/* The Study: lesson worksheets.
   10 More or Less (Math), Sound Investigator, Story Time, Word Chains, Heart Word (Phonics), Handwriting (ELA).
   One file, loaded by index.html (settings + the printed page) and by do.html (the on-screen version).
   Each worksheet has dated official school sheets (📄 Load MM/DD/YY Official School Worksheet: the same questions as that day's
   sheet from school) and "own" (✏️ My own: change it for next time). A school sheet's title starts with "📄 School MM/DD/YY ·". */

const L_IN_DO = !!document.getElementById('app') && !document.getElementById('panel');   // do.html has #app; the Worksheets page has #panel

/* ---------------- shared helpers ---------------- */
const L_esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const L_rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const L_shuf = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const L_list = s => String(s || '').split(/[,\n]+/).map(x => x.trim()).filter(Boolean);
const L_lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const L_ints = s => String(s || '').split(/[^0-9]+/).filter(Boolean).map(Number);
const L_letters = w => String(w).toLowerCase().replace(/[^a-z]/g, '');
const L_COL = ['#3C7DD9', '#0F9F8F', '#8B5CF6', '#EA580C', '#DB2777', '#16A34A', '#6366F1', '#D97706'];

/* "question | choice | choice | answer" per line */
function L_questions(s) {
  return L_lines(s).map(l => l.split('|').map(x => x.trim())).filter(p => p.length >= 3)
    .map(p => { const ans = p.length >= 4 ? p[p.length - 1] : p[1], choices = p.slice(1, p.length >= 4 ? -1 : undefined); return { q: p[0], choices, answer: choices.find(c => c.toLowerCase() === ans.toLowerCase()) || choices[0] }; });
}

/* Spelling patterns: "a_e" = a, then 1–2 consonants, then e (cave, snakes, plate); anything else = those letters (ai, igh, ee) */
const L_IRREG = new Set(['have', 'are', 'were', 'come', 'some', 'done', 'gone', 'give', 'live', 'love', 'one', 'none', 'there', 'where', 'here', 'move', 'lose', 'whose', 'sure', 'eye', 'the', 'once', 'above', 'glove', 'dove', 'shove']);
function L_pattern(p) {
  p = String(p || '').toLowerCase().replace(/[–—-]/g, '_').replace(/\s/g, '');
  const m = p.match(/^([a-z]+)_e$/);
  if (m) {
    const re = new RegExp(`(${m[1]})([bcdfghjklmnpqrstvwxz]{1,2})(e)(s|d)?$`);
    return { label: `${m[1]}_e`, test: w => { const x = L_letters(w); return !L_IRREG.has(x) && re.test(x); },
      marks: w => { const x = w.toLowerCase(), mm = x.match(new RegExp(`${m[1]}[bcdfghjklmnpqrstvwxz]{1,2}e(?=s?d?[^a-z]*$)`)); if (!mm) return []; const i = mm.index; return [i, i + mm[0].length - 1]; } };
  }
  if (!/^[a-z]+$/.test(p)) return null;
  return { label: p, test: w => L_letters(w).includes(p), marks: w => { const i = w.toLowerCase().indexOf(p); return i < 0 ? [] : Array.from({ length: p.length }, (_, k) => i + k); } };
}
/* word with the pattern's letters underlined in color */
function L_hlWord(w, pat, color = '#7E22CE') {
  const idx = pat && pat.test(w) ? pat.marks(w) : [];
  return [...w].map((ch, i) => idx.includes(i) ? `<span style="color:${color};text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:5px">${L_esc(ch)}</span>` : L_esc(ch)).join('');
}
/* "wh*|o*" → [{t:'wh', heart:true}, {t:'o', heart:true}] */
const L_parts = s => String(s || '').split('|').map(x => x.trim()).filter(Boolean).map(x => ({ t: x.replace(/\*/g, ''), heart: x.includes('*') }));
const L_HEART = (s = 22, c = '#E11D48') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 C5 15.5 2 12.5 2 8.5 C2 5.5 4.4 3 7.3 3 C9.2 3 10.9 4 12 5.6 C13.1 4 14.8 3 16.7 3 C19.6 3 22 5.5 22 8.5 C22 12.5 19 15.5 12 21 Z" fill="${c}"/></svg>`;

/* Base-ten blocks: green ten sticks and blue ones, like the school sheet */
function L_blocks(n, { unit = 13, tap = false } = {}) {
  const tens = Math.floor(n / 10), ones = n % 10, gap = 8, sw = unit + 4, H = unit * 10 + 4;
  const W = tens * (sw + gap) + (ones ? unit + 10 : 0) + 6;
  let g = '';
  for (let t = 0; t < tens; t++) {
    const x = 3 + t * (sw + gap);
    g += `<g ${tap ? `data-stick="${t}" style="cursor:pointer"` : ''}><rect x="${x}" y="2" width="${sw}" height="${H}" rx="3" fill="#16A34A" stroke="#14532D" stroke-width="2"/>${Array.from({ length: 9 }, (_, k) => `<line x1="${x}" x2="${x + sw}" y1="${2 + (k + 1) * unit + 2}" y2="${2 + (k + 1) * unit + 2}" stroke="#14532D" stroke-width="1.2"/>`).join('')}${Array.from({ length: 10 }, (_, k) => `<circle cx="${x + sw / 2}" cy="${4 + k * unit + unit / 2}" r="${unit * 0.22}" fill="#4ADE80"/>`).join('')}</g>`;
  }
  const ox = 3 + tens * (sw + gap) + 4;
  for (let o = 0; o < ones; o++) g += `<rect x="${ox}" y="${H - (o + 1) * (unit + 4) + 4}" width="${unit}" height="${unit}" rx="2" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="2"/>`;
  return `<svg width="${Math.max(W, 20)}" height="${H + 4}" viewBox="0 0 ${Math.max(W, 20)} ${H + 4}" aria-label="${tens} tens and ${ones} ones">${g}</svg>`;
}
/* A 100 chart with inline styles (prints, and shows in Parent Review's Replay) */
function L_chart(lit = [], { cell = 34, fs = 15, ring = [] } = {}) {
  let h = `<div style="display:inline-grid;grid-template-columns:repeat(10,${cell}px);border:2px solid #1F2937;background:#fff">`;
  for (let n = 1; n <= 100; n++) h += `<div style="height:${cell}px;display:grid;place-items:center;border:1px solid #94A3B8;font:700 ${fs}px Fredoka,sans-serif;color:${lit.includes(n) ? '#DB2777' : '#1F2937'};${ring.includes(n) ? 'background:#DCFCE7;box-shadow:inset 0 0 0 3px #16A34A;' : ''}">${n}</div>`;
  return h + '</div>';
}

/* ---------------- the six worksheets ---------------- */
function L_tenRandom(dir) {
  if (dir === 'both') {
    const used = new Set(), nums = []; while (nums.length < 10) { const n = L_rand(11, 89); if (!used.has(n)) { used.add(n); nums.push(n); } }
    const a = L_rand(20, 50), b = L_rand(60, 95), row = (s, k) => [0, 1, 2, 3, 4].map(j => s + j * k).join(', ');
    return { dir, heading: 'Find 10 More or 10 Less', blocks: '', chart: '', nums: nums.join(', '), patterns: L_shuf([row(a, 10), row(a, -1), row(a, 1)]).join(' | ') + ' || ' + L_shuf([row(b, -1), row(b, 1), row(b, -10)]).join(' | '), aloud: true };
  }
  const more = dir !== 'less', lo = more ? 10 : 11, hi = more ? 89 : 99, used = new Set(), nums = [];
  while (nums.length < 8) { const n = L_rand(lo, hi); if (!used.has(n)) { used.add(n); nums.push(n); } }
  const s = more ? L_rand(20, 50) : L_rand(55, 90), D = more ? 10 : -10;
  const rows = L_shuf([[0, 1, 2, 3, 4].map(k => s + k * D), [0, 1, 2, 3, 4].map(k => s + k), [0, 1, 2, 3, 4].map(k => s - k)]);
  return { dir, heading: more ? 'Find 10 More' : 'Find 10 Less', blocks: more ? L_rand(12, 79) : L_rand(21, 89), chart: more ? L_rand(11, 89) : L_rand(12, 99), nums: nums.join(', '), patterns: rows.map(r => r.join(', ')).join(' | '), aloud: true };
}
const L_SOUNDS = {
  a: { sound: '/ā/', cols: 'a_e: lace, plate, made, tape, page, snake, lane, cane, place, grape\nai: rain, chain, train, brain, sail, paint, main, braid, pail, faint\nay: play, way, say, stay, day, spray, pay, tray, May, gray\neigh: eight, weight, weigh, sleigh, freight, neigh\na: acorn, David, raven, label, data, major, fable, basic, April, bacon', questions: 'Where do you see ai in words? | middle | end | middle\nWhere do you see ay in words? | middle | end | end\nWhich spelling has more words? | ai | eigh | ai' },
  e: { sound: '/ē/', cols: 'ee: see, tree, feet, green, sleep, three, week, queen\nea: eat, sea, team, read, leaf, beach, clean, dream\ne_e: these, Pete, eve, theme, Steve\ny: happy, funny, baby, candy, sunny, puppy\ne: me, he, she, we, be, even', questions: 'Where do you see y in these words? | middle | end | end\nWhich spelling has more words? | ea | e_e | ea' },
  i: { sound: '/ī/', cols: 'i_e: bike, time, kite, five, ride, smile, pine, slide\nigh: high, night, light, right, sight, bright, might\ny: my, fly, cry, try, sky, shy\nie: pie, tie, lie, die\ni: hi, mind, kind, find, child, wild', questions: 'Where do you see y in these words? | middle | end | end\nWhich spelling has more words? | i_e | ie | i_e' },
  o: { sound: '/ō/', cols: 'o_e: home, rope, bone, nose, hope, stone, note, smoke\noa: boat, road, coat, soap, goat, toast, float\now: snow, grow, show, slow, blow, bowl\noe: toe, hoe, doe, foe\no: go, no, so, cold, most, open', questions: 'Where do you see oa in words? | middle | end | middle\nWhere do you see oe in words? | middle | end | end' },
  u: { sound: '/ū/', cols: 'u_e: cute, mule, tube, flute, June, rule, huge\new: new, few, grew, chew, flew, drew\nue: blue, glue, true, clue, due\nu: music, menu, unit, human, tuba', questions: 'Where do you see ue in words? | middle | end | end\nWhich spelling has more words? | ew | ue | ew' }
};
const L_cols = s => L_lines(s).map(l => { const i = l.indexOf(':'); return i < 0 ? null : { label: l.slice(0, i).trim(), words: L_list(l.slice(i + 1)) }; }).filter(c => c && c.words.length);
const L_SIGHT_POOL = 'the they their there then them said say sad was saw as of off for from have has had his her here where were what when who why you your our out are said some come one on no do to two go so see she he we me my by be is it in at and can could would should look like little said want went with will'.split(' ');
function L_heartRow(word) {
  const w = word.toLowerCase(), others = [...new Set(L_SIGHT_POOL)].filter(x => x !== w);
  const near = L_shuf(others.filter(x => x[0] === w[0] || Math.abs(x.length - w.length) <= 1)).slice(0, 6);
  const rest = L_shuf(others.filter(x => !near.includes(x))).slice(0, 8 - near.length);
  return L_shuf([w, w, w, w, ...near, ...rest]).join(' ');
}

const LT = {
  tenmore: {
    name: '10 More or Less', cls: 'math',
    help: 'Ten sticks, the 100 chart, “what is 10 more than…”, and a 10-more pattern. On screen he taps a ten stick on, finds the number on the 100 chart, and types the answers.',
    schools: {
      '2026-11-09': { note: 'Same numbers as the school sheet “10 More or Less (A): Find 10 More”.', set: () => ({ dir: 'more', heading: 'Find 10 More', blocks: 34, chart: 58, nums: '12, 26, 87, 53, 50, 88, 49, 82', patterns: '46, 47, 48, 49, 50 | 46, 56, 66, 76, 86 | 46, 45, 44, 43, 42', aloud: true }) },
      '2026-11-12': { note: 'Same questions and numbers as the school sheet “10 More or Less (C): Find 10 More or 10 Less”.', set: () => ({ dir: 'both', heading: 'Find 10 More or 10 Less', blocks: '', chart: '', nums: '34, 27, 60, 57, 25, 85, 41, 72, 81, 17', patterns: '45, 55, 65, 75, 85 | 45, 44, 43, 42, 41 | 45, 46, 47, 48, 49 || 99, 98, 97, 96, 95 | 99, 100, 101, 102, 103 | 99, 89, 79, 69, 59', aloud: true }) },
      '2026-11-10': { note: 'Same numbers as the school sheet “10 More or Less (B): Find 10 Less”.', set: () => ({ dir: 'less', heading: 'Find 10 Less', blocks: 55, chart: 28, nums: '20, 61, 31, 11, 64, 76, 45, 33', patterns: '62, 52, 42, 32, 22 | 62, 61, 60, 59, 58 | 62, 63, 64, 65, 66', aloud: true }) }
    },
    own: () => L_tenRandom('more'),
    fields: () => [
      { k: 'dir', label: '10 more or 10 less?', type: 'select', options: [['more', '10 more'], ['less', '10 less'], ['both', '10 more and 10 less']] },
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'blocks', label: 'Ten sticks show this number', type: 'num', help: 'Leave empty to skip (10 more and 10 less skips it).' },
      { k: 'chart', label: '100 chart: start at', type: 'num', help: 'Leave empty to skip.' },
      { k: 'nums', label: 'Write the number 10 more (or less) than…', type: 'area', help: 'Separate the numbers with commas.' },
      { k: 'patterns', label: 'Find the pattern rows', type: 'area', help: 'Rows separated by | . One of them should go up (or down) by 10. For 10 more and 10 less: the 10-more rows, then || , then the 10-less rows.' },
      { k: 'aloud', label: 'Say how he found it out loud (microphone)', type: 'check' }
    ],
    acts: mode => mode === 'own' ? [['shuffle', '🎲 New numbers']] : [],
    act: (a, c) => { if (a === 'shuffle') Object.assign(c, L_tenRandom(c.dir)); },
    title: c => (c.heading || '').trim() || (c.dir === 'both' ? 'Find 10 More or 10 Less' : c.dir === 'less' ? 'Find 10 Less' : 'Find 10 More'),
    data: c => {
      const both = c.dir === 'both', more = c.dir !== 'less', ok = n => both ? n >= 10 && n <= 90 : more ? n >= 1 && n <= 90 : n >= 10 && n <= 100;
      const rowsOf = t => String(t || '').split('|').map(L_ints).filter(r => r.length >= 2);
      const sets = String(c.patterns || '').split('||');
      return { dir: both ? 'both' : more ? 'more' : 'less', heading: LT.tenmore.title(c), blocks: +c.blocks || 0, chart: +c.chart || 0, nums: L_ints(c.nums).filter(ok), rows: both ? [] : rowsOf(c.patterns), rowsMore: both ? rowsOf(sets[0]) : [], rowsLess: both ? rowsOf(sets[1]) : [], aloud: !!c.aloud };
    },
    check: d => {
      if (d.dir === 'both') return d.nums.length ? '' : 'Type some numbers (10 to 90).';
      const more = d.dir === 'more';
      if (d.blocks && (more ? !(d.blocks >= 1 && d.blocks <= 90) : !(d.blocks >= 10 && d.blocks <= 100))) return `The ten sticks number has to be ${more ? '1 to 90' : '10 to 100'}.`;
      if (d.chart && (more ? !(d.chart >= 1 && d.chart <= 90) : !(d.chart >= 11 && d.chart <= 100))) return `The 100 chart number has to be ${more ? '1 to 90' : '11 to 100'}.`;
      return '';
    }
  },
  sound: {
    name: 'Sound Investigator', cls: 'phonics',
    help: 'Columns of words, one column per spelling of a sound. He reads down each column, then across each row, and answers the questions. On screen the microphone listens as he reads each word.',
    schools: {
      '2026-11-09': { note: 'Same words and questions as the school sheet “Spellings for Sound /ā/ (A): Investigator”.', set: () => ({ heading: 'Spellings for Sound /ā/', sound: '/ā/', cols: L_SOUNDS.a.cols.replace('a_e:', 'a–e:'), across: true, questions: L_SOUNDS.a.questions, sort: false }) }
    },
    own: () => ({ heading: 'Spellings for Sound /ā/', sound: '/ā/', cols: L_SOUNDS.a.cols, across: true, questions: L_SOUNDS.a.questions, sort: true }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'cols', label: 'Columns', type: 'area', rows: 6, help: 'One line per spelling: “ai: rain, chain, train”.' },
      { k: 'across', label: 'Then read across each row too', type: 'check' },
      { k: 'questions', label: 'Questions', type: 'area', rows: 4, help: 'One per line: question | choice | choice | answer' },
      { k: 'sort', label: 'Add a sorting game on screen (sort words into their spelling)', type: 'check' }
    ],
    acts: mode => mode === 'own' ? [['a', 'Long a'], ['e', 'Long e'], ['i', 'Long i'], ['o', 'Long o'], ['u', 'Long u']] : [],
    act: (a, c) => { const s = L_SOUNDS[a]; if (s) Object.assign(c, { heading: `Spellings for Sound ${s.sound}`, sound: s.sound, cols: s.cols, questions: s.questions }); },
    title: c => (c.heading || '').trim() || 'Sound Investigator',
    data: c => ({ heading: LT.sound.title(c), cols: L_cols(c.cols), across: !!c.across, questions: L_questions(c.questions), sort: !!c.sort }),
    check: d => d.cols.length ? '' : 'Add at least one column, like “ai: rain, chain, train”.'
  },
  story: {
    name: 'Story Time', cls: 'phonics',
    help: 'A short decodable story. He reads it a sentence at a time (the microphone listens, and his reading is saved for Parent Review), finds the words with the lesson’s spelling, and draws the story.',
    schools: {
      '2026-11-09': { note: 'The UFLI story isn’t built in, so type it in the Story box from the sheet. The title and lesson are already filled in.', set: () => ({ label: 'Lesson 54: a_e /ā/', heading: 'Cave in the Maze', pattern: 'a_e', text: '', questions: '', draw: true }) }
    },
    own: () => ({ label: 'Long a: a_e', heading: 'The Snake at the Lake', pattern: 'a_e', text: 'Kate and Gabe went to the lake. They made up a game. Gabe had to name each shape in the sand. Kate got a cane to dig with. Then they saw a snake by the gate! “Let’s not wake it,” said Kate. The snake did not wake up. Gabe and Kate came home late. It was a fun day at the lake!', questions: 'Where did Kate and Gabe go? | the lake | the store | the lake\nWhat was by the gate? | a snake | a cake | a snake\nDid the snake wake up? | yes | no | no', draw: true }),
    fields: mode => [
      { k: 'label', label: 'Lesson', type: 'text' },
      { k: 'heading', label: 'Story title', type: 'text' },
      { k: 'pattern', label: 'Spelling to find', type: 'text', help: 'Like a_e, ai, ay, igh. Leave empty to skip “Find the words”.' },
      { k: 'text', label: 'Story', type: 'area', rows: 8, help: mode === 'school' ? 'Type the story from the school sheet here.' : '' },
      { k: 'draw', label: 'Draw the story', type: 'check' },
      { k: 'questions', label: 'Questions (optional)', type: 'area', rows: 3, help: 'One per line: question | choice | choice | answer' }
    ],
    acts: () => [],
    title: c => (c.heading || '').trim() || 'Story Time',
    data: c => ({ label: (c.label || '').trim(), heading: LT.story.title(c), pattern: (c.pattern || '').trim(), text: String(c.text || '').trim(), questions: L_questions(c.questions), draw: !!c.draw }),
    check: d => d.text ? '' : 'Type the story in the Story box first.'
  },
  chains: {
    name: 'Word Chains', cls: 'phonics',
    help: 'A home-practice lesson: the new words, a heart word, word chains (change one letter to make a new word) and two sentences. On screen the chains go spell, read, spell, read, like the lesson script.',
    schools: {
      '2026-11-09': { note: 'Same words, chains and sentences as the school sheet “Home Practice Lesson 54”.', set: () => ({ lesson: 'Lesson 54', concept: 'a_e', words: 'make, cape, fade, plate, skate, shade', heart: 'wh*|o*', chains: 'make, lake, cake, bake\nname, same, came, game', sentences: 'Who will be at the lake?\nBlake was late to the game.' }) }
    },
    own: () => ({ lesson: 'Long a: ai', concept: 'ai', words: 'rain, tail, paint, snail, wait, chain', heart: 's|ai*|d', chains: 'rain, pain, main, mail\nsail, tail, nail, snail', sentences: 'The snail is on the trail.\nWait for the rain to stop.' }),
    fields: () => [
      { k: 'lesson', label: 'Lesson', type: 'text' },
      { k: 'concept', label: 'New spelling', type: 'text', help: 'Like a_e, ai, igh.' },
      { k: 'words', label: 'Sample words', type: 'area' },
      { k: 'heart', label: 'Heart word, split into sounds', type: 'text', help: 'Split with | and put * after the heart parts: wh*|o* for who, s|ai*|d for said.' },
      { k: 'chains', label: 'Word chains', type: 'area', rows: 3, help: 'One chain per line: make, lake, cake, bake' },
      { k: 'sentences', label: 'Sentences', type: 'area', rows: 3, help: 'One per line.' }
    ],
    acts: () => [],
    title: c => `Word Chains${(c.lesson || '').trim() ? ' · ' + c.lesson.trim() : ''}`,
    data: c => ({ lesson: (c.lesson || '').trim(), concept: (c.concept || '').trim(), words: L_list(c.words), heart: L_parts(c.heart), chains: L_lines(c.chains).map(l => L_list(l).map(w => w.toLowerCase())).filter(ch => ch.length >= 2), sentences: L_lines(c.sentences) }),
    check: d => d.words.length || d.chains.length ? '' : 'Add some sample words or a word chain.'
  },
  heart: {
    name: 'Heart Word', cls: 'phonics',
    help: 'One heart word (a word with a part you learn by heart): map its sounds into boxes, write it 3 times, write a sentence with it, and find it in a row of words.',
    schools: {
      '2026-11-09': { note: 'Same word and the same row of words as the school sheet for “their”.', set: () => ({ word: 'their', parts: 'th|eir*', row: 'the their they she say go have their their said I of I' }) },
      '2026-11-12': { note: 'Same word and the same row of words as the school sheet for “my” (m is regular, y is the heart part).', set: () => ({ word: 'my', parts: 'm|y*', row: 'my the said look me my and my me too my said me is' }) }
    },
    own: () => ({ word: 'said', parts: 's|ai*|d', row: L_heartRow('said') }),
    fields: () => [
      { k: 'word', label: 'Word', type: 'text' },
      { k: 'parts', label: 'Its sounds (one box each)', type: 'text', help: 'Split with | and put * after the heart part: th|eir* for their, s|ai*|d for said.' },
      { k: 'row', label: 'Find the word in this row', type: 'area', help: 'Words separated by spaces.' }
    ],
    acts: mode => mode === 'own' ? [['row', '🎲 Make a new row']] : [],
    act: (a, c) => { if (a === 'row') c.row = L_heartRow(c.word || 'said'); },
    title: c => `Heart Word: ${(c.word || '').trim() || '…'}`,
    data: c => { const w = (c.word || '').trim(); let parts = L_parts(c.parts); if (parts.map(p => p.t).join('').toLowerCase() !== w.toLowerCase()) parts = [{ t: w, heart: true }]; return { word: w, parts, row: String(c.row || '').split(/\s+/).filter(Boolean) }; },
    check: d => d.word ? (d.row.some(x => x.toLowerCase() === d.word.toLowerCase()) ? '' : `Put “${d.word}” in the row at least once.`) : 'Type the word first.'
  },
  letter: {
    name: 'Handwriting', cls: 'ela',
    help: 'Trace and write a letter, then names, a sentence to trace and a sentence to copy. On screen he writes with his finger or Apple Pencil, and every line is saved as a picture in Parent Review.',
    schools: {
      '2026-11-09': { note: 'Same letter, names and sentences as the school sheet “Uppercase Q”.', set: () => ({ letter: 'Q', words: 'Quinn, Quella, Quentin', trace: 'Quency has a quilt.', copy: 'Quinn the quail quests for food.' }) },
      '2026-11-10': { note: 'Same letter, words and sentences as the school sheet “Lowercase f”.', set: () => ({ letter: 'f', words: 'fish, fan, fat', trace: 'The fawn is fast.', copy: 'The fox has fuzzy fur.' }) },
      '2026-11-12': { note: 'Same letter, names and sentences as the school sheet “Uppercase F”.', set: () => ({ letter: 'F', words: 'Felicia, Frank, Finn', trace: 'Flora fed the fish.', copy: 'Fred the fly flies fast.' }) }
    },
    own: () => ({ letter: 'R', words: 'Rosa, Ryan, Rudy', trace: 'Rex ran to the rug.', copy: 'Rita reads a red book.' }),
    fields: () => [
      { k: 'letter', label: 'Letter', type: 'text', help: 'A capital (Q) or a small letter (q).' },
      { k: 'words', label: 'Words to trace, then write', type: 'text' },
      { k: 'trace', label: 'Sentence to trace', type: 'text' },
      { k: 'copy', label: 'Sentence to copy', type: 'text' }
    ],
    acts: () => [],
    title: c => { const l = (String(c.letter || '').trim()[0] || 'A'); return `${l === l.toUpperCase() ? 'Uppercase' : 'Lowercase'} ${l}`; },
    data: c => ({ letter: String(c.letter || '').trim()[0] || 'A', words: L_list(c.words).slice(0, 4), trace: (c.trace || '').trim(), copy: (c.copy || '').trim() }),
    check: d => /[a-z]/i.test(d.letter) ? '' : 'Type a letter.'
  },
  sort: {
    name: 'Spelling Sort', cls: 'ela',
    help: 'Sort spelling words under headings (like the endings –ff, –ll, –ss, –zz), spell each one when he hears it, then say sentences with 3 of them out loud. Printed, it has word cards to cut out, the chart and the activity.',
    schools: {
      '2026-11-12': { need: c => String(c.hunt || '').trim() ? '' : 'Paste the word hunt paragraph from the school sheet.', note: 'Same headings and words as the school sheet “The Poor Man’s Reward” (C): Apply Spelling List 3: the word hunt, then sort and glue the chart. The word hunt paragraph isn’t built in: copy it from the school PDF into the Word hunt box.', set: () => ({ heading: 'Spelling List 3: Word Hunt', heads: '–ff, –ll, –ss, –zz', words: 'miss, off, pass, pull, boss, buzz, fizz, less, small, still, stuff, tell', hunt: '', spell: false, glue: true, say: false }) },
      '2026-11-10': { note: 'Same headings and words as the school sheet “The Poor Man’s Reward” (B): Practice Spelling List 3.', set: () => ({ heading: 'Spelling List 3', heads: '–ff, –ll, –ss, –zz', words: 'miss, off, pass, pull, boss, buzz, fizz, less, small, still, stuff, tell', spell: true, say: true }) }
    },
    own: () => ({ heading: 'My Spelling Sort', heads: '–ck, –ng', words: 'back, sock, duck, kick, ring, song, long, king', spell: true, say: true }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'heads', label: 'Headings', type: 'text', help: 'Separate with commas. Endings like –ff (or ff) match words that end with those letters; anything else matches words that have them.' },
      { k: 'words', label: 'Spelling words', type: 'area', rows: 3, help: 'Separate with commas.' },
      { k: 'hunt', label: 'Word hunt paragraph (optional)', type: 'area', rows: 4, help: 'He taps every word that ends like a heading. Leave empty to skip.' },
      { k: 'spell', label: 'Spell each word when he hears it, then drag it into the chart', type: 'check' },
      { k: 'glue', label: 'Drag each word into the chart (without spelling it first)', type: 'check' },
      { k: 'say', label: 'Say a sentence with 3 of the words out loud (microphone)', type: 'check' }
    ],
    acts: () => [],
    title: c => (c.heading || '').trim() || 'Spelling Sort',
    data: c => {
      const heads = L_list(c.heads).map(h => ({ label: h, end: /^[-–—]/.test(h), k: h.replace(/^[-–—]\s*/, '').toLowerCase() })).filter(h => h.k);
      const of = w => { const x = w.toLowerCase(); let i = heads.findIndex(h => h.end && x.endsWith(h.k)); if (i < 0) i = heads.findIndex(h => !h.end && x.includes(h.k)); return i; };
      return { heading: LT.sort.title(c), heads: heads.map(h => h.label), words: L_list(c.words).map(w => ({ w: w.toLowerCase(), h: of(w) })), hunt: String(c.hunt || '').trim(), spell: !!c.spell, glue: !!c.glue, say: !!c.say };
    },
    check: d => d.heads.length < 2 ? 'Type at least 2 headings.' : !d.words.length ? 'Type the spelling words.' : (d.words.filter(x => x.h < 0).length ? `These don’t fit a heading: ${d.words.filter(x => x.h < 0).map(x => x.w).join(', ')}.` : '')
  },
  readaloud: {
    name: 'Read Story for Class Recording', cls: 'phonics',
    help: 'Just the story, big and easy to read, so he can read it out loud while his school website records him. This page doesn’t talk and doesn’t record. It can show the picture he drew of the story in Story Time.',
    schools: {
      '2026-11-10': { note: 'Read aloud of “Cave in the Maze” (UFLI Lesson 54). The story isn’t built in: it’s copied from what you typed in Story Time’s 11/09/26 sheet (or type it here).', set: () => ({ heading: 'Cave in the Maze', text: '', pic: true, follow: false }) }
    },
    own: () => ({ heading: '', text: '', pic: true, follow: false }),
    prefill: c => { if (c.text || typeof state === 'undefined' || !state.story) return; const st = state.story, all = [...Object.values(st.schools || {}), st.school, st.own].filter(Boolean); const m = all.find(x => (x.heading || '').trim().toLowerCase() === (c.heading || '').trim().toLowerCase() && (x.text || '').trim()); if (m) c.text = m.text; },
    fields: () => [
      { k: 'heading', label: 'Story title', type: 'text' },
      { k: 'text', label: 'Story', type: 'area', rows: 8, help: 'Copied from Story Time when the title matches. You can also paste or type it.' },
      { k: 'pic', label: 'Show the picture he drew of this story (from Story Time)', type: 'check' },
      { k: 'follow', label: 'Light up one sentence at a time (he taps Next to move on)', type: 'check' }
    ],
    acts: () => [['fromStory', '📋 Use the story from Story Time']],
    act: (a, c) => { if (a === 'fromStory') { const keep = c.text; c.text = ''; LT.readaloud.prefill(c); if (!c.text) { c.text = keep; alert('Story Time doesn’t have a story with this title yet. Type the title exactly as it is there, or paste the story.'); } } },
    title: c => `Read for class: ${(c.heading || '').trim() || 'my story'}`,
    data: c => ({ heading: (c.heading || '').trim(), text: String(c.text || '').trim(), pic: !!c.pic, follow: !!c.follow }),
    check: d => d.text ? '' : 'Type or paste the story (or tap 📋 Use the story from Story Time).'
  },
  /* Nov 10, 2026 (Dylan: a "Fix it" assignment for the words he missed spelling on his worksheets, "so he can practice hearing them,
     tracing them, then spelling them"; on his start screen it sits after his worksheets and before his sight words, under 🛠️ Extra help) */
  fixit: {
    name: 'Fix My Spelling Mistakes', cls: 'phonics', noSchool: true,
    help: 'Extra help for words he spelled wrong on his worksheets. Each word: he hears it spelled out loud (and sees what he wrote last time), traces it, then spells it by himself from hearing it. On his device it shows under “🛠️ Extra help”, after his worksheets and before his sight words. You don’t have to assign it for words he misses today: his device adds it by itself as soon as he finishes a worksheet with a spelling mistake. Use this to add words from earlier days, or your own.',
    schools: {},
    own: () => ({ words: '', trace: '2' }),
    fields: () => [
      { k: 'words', label: 'Words to fix', type: 'area', rows: 3, help: 'Separate with commas. To show him what he wrote, add it after a colon: pull: plull. The 📥 buttons fill this in from his worksheet results.' },
      { k: 'trace', label: 'Trace each word', type: 'select', options: [['1', '1 time'], ['2', '2 times'], ['3', '3 times']] }
    ],
    acts: () => [['today', '📥 Load his spelling mistakes from today'], ['week', '📥 From the last 7 days']],
    act: (a, c) => L_loadMisses(a === 'today' ? 0 : 6, c),
    title: () => '🛠️ Let’s fix our mistakes from earlier',
    data: c => {
      const seen = new Set(), words = [];
      L_list(c.words).forEach(x => { const [w, his = ''] = x.split(':').map(y => y.trim().toLowerCase()); const k = L_letters(w); if (k && !seen.has(w)) { seen.add(w); words.push({ w, his: L_letters(his) && L_letters(his) !== k ? his : '' }); } });
      return { words: words.slice(0, 12), trace: Math.min(3, Math.max(1, +c.trace || 2)) };
    },
    check: d => d.words.length ? '' : 'Type the words, or tap 📥 to load his spelling mistakes.'
  }
};
const L_IDS = Object.keys(LT);
const L_CLASS_OF = { fixit: 'phonics', tenmore: 'math', sound: 'phonics', story: 'phonics', readaloud: 'phonics', chains: 'phonics', heart: 'phonics', letter: 'ela', sort: 'ela' };

/* =====================================================================
   Worksheets page (index.html): the settings panel and the printed page
   ===================================================================== */
if (!L_IN_DO) {
  (() => { const st = document.createElement('style'); st.textContent = `
    .ls-mode { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; } .ls-mode button { flex:1 1 180px; font:600 15px Fredoka,sans-serif; border:2px solid var(--line); background:var(--surface-2); color:var(--ink); border-radius:12px; padding:10px 8px; cursor:pointer; }
    .ls-mode button[aria-pressed="true"].school { background:#3A2E0C; border-color:#F59E0B; color:#FDE68A; } .ls-mode button[aria-pressed="true"].own { background:#1B2D47; border-color:var(--study); }
    .ls-school { background:#3A2E0C; border:1px solid #B7791F; color:#FDE68A; border-radius:10px; padding:8px 10px; font-size:14px; margin-bottom:12px; line-height:1.35; }
    .ls-acts { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
    .ls-tag { position:absolute; top:15px; right:40px; font:700 13px Fredoka,sans-serif; color:#92400E; background:#FEF3C7; border:1.5px solid #F59E0B; border-radius:999px; padding:2px 10px; }
    .ls-h2 { font:700 22px Fredoka,sans-serif; color:#1E3A5F; margin:0; display:flex; align-items:center; gap:10px; } .ls-h2 .n { width:30px; height:30px; border-radius:50%; color:#fff; display:grid; place-items:center; font-size:16px; flex:none; }
    .ls-inst { font-size:17px; color:#334155; margin:0 0 0 40px; }
    .ls-card { border:2px solid #CBD5E1; border-radius:16px; padding:12px 16px; }
    .ls-cols { display:flex; gap:10px; justify-content:center; } .ls-cols > div { border:2px solid #CBD5E1; border-radius:12px; overflow:hidden; min-width:110px; text-align:center; }
    .ls-cols b { display:block; color:#fff; font:700 20px Fredoka,sans-serif; padding:4px 8px; } .ls-cols span { display:block; font-size:19px; padding:3px 8px; border-top:1px solid #E2E8F0; }
    .ls-circ { display:inline-block; border:2px solid #CBD5E1; border-radius:999px; padding:2px 16px; margin:0 8px; font-size:19px; }
    .ls-tiles span { display:inline-grid; place-items:center; min-width:46px; height:52px; border:2px solid #1F2937; border-radius:6px; font:700 30px Andika,sans-serif; margin-right:-2px; background:#fff; position:relative; }
    `; document.head.appendChild(st); })();
}
function L_tag(exact) { return exact ? '<span class="ls-tag">📄 School copy</span>' : ''; }
const L_h = (n, c, t) => `<div class="ls-h2"><span class="n" style="background:${c}">${n}</span>${t}</div>`;
function L_sheetOf(page, exact, opts) { return sheet(L_tag(exact) + page, opts); }

LT.tenmore.print = (d, exact) => {
  if (d.dir === 'both') {
    const pat = (n, w, rows) => rows.length ? L_h(n, '#EA580C', `Which numbers show a pattern of 10 ${w}? Circle it.`) + `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;padding:4px 0 10px">${rows.map(r => `<div style="font:600 28px Fredoka,sans-serif;border:2px dashed #CBD5E1;border-radius:999px;padding:5px 26px">${r.join(', ')}</div>`).join('')}</div>` : '';
    const p1 = nameDate() + title(d.heading, '10 More or Less', star('#16A34A'), star('#1D4ED8'))
      + L_h(1, '#16A34A', 'Answer out loud: How do you find 10 more than a number?') + writebox(736, '', 46)
      + L_h(2, '#0F766E', 'Answer out loud: How do you find 10 less than a number?') + writebox(736, '', 46)
      + pat(3, 'more', d.rowsMore) + pat(4, 'less', d.rowsLess);
    const p2 = nameDate() + L_h(5, '#1D4ED8', 'Write the numbers that are 10 less and 10 more than the number shown.')
      + `<div style="display:flex;flex-direction:column;gap:20px;padding:10px 40px">${d.nums.map((n, i) => `<div style="display:flex;align-items:center;gap:16px;font:700 32px Fredoka,sans-serif"><span style="width:44px;color:#64748B;font-size:22px">${i + 5}.</span><span style="flex:1;border-bottom:3px solid #1F2937;height:38px"></span><span style="width:70px;text-align:center">${n}</span><span style="flex:1;border-bottom:3px solid #1F2937;height:38px"></span></div>`).join('')}</div>`
      + '<div style="display:flex;justify-content:space-between;padding:0 60px 0 110px;font:600 18px Fredoka,sans-serif;color:#64748B"><span>← 10 less</span><span>10 more →</span></div>';
    return L_sheetOf(p1, exact, { gap: 12 }) + L_sheetOf(p2, exact, { gap: 14 });
  }
  const w = d.dir === 'more' ? 'more' : 'less', More = d.dir === 'more' ? 'More' : 'Less';
  const p1 = nameDate() + title(d.heading, `10 ${More} or Less`, star('#16A34A'), star('#1D4ED8'))
    + L_h(1, '#16A34A', `Find 10 ${w} than the number. Say your answer out loud.`)
    + `<div class="ls-card" style="display:flex;align-items:flex-end;gap:30px;justify-content:center">${L_blocks(d.blocks, { unit: 15 })}<div style="font:700 26px Fredoka,sans-serif">10 ${w} = ${blank(110)}</div></div>`
    + L_h(2, '#DB2777', `Find the pink number. Circle the number that is 10 ${w}.`)
    + `<div style="text-align:center">${L_chart([d.chart], { cell: 52, fs: 21 })}</div>`;
  const p2 = nameDate() + L_h(3, '#1D4ED8', `Write the number that is 10 ${w} than the number shown.`)
    + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 40px;padding:10px 30px">${d.nums.map((n, i) => `<div style="display:flex;align-items:center;gap:14px;font:700 34px Fredoka,sans-serif"><span style="width:44px;color:#64748B;font-size:22px">${i + 3}.</span><span style="width:60px">${n}</span><span style="font-size:26px;color:#64748B">→</span><span style="flex:1;border-bottom:3px solid #1F2937;height:40px"></span></div>`).join('')}</div>`
    + (d.rows.length ? L_h(4, '#EA580C', `Circle the numbers that show a pattern of 10 ${w}.`) + `<div style="display:flex;flex-direction:column;gap:16px;align-items:center;padding-top:6px">${d.rows.map(r => `<div style="font:600 30px Fredoka,sans-serif;border:2px dashed #CBD5E1;border-radius:999px;padding:6px 28px">${r.join(', ')}</div>`).join('')}</div>` : '');
  return L_sheetOf(p1, exact, { gap: 16 }) + L_sheetOf(p2, exact, { gap: 18 });
};
LT.sound.print = (d, exact) => {
  const n = Math.max(...d.cols.map(c => c.words.length));
  const cols = `<div class="ls-cols">${d.cols.map((c, i) => `<div><b style="background:${L_COL[i % 8]}">${L_esc(c.label)}</b>${Array.from({ length: n }, (_, k) => `<span>${L_esc(c.words[k] || ' ')}</span>`).join('')}</div>`).join('')}</div>`;
  return L_sheetOf(nameDate() + title(d.heading, 'Investigator', mag, star('#1D4ED8'))
    + L_h(1, '#1D4ED8', 'Read each word out loud, going down each column.') + (d.across ? `<p class="ls-inst">Then read each word again, going across each row.</p>` : '') + cols
    + (d.questions.length ? L_h(2, '#0F766E', 'Circle the answer.') + `<div style="display:flex;flex-direction:column;gap:12px;padding-left:40px">${d.questions.map((q, i) => `<div style="font-size:20px;display:flex;align-items:center;gap:6px"><b>${i + 1}.</b> ${L_esc(q.q)}<span style="flex:1"></span>${q.choices.map(c => `<span class="ls-circ">${L_esc(c)}</span>`).join('')}</div>`).join('')}</div>` : ''), exact, { gap: 12 });
};
LT.story.print = (d, exact) => {
  const pat = L_pattern(d.pattern), text = L_esc(d.text);
  return L_sheetOf(nameDate() + `<div style="display:flex;justify-content:space-between;font:600 16px Fredoka,sans-serif;color:#475569"><span>${L_esc(d.label)}</span><span>Story Time</span></div>`
    + `<h1 style="font:700 36px Fredoka,sans-serif;text-align:center;margin:0;color:#1E3A5F">${L_esc(d.heading)}</h1>`
    + (d.draw ? `<div style="font-size:15px;color:#475569">Draw the story here:</div><div style="border:2px solid #1F2937;height:300px;flex:none"></div>` : '')
    + `<div style="font-size:${d.text.length > 600 ? 20 : 24}px;line-height:1.7;text-indent:40px">${text || '<span style="color:#94A3B8">(Type the story in the box on the left.)</span>'}</div>`
    + (pat && d.text ? `<div style="font-size:17px;color:#475569">Underline every word with <b>${L_esc(pat.label)}</b>.</div>` : '')
    + (d.questions.length ? `<div style="display:flex;flex-direction:column;gap:10px">${d.questions.map((q, i) => `<div style="font-size:19px"><b>${i + 1}.</b> ${L_esc(q.q)} ${q.choices.map(c => `<span class="ls-circ">${L_esc(c)}</span>`).join('')}</div>`).join('')}</div>` : ''), exact, { gap: 12 });
};
LT.chains.print = (d, exact) => {
  const pat = L_pattern(d.concept);
  const box = (h, body) => `<div class="ls-card" style="padding:0;overflow:hidden"><div style="background:#1E3A5F;color:#fff;font:700 20px Fredoka,sans-serif;padding:6px 14px;text-align:center">${h}</div><div style="padding:12px 16px">${body}</div></div>`;
  const heart = `<div style="text-align:center"><span class="ls-tiles">${d.heart.map(p => `<span>${L_esc(p.t)}${p.heart ? `<i style="position:absolute;bottom:-26px">${L_HEART(22)}</i>` : ''}</span>`).join('')}</span></div><div style="height:22px"></div>`;
  return L_sheetOf(nameDate() + title('Home Practice', d.lesson, star('#E11D48'), star('#1D4ED8'))
    + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">`
    + box(`New Concept: ${L_esc(d.concept)}`, `<div style="columns:2;font-size:26px;line-height:1.6;text-align:center">${d.words.map(w => `<div>${L_hlWord(w, pat)}</div>`).join('')}</div>`)
    + box('Word Chains', d.chains.map((ch, i) => `<div style="font-size:19px;margin:4px 0"><b>${i + 1}.</b> ${ch.map(L_esc).join(' → ')}</div>`).join('') + `<div style="font-size:14px;color:#475569;margin-top:6px">Make the first word. Change one letter at a time to make the next.</div>`)
    + box('New Irregular Word', heart + `<div style="font-size:14px;color:#475569;text-align:center">♥ = the part you learn by heart</div>`)
    + box('Sentences', d.sentences.map((s, i) => `<div style="font-size:21px;margin:4px 0"><b>${i + 1}.</b> ${L_esc(s)}</div>`).join(''))
    + `</div>` + L_h('✎', '#0F766E', 'Spell each word in the chain.') + `<div style="display:flex;flex-direction:column;gap:8px">${(d.chains[0] || []).map(() => writebox(736, '', 40)).join('')}</div>`, exact, { gap: 14 });
};
LT.heart.print = (d, exact) => {
  const big = `<div style="border:3px solid #1F2937;border-radius:8px;padding:30px 18px 4px;display:inline-flex;align-items:flex-end;gap:0;font:700 80px/1 Andika,sans-serif;position:relative;background:#fff">${d.parts.map(p => `<span style="position:relative">${L_esc(p.t)}${p.heart ? `<i style="position:absolute;left:50%;top:-32px;transform:translateX(-50%)">${L_HEART(36)}</i>` : ''}</span>`).join('')}</div>`;
  const map = `<div style="display:flex">${d.parts.map(() => `<div style="width:120px;height:100px;border:3px solid #1F2937;margin-right:-3px"></div>`).join('')}</div>`;
  return L_sheetOf(nameDate() + `<div style="display:flex;align-items:center;justify-content:space-around;padding-top:16px">${big}<div style="text-align:center"><div style="font:700 20px Fredoka,sans-serif;margin-bottom:6px">Map the word:</div>${map}</div></div>`
    + L_h(1, '#1D4ED8', `Write the word <u>${L_esc(d.word)}</u> three times:`) + [1, 2, 3].map(() => writebox(736, '', 46)).join('')
    + L_h(2, '#0F766E', `Write a sentence with the word: <u>${L_esc(d.word)}</u>`) + writebox(736, '', 46) + writebox(736, '', 46)
    + L_h(3, '#7E22CE', `Circle the word: <u>${L_esc(d.word)}</u>`) + `<div style="border:2px solid #1F2937;padding:8px 12px;display:flex;justify-content:space-between;font-size:26px">${d.row.map(w => `<span>${L_esc(w)}</span>`).join('')}</div>`, exact, { gap: 14 });
};
LT.letter.print = (d, exact) => {
  const L = d.letter, hw = (txt, ghost) => writebox(736, ghost ? txt : '', 60);
  const p1 = nameDate() + title(LT.letter.title(d), 'Handwriting', star('#F59E0B'), star('#1D4ED8'))
    + L_h(1, '#1D4ED8', `Trace and write the ${L === L.toUpperCase() ? 'uppercase' : 'lowercase'} letter ${L_esc(L)}.`) + hw(`${L}   ${L}   ${L}   ${L}   ${L}`, true) + hw('', false)
    + (d.words.length ? L_h(2, '#0F766E', `Trace the words ${L_esc(d.words.join(', '))}.`) + hw(d.words.join('   '), true) + L_h(3, '#7E22CE', 'Write the words.') + hw('', false) : '');
  const p2 = nameDate() + (d.trace ? L_h(4, '#EA580C', `Trace the sentence.`) + hw(d.trace, true) + hw(d.trace, true) : '')
    + (d.copy ? L_h(5, '#DB2777', 'Copy the sentence.') + `<div style="font-size:30px;padding-left:40px">${L_esc(d.copy)}</div>` + hw('', false) + hw('', false) : '');
  return L_sheetOf(p1, exact, { gap: 16 }) + L_sheetOf(p2, exact, { gap: 18 });
};

LT.sort.print = (d, exact) => {
  const card = (t, bold, c) => `<div style="border:2px dashed #475569;border-radius:8px;padding:10px 6px;text-align:center;font:${bold ? '700 30px Fredoka' : '700 28px Andika'},sans-serif;${c ? `color:${c}` : ''}">${L_esc(t)}</div>`;
  const per = d.heads.map((_, hi) => d.words.filter(x => x.h === hi).length), rows = Math.max(3, ...per) + 1;
  const p1 = nameDate() + title(d.heading, 'Spelling Sort', star('#0F766E'), star('#DB2777'))
    + L_h(1, '#0F766E', 'Cut out the headings and the spelling words. Lay the headings out in a row, then sort each word under the heading that matches how it ends.')
    + `<div style="display:grid;grid-template-columns:repeat(${Math.min(4, d.heads.length)},1fr);gap:10px;margin:6px 0 16px">${d.heads.map((h, hi) => card(h, true, L_COL[hi % 8])).join('')}</div>`
    + `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${d.words.map(x => card(x.w)).join('')}</div>`;
  const p2 = nameDate() + L_h(2, '#1D4ED8', d.glue && !d.spell ? 'Look at your sort. Glue each spelling word under its heading.' : 'Look at your sort. Write each spelling word under its heading.')
    + `<table style="width:100%;border-collapse:collapse;font:700 26px Fredoka,sans-serif;margin-bottom:18px"><tr>${d.heads.map((h, hi) => `<th style="border:2px solid #1F2937;padding:8px;color:${L_COL[hi % 8]}">${L_esc(h)}</th>`).join('')}</tr>${Array.from({ length: rows }, () => `<tr>${d.heads.map(() => '<td style="border:2px solid #1F2937;height:54px"></td>').join('')}</tr>`).join('')}</table>`
    + L_h(3, '#7E22CE', 'Practice your spelling words. Pick one:')
    + `<div style="font-size:21px;line-height:1.5;padding-left:40px"><p><b>🎭 Act it out.</b> Pick three spelling words and act each one out. Can someone guess the word?</p><p><b>🗣️ Say sentences.</b> Pick three spelling words. Make up a sentence with each one and say it out loud to someone.</p></div>`;
  const p0 = d.hunt ? L_sheetOf(nameDate() + title(d.heading, 'Word Hunt', star('#0F766E'), star('#DB2777')) + L_h(1, '#0F766E', `Word hunt! Circle the words that end with ${L_esc(d.heads.join(', '))}.`)
    + `<div style="font:400 30px/2 Andika,sans-serif;padding:10px 30px">${L_esc(d.hunt)}</div>`, exact, { gap: 14 }) : '';
  return p0 + L_sheetOf(p1, exact, { gap: 14 }) + L_sheetOf(p2, exact, { gap: 14 });
};
/* Fix My Spelling Mistakes: the words he missed spelling on his on-screen worksheets (what each result calls `missed`, with what he
   typed), from the Study database and this device. days = 0 → today only. */
async function L_loadMisses(days, c) {
  await new Promise(r => setTimeout(r));   // after the panel redraws from the click
  const msg = t => { const el = document.getElementById('lsLoad'); if (el) el.textContent = t; };
  msg('Looking for his spelling mistakes…');
  const from = new Date(); from.setHours(0, 0, 0, 0); from.setDate(from.getDate() - days);
  let recs = [];
  try { const sb = sbClient(); if (sb) { const { data } = await sb.from('study_log').select('t,data').eq('kind', 'sheet').gte('t', from.toISOString()); recs = (data || []).map(r => r.data).filter(Boolean); } } catch (e) { }
  try { (store('sheet-log') || []).forEach(r => { if (r && r.t >= +from && !recs.some(x => x.id === r.id)) recs.push(r); }); } catch (e) { }
  const got = new Map(), from2 = new Map();
  recs.sort((a, b) => a.t - b.t).forEach(r => (r.missed || []).forEach(m => {
    const w = String(m.word || '').trim().toLowerCase(); if (!L_letters(w)) return;
    const his = String(m.typed || '').trim().toLowerCase();
    if (!got.has(w) || (his && !got.get(w))) got.set(w, his);
    if (!from2.has(w)) from2.set(w, r.title || '');
  }));
  if (!got.size) { msg(days ? 'No spelling mistakes on his worksheets in the last 7 days. 🎉' : 'No spelling mistakes on his worksheets today. 🎉 (Results show up here once he finishes a worksheet.)'); return; }
  const have = L_list(c.words).map(x => x.split(':')[0].trim().toLowerCase());
  const add = [...got].filter(([w]) => !have.includes(w));
  c.words = [...L_list(c.words), ...add.map(([w, his]) => his && his !== w ? `${w}: ${his}` : w)].join(', ');
  if (typeof save === 'function') save();
  if (typeof renderPanel === 'function') renderPanel();
  const sheets = [...new Set([...got.keys()].map(w => from2.get(w)).filter(Boolean))];
  msg(add.length ? `Added ${add.length} word${add.length > 1 ? 's' : ''}: ${add.map(([w]) => w).join(', ')}${sheets.length ? ` (from ${sheets.join('; ')})` : ''}.` : 'Those words are already in the list.');
}
LT.fixit.print = d => {
  const row = x => `<div style="display:grid;grid-template-columns:1fr 1.3fr 1.3fr;gap:14px;align-items:center;border-bottom:2px solid #E2E8F0;padding:10px 0">
      <div style="font:700 40px Andika,sans-serif;color:#1F2937">${L_esc(x.w)}${x.his ? `<div style="font:400 16px Fredoka,sans-serif;color:#64748B">not <s>${L_esc(x.his)}</s></div>` : ''}</div>
      <div style="font:700 44px Andika,sans-serif;color:#CBD5E1;border-bottom:2px solid #1F2937;line-height:1.3">${L_esc(x.w)}</div>
      <div style="border-bottom:2px solid #1F2937;height:58px"></div></div>`;
  return L_sheetOf(nameDate() + title('Fix My Spelling Mistakes', 'Hear it, trace it, spell it', star('#F59E0B'), star('#DB2777'))
    + L_h(1, '#0F766E', 'Say each word out loud and spell it. Trace it in the middle. Then fold the paper, listen, and write it on your own.')
    + `<div style="display:grid;grid-template-columns:1fr 1.3fr 1.3fr;gap:14px;font:700 18px Fredoka,sans-serif;color:#475569;margin-top:10px"><div>Look</div><div>Trace</div><div>Write it</div></div>`
    + d.words.map(row).join(''), false, { gap: 8 });
};
LT.readaloud.print = (d, exact) => L_sheetOf(nameDate() + title(d.heading || 'My Story', 'Read it out loud', star('#F59E0B'), star('#1D4ED8'))
  + `<div style="font:400 30px/1.9 Andika,sans-serif;padding:10px 24px">${L_esc(d.text)}</div>`, exact, { gap: 14 });

/* settings panel. Each worksheet can have several official school sheets, one per school day (Nov 9, 2026, Dylan: "Load 11/10/26
   Official School Worksheets so I know it's for the next day's assignments"). state[t] = { mode: 'school'|'own', day: 'YYYY-MM-DD',
   schools: { day: settings }, own }. The first version had one "school" set; it was the 11/09/26 sheet, so it moves there. */
const L_dayLabel = d => { const [y, m, dd] = String(d).split('-'); return `${m}/${dd}/${String(y).slice(2)}`; };
const L_days = t => Object.keys(LT[t].schools || {}).sort();
const L_schoolTag = day => `📄 School ${L_dayLabel(day)} · `;
function L_st(t) {
  if (LT[t].noSchool) { const s = state[t] || (state[t] = {}); s.mode = 'own'; if (!s.own) s.own = LT[t].own(); if (!s.schools) s.schools = {}; return s; }   // no official school sheets (Fix My Spelling Mistakes)
  const s = state[t] || (state[t] = { mode: 'school' });
  if (!s.schools) { s.schools = {}; if (s.school) s.schools[L_days(t)[0]] = s.school; delete s.school; }
  if (!s.day || !LT[t].schools[s.day]) s.day = L_days(t).at(-1);
  if (!s.schools[s.day]) { s.schools[s.day] = LT[t].schools[s.day].set(); if (LT[t].prefill) LT[t].prefill(s.schools[s.day]); }
  if (!s.own) s.own = LT[t].own();
  if (s.mode !== 'own') s.mode = 'school';
  return s;
}
function L_cur(t) { const s = L_st(t); return s.mode === 'own' ? s.own : s.schools[s.day]; }
function L_panel(t) {
  const L = LT[t], s = L_st(t), mode = s.mode, c = L_cur(t);
  const f = L.fields(mode).map(x => {
    const id = `lk_${x.k}`, v = c[x.k];
    const inp = x.type === 'area' ? `<textarea id="${id}" data-lk="${x.k}" rows="${x.rows || 2}">${L_esc(v)}</textarea>`
      : x.type === 'select' ? `<select id="${id}" data-lk="${x.k}">${x.options.map(([val, lab]) => `<option value="${val}" ${val === v ? 'selected' : ''}>${lab}</option>`).join('')}</select>`
      : x.type === 'check' ? '' : `<input type="text" id="${id}" data-lk="${x.k}" value="${L_esc(v)}" ${x.type === 'num' ? 'inputmode="numeric"' : ''}>`;
    if (x.type === 'check') return `<label class="check"><input type="checkbox" data-lk="${x.k}" ${v ? 'checked' : ''}>${L_esc(x.label)}</label>`;
    return `<div class="field"><label for="${id}">${L_esc(x.label)}</label>${inp}${x.help ? `<small>${L_esc(x.help)}</small>` : ''}</div>`;
  }).join('');
  const acts = (L.acts(mode) || []);
  const d = L.data(c), problem = L.check(d), sc = L.schools[s.day];
  return `<h2>${L_esc(L.name)}</h2><p class="help">${L_esc(L.help)}</p>
    ${L.noSchool ? '' : `<div class="ls-mode" role="group" aria-label="Which version">${L_days(t).map(day => `<button class="school" data-lday="${day}" aria-pressed="${mode === 'school' && s.day === day}">📄 Load ${L_dayLabel(day)} Official School Worksheet</button>`).join('')}<button class="own" data-lmode="own" aria-pressed="${mode === 'own'}">✏️ My own</button></div>`}
    ${L.noSchool ? '' : mode === 'school' ? `<div class="ls-school"><b>📄 ${L_dayLabel(s.day)} official school worksheet:</b> ${L_esc(sc.note)} On his device it’s called “${L_esc(L_schoolTag(s.day) + L.title(c))}”.</div>` : '<p class="help" style="margin-top:-4px">Your own version: change anything, and use it again any time. The school worksheets stay as they are.</p>'}
    ${acts.length ? `<div class="ls-acts">${acts.map(([k, lab]) => `<button class="btn btn-small" data-lact="${k}">${L_esc(lab)}</button>`).join('')}</div>` : ''}
    ${L.noSchool ? '<div class="note" id="lsLoad" style="margin:-4px 0 12px"></div>' : ''}
    ${f}
    ${mode === 'school' ? `<button class="btn btn-small" data-lact="__reset" style="margin-bottom:12px">↺ Back to the ${L_dayLabel(s.day)} school sheet</button>` : ''}
    ${problem ? `<div class="warn" id="lsWarn">${L_esc(problem)}</div>` : '<div class="warn" id="lsWarn" hidden></div>'}
    ${printBlock(['tenmore', 'letter', 'sort'].includes(t))}`;
}
function L_snapshot(t) {
  const L = LT[t], s = L_st(t), c = L_cur(t), d = L.data(c), need = L.check(d), school = s.mode === 'school';
  return { title: (school ? L_schoolTag(s.day) : '') + L.title(c), data: { ...d, exact: school, schoolDay: school ? s.day : '' }, ok: !need, need };
}
/* A school worksheet for one day, ready to assign (used to put every official school worksheet on his day by itself, Nov 9, 2026).
   Uses what's typed on that day's sheet on this device, if anything. need = what's missing before it can go on his day. */
function L_snapshotDay(t, day) {
  const L = LT[t], sc = L.schools && L.schools[day]; if (!sc) return null;
  const st = state[t] || {}, have = st.schools && st.schools[day];
  const c = have ? have : (() => { const x = sc.set(); if (L.prefill) L.prefill(x); return x; })();
  const d = L.data(c), need = L.check(d) || (sc.need ? sc.need(c) : '');
  return { title: L_schoolTag(day) + L.title(c), data: { ...d, exact: true, schoolDay: day }, ok: !need, need };
}
function L_build(t) { const L = LT[t], s = L_st(t), d = L.data(L_cur(t)); return L.print(d, s.mode === 'school'); }
function L_defaults() { return Object.fromEntries(L_IDS.map(k => [k, { mode: 'school', day: L_days(k).at(-1), schools: {}, own: LT[k].own() }])); }
/* panel events (called from index.html's input/click handlers) */
function L_input(el) {
  const t = state.tool; if (!LT[t] || !el.dataset.lk) return false;
  const c = L_cur(t), k = el.dataset.lk;
  c[k] = el.type === 'checkbox' ? el.checked : el.value;
  const w = document.getElementById('lsWarn'); if (w) { const p = LT[t].check(LT[t].data(c)); w.hidden = !p; w.textContent = p; }
  if (L_st(t).mode === 'school' && typeof autoSchoolSoon === 'function') autoSchoolSoon();
  return true;
}
function L_click(el) {
  const t = state.tool; if (!LT[t]) return false;
  if (el.dataset.lday) { const s = L_st(t); s.mode = 'school'; s.day = el.dataset.lday; L_st(t); return 'panel'; }
  if (el.dataset.lmode) { L_st(t).mode = el.dataset.lmode; return 'panel'; }
  if (el.dataset.lact === '__reset') { const s = L_st(t); if (!confirm(`Put the ${L_dayLabel(s.day)} school sheet back the way the school has it?`)) return true; s.schools[s.day] = LT[t].schools[s.day].set(); if (LT[t].prefill) LT[t].prefill(s.schools[s.day]); if (typeof autoSchoolSoon === 'function') autoSchoolSoon(); return 'panel'; }
  if (el.dataset.lact) { LT[t].act(el.dataset.lact, L_cur(t)); return 'panel'; }
  return false;
}

/* =====================================================================
   On screen (do.html)
   ===================================================================== */
if (L_IN_DO) {
  (() => { const st = document.createElement('style'); st.textContent = `
    .ls-exact { display:inline-block; font:700 14px Fredoka,sans-serif; color:#FDE68A; background:#3A2E0C; border:1px solid #B7791F; border-radius:999px; padding:2px 10px; margin-bottom:4px; }
    .ls-blk { background:#fff; border-radius:18px; padding:14px 18px; display:inline-block; }
    .ls-blk [data-stick]:hover rect { filter:brightness(1.1); }
    .ls-num { display:flex; gap:8px; justify-content:center; min-height:84px; }
    .ls-num span { width:66px; height:80px; border-radius:14px; border:3px dashed var(--field-line); background:var(--field); display:grid; place-items:center; font:700 48px Fredoka,sans-serif; }
    .ls-num span.f { border-style:solid; border-color:var(--study); } .ls-num.ok span { border-color:var(--good); color:var(--good); }
    .ls-chart { display:grid; grid-template-columns:repeat(10, minmax(0,1fr)); gap:3px; width:min(640px, 94vw); }
    .ls-chart button { aspect-ratio:1; border-radius:8px; border:2px solid var(--line); background:var(--surface-2); color:var(--ink); font:700 clamp(14px,2.6vw,22px) Fredoka,sans-serif; cursor:pointer; padding:0; touch-action:manipulation; }
    .ls-chart button.lit { background:#DB2777; border-color:#DB2777; color:#fff; } .ls-chart button.right { background:var(--good); border-color:var(--good); color:#0E151D; }
    .ls-chart button.wrong { border-color:var(--bad); background:var(--bad-bg); } .ls-chart button.col { border-color:var(--try); }
    .ls-chart.view button { cursor:default; }
    .ls-big { font:700 clamp(46px,9vw,80px) Fredoka,sans-serif; background:#fff; color:#1F2937; border-radius:20px; padding:4px 30px; }
    .ls-choices { display:flex; flex-direction:column; gap:12px; width:min(640px,94vw); }
    .ls-choices.row2 { flex-direction:row; flex-wrap:wrap; justify-content:center; } .ls-choices.row2 button { flex:1 1 200px; }
    .ls-choices button { font:700 26px Fredoka,sans-serif; border:3px solid var(--line); background:var(--surface-2); color:var(--ink); border-radius:18px; padding:16px 18px; cursor:pointer; touch-action:manipulation; }
    .ls-choices button.wrong { border-color:var(--bad); background:var(--bad-bg); color:#FCA5A5; } .ls-choices button.right { border-color:var(--good); background:var(--good-bg); color:var(--good); }
    .ls-grid { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
    .ls-pick { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; max-width:720px; margin:10px auto; } .ls-pick button { font:700 28px Andika,sans-serif; padding:10px 20px; border-radius:14px; border:3px solid var(--line); background:var(--surface-2); color:var(--ink); cursor:pointer; } .ls-pick button.on { border-color:var(--good); background:var(--good-bg); }
    .ra-wrap { display:flex; flex-wrap:wrap; gap:16px; justify-content:center; align-items:flex-start; width:min(1100px,96vw); margin:6px auto; }
    .ra-pic { width:min(360px,90vw); border-radius:14px; border:3px solid var(--line); background:#fff; }
    .ra-page { flex:1 1 520px; box-sizing:border-box; max-width:100%; background:#fff; color:#1F2937; border-radius:16px; padding:18px 26px; }
    .ra-title { font:700 34px Fredoka,sans-serif; text-align:center; color:#1E3A5F; margin-bottom:8px; }
    .ra-text { font:400 clamp(28px,3.6vw,40px)/1.8 Andika,sans-serif; } .ra-s.now { background:#FEF08A; border-radius:8px; box-shadow:0 0 0 4px #FEF08A; } .ra-s.done { color:#94A3B8; }
    .ls-bub-home { min-height:74px; display:flex; justify-content:center; align-items:center; margin:6px 0; }
    .ls-bubble { display:inline-block; font:700 36px Andika,sans-serif; background:#FACC15; color:#17201A; border-radius:999px; padding:6px 28px; touch-action:none; cursor:grab; box-shadow:0 4px 0 #A16207; user-select:none; }
    .ls-bubble.sel { outline:4px solid #fff; outline-offset:3px; } .ls-bubble.drag { position:fixed; z-index:60; pointer-events:none; cursor:grabbing; box-shadow:0 10px 24px rgba(0,0,0,.45); }
    #sortChart .c { min-width:120px; transition:outline-color .1s; } #sortChart .c.over { outline:4px solid #FACC15; outline-offset:2px; } #sortChart .c.good { outline:4px solid var(--good); }
    #sortChart .c span { min-height:28px; }
    #hunt .w { cursor:pointer; border-radius:8px; padding:0 3px; } #hunt .w.found { background:#BBF7D0; color:#14532D; } #hunt .w.nope { background:#FECACA; } #hunt .w.missed { background:#FDE68A; outline:2px dashed #B45309; }
    .ls-ten .q { color:var(--try); }
    #lsErase.on, #undoBtn + #eraseBtn.on, #wlErase.on { background:#FDE68A; color:#17201A; border-color:#F59E0B; } canvas.erasing { cursor:cell; }
    .ls-help-box .ls-choices { width:100%; } .ls-help-box .ls-choices.row2 button { flex:1 1 120px; }
    .ls-help-box { background:var(--surface-2); border:2px solid var(--try); border-radius:16px; padding:10px 14px; margin:8px auto; max-width:620px; text-align:center; display:flex; flex-direction:column; gap:8px; align-items:center; }
    .ls-teamwords { display:flex; flex-wrap:wrap; gap:10px 22px; justify-content:center; max-width:760px; margin:8px auto; font:700 40px Andika,sans-serif; }
    .ls-teamwords mark.ls-team { background:#FACC15; color:#17201A; border-radius:8px; padding:0 3px; }
    .ls-grid .c { background:var(--surface-2); border:2px solid var(--line); border-radius:14px; overflow:hidden; min-width:96px; }
    .ls-grid .c b { display:block; color:#fff; font:700 20px Fredoka,sans-serif; padding:4px 10px; text-align:center; }
    .ls-grid .c span { display:block; font:400 20px Andika,sans-serif; padding:2px 10px; text-align:center; border-top:1px solid var(--line); min-height:30px; }
    .ls-grid .c span.now { background:#FDE68A; color:#1F2937; font-weight:700; } .ls-grid .c span.did { color:var(--good); }
    .ls-grid.small .c span { font-size:16px; min-height:24px; }
    .ls-story { background:#fff; color:#1F2937; border-radius:18px; padding:16px 22px; font:400 clamp(20px,3vw,27px)/1.7 Andika,sans-serif; width:min(900px,96vw); text-align:left; }
    .ls-story .w { border-radius:6px; padding:0 2px; cursor:pointer; } .ls-story .s.now { background:#FEF3C7; box-shadow:0 0 0 4px #FEF3C7; border-radius:6px; } .ls-story .s.done { color:#64748B; }
    .ls-story .w.found { background:#DDD6FE; color:#5B21B6; font-weight:700; } .ls-story .w.miss { background:#FED7AA; animation:lspulse 1s infinite; } .ls-story .w.no { background:#FECACA; }
    @keyframes lspulse { 50% { box-shadow:0 0 0 4px #FDBA74; } }
    .ls-tiles { display:flex; gap:0; justify-content:center; flex-wrap:wrap; }
    .ls-tiles .t { min-width:70px; height:86px; display:grid; place-items:center; background:#fff; color:#1F2937; border:3px solid #1F2937; margin-right:-3px; font:700 54px Andika,sans-serif; position:relative; padding:0 8px; }
    .ls-tiles .t.ch { background:#FEF3C7; box-shadow:inset 0 0 0 4px #F59E0B; }
    .ls-tiles .t .hrt { position:absolute; top:-30px; left:50%; transform:translateX(-50%); }
    .ls-tiles button.t { cursor:pointer; } .ls-tiles .t.pick { background:#FCE7F3; box-shadow:inset 0 0 0 4px #DB2777; }
    .ls-split { display:flex; align-items:stretch; justify-content:center; }
    .ls-split .l { width:62px; height:86px; display:grid; place-items:center; background:#fff; color:#1F2937; font:700 54px Andika,sans-serif; border-top:3px solid #1F2937; border-bottom:3px solid #1F2937; }
    .ls-split .l.first { border-left:3px solid #1F2937; border-radius:10px 0 0 10px; } .ls-split .l.last { border-right:3px solid #1F2937; border-radius:0 10px 10px 0; }
    .ls-split .g { width:30px; border:0; border-top:3px solid #1F2937; border-bottom:3px solid #1F2937; background:#fff; cursor:pointer; position:relative; touch-action:manipulation; padding:0; }
    .ls-split .g::after { content:''; position:absolute; left:50%; top:10px; bottom:10px; transform:translateX(-50%); border-left:3px dotted #CBD5E1; }
    .ls-split .g.on { background:transparent; border-color:transparent; width:36px; } .ls-split .g.on::after { top:-6px; bottom:-6px; border-left:5px solid #F59E0B; } .ls-split .g.on + .l { border-left:3px solid #1F2937; border-radius:10px 0 0 10px; } .ls-split .l.endb { border-right:3px solid #1F2937; border-radius:0 10px 10px 0; }
    .ls-row { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; width:min(900px,96vw); }
    .ls-row button { font:700 28px Andika,sans-serif; background:#fff; color:#1F2937; border:3px solid #CBD5E1; border-radius:999px; padding:6px 20px; cursor:pointer; touch-action:manipulation; }
    .ls-row button.found { border-color:#7E22CE; background:#F3E8FF; box-shadow:0 0 0 3px #7E22CE; } .ls-row button.no { border-color:var(--bad); background:#FEE2E2; }
    .ls-palette { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; } .ls-palette button { width:48px; height:48px; border-radius:50%; border:3px solid var(--line); cursor:pointer; font-size:22px; }
    .ls-palette button.on { box-shadow:0 0 0 4px #fff; } .ls-model { font:700 clamp(30px,6vw,52px) Andika,sans-serif; background:#fff; color:#1F2937; border-radius:16px; padding:2px 22px; }
    .ls-help { font-size:15px; } .ls-ten { display:flex; align-items:center; gap:18px; font:700 clamp(40px,8vw,70px) Fredoka,sans-serif; } .ls-ten i { font-style:normal; color:var(--muted); font-size:.6em; }
    `; document.head.appendChild(st); })();
}

/* ---- on-screen helpers ---- */
const L_wantMic = () => (typeof store === 'function' ? (store('spell-daily') || {}).mic !== false : true);
async function L_mic() { return L_wantMic() ? await getMic() : null; }
const L_count = (i, n, what = 'Number') => `<div class="count">${what} ${i + 1} of ${n}</div>`;
const L_exactTag = () => SD && SD.exact ? `<div class="ls-exact">📄 ${SD.schoolDay ? `School worksheet ${L_dayLabel(SD.schoolDay)}` : 'School copy'}</div>` : '';

/* Wait for him to read something out loud. Microphone: waits until it hears him (and at least minMs). No microphone: an "I read it" button
   that only works after minMs. Needs a <div id="lsSay"> on the screen. Resolves { heard, clip }. */
async function L_read({ minMs = 800, label = 'I read it! 🗣️', nudge = 'I’m listening… read it out loud!' } = {}) {
  const g = partGen, t0 = Date.now(), box = $('lsSay'); let clip = null;
  if (mic && box && talkMode() === 'button') {   // Get ready → Speak now → Done
    for (;;) {
      await quiet(); if (g !== partGen) return stale(g); if (!mic) break;
      const r = await speakNow(box, { minMs, maxMs: Math.max(12000, minMs + 9000), what: /read/i.test(label) ? 'Read it now!' : 'Say it now!' });
      if (g !== partGen) return stale(g);
      if (r) { box.innerHTML = ''; return { heard: r.heard, clip: r.clip }; }
    }
  }
  if (mic && box) {
    box.innerHTML = '<div class="meter"><i id="mfill"></i></div>';
    for (;;) {
      await quiet(); if (g !== partGen) return stale(g); if (!mic) break;
      const r = await listenForVoice((lvl, over) => { const f = $('mfill'); if (f) { f.style.width = Math.round(lvl * 100) + '%'; f.style.background = over ? 'var(--good)' : 'var(--try)'; } }, () => setMsg(nudge, 'try'));
      if (g !== partGen) return stale(g);
      if (r) { if (!clip && r.clip) clip = r.clip; if (Date.now() - t0 >= minMs) return { heard: true, clip }; setMsg('Keep reading!', 'good'); }
    }
  }
  if (!box) return { heard: false };
  box.innerHTML = `<button class="btn big primary" id="lsSaid" disabled>${label}</button>`;
  await wait(Math.max(minMs, 900)); if (g !== partGen) return stale(g);
  const b = $('lsSaid'); if (!b) return { heard: false }; b.disabled = false;
  await new Promise(r => { b.onclick = r; });
  return { heard: false };
}
/* type a number on the number pad into #io; practice style (wrong → try again; after 2 it shows the answer). Resolves { typed, ok, tries, attempts } */
function L_numpad(answer) {
  answer = String(answer);
  return new Promise(res => {
    let typed = '', tries = 0, first = null, live = true; const attempts = [];
    $('io').innerHTML = `<div class="ls-num" id="nshow"></div><div class="message" id="msg"></div><div class="numpad" id="np">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => `<button data-n="${n}">${n}</button>`).join('')}</div>
      <div class="row acts"><button class="btn big" id="nBack">⌫ Back</button><button class="btn big primary" id="nDone" disabled>Check ✓</button></div>`;
    const draw = (cls = '') => { $('nshow').className = 'ls-num ' + cls; $('nshow').innerHTML = (typed ? [...typed].map(c => `<span class="f">${c}</span>`).join('') : '') + (typed.length < 3 && !cls ? '<span></span>' : ''); $('nDone').disabled = !typed; };
    draw();
    const add = n => { if (live && typed.length < 3) { typed += n; draw(); } };
    $('np').onclick = e => { const b = e.target.closest('[data-n]'); if (b) add(b.dataset.n); };
    const kd = e => { if (!live) return document.removeEventListener('keydown', kd); if (/^[0-9]$/.test(e.key)) add(e.key); else if (e.key === 'Backspace') { e.preventDefault(); $('nBack').click(); } else if (e.key === 'Enter' && !$('nDone').disabled) { e.preventDefault(); $('nDone').click(); } };
    document.addEventListener('keydown', kd);
    $('nBack').onclick = () => { typed = typed.slice(0, -1); draw(); };
    $('nDone').onclick = () => {
      if (!typed) return;
      if (first === null) first = typed; attempts.push(typed);
      if (+typed === +answer) {
        live = false; document.removeEventListener('keydown', kd); draw('ok'); $('nDone').disabled = $('nBack').disabled = true;
        setMsg(tries ? 'You got it!' : 'Yes! Right the first time!', 'good'); say(`Yes! ${answer}!`, 0.95);
        nextUp(1200).then(() => res({ typed: first, ok: tries === 0, tries, attempts }));
      } else {
        tries++; typed = ''; draw(); shakeEl($('nshow'));
        if (tries >= 2) { setMsg(`It’s ${answer}. Now you type it.`, 'try'); say(`It's ${answer}. Now you type it.`, 0.9); }
        else setMsg('Not quite. Count again and try again.', 'try');
      }
    };
  });
}
/* tap one of the choices in #io; practice style. Resolves { typed (first pick), ok, picks } */
function L_choose(choices, answer, { hint = 'Not quite. Look again.', row = false, sayIt = false } = {}) {
  return new Promise(res => {
    const picks = [];
    $('io').innerHTML = `<div class="ls-choices${row ? ' row2' : ''}" id="ch">${choices.map((c, i) => `<button data-c="${i}">${L_esc(c)}</button>`).join('')}</div><div class="message" id="msg"></div>`;
    $('ch').onclick = e => {
      const b = e.target.closest('[data-c]'); if (!b || b.disabled) return;
      const c = choices[+b.dataset.c]; picks.push(c);
      if (sayIt) say(c, 0.9);
      if (c === answer) {
        b.classList.add('right'); $('ch').querySelectorAll('button').forEach(x => x.disabled = true);
        setMsg(picks.length === 1 ? 'Yes! Right the first time!' : 'You got it!', 'good'); if (!sayIt) say('Yes!', 1);
        nextUp(1200).then(() => res({ typed: picks[0], ok: picks.length === 1, picks }));
      } else { b.classList.add('wrong'); b.disabled = true; shakeEl(b); setMsg(hint, 'try'); }
    };
  });
}
const L_ask = qs => async () => {
  await each(qs.length, i => new Promise(async done => {
    const q = qs[i], pn = PARTS[partIdx].name;
    app.innerHTML = head(L_esc(q.q)) + L_count(i, qs.length, 'Question') + `<button class="btn" id="hearQ">${SPK}Hear the question</button>` + (L_ask.extra ? L_ask.extra() : '') + '<div id="io"></div>';
    const sq = () => say(q.q + ' ' + q.choices.join(', or '), 0.9); $('hearQ').onclick = sq; sq();
    const r = await L_choose(q.choices, q.answer, { row: q.choices.length <= 3 });
    mark(pn, q.q, r.ok, r.typed, q.answer, null, { text: q.q, choices: q.choices }, r.picks); done();
  }));
  partDone(firstTry(PARTS[partIdx].name) + '.');
};

/* Finger / Apple Pencil writing on handwriting lines.
   guide: gray letters to trace (checked letter by letter, like Sight Word Practice). No guide: free writing (checked that he wrote across the line).
   Renders into #lsPad. Resolves { img, redo }. */
let L_usedPen = false;
/* What happened on a writing pad, for Parent Review (Nov 10, Dylan: "he had to trace more 2 times… I don't know what he had to trace";
   "don't know if he did 4 lines or if it auto came that way") */
function L_padNote(r, guide) {
  const x = n => n === 1 ? 'once' : `${n} times`, w = r.why || {}, bits = [];
  if (w.missed) bits.push(`${x(w.missed)} it asked him to trace letters he had skipped (they turned orange)`);
  if (w.off) bits.push(`${x(w.off)} it asked him to stay on the gray letters`);
  if (w.lines) bits.push(`${x(w.lines)} it asked him to keep his letters on the lines`);
  if (w.short) bits.push(`${x(w.short)} it asked him to write all of it`);
  if (!bits.length && r.redo) bits.push(`${x(r.redo)} it asked him to fix it`);
  let t = bits.length ? ` Before it was right, ${bits.join('; ')}.` : ' Right the first time he tapped Done.';
  if (r.more) t += guide ? ` He tapped ➕ Need more space ${x(r.more)} for bigger letters (the tracing started over).` : ` He tapped ➕ Need more space ${x(r.more)} (${r.rows || r.more + 1} lines; it starts with 1).`;
  else if (!guide) t += ' He used the 1 line it starts with.';
  return t;
}
async function L_pad({ text, guide = true, fsMax = 150, H = 230, need = 0.45, label = '', check = true, rows: rows0 = 0 }) {
  try { await document.fonts.load(`700 ${fsMax}px Andika`); } catch (e) { }
  // Free writing of a sentence (Nov 9, 2026, Dylan: "make sure he is writing in his grids… Need more space"): big rows like a
  // single word's, starting with 2, and ➕ Need more space adds another (up to 5). Every pad has ↶ Undo (the last line he drew).
  // Tracing a sentence (Nov 9, later: "This section needs an option to add more space"): it wraps onto rows at a size he can trace
  // (not squeezed onto one line), and ➕ Need more space makes the letters bigger (more rows; starts the tracing over).
  const multi = !guide && /\s/.test(text.trim()), gMulti = guide && /\s/.test(text.trim());
  if (multi) { fsMax = Math.max(fsMax, 110); H = Math.max(H, 200); }
  if (gMulti) { fsMax = Math.min(fsMax, 110); H = Math.min(H, 190); }
  let nRows = guide ? 1 : rows0 || 1; const maxRows = guide ? 1 : multi ? 5 : 2;   // Nov 10 (Dylan): always one row first; ➕ Need more space adds rows
  const gSizes = [fsMax, Math.round(fsMax * 1.25), Math.round(fsMax * 1.5)]; let gStep = 0;
  return new Promise(done => {
    $('lsPad').innerHTML = `<div class="tracebox"><canvas id="lsCv"></canvas></div><div class="message" id="msg"></div>
      <div class="row acts"><button class="btn big" id="lsUndo">↶ Undo</button><button class="btn big" id="lsErase" aria-pressed="false">🧽 Eraser</button><button class="btn big" id="lsClear">↺ Start over</button>${!guide || gMulti ? '<button class="btn big" id="lsMore">➕ Need more space</button>' : ''}<button class="btn big primary" id="lsDone">Done ✓</button></div>`;
    const cv = $('lsCv'), dpr = window.devicePixelRatio || 1, Wd = Math.min(960, window.innerWidth - 40); let rowH = H;
    let Ht = rowH * nRows, ctx = cv.getContext('2d');
    const size = () => { Ht = rowH * nRows; cv.width = Wd * dpr; cv.height = Ht * dpr; cv.style.width = Wd + 'px'; cv.style.height = Ht + 'px'; ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const font = s => `700 ${s}px Andika, sans-serif`;
    let fs = fsMax, tw = 0, x0 = 24, gRows = [], spans = [], coreD = null, nearD = null;
    const geo = r => { const base = r * rowH + rowH * 0.68; return { top: base - fs * 0.74, mid: base - fs * 0.5, base }; };
    const make = (h = Ht) => { const c = document.createElement('canvas'); c.width = Wd; c.height = h; const g = c.getContext('2d'); g.font = font(fs); return [c, g]; };
    const layout = () => {   // guide text → rows (a sentence wraps by words), each centered; the letter spans remember their row
      fs = guide && gMulti ? gSizes[gStep] : fsMax; ctx.font = font(fs); if (guide && gMulti) rowH = Math.max(150, Math.round(fs * 1.55));
      if (guide && !gMulti) { while (ctx.measureText(text).width > Wd * 0.9 && fs > 34) { fs -= 4; ctx.font = font(fs); } }
      if (!guide) { fs = Math.min(fs, rowH * 0.55); ctx.font = font(fs); }
      tw = ctx.measureText(text).width;
      if (guide) {
        const lines = []; if (gMulti) { let cur = ''; text.trim().split(/\s+/).forEach(w => { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > Wd * 0.92) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); } else lines.push(text);
        nRows = lines.length; size(); ctx.font = font(fs);
        gRows = lines.map((t, r) => ({ t, r, x: (Wd - ctx.measureText(t).width) / 2 }));
        spans = gRows.flatMap(g => [...g.t].map((ch, k) => ({ ch, r: g.r, a: g.x + ctx.measureText(g.t.slice(0, k)).width, b: g.x + ctx.measureText(g.t.slice(0, k + 1)).width })).filter(z => /[a-z]/i.test(z.ch)));
        const [core, cg] = make(); gRows.forEach(g => cg.fillText(g.t, g.x, geo(g.r).base));
        const [near, ng] = make(); ng.lineWidth = Math.max(16, fs * 0.16); ng.lineJoin = 'round'; gRows.forEach(g => { ng.strokeText(g.t, g.x, geo(g.r).base); ng.fillText(g.t, g.x, geo(g.r).base); });
        coreD = cg.getImageData(0, 0, Wd, Ht).data; nearD = ng.getImageData(0, 0, Wd, Ht).data;
      }
    };
    layout();
    const base = geo(0).base;
    let more = 0; const why = { missed: 0, off: 0, lines: 0, short: 0 };   // for Parent Review: what each "try again" was about, and ➕ taps
    let strokes = [], cur = null, orange = new Set(), redo = 0, flagged = null, offLines = new Set(), caseAsked = '';
    window.__lsPad = { text, x0, base, get fs() { return fs; }, Wd, get Ht() { return Ht; }, guide, rowH, geo, rows: () => nRows, strokes: () => strokes, spans: () => spans };   // for automated tests
    const lines = () => {
      for (let r = 0; r < nRows; r++) {
        const g = geo(r);
        ctx.lineWidth = 2; ctx.strokeStyle = '#1E3A5F'; ctx.setLineDash([]);
        [g.top, g.base].forEach(y => { ctx.beginPath(); ctx.moveTo(8, y); ctx.lineTo(Wd - 8, y); ctx.stroke(); });
        ctx.strokeStyle = '#94A3B8'; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(8, g.mid); ctx.lineTo(Wd - 8, g.mid); ctx.stroke(); ctx.setLineDash([]);
        if (nRows > 1) { ctx.fillStyle = '#94A3B8'; ctx.font = '700 16px Fredoka, sans-serif'; ctx.fillText(String(r + 1), 10, g.top - 8); }
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, Wd, Ht); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, Wd, Ht);
      if (flagged) { ctx.fillStyle = 'rgba(251,146,60,.28)'; flagged.forEach(f => { const g = geo(f.row); ctx.fillRect(f.x0 - 6, g.top - 10, f.x1 - f.x0 + 12, g.base - g.top + 20); }); }
      lines();
      if (guide) { ctx.font = font(fs); gRows.forEach(g => [...g.t].forEach((ch, k) => { const xa = g.x + ctx.measureText(g.t.slice(0, k)).width, s = spans.find(z => z.r === g.r && Math.abs(z.a - xa) < 0.01); ctx.fillStyle = s && orange.has(s) ? '#FDBA74' : '#CBD5E1'; ctx.fillText(ch, xa, geo(g.r).base); })); }
      ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(7, fs * 0.07);
      strokes.forEach(st => { ctx.strokeStyle = offLines.has(st) ? '#F97316' : '#2563EB'; ctx.beginPath(); st.forEach(([px, py], k) => k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); if (st.length === 1) ctx.lineTo(st[0][0] + 0.1, st[0][1]); ctx.stroke(); });
    };
    draw();
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * Wd / r.width, (e.clientY - r.top) * Ht / r.height]; };
    const changed = () => { flagged = null; caseAsked = ''; offLines.clear(); };
    let penId = null;
    cv.onpointerdown = e => { e.preventDefault(); if (e.pointerType === 'pen') L_usedPen = true; if ((L_usedPen && e.pointerType === 'touch') || (cur && penId !== e.pointerId)) return; penId = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (er) { } cur = [pt(e)]; strokes.push(cur); changed(); draw(); };
    cv.onpointermove = e => { if (!cur || e.pointerId !== penId) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : []; (evs.length ? evs : [e]).forEach(ev => cur.push(pt(ev))); draw(); };
    cv.onpointerup = cv.onpointercancel = e => { if (e.pointerId === penId) { cur = null; penId = null; } };
    $('lsClear').onclick = () => { strokes = []; orange.clear(); changed(); setMsg(''); draw(); };
    $('lsUndo').onclick = () => { if (cur) return; strokes.pop(); changed(); setMsg(''); draw(); };
    const tools = padTools({ cv, get: () => strokes, set: v => { strokes = v; }, pt, redraw: () => draw(), radius: Math.max(14, fs * 0.13), eraseBtn: $('lsErase'), undoBtn: $('lsUndo'), clearBtn: $('lsClear'), changed: () => { if (!cur) { changed(); setMsg(''); } } });
    if ($('lsMore')) {
      const moreBtn = $('lsMore'), syncMore = () => { moreBtn.disabled = nRows >= maxRows; moreBtn.textContent = nRows >= maxRows ? 'No more space' : '➕ Need more space'; };
      if (guide) {   // tracing: bigger letters on more rows (the tracing starts over)
        const syncG = () => { moreBtn.disabled = gStep >= gSizes.length - 1; moreBtn.textContent = moreBtn.disabled ? 'Biggest letters' : '➕ Need more space'; };
        moreBtn.onclick = () => { if (gStep >= gSizes.length - 1) return; gStep++; more++; strokes = []; orange.clear(); changed(); layout(); draw(); syncG(); setMsg('Bigger letters! Trace them from the start.', 'good'); cv.scrollIntoView({ block: 'end', behavior: 'smooth' }); };
        syncG();
      } else {
      moreBtn.onclick = () => { if (nRows >= maxRows) return; nRows++; more++; size(); changed(); draw(); syncMore(); setMsg('Here’s another line. Keep going!', 'good'); cv.scrollIntoView({ block: 'end', behavior: 'smooth' }); };
      syncMore();
      }
    }
    const snap = () => { try { const sm = document.createElement('canvas'); sm.width = 420; sm.height = Math.round(420 * Ht / Wd); sm.getContext('2d').drawImage(cv, 0, 0, sm.width, sm.height); return sm.toDataURL('image/png'); } catch (er) { return ''; } };
    const finishPad = extra => {
      setMsg(guide ? 'Beautiful tracing!' : 'Nice writing!', 'good'); say(guide ? 'Beautiful!' : 'Nice writing!', 0.95);
      flagged = null; draw();
      tools.setMode(false); flagged = null; draw();
      const img = snap(); ['lsDone', 'lsClear', 'lsUndo', 'lsMore', 'lsErase'].forEach(id => { if ($(id)) $(id).disabled = true; });
      nextUp(1100).then(() => done({ img, redo, more, why, rows: nRows, ...extra }));
    };
    $('lsDone').onclick = () => {
      if (!strokes.length) return setMsg(guide ? 'Use your finger to trace the gray letters.' : 'Write it on the lines with your finger or pencil.', 'try');
      if (guide) {
        const [ink, ig] = make(); ig.lineCap = ig.lineJoin = 'round'; ig.lineWidth = Math.max(12, fs * 0.12);
        strokes.forEach(st => { ig.beginPath(); st.forEach(([px, py], k) => k ? ig.lineTo(px, py) : ig.moveTo(px, py)); if (st.length === 1) ig.lineTo(st[0][0] + 0.1, st[0][1]); ig.stroke(); });
        const inkD = ig.getImageData(0, 0, Wd, Ht).data;
        let all = 0, out = 0; const per = spans.map(() => [0, 0]);
        for (let py = 0; py < Ht; py += 3) { const r = Math.min(nRows - 1, Math.floor(py / rowH)); for (let px = 0; px < Wd; px += 3) {
          const o = (py * Wd + px) * 4 + 3, isInk = inkD[o] > 40;
          if (isInk) { all++; if (nearD[o] < 40) out++; }
          if (coreD[o] > 100) { const s = spans.findIndex(z => z.r === r && px >= z.a && px < z.b); if (s >= 0) { per[s][1]++; if (isInk) per[s][0]++; } }
        } }
        const missed = spans.filter((s, k) => per[k][1] && per[k][0] / per[k][1] < need);
        orange = new Set(missed);
        if ((all ? out / all : 1) > 0.4) { redo++; why.off++; draw(); setMsg('Stay on the gray letters. Tap ↶ Undo or Start over and trace them carefully.', 'try'); say('Stay on the gray letters.', 0.95); return; }
        if (missed.length) { redo++; why.missed++; draw(); setMsg(`Trace the orange letter${missed.length > 1 ? 's' : ''} too.`, 'try'); say(`Trace the orange letter${missed.length > 1 ? 's' : ''} too.`, 0.95); return; }
        return finishPad({});
      }
      // free writing: (1) on the lines, (2) all of it, (3) capital or small letters
      const pts = strokes.flat(), rowOf = y => Math.max(0, Math.min(nRows - 1, Math.floor(y / rowH)));
      const inBand = ([, y]) => { const g = geo(rowOf(y)), xh = g.base - g.mid; return y >= g.top - xh * 0.45 && y <= g.base + xh * 1.1; };
      offLines = new Set(strokes.filter(st => st.filter(p => !inBand(p)).length > st.length * 0.5));
      const outFrac = pts.filter(p => !inBand(p)).length / pts.length;
      if (outFrac > 0.25) { redo++; why.lines++; draw(); setMsg('Keep your letters on the lines: tall letters touch the top line, and every letter sits on the bottom line. Tap ↶ Undo to fix the orange ones.', 'try'); say('Keep your letters on the lines.', 0.95); return; }
      offLines.clear();
      let width = 0, n = pts.length;
      for (let r = 0; r < nRows; r++) { const xs = pts.filter(p => rowOf(p[1]) === r).map(p => p[0]); if (xs.length > 2) width += Math.max(...xs) - Math.min(...xs); }
      const want = Math.min(tw, (Wd - 48) * nRows) * (multi ? 0.35 : 0.45);
      if (width < want || n < 40) { redo++; why.short++; draw(); setMsg(label ? `Write ${label}. Keep going!` : `Write all of “${text}”. Keep going!${multi && nRows < maxRows ? ' Tap ➕ Need more space if you run out of room.' : ''}`, 'try'); say('Write all of it.', 0.95); return; }
      if (check && typeof hcCheck === 'function') {
        const dense = hcDense(strokes), rows = Array.from({ length: nRows }, (_, r) => ({ ...geo(r), pts: dense.filter(p => rowOf(p[1]) === r) }));
        const flags = hcCheck(rows, text), key = flags.map(f => f.ch + f.row + Math.round(f.x0)).join();
        if (flags.length && caseAsked !== key) {   // ask once; Done again means "it's right" (the check can be wrong)
          caseAsked = key; flagged = flags; draw();
          const m = hcMessage(flags); setMsg(`${m} Fix it with ↶ Undo, or tap Done again if it’s right.`, 'try'); say(m, 0.95); return;
        }
        if (flags.length) return finishPad({ caseFlags: flags.map(f => `${f.ch} in “${f.word}” (${f.want === 'small' ? 'looked like a capital' : 'looked small'})`) });
      }
      finishPad({});
    };
  });
}
/* Drawing area with colors (for "draw the story"). Renders into #lsPad. Resolves { img } */
function L_drawPad() {
  return new Promise(done => {
    const PAL = [['#1F2937', 'black'], ['#DC2626', 'red'], ['#EA580C', 'orange'], ['#FACC15', 'yellow'], ['#16A34A', 'green'], ['#2563EB', 'blue'], ['#7C3AED', 'purple'], ['#92400E', 'brown'], ['#F9A8D4', 'pink'], ['#FFFFFF', 'eraser']];
    $('lsPad').innerHTML = `<div class="ls-palette" id="lsPal">${PAL.map(([c, n], i) => `<button data-c="${c}" aria-label="${n}" class="${i ? '' : 'on'}" style="background:${c}">${n === 'eraser' ? '🧽' : ''}</button>`).join('')}</div>
      <div class="tracebox"><canvas id="lsCv"></canvas></div><div class="message" id="msg"></div>
      <div class="row acts"><button class="btn big" id="lsUndo">↶ Undo</button><button class="btn big" id="lsClear">↺ Start over</button><button class="btn big primary" id="lsDone">Done ✓</button></div>`;
    const cv = $('lsCv'), dpr = window.devicePixelRatio || 1, Wd = Math.min(960, window.innerWidth - 40), Ht = Math.round(Math.max(240, Math.min(520, window.innerHeight - 390, Wd * 0.62)));
    cv.width = Wd * dpr; cv.height = Ht * dpr; cv.style.width = Wd + 'px'; cv.style.height = Ht + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); ctx.lineCap = ctx.lineJoin = 'round';
    const clear = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, Wd, Ht); };
    clear();
    let color = PAL[0][0], last = null, penId = null, inked = 0;
    $('lsPal').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; color = b.dataset.c; $('lsPal').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * Wd / r.width, (e.clientY - r.top) * Ht / r.height]; };
    const seg = (a, b) => { ctx.strokeStyle = color; ctx.lineWidth = color === '#FFFFFF' ? 28 : 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] + 0.1, b[1]); ctx.stroke(); if (color !== '#FFFFFF') inked += Math.hypot(b[0] - a[0], b[1] - a[1]) + 1; };
    cv.onpointerdown = e => { e.preventDefault(); if (e.pointerType === 'pen') L_usedPen = true; if ((L_usedPen && e.pointerType === 'touch') || penId !== null) return; penId = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (er) { } last = pt(e); seg(last, last); };
    cv.onpointermove = e => { if (e.pointerId !== penId) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : []; (evs.length ? evs : [e]).forEach(ev => { const p = pt(ev); seg(last, p); last = p; }); };
    cv.onpointerup = cv.onpointercancel = e => { if (e.pointerId === penId) penId = null; };
    $('lsClear').onclick = () => { clear(); inked = 0; hist.length = 0; };
    const hist = [];   // ↶ Undo: the picture before each line he drew (last 15)
    cv.addEventListener('pointerdown', e => { if (penId !== null || (L_usedPen && e.pointerType === 'touch')) return; try { hist.push([ctx.getImageData(0, 0, cv.width, cv.height), inked]); if (hist.length > 15) hist.shift(); } catch (er) { } }, true);
    $('lsUndo').onclick = () => { const h = hist.pop(); if (!h) return; ctx.putImageData(h[0], 0, 0); inked = h[1]; };
    $('lsDone').onclick = () => {
      if (inked < 300) return setMsg('Draw a little more of the story first.', 'try');
      let img = ''; try { const sm = document.createElement('canvas'); sm.width = 480; sm.height = Math.round(480 * Ht / Wd); sm.getContext('2d').drawImage(cv, 0, 0, sm.width, sm.height); img = sm.toDataURL('image/jpeg', 0.8); } catch (er) { }
      setMsg('What a great picture!', 'good'); say('What a great picture!', 0.95); $('lsDone').disabled = true;
      nextUp(1100).then(() => done({ img }));
    };
  });
}
const L_free = () => { items.at(-1).free = true; };
const L_clipKey = (kind, run, i) => `clip:${kind}:${run}:${i}`;
function L_keepClip(kind, run, i, clip) { if (!clip) return []; const k = L_clipKey(kind, run, i); saveClip(k, clip, run); return [k]; }

/* ---------- 10 More or Less ---------- */
LT.tenmore.run = () => {
  const d = SD, more = d.dir !== 'less', D = more ? 10 : -10, word = more ? 'more' : 'less', More = more ? 'More' : 'Less', run = Date.now().toString(36);
  const sticks = async () => {
    const ans = d.blocks + D; let n = d.blocks;
    const draw = (sub, tap) => { app.innerHTML = L_exactTag() + head(sub) + `<div class="ls-blk" id="blk">${L_blocks(n, { unit: 20, tap })}</div><div id="lsBtn"></div><div class="message" id="msg"></div><div id="io"></div>`; };
    await new Promise(r => {
      if (more) {
        draw(`This shows ${d.blocks}. Add a ten stick to make 10 more.`, false);
        $('lsBtn').innerHTML = '<button class="btn big primary" id="addTen">+ Add a ten stick</button>';
        say(`This shows ${d.blocks}. Add a ten stick to make 10 more.`, 0.95);
        $('addTen').onclick = () => { n += 10; $('blk').innerHTML = L_blocks(n, { unit: 20 }); $('lsBtn').innerHTML = ''; say('One more ten!', 1); r(); };
      } else {
        draw(`This shows ${d.blocks}. Tap a ten stick to take it away.`, true);
        say(`This shows ${d.blocks}. Tap a ten stick to take it away. That makes 10 less.`, 0.95);
        $('blk').onclick = e => { if (!e.target.closest('[data-stick]')) return; n -= 10; $('blk').innerHTML = L_blocks(n, { unit: 20 }); $('blk').onclick = null; say('One less ten!', 1); r(); };
      }
    });
    setMsg('Count the tens and ones. What number is it now?'); say('What number is it now?', 0.95);
    const r = await L_numpad(ans);
    mark('Ten Sticks', `10 ${word} than ${d.blocks}`, r.ok, r.typed, String(ans), null, { html: `<div style="background:#fff;padding:10px;border-radius:12px;display:inline-block">${L_blocks(d.blocks, { unit: 14 })}</div>`, text: `${d.blocks} in ten sticks and ones. He ${more ? 'added' : 'took away'} a ten.` }, r.attempts);
    if (d.aloud) {
      app.innerHTML = L_exactTag() + head(`Say it out loud: how did you find 10 ${word} than ${d.blocks}?`) + `<div class="ls-ten">${d.blocks}<i>→</i>${ans}</div><div class="message" id="msg"></div><div id="lsSay"></div>`;
      await L_mic(); say(`Now say it out loud. How did you find 10 ${word} than ${d.blocks}?`, 0.95);
      const s = await L_read({ minMs: 1500, label: 'I said it! 🗣️', nudge: 'I’m listening… say how you found it!' }); stopMic();
      mark('Ten Sticks', `Said out loud how he found 10 ${word}`, true, '', '', null, { text: `He explained out loud how to find 10 ${word} than ${d.blocks}.`, clips: L_keepClip('ten', run, 0, s.clip) }, [s.heard ? 'said it (microphone heard him)' : 'tapped “I said it”']); L_free();
    }
    partDone(r.ok ? `${ans}, right the first time!` : `${ans}.`);
  };
  const chart = async () => {
    const target = d.chart + D; let tries = 0; const picks = [];
    app.innerHTML = L_exactTag() + head(`Find the pink number, ${d.chart}. Tap the number that is 10 ${word}.`) + `<div class="ls-chart" id="ch">${Array.from({ length: 100 }, (_, k) => `<button data-n="${k + 1}" class="${k + 1 === d.chart ? 'lit' : ''}">${k + 1}</button>`).join('')}</div><div class="message" id="msg"></div>`;
    say(`Find the pink number, ${d.chart}. Tap the number that is 10 ${word}.`, 0.95);
    await new Promise(r => {
      $('ch').onclick = e => {
        const b = e.target.closest('[data-n]'); if (!b || b.disabled || +b.dataset.n === d.chart) return;
        const n = +b.dataset.n; picks.push(String(n));
        if (n === target) { b.classList.add('right'); $('ch').onclick = null; setMsg(`Yes! 10 ${word} than ${d.chart} is ${target}. It’s right ${more ? 'below' : 'above'} it!`, 'good'); say(`Yes! ${target}!`, 0.95); nextUp(1600).then(r); return; }
        tries++; b.classList.add('wrong'); b.disabled = true; shakeEl(b);
        if (tries === 1) setMsg(`Not quite. 10 ${word} is in the same column, one row ${more ? 'down' : 'up'}.`, 'try');
        else { setMsg(`Look in the yellow column, right ${more ? 'below' : 'above'} ${d.chart}.`, 'try'); $('ch').querySelectorAll('button').forEach(x => { if ((+x.dataset.n - d.chart) % 10 === 0) x.classList.add('col'); }); }
      };
    });
    mark('100 Chart', `10 ${word} than ${d.chart}`, tries === 0, picks[0], String(target), null, { html: L_chart([d.chart], { cell: 26, fs: 12 }), text: `The 100 chart with ${d.chart} in pink.` }, picks);
    partDone(tries ? `Found ${target} on try ${tries + 1}.` : `Found ${target} right the first time.`);
  };
  const write = async () => {
    await each(d.nums.length, i => new Promise(async done => {
      const n = d.nums[i], ans = n + D; let helped = false;
      app.innerHTML = L_exactTag() + head(`What number is 10 ${word} than ${n}?`) + L_count(i, d.nums.length) + `<div class="ls-ten">${n}<i>→</i>?</div>
        <button class="btn ls-help" id="showChart">🔢 Show me the 100 chart</button><div id="chartBox"></div><div id="io"></div>`;
      say(`What number is 10 ${word} than ${n}?`, 0.95);
      $('showChart').onclick = () => { helped = true; $('showChart').remove(); $('chartBox').innerHTML = `<div class="ls-chart view">${Array.from({ length: 100 }, (_, k) => `<button tabindex="-1" class="${k + 1 === n ? 'lit' : ''}">${k + 1}</button>`).join('')}</div>`; };
      const r = await L_numpad(ans);
      mark(`10 ${More}`, `10 ${word} than ${n}`, r.ok, r.typed, String(ans), null, { text: `What number is 10 ${word} than ${n}?${helped ? ' (He opened the 100 chart to help.)' : ''}` }, r.attempts);
      done();
    }));
    partDone(firstTry(`10 ${More}`) + '.');
  };
  const pattern = async () => {
    const rows = d.rows.map(r => r.join(', ')), good = d.rows.find(r => r.every((x, k) => !k || x - r[k - 1] === D));
    app.innerHTML = L_exactTag() + head(`Which numbers show a pattern of 10 ${word}? Tap it.`) + '<div id="io"></div>';
    say(`Which numbers show a pattern of 10 ${word}? Tap it.`, 0.95);
    const r = await L_choose(rows, good ? good.join(', ') : rows[0], { hint: `Look at the tens. In a 10 ${word} pattern, the tens go ${more ? 'up' : 'down'} by one each time.` });
    mark('Find the Pattern', `Pattern of 10 ${word}`, r.ok, r.typed, good ? good.join(', ') : '', null, { text: `Which numbers show a pattern of 10 ${word}?`, choices: rows }, r.picks);
    partDone(r.ok ? 'Right the first time!' : 'Found it!');
  };
  if (d.dir === 'both') return LT.tenmore.runBoth(run);
  PARTS = [];
  if (d.blocks) PARTS.push({ name: 'Ten Sticks', run: sticks });
  if (d.chart) PARTS.push({ name: '100 Chart', run: chart });
  if (d.nums.length) PARTS.push({ name: `10 ${More}`, run: write });
  if (d.rows.length >= 2) PARTS.push({ name: 'Find the Pattern', run: pattern });
  return { intro: `Find the number that is 10 ${word}!` };
};

/* 10 more AND 10 less (the (C) sheet, Nov 9, 2026): say how you find each one, pick each pattern, then 10 less and 10 more of each number */
LT.tenmore.runBoth = run => {
  const d = SD;
  const sayIt = async () => {
    await L_mic();
    const qs = [['more', 'How do you find 10 more than a number?'], ['less', 'How do you find 10 less than a number?']];
    await each(qs.length, i => new Promise(async done => {
      const [w, q] = qs[i];
      app.innerHTML = L_exactTag() + head('Answer the question out loud.') + L_count(i, qs.length, 'Question') + `<div class="ls-model" style="font-size:clamp(26px,4vw,40px)">${L_esc(q)}</div><div class="message" id="msg"></div><div id="lsSay"></div>`;
      say(q, 0.92);
      const r = await L_read({ minMs: 1800, label: 'I said it! 🗣️', nudge: 'I’m listening… say how you do it!' });
      mark('Say It', q, true, '', '', null, { text: `He answered out loud: ${q}`, clips: L_keepClip('ten', run, i, r.clip) }, [r.heard ? 'said it (microphone heard him)' : 'tapped “I said it”']); L_free();
      setMsg('Great explaining!', 'good'); await wait(500); done();
    }));
    stopMic(); partDone('Both answered out loud!');
  };
  const patterns = async () => {
    const sets = [['more', d.rowsMore, 10], ['less', d.rowsLess, -10]].filter(x => x[1].length >= 2);
    await each(sets.length, i => new Promise(async done => {
      const [w, rows, D] = sets[i], txt = rows.map(r => r.join(', ')), good = rows.find(r => r.every((x, k) => !k || x - r[k - 1] === D));
      app.innerHTML = L_exactTag() + head(`Which numbers show a pattern of 10 ${w}? Tap it.`) + L_count(i, sets.length, 'Question') + '<div id="io"></div>';
      say(`Which numbers show a pattern of 10 ${w}?`, 0.95);
      const r = await L_choose(txt, good ? good.join(', ') : txt[0], { hint: `Look at the tens. In a 10 ${w} pattern, the tens go ${D > 0 ? 'up' : 'down'} by one each time.` });
      mark('Find the Pattern', `Pattern of 10 ${w}`, r.ok, r.typed, good ? good.join(', ') : '', null, { text: `Which numbers show a pattern of 10 ${w}?`, choices: txt }, r.picks); done();
    }));
    partDone(firstTry('Find the Pattern') + '.');
  };
  const both = async () => {
    await each(d.nums.length, i => new Promise(async done => {
      const n = d.nums[i]; let helped = false;
      for (const [w, D] of [['less', -10], ['more', 10]]) {
        const ans = n + D, row = w === 'less' ? `<b class="q">?</b><i>←</i>${n}<i>→</i><span style="opacity:.35">?</span>` : `${n - 10}<i>←</i>${n}<i>→</i><b class="q">?</b>`;
        app.innerHTML = L_exactTag() + head(`What number is 10 ${w} than ${n}?`) + L_count(i, d.nums.length) + `<div class="ls-ten">${row}</div>
          <button class="btn ls-help" id="showChart">🔢 Show me the 100 chart</button><div id="chartBox"></div><div id="io"></div>`;
        say(`What number is 10 ${w} than ${n}?`, 0.95);
        $('showChart').onclick = () => { helped = true; $('showChart').remove(); $('chartBox').innerHTML = `<div class="ls-chart view">${Array.from({ length: 100 }, (_, k) => `<button tabindex="-1" class="${k + 1 === n ? 'lit' : ''}">${k + 1}</button>`).join('')}</div>`; };
        const r = await L_numpad(ans);
        mark('10 More and 10 Less', `10 ${w} than ${n}`, r.ok, r.typed, String(ans), null, { text: `What number is 10 ${w} than ${n}?${helped ? ' (He opened the 100 chart to help.)' : ''}` }, r.attempts);
      }
      done();
    }));
    partDone(firstTry('10 More and 10 Less') + '.');
  };
  PARTS = [];
  if (d.aloud) PARTS.push({ name: 'Say It', run: sayIt });
  if (d.rowsMore.length >= 2 || d.rowsLess.length >= 2) PARTS.push({ name: 'Find the Pattern', run: patterns });
  if (d.nums.length) PARTS.push({ name: '10 More and 10 Less', run: both });
  return { intro: 'Find 10 more and 10 less!' };
};

/* ---------- Sound Investigator ---------- */
LT.sound.run = () => {
  const d = SD, cols = d.cols, n = Math.max(...cols.map(c => c.words.length));
  const grid = (now, did, small) => `<div class="ls-grid${small ? ' small' : ''}">${cols.map((c, ci) => `<div class="c"><b style="background:${L_COL[ci % 8]}">${L_esc(c.label)}</b>${Array.from({ length: n }, (_, k) => { const key = ci + ':' + k, w = c.words[k]; return `<span class="${now === key ? 'now' : did && did.has(key) ? 'did' : ''}">${w ? L_esc(w) : ''}</span>`; }).join('')}</div>`).join('')}</div>`;
  const reading = (order, part, sub) => async () => {
    await L_mic(); const did = new Set(), helped = [];
    await each(order.length, i => new Promise(async done => {
      const [ci, k] = order[i], w = cols[ci].words[k];
      app.innerHTML = L_exactTag() + head(sub) + L_count(i, order.length, 'Word') + `<div class="big-word">${L_esc(w)}</div><div class="message" id="msg">${mic ? 'Read it out loud!' : 'Read it out loud, then tap the button.'}</div><div id="lsSay"></div>
        <button class="btn ls-help" id="helpW">${SPK}Help: what’s this word?</button>${grid(ci + ':' + k, did, true)}`;
      $('helpW').onclick = () => { listenToken++; if (!helped.includes(w)) helped.push(w); playWord(w); };
      const r = await L_read({ minMs: 500 });
      did.add(ci + ':' + k); setMsg(r.heard ? 'I heard you!' : 'Great!', 'good'); await wait(350); done();
    }));
    stopMic();
    mark(part, sub, helped.length === 0, '', '', null, { text: `He read ${order.length} words out loud.${helped.length ? ` He asked for help with: ${helped.join(', ')}.` : ''}` }, helped.length ? helped.map(w => 'help: ' + w) : ['read them all']); L_free();
    partDone(helped.length ? `Read every word (help with ${helped.length}).` : 'Read every word all by himself!');
  };
  const down = [], across = [];
  cols.forEach((c, ci) => c.words.forEach((w, k) => down.push([ci, k])));
  for (let k = 0; k < n; k++) cols.forEach((c, ci) => { if (c.words[k]) across.push([ci, k]); });
  PARTS = [{ name: 'Read Down', run: reading(down, 'Read Down', 'Read each word out loud, going down each column.') }];
  if (d.across) PARTS.push({ name: 'Read Across', run: reading(across, 'Read Across', 'Now read each word again, going across each row.') });
  // Questions. "Where do you see ay in words?" comes in two steps (Nov 9, 2026: the ay column was in the middle of the grid, so he
  // answered "middle"): first find the ay column, then look at just its words with ay lit up, and say where ay is IN THE WORD.
  const norm = t => String(t || '').toLowerCase().replace(/[–—-]/g, '_').trim();
  const where = q => { const m = q.q.match(/where do you see\s+(\S+)\s+in/i); if (!m) return null; const ci = cols.findIndex(c => norm(c.label) === norm(m[1])); return ci < 0 || /_/.test(norm(m[1])) ? null : { ci, team: norm(m[1]) }; };
  const inWord = c => /^(middle|end|beginning|start)$/i.test(c) ? (/end/i.test(c) ? 'at the end of the word' : `${/beg|start/i.test(c) ? 'at the' : 'in the'} ${c.toLowerCase()} of the word`) : c;
  const lit = (w, team) => { const k = w.toLowerCase().lastIndexOf(team); return k < 0 ? L_esc(w) : L_esc(w.slice(0, k)) + `<mark class="ls-team">${L_esc(w.slice(k, k + team.length))}</mark>` + L_esc(w.slice(k + team.length)); };
  if (d.questions.length) PARTS.push({ name: 'Questions', run: async () => {
    const steps = d.questions.flatMap((q, qi) => { const wq = where(q); return wq ? [{ q, qi, wq, col: true }, { q, qi, wq }] : [{ q, qi }]; });
    await each(steps.length, i => new Promise(async done => {
      const { q, qi, wq, col } = steps[i], cnt = L_count(qi, d.questions.length, 'Question');
      if (wq && col) {
        const lab = cols[wq.ci].label, sq = () => say(`Find the ${wq.team.split('').join(' ')} column. Tap its name.`, 0.9);
        app.innerHTML = head(`First, find the <b>${L_esc(lab)}</b> column. Tap its name.`) + cnt + `<button class="btn" id="hearQ">${SPK}Hear it</button>` + grid(null, null, true) + '<div id="io"></div>';
        $('hearQ').onclick = sq; sq();
        const r = await L_choose(cols.map(c => c.label), lab, { row: true, hint: 'Look at the colored names at the top of each column.' });
        mark('Questions', `Find the ${lab} column`, r.ok, r.typed, lab, null, { text: `Find the ${lab} column.`, choices: cols.map(c => c.label) }, r.picks); return done();
      }
      if (wq) {
        const team = wq.team, words = cols[wq.ci].words, disp = q.choices.map(inWord), qq = `Look at the ${team} in each word. Where is ${team}: ${disp.join(', or ')}?`;
        const sq = () => say(`Look at the ${team.split('').join(' ')} in each word. Is it ${disp.join(', or ')}?`, 0.9);
        app.innerHTML = head(L_esc(qq)) + cnt + `<button class="btn" id="hearQ">${SPK}Hear the question</button><div class="ls-teamwords">${words.map(w => `<span>${lit(w, team)}</span>`).join('')}</div><div id="io"></div>`;
        $('hearQ').onclick = sq; sq();
        const r = await L_choose(disp, inWord(q.answer), { row: true, hint: `Look where the yellow ${team} is inside each word. Is it at the very end?` });
        const back = v => q.choices[disp.indexOf(v)] || v;
        mark('Questions', q.q, r.ok, back(r.typed), q.answer, null, { text: qq, choices: q.choices }, r.picks.map(back)); return done();
      }
      app.innerHTML = head(L_esc(q.q)) + cnt + `<button class="btn" id="hearQ">${SPK}Hear the question</button>` + grid(null, null, true) + '<div id="io"></div>';
      const sq = () => say(q.q + ' ' + q.choices.join(', or '), 0.9); $('hearQ').onclick = sq; sq();
      const r = await L_choose(q.choices, q.answer, { row: q.choices.length <= 3 });
      mark('Questions', q.q, r.ok, r.typed, q.answer, null, { text: q.q, choices: q.choices }, r.picks); done();
    }));
    partDone(firstTry('Questions') + '.');
  } });
  if (d.sort && cols.length >= 2) PARTS.push({ name: 'Sort the Words', run: async () => {
    const pool = L_shuf(cols.flatMap((c, ci) => c.words.map(w => [w, ci]))).slice(0, 12);
    await each(pool.length, i => new Promise(async done => {
      const [w, ci] = pool[i];
      app.innerHTML = L_exactTag() + head('Which spelling does this word use? Tap its box.') + L_count(i, pool.length, 'Word') + `<div class="big-word">${L_esc(w)}</div><button class="btn" id="hearW">${SPK}Hear it</button><div id="io"></div>`;
      $('hearW').onclick = () => playWord(w); playWord(w);
      const r = await L_choose(cols.map(c => c.label), cols[ci].label, { row: true, hint: 'Look at the letters that make the sound. Try again.' });
      mark('Sort the Words', w, r.ok, r.typed, cols[ci].label, null, { text: `Which spelling does “${w}” use?`, choices: cols.map(c => c.label) }, r.picks); done();
    }));
    partDone(firstTry('Sort the Words') + '.');
  } });
  return { intro: `Read the words like an investigator!` };
};

/* ---------- Story Time ---------- */
LT.story.run = () => {
  const d = SD, pat = L_pattern(d.pattern), run = Date.now().toString(36);
  const sents = (d.text.match(/[^.!?]+[.!?]+["”’']*\s*|[^.!?]+$/g) || [d.text]).map(s => s.trim()).filter(Boolean);
  let wi = 0; const words = []; // {t, s}
  const html = sents.map((s, si) => `<span class="s" data-s="${si}">${s.split(/\s+/).map(t => { words.push({ t, s: si }); return `<span class="w" data-w="${wi++}">${L_esc(t)}</span>`; }).join(' ')}</span>`).join(' ');
  const story = () => `<div class="ls-story" id="story"><div style="font:700 26px Fredoka,sans-serif;text-align:center;color:#1E3A5F;margin-bottom:6px">${L_esc(d.heading)}</div>${html}</div>`;
  const read = async () => {
    await L_mic(); const helped = [];
    await each(sents.length, i => new Promise(async done => {
      app.innerHTML = L_exactTag() + head('Read the story out loud, one sentence at a time. Tap a word if you need help.') + L_count(i, sents.length, 'Sentence') + `<div class="message" id="msg">${mic ? 'Read the yellow sentence out loud!' : 'Read the yellow sentence out loud, then tap the button.'}</div><div id="lsSay"></div>` + story();
      app.querySelectorAll('.s').forEach(s => { const k = +s.dataset.s; s.classList.toggle('now', k === i); s.classList.toggle('done', k < i); });
      const cur = app.querySelector('.s.now'); if (cur) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
      $('story').onclick = e => { const w = e.target.closest('[data-w]'); if (!w) return; const t = L_letters(w.textContent); if (!t) return; listenToken++; if (!helped.includes(t)) helped.push(t); playWord(t); };
      const nW = sents[i].split(/\s+/).length;
      const r = await L_read({ minMs: Math.min(6000, nW * 380) });
      mark('Read the Story', `Sentence ${i + 1}`, true, '', '', null, { text: sents[i], clips: L_keepClip('story', run, i, r.clip) }, [r.heard ? 'read it out loud (microphone heard him)' : 'tapped “I read it”']); L_free();
      setMsg('Great reading!', 'good'); await wait(400); done();
    }));
    stopMic();
    extra.storyHelp = helped;
    partDone(helped.length ? `Read the whole story (tapped for help: ${helped.join(', ')}).` : 'Read the whole story!');
  };
  const find = async () => {
    const targets = [...new Set(words.filter(w => pat.test(w.t)).map(w => L_letters(w.t)))], found = new Set(), wrong = new Set(); let dones = 0;
    app.innerHTML = L_exactTag() + head(`Find every word with <b>${L_esc(pat.label)}</b>. Tap them!`) + `<div class="count" id="fc"></div><div class="message" id="msg"></div>` + story() + `<button class="btn big primary" id="allFound">I found them all ✓</button>`;
    say(`Find every word with ${pat.label.replace('_', ' blank ')} and tap it.`, 0.95);
    const upd = () => { $('fc').textContent = `Found ${found.size} of ${targets.length}`; };
    upd();
    await new Promise(res => {
      $('story').onclick = e => {
        const el = e.target.closest('[data-w]'); if (!el) return; const t = L_letters(el.textContent); if (!t || found.has(t)) return;
        if (targets.includes(t)) { found.add(t); app.querySelectorAll('[data-w]').forEach(x => { if (L_letters(x.textContent) === t) x.classList.add('found'); }); setMsg(`Yes! “${t}” has ${pat.label}.`, 'good'); upd(); if (found.size === targets.length) { $('allFound').hidden = true; nextUp(1300).then(res); } }
        else { if (!wrong.has(t)) wrong.add(t); el.classList.add('no'); shakeEl(el); setTimeout(() => el.classList.remove('no'), 900); setMsg(`“${t}” doesn’t have ${pat.label}. Look again.`, 'try'); }
      };
      $('allFound').onclick = () => {
        if (found.size === targets.length) return res();
        dones++;
        if (dones === 1) { setMsg(`There ${targets.length - found.size === 1 ? 'is 1 more' : `are ${targets.length - found.size} more`}. Keep looking!`, 'try'); say('Keep looking!', 1); return; }
        app.querySelectorAll('[data-w]').forEach(x => { const t = L_letters(x.textContent); if (targets.includes(t) && !found.has(t)) x.classList.add('miss'); });
        setMsg('Here are the ones you missed, in orange.', 'try'); $('allFound').textContent = 'Next →'; $('allFound').onclick = res;
      };
    });
    targets.forEach(t => mark('Find the Words', t, found.has(t), found.has(t) ? t : '', t, null, { text: `A word with ${pat.label} in the story.` }, found.has(t) ? [t] : ['missed']));
    wrong.forEach(t => mark('Find the Words', `${t} (no ${pat.label})`, false, t, `not ${pat.label}`, null, { text: `He tapped “${t}”, which doesn’t have ${pat.label}.` }, [t]));
    partDone(`Found ${found.size} of ${targets.length}${wrong.size ? `, ${wrong.size} wrong tap${wrong.size > 1 ? 's' : ''}` : ''}.`);
  };
  const drawIt = async () => {
    app.innerHTML = L_exactTag() + head(`Draw the story “${L_esc(d.heading)}”.`) + '<div id="lsPad"></div>';
    say('Draw a picture of the story.', 0.95);
    const r = await L_drawPad();
    mark('Draw the Story', d.heading, true, '', '', null, { img: r.img, text: `His drawing of “${d.heading}”.` }, []); L_free();
    partDone('What a picture!');
  };
  PARTS = [{ name: 'Read the Story', run: read }];
  if (pat && words.some(w => pat.test(w.t))) PARTS.push({ name: 'Find the Words', run: find });
  if (d.draw) PARTS.push({ name: 'Draw the Story', run: drawIt });
  if (d.questions.length) PARTS.push({ name: 'Questions', run: async () => { L_ask.extra = () => story(); await L_ask(d.questions)(); L_ask.extra = null; } });
  return { intro: `${d.label ? d.label + ' · ' : ''}${d.heading}: read it, find the words, and draw it!` };
};

/* ---------- Word Chains (home practice) ---------- */
function L_change(a, b) {
  if (a.length === b.length) { const idx = [...a].map((c, i) => c !== b[i] ? i : -1).filter(i => i >= 0); if (idx.length === 1) { const i = idx[0]; return { text: `Change the ${a[i]} to ${b[i]}.`, speak: `Change the ${letterName(a[i])} to ${letterName(b[i])}.`, at: [i] }; } }
  if (b.startsWith(a)) { const x = b.slice(a.length); return { text: `Add ${x} at the end.`, speak: `Add ${[...x].map(letterName).join(' ')} at the end.`, at: [...x].map((_, k) => a.length + k) }; }
  if (b.endsWith(a)) { const x = b.slice(0, b.length - a.length); return { text: `Add ${x} at the start.`, speak: `Add ${[...x].map(letterName).join(' ')} at the start.`, at: [...x].map((_, k) => k) }; }
  for (let i = 0; i < b.length; i++) if (b.slice(0, i) + b.slice(i + 1) === a) return { text: `Add ${b[i]}.`, speak: `Add ${letterName(b[i])}.`, at: [i] };
  for (let i = 0; i < a.length; i++) if (a.slice(0, i) + a.slice(i + 1) === b) return { text: `Take away the ${a[i]}.`, speak: `Take away the ${letterName(a[i])}.`, at: [] };
  return { text: `Change ${a} to ${b}.`, speak: `Change ${a} to ${b}.`, at: [...b].map((c, i) => c !== a[i] ? i : -1).filter(i => i >= 0) };
}
/* Letters that can make the same sound (Word Chains help, Nov 9, 2026: "lake to cake… but there is already a k").
   [letter, also, sound name] */
const L_SAME = [['c', 'k', 'the /k/ sound'], ['k', 'c', 'the /k/ sound'], ['ck', 'k', 'the /k/ sound'], ['s', 'c', 'the /s/ sound'], ['c', 's', 'the /s/ sound'], ['j', 'g', 'the /j/ sound'], ['g', 'j', 'the /j/ sound'], ['f', 'ph', 'the /f/ sound'], ['z', 's', 'the /z/ sound'], ['s', 'z', 'the /z/ sound']];
const L_sameAs = (want, got) => L_SAME.find(([a, b]) => a === want && b === got);
// the sound a letter makes at position i of word (c and g are soft before e, i, y), and the other letters for that sound
function L_alike(word, i) {
  const ch = word[i], soft = /[eiy]/.test(word[i + 1] || '');
  const sound = ch === 'c' ? (soft ? 'the /s/ sound' : 'the /k/ sound') : ch === 'g' ? (soft ? 'the /j/ sound' : '') : ch === 's' ? 'the /s/ sound' : (L_SAME.find(x => x[0] === ch) || [])[2] || '';
  return { sound, alts: sound ? L_SAME.filter(([a, , snd]) => a === ch && snd === sound).map(x => x[1]) : [] };
}
// he typed a word that sounds right but uses a sound-alike letter (kake for cake): say so
function L_soundAlike(typed, answer) {
  const t = String(typed).toLowerCase().trim(), a = answer.toLowerCase();
  if (t.length !== a.length) return null;
  const diff = [...a].map((c, i) => c !== t[i] ? i : -1).filter(i => i >= 0);
  if (!diff.length || diff.length > 1) return null;
  const al = L_alike(a, diff[0]); if (!al.alts.includes(t[diff[0]])) return null;
  return { want: a[diff[0]], got: t[diff[0]], sound: al.sound };
}
const L_tiles = (w, at = []) => `<div class="ls-tiles">${[...w].map((c, i) => `<span class="t${at.includes(i) ? ' ch' : ''}">${L_esc(c)}</span>`).join('')}</div>`;
/* Word Chains "🆘 Help me" (Nov 9, 2026): 1) hear both words slowly and pick which sound changed (first / middle / last),
   2) pick the letter for the new sound out of 3 (a sound-alike letter gets "that makes the sound too, but…"), 3) the letter to change lights up.
   Uses #chHelp, #chBox, #prevT. Returns { used() } = the help steps he opened, for Parent Review. */
function L_chainHelp(prev, w) {
  const c = L_change(prev, w), used = []; let step = 0;
  const same = prev.length === w.length && c.at.length === 1, i = same ? c.at[0] : -1;
  const place = i === 0 ? 'first' : i === prev.length - 1 ? 'last' : 'middle';
  const btn = $('chHelp'), box = $('chBox');
  if (!btn || !box) return { used: () => used };
  if (!same) { btn.onclick = () => { used.push('showed the change'); box.innerHTML = `<div class="message try">${L_esc(c.text)}</div>`; say(c.speak, 0.9); }; return { used: () => used }; }
  const light = () => { const t = $('prevT'); if (t) t.innerHTML = L_tiles(prev, [i]); };
  btn.onclick = () => {
    step++;
    if (step === 1) {
      used.push('which sound changed');
      box.innerHTML = `<div class="ls-help-box"><b>Say both words slowly. Which sound is different?</b><div class="ls-choices row2" id="chPl">${['first', 'middle', 'last'].map(p => `<button data-p="${p}">${p} sound</button>`).join('')}</div><button class="btn" id="chAgain">${SPK}Hear both again</button></div>`;
      const both = () => say(`${prev}. ${w}. Which sound is different?`, 0.7); $('chAgain').onclick = both; both();
      $('chPl').onclick = e => { const b = e.target.closest('[data-p]'); if (!b || b.disabled) return;
        if (b.dataset.p === place) { b.classList.add('right'); $('chPl').querySelectorAll('button').forEach(x => x.disabled = true); light(); say(`Yes! The ${place} sound changes.`, 0.95); btn.textContent = '🆘 More help'; }
        else { b.classList.add('wrong'); b.disabled = true; say('Listen again.', 0.95); both(); } };
    } else if (step === 2) {
      used.push('which letter');
      light();
      const want = w[i], al = L_alike(w, i), alike = al.alts.filter(x => x.length === 1);
      const pool = [want, ...alike, ...'bdmnprt'.split('').filter(x => x !== want && x !== prev[i] && !alike.includes(x))].slice(0, 3);
      const opts = L_shuf(pool);
      box.innerHTML = `<div class="ls-help-box"><b>Which letter makes the new ${place} sound in “${L_esc(w)}”?</b><div class="ls-choices row2" id="chLt">${opts.map(x => `<button data-l="${x}">${x}</button>`).join('')}</div><div class="message" id="chMsg"></div></div>`;
      say(`Which letter makes the new ${place} sound in ${w}?`, 0.9);
      $('chLt').onclick = e => { const b = e.target.closest('[data-l]'); if (!b || b.disabled) return; const l = b.dataset.l, m = alike.includes(l) ? [want, l, al.sound] : null;
        say(l, 1);
        if (l === want) { b.classList.add('right'); $('chLt').querySelectorAll('button').forEach(x => x.disabled = true); const tip = alike.length ? ` ${al.sound[0].toUpperCase() + al.sound.slice(1)} can be spelled ${[want, ...alike].join(' or ')}. In ${w}, it’s ${want}.` : ''; $('chMsg').className = 'message good'; $('chMsg').textContent = `Yes! Change the ${prev[i]} to ${want}.${tip}`; say(`Yes! Change the ${letterName(prev[i])} to ${letterName(want)}.`, 0.9); btn.textContent = '🆘 Show me'; }
        else if (m) { b.classList.add('wrong'); b.disabled = true; $('chMsg').className = 'message try'; $('chMsg').textContent = `${l} makes that sound too! But ${w} is spelled with ${want}. ${m[2][0].toUpperCase() + m[2].slice(1)} can be spelled ${want} or ${l}.`; say(`${l} makes that sound too! But ${w} is spelled with ${letterName(want)}.`, 0.9); }
        else { b.classList.add('wrong'); b.disabled = true; $('chMsg').className = 'message try'; $('chMsg').textContent = 'Say the sound and listen. Try another letter.'; } };
    } else {
      used.push('showed the letter');
      light(); box.innerHTML = `<div class="message try">Change the <b>${L_esc(prev[i])}</b> to <b>${L_esc(w[i])}</b>.</div>`; say(`Change the ${letterName(prev[i])} to ${letterName(w[i])}.`, 0.9); btn.disabled = true;
    }
  };
  return { used: () => used };
}
LT.chains.run = () => {
  const d = SD, pat = L_pattern(d.concept), run = Date.now().toString(36);
  const sample = async () => {
    await L_mic(); const helped = [];
    await each(d.words.length, i => new Promise(async done => {
      const w = d.words[i];
      app.innerHTML = L_exactTag() + head(`New spelling: <b>${L_esc(d.concept)}</b>. Read each word out loud.`) + L_count(i, d.words.length, 'Word') + `<div class="big-word">${L_hlWord(w, pat)}</div><div class="message" id="msg"></div><div id="lsSay"></div><button class="btn ls-help" id="helpW">${SPK}Help: what’s this word?</button>`;
      $('helpW').onclick = () => { listenToken++; if (!helped.includes(w)) helped.push(w); playWord(w); };
      await L_read({ minMs: 500 }); setMsg('Great!', 'good'); await wait(350); done();
    }));
    stopMic();
    mark('Read the Words', d.words.join(', '), !helped.length, '', '', null, { text: `He read the new ${d.concept} words out loud.${helped.length ? ` Help with: ${helped.join(', ')}.` : ''}` }, helped.length ? helped.map(w => 'help: ' + w) : ['read them all']); L_free();
    partDone(helped.length ? `Read them all (help with ${helped.length}).` : 'Read them all by himself!');
  };
  const word = d.heart.map(p => p.t).join('');
  const heartTiles = () => `<div class="ls-tiles" style="margin-top:34px">${d.heart.map(p => `<span class="t">${L_esc(p.t)}${p.heart ? `<i class="hrt">${L_HEART(30)}</i>` : ''}</span>`).join('')}</div>`;
  const heartW = async () => {
    app.innerHTML = L_exactTag() + head(`A heart word: <b>${L_esc(word)}</b>. The parts with a ♥ you learn by heart.`) + heartTiles() + `<button class="btn" id="hearW">${SPK}Hear it</button><button class="btn big primary" id="cover">I know it: cover it 🙈</button>`;
    $('hearW').onclick = () => playWord(word); await playWord(word);
    await new Promise(r => { $('cover').onclick = r; });
    app.innerHTML = L_exactTag() + head(`Spell the heart word <b>${L_esc(word)}</b> from memory.`) + `<div class="hidden-word">The word is covered</div><button class="btn" id="hearW">${SPK}Hear it</button><div id="io"></div>`;
    $('hearW').onclick = () => playWord(word); playWord(word);
    const r = await freeType({ answer: word.toLowerCase() });
    mark('Heart Word', word, r.ok, r.typed, word, word, { text: 'He heard the heart word and spelled it from memory.' }, r.attempts);
    partDone(r.ok ? 'Spelled right the first time!' : 'Spelled it!');
  };
  const chainsP = async () => {
    const steps = []; d.chains.forEach((ch, ci) => ch.forEach((w, k) => steps.push({ ci, k, w, prev: k ? ch[k - 1] : null, ch })));
    await each(steps.length, i => new Promise(async done => {
      const s = steps[i], label = `Chain ${s.ci + 1}: ${s.ch.join(' → ')}`;
      if (s.k === 0 || s.k % 2 === 0) {   // spelling
        const sub = s.k === 0 ? `Make the word you hear.` : `Change ${L_esc(s.prev)} to the word you hear.`;
        app.innerHTML = L_exactTag() + head(sub) + `<div class="count">${L_esc(label.split(':')[0])} · step ${s.k + 1} of ${s.ch.length}</div>` + (s.prev ? `<div id="prevT">${L_tiles(s.prev)}</div>` : '') + `<div class="row" style="justify-content:center"><button class="btn" id="hearW">${SPK}Hear the word</button>${s.prev ? '<button class="btn" id="chHelp">🆘 Help me</button>' : ''}</div><div id="chBox"></div><div id="io"></div>`;
        const sp = () => say(s.k === 0 ? `Make the word ${s.w}.` : `Change ${s.prev} to ${s.w}.`, 0.85); $('hearW').onclick = sp; sp();
        const helps = s.prev ? L_chainHelp(s.prev, s.w) : null;
        const hint = t => { const m = L_soundAlike(t, s.w); return m ? `Good listening, ${t} sounds right! But ${s.w} is spelled with ${m.want}, not ${m.got}. ${m.sound[0].toUpperCase() + m.sound.slice(1)} can be spelled ${m.want} or ${m.got}.` : 'Not quite. Say it slowly and listen for each sound.'; };
        const r = await freeType({ answer: s.w, hint });
        const used = helps ? helps.used() : [];
        mark('Word Chains', `Spell “${s.w}”${s.prev ? ` (from ${s.prev})` : ''}`, r.ok && !used.length, r.typed, s.w, s.w, { text: (s.k === 0 ? `He heard “${s.w}” and spelled it.` : `He saw “${s.prev}”, heard “${s.w}”, and spelled it.`) + (used.length ? ` Help he used: ${used.join('; ')}.` : '') }, r.attempts);
      } else {   // reading
        const c = L_change(s.prev, s.w), same = [...new Set([...s.ch, ...d.chains.flat()])].filter(x => x !== s.w && x !== s.prev && Math.abs(x.length - s.w.length) <= 1), others = [s.prev, ...L_shuf(same)].slice(0, 2);
        const choices = L_shuf([s.w, ...others]);
        app.innerHTML = L_exactTag() + head(`${L_esc(c.text)} What word is this?`) + `<div class="count">${L_esc(label.split(':')[0])} · step ${s.k + 1} of ${s.ch.length}</div><div style="opacity:.55">${L_tiles(s.prev)}</div><div style="font-size:30px">⬇</div>${L_tiles(s.w, c.at)}<div id="io"></div>`;
        say(`${c.speak} What word is this?`, 0.9);
        const r = await L_choose(choices, s.w, { row: true, hint: 'Look at each letter and sound it out.' });
        mark('Word Chains', `Read “${s.w}” (${c.text})`, r.ok, r.typed, s.w, null, { text: `${c.text} What word is this?`, html: `<div style="font:700 40px Andika,sans-serif;background:#fff;color:#1F2937;border-radius:12px;padding:4px 16px;display:inline-block">${L_esc(s.w)}</div>`, choices }, r.picks);
      }
      done();
    }));
    partDone(firstTry('Word Chains') + '.');
  };
  const sentP = async () => {
    await L_mic();
    await each(d.sentences.length, i => new Promise(async done => {
      const sent = d.sentences[i], toks = sent.split(/\s+/);
      const targets = pat ? [...new Set(toks.filter(t => pat.test(t)).map(L_letters))] : [];
      app.innerHTML = L_exactTag() + head('Read the sentence out loud.') + L_count(i, d.sentences.length, 'Sentence') + `<div class="ls-story" id="story" style="text-align:center">${toks.map((t, k) => `<span class="w" data-w="${k}">${L_esc(t)}</span>`).join(' ')}</div><div class="message" id="msg"></div><div id="lsSay"></div>`;
      const r = await L_read({ minMs: Math.min(5000, toks.length * 380) });
      const clips = L_keepClip('chain', run, i, r.clip);
      if (!targets.length) { mark('Sentences', sent, true, '', '', null, { text: sent, clips }, ['read it']); L_free(); return done(); }
      $('lsSay').innerHTML = ''; setMsg(`Now tap the word${targets.length > 1 ? 's' : ''} with ${pat.label}.`); say(`Now tap the word${targets.length > 1 ? 's' : ''} with ${pat.label.replace('_', ' blank ')}.`, 0.95);
      const found = new Set(), picks = []; let wrongs = 0;
      await new Promise(res => {
        $('story').onclick = e => {
          const el = e.target.closest('[data-w]'); if (!el) return; const t = L_letters(el.textContent); if (!t || found.has(t)) return; picks.push(t);
          if (targets.includes(t)) { found.add(t); el.classList.add('found'); if (found.size === targets.length) { setMsg('Yes! You found them!', 'good'); say('Yes!', 1); nextUp(1200).then(res); } else setMsg('Yes! Is there another one?', 'good'); }
          else { wrongs++; el.classList.add('no'); shakeEl(el); setTimeout(() => el.classList.remove('no'), 900); setMsg(`“${t}” doesn’t have ${pat.label}. Look again.`, 'try'); }
        };
      });
      mark('Sentences', sent, wrongs === 0, picks.join(', '), targets.join(', '), null, { text: `He read “${sent}” out loud, then tapped the ${pat.label} word${targets.length > 1 ? 's' : ''}.`, clips }, picks);
      done();
    }));
    stopMic();
    partDone('Sentences done!');
  };
  PARTS = [];
  if (d.words.length) PARTS.push({ name: 'Read the Words', run: sample });
  if (word) PARTS.push({ name: 'Heart Word', run: heartW });
  if (d.chains.length) PARTS.push({ name: 'Word Chains', run: chainsP });
  if (d.sentences.length) PARTS.push({ name: 'Sentences', run: sentP });
  return { intro: `${d.lesson ? d.lesson + ': ' : ''}new words, a heart word, word chains and sentences.` };
};

/* ---------- Heart Word ---------- */
LT.heart.run = () => {
  const d = SD, w = d.word, parts = d.parts, run = Date.now().toString(36);
  const big = () => `<div class="ls-tiles" style="margin-top:36px">${parts.map(p => `<span class="t">${L_esc(p.t)}${p.heart ? `<i class="hrt">${L_HEART(32)}</i>` : ''}</span>`).join('')}</div>`;
  const mapP = async () => {
    app.innerHTML = L_exactTag() + head(`This is a heart word: <b>${L_esc(w)}</b>. The ♥ part you learn by heart.`) + big() + `<button class="btn" id="hearW">${SPK}Hear it</button><button class="btn big primary" id="go2">Map the word →</button>`;
    $('hearW').onclick = () => playWord(w); await playWord(w);
    await new Promise(r => { $('go2').onclick = r; });
    const L = [...w], ends = []; let acc = 0; parts.forEach((p, i) => { acc += p.t.length; if (i < parts.length - 1) ends.push(acc); });
    let on = new Set(), tries = 0; const picks = [];
    app.innerHTML = L_exactTag() + head(`Map the word: tap between the letters to split it into ${parts.length} sound box${parts.length > 1 ? 'es' : ''}.`) + `<button class="btn" id="hearW">${SPK}Hear it slowly</button><div class="ls-split" id="sp"></div><div class="count" id="bx"></div><div class="message" id="msg"></div><button class="btn big primary" id="chk">Check ✓</button>`;
    const slow = () => say(parts.map(p => p.t).join(' ... '), 0.6);
    $('hearW').onclick = () => { playWord(w).then(() => wait(300)).then(slow); };
    const draw = () => { $('sp').innerHTML = L.map((c, i) => `${i ? `<button class="g${on.has(i) ? ' on' : ''}" data-g="${i}" aria-label="Split before ${c}"></button>` : ''}<span class="l${i === 0 ? ' first' : ''}${i === L.length - 1 ? ' last' : ''}${on.has(i + 1) ? ' endb' : ''}">${L_esc(c)}</span>`).join(''); $('bx').textContent = `${on.size + 1} box${on.size ? 'es' : ''} now · it needs ${parts.length}`; };
    draw(); say(`Tap between the letters to split ${w} into ${parts.length} sounds.`, 0.95);
    $('sp').onclick = e => { const g = e.target.closest('[data-g]'); if (!g) return; const i = +g.dataset.g; on.has(i) ? on.delete(i) : on.add(i); draw(); };
    await new Promise(res => {
      $('chk').onclick = () => {
        const mine = [...on].sort((a, b) => a - b), pick = L.map((c, i) => (on.has(i) ? '|' : '') + c).join(''); picks.push(pick);
        if (mine.join() === ends.join()) { setMsg('Yes! Those are the sounds!', 'good'); say('Yes!', 1); $('chk').disabled = true; $('sp').onclick = null; nextUp(1200).then(res); return; }
        tries++; shakeEl($('sp'));
        if (tries >= 2) { on = new Set(ends); draw(); setMsg(`It’s ${parts.map(p => p.t).join(' | ')}. Look, then tap Check.`, 'try'); slow(); }
        else setMsg(mine.length + 1 !== parts.length ? `It needs ${parts.length} boxes. Say it slowly and try again.` : 'Not quite. Say it slowly. Where does each sound stop?', 'try');
      };
    });
    mark('Map the Word', w, tries === 0, picks[0], parts.map(p => p.t).join('|'), null, { text: `He split “${w}” into its sounds.` }, picks);
    const hearts = parts.map((p, i) => p.heart ? i : -1).filter(i => i >= 0);
    if (hearts.length && hearts.length < parts.length) {
      const sel = new Set(), hp = []; let t2 = 0;
      app.innerHTML = L_exactTag() + head(`Which part is the heart part, the part you have to learn by heart? Tap it.`) + `<div class="ls-tiles" id="hp">${parts.map((p, i) => `<button class="t" data-p="${i}">${L_esc(p.t)}</button>`).join('')}</div><div class="message" id="msg"></div>`;
      say('Which part is the heart part? Tap it.', 0.95);
      await new Promise(res => {
        $('hp').onclick = e => {
          const b = e.target.closest('[data-p]'); if (!b) return; const i = +b.dataset.p; if (sel.has(i)) return; hp.push(parts[i].t);
          if (hearts.includes(i)) { sel.add(i); b.classList.add('pick'); b.insertAdjacentHTML('beforeend', `<i class="hrt">${L_HEART(30)}</i>`); if (hearts.every(h => sel.has(h))) { setMsg('Yes! That’s the heart part.', 'good'); say('Yes!', 1); $('hp').onclick = null; nextUp(1200).then(res); } }
          else { t2++; shakeEl(b); setMsg(`“${parts[i].t}” sounds the way it looks. Which part is tricky?`, 'try'); }
        };
      });
      mark('Map the Word', `Heart part of ${w}`, t2 === 0, hp[0], hearts.map(i => parts[i].t).join(', '), null, { text: `Which part of “${w}” is the heart part?`, choices: parts.map(p => p.t) }, hp);
    }
    partDone(tries ? 'Mapped it!' : 'Mapped it right the first time!');
  };
  const write3 = async () => {
    for (let i = 0; i < 3; i++) {
      app.innerHTML = L_exactTag() + head(`Write the word <b>${L_esc(w)}</b> on the lines.`) + L_count(i, 3, 'Time') + `<div class="ls-model">${L_esc(w)}</div><div id="lsPad"></div>`;
      if (i === 0) playWord(w);
      const r = await L_pad({ text: w, guide: false });
      mark('Write It 3 Times', `${w} (${i + 1})`, true, '', '', null, { img: r.img, text: `Writing “${w}”, time ${i + 1} of 3.${L_padNote(r, false)}` }, []); L_free();
    }
    partDone('Written 3 times!');
  };
  const sentence = async () => {
    await L_mic();
    app.innerHTML = L_exactTag() + head(`Think of a sentence with the word <b>${L_esc(w)}</b>. Say it out loud first.`) + `<div class="ls-model">${L_esc(w)}</div><div class="message" id="msg"></div><div id="lsSay"></div>`;
    say(`Think of a sentence with the word ${w}. Say it out loud.`, 0.95);
    const r = await L_read({ minMs: 1500, label: 'I said my sentence 🗣️', nudge: 'I’m listening… say your sentence!' });
    stopMic();
    app.innerHTML = L_exactTag() + head(`Now write your sentence with <b>${L_esc(w)}</b>.`) + '<div id="lsPad"></div>';
    const p = await L_pad({ text: `${w} ${w} ${w} ${w}`, guide: false, fsMax: 70, H: 200, label: 'your whole sentence', check: false });
    mark('Write a Sentence', `A sentence with ${w}`, true, '', '', null, { img: p.img, text: `He said a sentence with “${w}” out loud, then wrote it.${L_padNote(p, false)}`, clips: L_keepClip('heart', run, 0, r.clip) }, [r.heard ? 'said it out loud, then wrote it' : 'wrote it']); L_free();
    partDone('Great sentence!');
  };
  const findP = async () => {
    const row = d.row, target = w.toLowerCase(), need = row.filter(x => x.toLowerCase() === target).length; let got = 0; const wrong = [];
    app.innerHTML = L_exactTag() + head(`Tap every <b>${L_esc(w)}</b>.`) + `<div class="count" id="fc">Found 0 of ${need}</div><div class="ls-row" id="row">${row.map((x, i) => `<button data-i="${i}">${L_esc(x)}</button>`).join('')}</div><div class="message" id="msg"></div>`;
    say(`Tap every ${w}.`, 0.95);
    await new Promise(res => {
      $('row').onclick = e => {
        const b = e.target.closest('[data-i]'); if (!b || b.classList.contains('found')) return; const x = row[+b.dataset.i];
        if (x.toLowerCase() === target) { b.classList.add('found'); got++; $('fc').textContent = `Found ${got} of ${need}`; if (got === need) { setMsg('You found them all!', 'good'); say('You found them all!', 1); $('row').onclick = null; nextUp(1300).then(res); } else setMsg('Yes!', 'good'); }
        else { wrong.push(x); b.classList.add('no'); shakeEl(b); setTimeout(() => b.classList.remove('no'), 900); setMsg(`That says “${x}”. Look at every letter.`, 'try'); say(x, 0.9); }
      };
    });
    mark('Find the Word', `Every “${w}” in the row`, wrong.length === 0, wrong[0] || target, target, null, { text: row.join(' ') }, wrong.length ? wrong : [target]);
    partDone(wrong.length ? `Found all ${need} (${wrong.length} wrong tap${wrong.length > 1 ? 's' : ''}).` : `Found all ${need}, no wrong taps!`);
  };
  PARTS = [{ name: 'Map the Word', run: mapP }, { name: 'Write It 3 Times', run: write3 }, { name: 'Write a Sentence', run: sentence }, { name: 'Find the Word', run: findP }];
  return { intro: `Learn the heart word “${w}”.` };
};

/* ---------- Handwriting ---------- */
LT.letter.run = () => {
  const d = SD, Lt = d.letter, nm = Lt === Lt.toUpperCase() ? 'uppercase' : 'lowercase';
  const doPad = async (part, sub, text, guide, n = 1, extraTop = '') => {
    for (let i = 0; i < n; i++) {
      if (stepSkip()) continue;   // done before a reload
      app.innerHTML = L_exactTag() + head(sub) + (n > 1 ? L_count(i, n, 'Time') : '') + extraTop + '<div id="lsPad"></div>';
      const r = await L_pad({ text, guide, fsMax: text.length <= 1 ? 190 : 150, H: text.length <= 1 ? 250 : 230 });
      mark(part, `${text}${n > 1 ? ` (${i + 1})` : ''}`, r.redo === 0, '', '', null, { img: r.img, text: `${guide ? 'Tracing' : 'Writing'} “${text}”${/[.!?]$/.test(text) ? '' : '.'}${L_padNote(r, guide)}${r.caseFlags ? ` The capital-letter check asked about ${r.caseFlags.join(', ')}, and he kept it.` : ''}` }, []); L_free(); stepDone();
    }
  };
  const P = [
    { name: 'Trace the Letter', run: async () => { say(`Trace the ${nm} letter ${Lt}.`, 0.95); await doPad('Trace the Letter', `Trace the ${nm} letter <b>${L_esc(Lt)}</b>.`, Lt, true, 3); partDone('Letter traced 3 times!'); } },
    { name: 'Write the Letter', run: async () => { say(`Now write the ${nm} letter ${Lt} by yourself.`, 0.95); await doPad('Write the Letter', `Write the ${nm} letter <b>${L_esc(Lt)}</b> by yourself.`, Lt, false, 3, `<div class="ls-model">${L_esc(Lt)}</div>`); partDone('Letter written 3 times!'); } }
  ];
  if (d.words.length) {
    P.push({ name: 'Trace the Words', run: async () => { for (const w of d.words) { playWord(w); await doPad('Trace the Words', `Trace the word <b>${L_esc(w)}</b>.`, w, true); } partDone('Words traced!'); } });
    P.push({ name: 'Write the Words', run: async () => { for (const w of d.words) { playWord(w); await doPad('Write the Words', `Write the word <b>${L_esc(w)}</b>.`, w, false, 1, `<div class="ls-model">${L_esc(w)}</div>`); } partDone('Words written!'); } });
  }
  if (d.trace) P.push({ name: 'Trace the Sentence', run: async () => { say(d.trace, 0.85); await doPad('Trace the Sentence', 'Trace the sentence.', d.trace, true); partDone('Sentence traced!'); } });
  if (d.copy) P.push({ name: 'Copy the Sentence', run: async () => { say(d.copy, 0.85); await doPad('Copy the Sentence', 'Copy the sentence.', d.copy, false, 1, `<div class="ls-model" style="font-size:clamp(24px,4vw,40px)">${L_esc(d.copy)}</div>`); partDone('Sentence copied!'); } });
  PARTS = P;
  return { intro: `Handwriting: the ${nm} letter ${Lt}. Use your finger or your pencil.` };
};

/* ---------- Spelling Sort ---------- */
/* The word he just spelled becomes a yellow bubble: he drags it onto a column of #sortChart (or taps the bubble, then a column).
   A wrong column shakes and the bubble goes back. Resolves the headings he tried, in order. */
function L_placeBubble(word, heads, right, hint) { return L_dragTo(word, '#sortChart .c', right, hint, { names: heads }); }
/* Generic: a yellow bubble with `word` he drags onto one of the elements matching `sel` (each has data-h = its index; SVG shapes work too),
   or taps the bubble, then a target. Right = the data-h that's right. Needs #io on the screen. Resolves the names he tried, in order. */
function L_dragTo(word, sel, right, hint, { names = null, prompt = null, sayIt = true, html = null } = {}) {
  return new Promise(res => {
    const picks = [], io = $('io'), nm = h => names ? names[h] : String(h);
    io.innerHTML = `<div class="message" id="msg">${prompt || `Now put “${L_esc(word)}” where it goes. Drag the bubble, or tap it and then tap where it goes.`}</div><div class="ls-bub-home"><span class="ls-bubble" id="bub">${html || L_esc(word)}</span></div>`;
    if (sayIt) say(`Now put ${word} where it goes.`, 0.95);
    const bub = $('bub'), targetAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest(sel); };
    let sel2 = false, drag = null, over = null, live = true;
    const setOver = c => { if (over) over.classList.remove('over'); over = c; if (c) c.classList.add('over'); };
    const back = () => { bub.classList.remove('drag', 'sel'); bub.style.left = bub.style.top = ''; sel2 = false; setOver(null); };
    const drop = c => {
      if (!live || !c) return back();
      const hi = +c.dataset.h; picks.push(nm(hi)); back();
      if (hi === right) { live = false; c.classList.add('good'); bub.remove(); document.removeEventListener('click', onT, true); setMsg(picks.length === 1 ? 'Yes! It goes there!' : 'You got it!', 'good'); say('Yes!', 1); return setTimeout(() => res(picks), 500); }
      shakeEl(c); setMsg(`Not that one. ${hint}`, 'try'); say('Not that one.', 0.95);
    };
    bub.onpointerdown = e => {
      if (!live) return; e.preventDefault(); const r = bub.getBoundingClientRect();
      drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, moved: false };
      try { bub.setPointerCapture(e.pointerId); } catch (er) { }
    };
    bub.onpointermove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 8) return;
      drag.moved = true; bub.classList.add('drag'); bub.style.left = (e.clientX - drag.dx) + 'px'; bub.style.top = (e.clientY - drag.dy) + 'px';
      setOver(targetAt(e.clientX, e.clientY));
    };
    bub.onpointerup = bub.onpointercancel = e => {
      if (!drag || e.pointerId !== drag.id) return; const d = drag; drag = null;
      if (d.moved) return drop(targetAt(e.clientX, e.clientY));
      sel2 = !sel2; bub.classList.toggle('sel', sel2); if (sel2) setMsg('Now tap where it goes.');
    };
    const onT = e => { if (!sel2 || !live) return; const c = e.target.closest && e.target.closest(sel); if (c) { e.stopPropagation(); drop(c); } };
    document.addEventListener('click', onT, true);
  });
}
LT.sort.run = () => {
  const d = SD, H = d.heads, run = Date.now().toString(36);
  const chart = filled => `<div class="ls-grid small" id="sortChart" style="margin-top:12px">${H.map((h, hi) => `<div class="c" data-h="${hi}"><b style="background:${L_COL[hi % 8]}">${L_esc(h)}</b>${d.words.filter(x => x.h === hi).map(x => `<span>${filled.has(x.w) ? L_esc(x.w) : '&nbsp;'}</span>`).join('')}</div>`).join('')}</div>`;
  const ending = x => H[x.h].replace(/^[-–—]\s*/, '');
  const sortP = async () => {
    const pool = L_shuf(d.words);
    await each(pool.length, i => new Promise(async done => {
      const x = pool[i];
      app.innerHTML = L_exactTag() + head('Which heading does this word go under? Look at how it ends.') + L_count(i, pool.length, 'Word') + `<div class="big-word">${L_esc(x.w)}</div><button class="btn" id="hearW">${SPK}Hear it</button><div id="io"></div>`;
      $('hearW').onclick = () => playWord(x.w); playWord(x.w);
      const r = await L_choose(H, H[x.h], { row: true, hint: 'Look at the last letters of the word. Try again.' });
      mark('Sort the Words', x.w, r.ok, r.typed, H[x.h], null, { text: `Which heading does “${x.w}” go under?`, choices: H }, r.picks); done();
    }));
    partDone(firstTry('Sort the Words') + '.');
  };
  const spellP = async () => {
    const pool = L_shuf(d.words), filled = new Set();
    await each(pool.length, i => new Promise(async done => {
      const x = pool[i];
      app.innerHTML = L_exactTag() + head(d.spell ? 'Listen to the word, then spell it. It goes in the chart!' : 'Put each spelling word in the chart, under the right heading.') + L_count(i, pool.length, 'Word') + (d.spell ? `<div class="hidden-word">Listen 👂</div>` : '') + `<button class="btn" id="hearW">${SPK}Hear the word</button><div id="io"></div>` + chart(filled);
      $('hearW').onclick = () => playWord(x.w); playWord(x.w);
      if (d.spell) {
        const r = await freeType({ answer: x.w, hint: t => { const m = L_soundAlike(t, x.w); return m ? `Good listening, ${t} sounds right! But it’s spelled with ${m.want}.` : 'Not quite. Say it slowly and listen to the end of the word. Try again.'; } });
        mark(PN, `Spell “${x.w}”`, r.ok, r.typed, x.w, x.w, { text: `He heard “${x.w}” and spelled it.` }, r.attempts);
      }
      const picks = await L_placeBubble(x.w, H, x.h, `Look at how ${x.w} ends: ${ending(x)}.`);
      filled.add(x.w); app.querySelector('#sortChart').outerHTML = chart(filled);
      mark(PN, `Put “${x.w}” in its column`, picks.length === 1, picks[0], H[x.h], null, { text: d.spell ? `He spelled “${x.w}”, then put it under a heading.` : `He put “${x.w}” under a heading.`, choices: H }, picks);
      await wait(700); done();
    }));
    app.innerHTML = L_exactTag() + head('Your chart is done!') + chart(new Set(d.words.map(x => x.w)));
    await wait(1500);
    partDone(firstTry(PN) + '.');
  };
  const PN = d.spell ? 'Write the Chart' : 'Glue the Chart';
  // Word Hunt (the (C) sheet): tap every word in the paragraph that ends like one of the headings
  const huntP = async () => {
    const toks = d.hunt.split(/\s+/).filter(Boolean), ends = H.map(h => h.replace(/^[-–—]\s*/, '').toLowerCase());
    const hit = t => { const w = L_letters(t); return ends.some(e => w.length > e.length && w.endsWith(e)); };
    const targets = toks.map((t, k) => hit(t) ? k : -1).filter(k => k >= 0);
    const found = new Set(), wrong = []; let checks = 0;
    app.innerHTML = L_exactTag() + head(`Word hunt! Tap every word that ends with ${H.join(', ')}.`) + `<div class="ls-story" id="hunt" style="text-align:left">${toks.map((t, k) => `<span class="w" data-k="${k}">${L_esc(t)}</span>`).join(' ')}</div><div class="message" id="msg"></div><div class="row acts"><button class="btn big primary" id="huntDone">I found them all ✓</button></div>`;
    say(`Word hunt! Tap every word that ends with ${ends.map(e => e.split('').join(' ')).join(', or ')}.`, 0.92);
    await new Promise(res => {
      $('hunt').onclick = e => { const el = e.target.closest('[data-k]'); if (!el) return; const k = +el.dataset.k;
        if (targets.includes(k)) { if (found.has(k)) return; found.add(k); el.classList.add('found'); say(L_letters(toks[k]), 1); }
        else { if (!wrong.includes(toks[k])) wrong.push(L_letters(toks[k])); el.classList.add('nope'); shakeEl(el); setTimeout(() => el.classList.remove('nope'), 700); setMsg(`${L_letters(toks[k])} doesn’t end with ${H.join(', ')}. Look at the last letters.`, 'try'); } };
      $('huntDone').onclick = () => {
        const left = targets.filter(k => !found.has(k)); checks++;
        if (!left.length) { setMsg('You found them all!', 'good'); say('You found them all!', 1); return nextUp(1200).then(res); }
        if (checks < 2) { setMsg(`${left.length} more to find! Read each word to the very end.`, 'try'); say(`${left.length} more to find!`, 1); return; }
        left.forEach(k => app.querySelector(`[data-k="${k}"]`).classList.add('missed')); setMsg(`These were hiding: ${left.map(k => L_letters(toks[k])).join(', ')}.`, 'try'); $('huntDone').textContent = 'Next →'; $('huntDone').onclick = res;
      };
    });
    const missed = targets.filter(k => !found.has(k)).map(k => L_letters(toks[k]));
    mark('Word Hunt', `Words that end with ${H.join(', ')}`, !missed.length && !wrong.length, `${found.size} of ${targets.length}`, targets.map(k => L_letters(toks[k])).join(', '), null, { text: `He found ${found.size} of ${targets.length}.${missed.length ? ` Missed: ${missed.join(', ')}.` : ''}${wrong.length ? ` Wrong taps: ${wrong.join(', ')}.` : ''}` }, [...[...found].map(k => L_letters(toks[k])), ...wrong.map(w => '✗ ' + w)]);
    partDone(missed.length ? `Found ${found.size} of ${targets.length}.` : `Found all ${targets.length}!`);
  };
  const sayP = async () => {
    const picked = await new Promise(res => {
      const on = new Set();
      app.innerHTML = L_exactTag() + head('Pick 3 spelling words. You’ll say a sentence with each one.') + `<div class="ls-pick" id="pk">${d.words.map(x => `<button data-w="${L_esc(x.w)}">${L_esc(x.w)}</button>`).join('')}</div><div class="row acts"><button class="btn big primary" id="pkGo" disabled>Start →</button></div>`;
      say('Pick 3 spelling words.', 0.95);
      $('pk').onclick = e => { const b = e.target.closest('[data-w]'); if (!b) return; const w = b.dataset.w; if (on.has(w)) on.delete(w); else if (on.size < 3) on.add(w); $('pk').querySelectorAll('[data-w]').forEach(x => x.classList.toggle('on', on.has(x.dataset.w))); $('pkGo').disabled = on.size !== 3; };
      $('pkGo').onclick = () => res([...on]);
    });
    await L_mic();
    await each(picked.length, i => new Promise(async done => {
      const w = picked[i];
      app.innerHTML = L_exactTag() + head(`Think of a sentence with <b>${L_esc(w)}</b>. Say it out loud.`) + L_count(i, picked.length, 'Sentence') + `<div class="ls-model">${L_esc(w)}</div><div class="message" id="msg"></div><div id="lsSay"></div>`;
      say(`Say a sentence with the word ${w}.`, 0.95);
      const r = await L_read({ minMs: 1500, label: 'I said my sentence 🗣️', nudge: 'I’m listening… say your sentence!' });
      mark('Say Sentences', `A sentence with “${w}”`, true, '', '', null, { text: `He said a sentence with “${w}” out loud.`, clips: L_keepClip('sort', run, i, r.clip) }, [r.heard ? 'said it out loud' : 'tapped the button']); L_free();
      setMsg('Great sentence!', 'good'); await wait(600); done();
    }));
    stopMic();
    partDone('Three great sentences!');
  };
  PARTS = [];
  if (d.hunt) PARTS.push({ name: 'Word Hunt', run: huntP });
  PARTS.push({ name: 'Sort the Words', run: sortP });
  if (d.spell || d.glue) PARTS.push({ name: PN, run: spellP });   // spell it, then drag it into its column (Nov 9: "put the word into a little draggable bubble")
  if (d.say) PARTS.push({ name: 'Say Sentences', run: sayP });
  return { intro: 'Sort your spelling words!' };
};

/* ---------- Read Story for Class Recording (Nov 9, 2026) ----------
   Just the story, big, for reading out loud while his school website records him. The page never talks or records here.
   It can show his Story Time drawing of the same story (from this device's results, or the Study database). */
async function L_findDrawing(heading) {
  const h = String(heading || '').trim().toLowerCase();
  const pick = recs => { for (const r of recs) { if (!r || r.tool !== 'story') continue; const it = (r.items || []).find(x => x.part === 'Draw the Story' && x.shown && x.shown.img && (!h || String(x.label || '').trim().toLowerCase() === h)); if (it) return it.shown.img; } return null; };
  let img = pick((store('sheet-log') || []).slice().sort((a, b) => b.t - a.t));
  if (img) return img;
  try { const sb = sbClient(); if (!sb) return null; const { data } = await sb.from('study_log').select('data').eq('kind', 'sheet').order('t', { ascending: false }).limit(80); img = pick((data || []).map(r => r.data)); } catch (e) { }
  return img;
}
LT.readaloud.run = () => {
  const d = SD, sents = (d.text.match(/[^.!?]+[.!?]+["”’']*\s*|[^.!?]+$/g) || [d.text]).map(s => s.trim()).filter(Boolean);
  const readP = async () => {
    const pic = d.pic ? await L_findDrawing(d.heading) : null;
    let i = 0;
    await new Promise(res => {
      const draw = () => {
        app.innerHTML = L_exactTag() + head('Read the story out loud for your class recording. Take your time!')
          + `<div class="ra-wrap">${pic ? `<img class="ra-pic" src="${pic}" alt="His drawing of the story">` : ''}<div class="ra-page"><div class="ra-title">${L_esc(d.heading)}</div><div class="ra-text">${sents.map((s, k) => `<span class="ra-s${d.follow ? (k === i ? ' now' : k < i ? ' done' : '') : ''}">${L_esc(s)}</span>`).join(' ')}</div></div></div>`
          + `<div class="row acts">${d.follow ? `<button class="btn big" id="raBack" ${i ? '' : 'disabled'}>← Back</button><button class="btn big primary" id="raNext">${i < sents.length - 1 ? 'Next sentence →' : 'I read it all ✓'}</button>` : '<button class="btn big primary" id="raNext">I read it all ✓</button>'}</div>`;
        const now = app.querySelector('.ra-s.now'); if (now) now.scrollIntoView({ block: 'center', behavior: 'smooth' });
        $('raNext').onclick = () => { if (d.follow && i < sents.length - 1) { i++; draw(); } else res(); };
        if ($('raBack')) $('raBack').onclick = () => { if (i) { i--; draw(); } };
      };
      draw();
    });
    mark('Read Aloud', d.heading || 'Story', true, '', '', null, { text: `He read “${d.heading}” out loud for his class recording (his school website recorded it).` }, ['read it']); L_free();
    partDone('Great reading!');
  };
  PARTS = [{ name: 'Read Aloud', run: readP }];
  return { intro: `Get ready to read “${d.heading}” for your class. When you’re ready, start your school recording, then tap Let’s go.` };
};

/* ---------- Fix My Spelling Mistakes (Nov 10, 2026): hear it, trace it, spell it ---------- */
if (L_IN_DO) { (() => { const st = document.createElement('style'); st.textContent = `
  .fx-was { font:600 22px Fredoka,sans-serif; color:#FCA5A5; margin:4px 0 2px; } .fx-was s { color:#F87171; text-decoration-thickness:3px; }
  .fx-tiles .t { transition:background .15s, box-shadow .15s; } .fx-tiles .t.now { background:#FEF08A; box-shadow:inset 0 0 0 4px #F59E0B; }
  .fx-tiles button.t { cursor:pointer; touch-action:manipulation; }
`; document.head.appendChild(st); })(); }
LT.fixit.run = () => {
  const d = SD, W = d.words;
  const tiles = w => `<div class="ls-tiles fx-tiles" id="fxT">${[...w].map((ch, i) => isLetter(ch) ? `<button class="t" data-i="${i}" aria-label="${L_esc(letterName(ch))}">${L_esc(ch)}</button>` : `<span class="t" style="border-color:transparent;background:transparent"></span>`).join('')}</div>`;
  let spellGen = 0;
  const spellOut = async w => {   // the word, each letter lighting up as it's said, then the word again
    const my = ++spellGen, el = () => [...document.querySelectorAll('#fxT .t')];
    await Promise.race([playWord(w), wait(2500)]); if (my !== spellGen) return;
    for (const [i, ch] of [...w].entries()) {
      if (!isLetter(ch)) continue; if (my !== spellGen) return;
      el().forEach(x => x.classList.toggle('now', +x.dataset.i === i));
      const nm = letterName(ch); await Promise.race([say(nm, 0.85), wait(550 + 110 * nm.length)]); await wait(150);
    }
    if (my !== spellGen) return; el().forEach(x => x.classList.remove('now'));
    await Promise.race([playWord(w), wait(2500)]);
  };
  const hearP = async () => {
    await each(W.length, i => new Promise(async done => {
      const x = W[i];
      app.innerHTML = head('Listen to how it’s spelled. Tap a letter to hear it again.') + L_count(i, W.length, 'Word')
        + (x.his ? `<div class="fx-was">Earlier you wrote <s>${L_esc(x.his)}</s>. It’s spelled:</div>` : '')
        + tiles(x.w) + `<div class="message" id="msg"></div><div class="row acts"><button class="btn big" id="fxAgain">${SPK}Hear it again</button><button class="btn big primary" id="fxNext" disabled>I heard it →</button></div>`;
      $('fxT').onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; spellGen++; document.querySelectorAll('#fxT .t').forEach(t => t.classList.toggle('now', t === b)); say(letterName(x.w[+b.dataset.i]), 0.85); };
      $('fxAgain').onclick = () => spellOut(x.w);
      await spellOut(x.w); $('fxNext').disabled = false;
      $('fxNext').onclick = () => { spellGen++; mark('Hear It', `Hear “${x.w}” spelled`, true, '', '', null, { text: `He heard “${x.w}” spelled out loud${x.his ? ` (earlier he wrote “${x.his}”)` : ''}.` }, ['heard it']); L_free(); done(); };
    }));
    partDone('You heard every word!');
  };
  const traceP = async () => {
    const n = d.trace || 2;
    for (let i = 0; i < W.length; i++) for (let k = 0; k < n; k++) {
      if (stepSkip()) continue;   // done before a reload
      const w = W[i].w;
      app.innerHTML = head(`Trace the word <b>${L_esc(w)}</b>. Say each letter as you trace it.`) + L_count(i, W.length, 'Word') + (n > 1 ? L_count(k, n, 'Time') : '') + '<div id="lsPad"></div>';
      playWord(w);
      const r = await L_pad({ text: w, guide: true });
      mark('Trace It', `${w}${n > 1 ? ` (${k + 1})` : ''}`, r.redo === 0, '', '', null, { img: r.img, text: `Tracing “${w}”.${L_padNote(r, true)}` }, []); L_free(); stepDone();
    }
    partDone('All traced!');
  };
  const spellP = async () => {
    const pool = L_shuf(W);
    await each(pool.length, i => new Promise(async done => {
      const x = pool[i];
      app.innerHTML = head('Now you spell it! Listen to the word, then type it.') + L_count(i, pool.length, 'Word') + `<div class="hidden-word">Listen 👂</div><button class="btn" id="hearW">${SPK}Hear the word</button><div id="io"></div>`;
      $('hearW').onclick = () => playWord(x.w); playWord(x.w);
      const r = await freeType({ answer: x.w, hint: t => { const m = typeof L_soundAlike === 'function' && L_soundAlike(t, x.w); return m ? `Good listening, ${t} sounds right! But it’s spelled with ${m.want}.` : 'Not quite. Think about how you heard it spelled. Try again.'; } });
      mark('Spell It', `Spell “${x.w}”`, r.ok, r.typed, x.w, x.w, { text: `He heard “${x.w}” and spelled it${x.his ? ` (earlier he wrote “${x.his}”)` : ''}.` }, r.attempts);
      done();
    }));
    partDone(firstTry('Spell It') + '.');
  };
  PARTS = [{ name: 'Hear It', run: hearP }, { name: 'Trace It', run: traceP }, { name: 'Spell It', run: spellP }];
  return { intro: `Extra help! Let’s fix ${W.length === 1 ? 'a word' : `${W.length} words`} from earlier. First you’ll hear ${W.length === 1 ? 'it' : 'each one'} spelled, then trace ${W.length === 1 ? 'it' : 'them'}, then spell ${W.length === 1 ? 'it' : 'them'} by yourself.` };
};
