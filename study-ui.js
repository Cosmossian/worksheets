/* The Study: shared bits for every page (Nov 20, 2026, Dylan's Study revamp).
   Loaded by index.html, spell.html, do.html, fixup.html and chores.html, right after listen.js.

   1. ↻ Reload on every page (Dylan: "He's doing this as a bookmark to the page in guided access mode, so he cannot simply reload it…
      when updates come through I don't have to rebookmark it"). A hard refresh: every file the page uses is fetched again past the
      browser's cache, then the page opens again with a fresh address (?_r=…, tidied away after it loads). Pages that already have a
      #reloadBtn (do.html, fixup.html) use that one; every other page gets a button in the top bar.
   2. Buttons, not links: anything with data-href is a button that goes to that page.
   3. Every tap, in order (Dylan: "I want to see literally what he picked and when he picked it. (ie first second third fourth…)").
      TAPS keeps each tap on a button, key, word or picture with the time, the part and the question he was on, and whether it turned
      green or red. Taps the page ignored while it was talking (listen.js) are kept too, marked "page was talking". Pages put
      TAPS.take() on the result they save; Parent Review shows it under "🕒 Every tap, in order".
   4. Styles for the hold-to-talk button (speakNow in do.html / spell.html) and the Parent Review tap list. */
(function () {
  /* ---------- 1. Hard reload ---------- */
  const tidy = () => {   // take ?_r= back out of the address so it doesn't pile up (or end up in a bookmark)
    try { const u = new URL(location.href); if (u.searchParams.has('_r')) { u.searchParams.delete('_r'); history.replaceState(history.state, '', u.pathname + (u.search || '') + u.hash); } } catch (e) { }
  };
  tidy();
  window.hardReload = async function () {
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { }
    document.body && document.body.classList.add('reloading');
    const urls = new Set([location.href.split('#')[0]]);
    document.querySelectorAll('script[src], link[rel="stylesheet"][href], link[rel="manifest"][href]').forEach(el => {
      try { const u = new URL(el.getAttribute('src') || el.getAttribute('href'), location.href); if (u.origin === location.origin) urls.add(u.href); } catch (e) { }
    });
    const fetched = Promise.all([...urls].map(u => fetch(u, { cache: 'reload', credentials: 'same-origin' }).catch(() => null)));
    await Promise.race([fetched, new Promise(r => setTimeout(r, 4000))]);   // never wait forever (slow internet)
    try { if (window.caches) { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } } catch (e) { }
    const u = new URL(location.href); u.searchParams.set('_r', Date.now().toString(36));
    location.replace(u.href);
  };
  const EMBED = new URLSearchParams(location.search).get('embed') === '1' && window.parent !== window;
  const PAGE = location.pathname.split('/').pop() || 'index.html';
  function addReload() {
    if (EMBED || document.getElementById('studyTools')) return;
    const tools = document.createElement('div'); tools.id = 'studyTools'; tools.setAttribute('data-free', '');
    if (PAGE !== 'index.html') {   // the grown-up-only Worksheets page doesn't need it
      const g = document.createElement('button'); g.type = 'button'; g.id = 'bugBtn'; g.innerHTML = '🐞 Something wrong?'; g.title = 'Send this screen to your grown-up';
      g.onclick = () => window.openBugReport && window.openBugReport();
      tools.appendChild(g);
    }
    const own = document.getElementById('reloadBtn');
    if (own) { own.hidden = false; own.onclick = e => { e.preventDefault(); window.hardReload(); }; own.setAttribute('data-free', ''); }
    else {
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'studyReload'; b.title = 'Load the newest version of this page';
      b.innerHTML = '↻ Reload';
      b.onclick = () => window.hardReload();
      tools.appendChild(b);
    }
    if (!tools.children.length) return;
    document.body.appendChild(tools);
    const pad = () => { const n = document.getElementById('tod-nav'); if (n) n.style.paddingRight = (tools.offsetWidth + 24) + 'px'; };
    pad(); setTimeout(pad, 300); window.addEventListener('load', pad);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addReload); else addReload();   // after the page's own header exists
  // do.html shows its own Reload later (after the worksheet loads): make sure it's always the hard kind
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('#reloadBtn'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); window.hardReload(); }, true);

  /* ---------- 2. Buttons that open a page ---------- */
  document.addEventListener('click', e => {
    if (e.defaultPrevented) return;
    const b = e.target.closest && e.target.closest('[data-href]'); if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    e.preventDefault();
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (x) { }
    location.href = b.getAttribute('data-href');
  });

  /* ---------- 3. Every tap, in order ---------- */
  const PICK = 'button, a, [data-w], [data-k], [data-n], [data-c], [data-v], [role="button"], .cell, .key, .dot, .lbox, .pill, input[type="checkbox"], input[type="radio"], label';
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  function labelOf(el) {
    let t = clean(el.getAttribute('aria-label')) || clean(el.innerText !== undefined ? el.innerText : el.textContent);
    if (!t) { const im = el.querySelector && el.querySelector('img[alt]'); t = im ? clean(im.alt) : clean(el.title); }
    if (!t) { const svgT = el.querySelector && el.querySelector('title'); t = svgT ? clean(svgT.textContent) : ''; }
    if (!t && el.dataset) { const v = Object.entries(el.dataset).find(([k, v]) => v && !/^(lf|free)/.test(k)); t = v ? clean(v[1]) : ''; }
    return (t || '(a picture)').slice(0, 70);
  }
  function ctxNow() {
    try { if (typeof TAPS.ctx === 'function') { const c = TAPS.ctx(); if (c) return c; } } catch (e) { }
    const h = document.querySelector('#app .part-title h2, main:not([hidden]) .part-title h2');
    const n = document.querySelector('#app .count, main:not([hidden]) .count');
    return { p: h ? clean(h.textContent).replace(/^\d+\.\s*/, '').slice(0, 50) : '', q: n ? clean(n.textContent).slice(0, 40) : '' };
  }
  const TAPS = window.TAPS = {
    list: [], max: 600, on: true,
    start(prev) { this.list = Array.isArray(prev) ? prev.slice(-this.max) : []; },
    take() { return this.list.slice(-this.max); },
    add(what, extra) { if (!this.on) return null; const c = ctxNow(); const r = { t: Date.now(), w: String(what).slice(0, 90), p: c.p || '', q: c.q || '', ...(extra || {}) }; this.list.push(r); if (this.list.length > this.max * 1.2) this.list = this.list.slice(-this.max); return r; },
    ctx: null
  };
  const okOf = el => {
    const c = ' ' + (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '') + ' ';
    if (/ (right|good|found|correct|yes) /.test(c)) return 1;
    if (/ (wrong|no|bad|nope|tried|miss|shake) /.test(c)) return 0;
    return null;
  };
  document.addEventListener('click', e => {
    if (!e.isTrusted) return;
    const el = e.target.closest && e.target.closest(PICK); if (!el) return;
    if (el.closest('#studyTools, #bugWrap, #reloadBtn, .ht-btn, .replay, #replay, .rp-top, #tod-nav')) return;
    const kpick = el.closest('.key'); const isKey = !!kpick || el.classList.contains('kpick');
    let what = labelOf(el);
    if (el.classList.contains('ksnd')) what = '🔊 heard the letter ' + (kpick && kpick.dataset.k ? kpick.dataset.k : what);
    else if (isKey && kpick && kpick.dataset.k) what = '⌨️ ' + kpick.dataset.k;
    const r = TAPS.add(what);
    if (!r) return;
    const before = okOf(el);
    setTimeout(() => { if (!el.isConnected) return; const after = okOf(el); if (after !== null && after !== before) r.ok = after; }, 450);
  }, true);
  /* listen.js calls this for taps it ignored while the page was talking */
  let lastBlocked = 0;
  window.__tapBlocked = e => {
    const now = Date.now(); if (now - lastBlocked < 250) return; lastBlocked = now;
    const el = e.target && e.target.closest && e.target.closest(PICK); if (!el) return;
    TAPS.add(labelOf(el), { blocked: 1 });
  };


  /* ---------- 5. 🐞 Something's wrong? (Nov 20, 2026) ----------
     Dylan: "a button on each page of the study for the child… I want it to show me what he sees like an interactable page. If a sound
     is wrong, I want to be able to see that on my side. If it messes up, I want to see that… send his current page and what's wrong
     to me. Under the parent review… 'BUG REPORTED' for each assignment so I can see and go listen."
     Tapping 🐞 copies his screen right away (the page as it looks, with drawings as pictures, no scripts), the last things the page
     said or played (text + recordings), his last taps, any page errors, the worksheet and his place in it. He picks what's wrong
     (big buttons, read out loud), can hold 🎤 to say it, and sends it. Saved in the Study database: study_log `bug:<id>` (small, kind
     'bug', shown in Parent Review) + `bugsnap:<id>` (the screen copy, kind 'bugsnap', only loaded when a grown-up opens it).
     Not sent yet → localStorage study-bug-outbox, tried again on every Study page. Never locked by listen.js (data-free). */
  const SOUNDS = [], ERRS = [];
  const keepSound = o => { SOUNDS.push({ t: Date.now(), ...o }); if (SOUNDS.length > 20) SOUNDS.shift(); };
  try {
    if ('speechSynthesis' in window) { const ss = speechSynthesis, sp = ss.speak.bind(ss); ss.speak = u => { try { if (!(bugOpen && u.__bug)) keepSound({ say: String(u.text || '').slice(0, 300), rate: u.rate || 1 }); } catch (e) { } return sp(u); }; }
    const P = HTMLMediaElement.prototype, pl = P.play;
    P.play = function () { try { const src = this.currentSrc || this.src || ''; keepSound({ src: src.startsWith('data:') ? (src.length < 400000 ? src : '') : src, rec: src.startsWith('data:') }); } catch (e) { } return pl.apply(this, arguments); };
  } catch (e) { }
  window.addEventListener('error', e => { ERRS.push({ t: Date.now(), m: String(e.message || e.error || '').slice(0, 300), at: `${(e.filename || '').split('/').pop()}:${e.lineno || ''}` }); if (ERRS.length > 10) ERRS.shift(); });
  window.addEventListener('unhandledrejection', e => { ERRS.push({ t: Date.now(), m: String((e.reason && (e.reason.message || e.reason)) || '').slice(0, 300), at: 'promise' }); if (ERRS.length > 10) ERRS.shift(); });
  let bugOpen = false;
  const sbGet = () => {
    try { if (typeof sbClient === 'function') { const c = sbClient(); if (c) return c; } } catch (e) { }
    try { if (typeof cloud !== 'undefined' && cloud.sb) return cloud.sb; } catch (e) { }
    try { if (window.__bugSb) return window.__bugSb; if (window.supabase && typeof SB_URL !== 'undefined') return (window.__bugSb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { storageKey: 'study-auth', persistSession: true, autoRefreshToken: false } })); } catch (e) { }
    return null;
  };
  function screenCopy() {
    document.querySelectorAll('input, textarea, select').forEach(el => { try { if (el.type === 'checkbox' || el.type === 'radio') el.toggleAttribute('checked', el.checked); else if (el.tagName === 'TEXTAREA') el.textContent = el.value; else if (el.tagName !== 'SELECT') el.setAttribute('value', el.value); } catch (e) { } });
    const live = [...document.querySelectorAll('canvas')], pics = live.map(c => { try { return c.width * c.height ? c.toDataURL('image/png') : ''; } catch (e) { return ''; } });
    const root = document.documentElement.cloneNode(true);
    root.querySelectorAll('script, iframe, noscript, #bugWrap, #listenNote, #studyTools').forEach(n => n.remove());
    [...root.querySelectorAll('canvas')].forEach((c, i) => { const im = document.createElement('img'); im.src = pics[i] || ''; im.className = c.className; const r = live[i] && live[i].getBoundingClientRect(); im.setAttribute('style', (c.getAttribute('style') || '') + (r ? `;width:${Math.round(r.width)}px;height:${Math.round(r.height)}px` : '')); c.replaceWith(im); });
    const b = root.querySelector('body'); if (b) b.classList.remove('listening', 'reloading');
    root.querySelectorAll('[on]').forEach(n => n.removeAttribute('on'));
    root.querySelectorAll('*').forEach(n => [...n.attributes].forEach(a => { if (/^on/i.test(a.name)) n.removeAttribute(a.name); }));
    const head = root.querySelector('head'); if (head) { const base = document.createElement('base'); base.href = location.href; head.prepend(base); }
    return '<!DOCTYPE html>' + root.outerHTML;
  }
  function placeInfo() {
    const out = { page: location.pathname.split('/').pop() || 'index.html', url: location.pathname.split('/').pop() + location.search, title: document.title };
    try { if (typeof A !== 'undefined' && A) { out.aid = A.id; out.atitle = A.title; out.tool = A.tool; out.A = JSON.parse(JSON.stringify(A)); } } catch (e) { }
    try { if (typeof PARTS !== 'undefined' && typeof partIdx !== 'undefined' && typeof A !== 'undefined' && A && typeof RESUMABLE === 'function' && RESUMABLE(A)) out.prog = { partIdx, step: typeof stepNo !== 'undefined' ? stepNo : 0, seed: typeof progSeed !== 'undefined' ? progSeed : null, items: typeof items !== 'undefined' ? items : [], partSum: typeof partSum !== 'undefined' ? partSum : [], extra: typeof extra !== 'undefined' ? extra : {} }; } catch (e) { }
    try { const q = new URLSearchParams(location.search); if (!out.aid && q.get('cid')) { out.aid = q.get('cid'); out.atitle = q.get('from') || 'Spelling Fix-Up'; out.tool = 'fixup'; } } catch (e) { }
    try { const c = ctxNow(); out.part = c.p || ''; out.q = c.q || ''; } catch (e) { }
    if (!out.atitle) out.atitle = out.part || document.title;
    return out;
  }
  const WHAT = [['sound', '🔊', 'A sound is wrong'], ['stuck', '😕', 'It’s stuck or broken'], ['right', '❌', 'It said I was wrong, but I was right'], ['other', '❓', 'Something else']];
  function bugSay(t) { try { const u = new SpeechSynthesisUtterance(t); u.rate = 0.95; u.__bug = true; speechSynthesis.speak(u); } catch (e) { } }
  async function openBug() {
    if (bugOpen) return;
    let html = '', info = {}, sounds = SOUNDS.slice(), taps = [];
    try { html = screenCopy(); } catch (e) { html = ''; }
    try { info = placeInfo(); } catch (e) { }
    try { taps = TAPS.take().slice(-40); } catch (e) { }
    const shot = { html, sounds, taps, errors: ERRS.slice(), vw: innerWidth, vh: innerHeight, sy: Math.round(scrollY), ua: navigator.userAgent, ...info };
    try { speechSynthesis.cancel(); } catch (e) { }
    document.querySelectorAll('audio, video').forEach(a => { try { a.pause(); } catch (e) { } });
    bugOpen = true;
    const w = document.createElement('div'); w.id = 'bugWrap'; w.setAttribute('data-free', ''); w.setAttribute('role', 'dialog');
    w.innerHTML = `<div class="bug-box"><h3>🐞 Tell your grown-up what’s wrong</h3>
      <div class="bug-picks">${WHAT.map(([k, ic, t]) => `<button type="button" data-bug="${k}"><span>${ic}</span>${t}</button>`).join('')}</div>
      <div class="bug-rec"><button type="button" class="bug-hold">🎤 Hold and tell me <small>(you can skip this)</small></button><div class="bug-recnote"></div></div>
      <div class="bug-acts"><button type="button" class="bug-cancel">✕ Never mind</button><button type="button" class="bug-send" disabled>📨 Send it</button></div></div>`;
    document.body.appendChild(w);
    bugSay('Something wrong? Tap what happened, then send it to your grown-up.');
    let what = '', voice = null, mr = null, chunks = [], stream = null, t0 = 0;
    const close = () => { bugOpen = false; try { speechSynthesis.cancel(); } catch (e) { } try { stream && stream.getTracks().forEach(t => t.stop()); } catch (e) { } w.remove(); };
    w.querySelector('.bug-cancel').onclick = close;
    w.querySelector('.bug-picks').onclick = e => { const b = e.target.closest('[data-bug]'); if (!b) return; what = b.dataset.bug; w.querySelectorAll('[data-bug]').forEach(x => x.classList.toggle('on', x === b)); w.querySelector('.bug-send').disabled = false; try { speechSynthesis.cancel(); } catch (x) { } bugSay(b.textContent.replace(/^\S+/, '')); };
    const hold = w.querySelector('.bug-hold'), note = w.querySelector('.bug-recnote');
    const stopRec = () => { if (!mr) return; const m = mr; mr = null; hold.classList.remove('on'); hold.innerHTML = '🎤 Hold and tell me again'; const ms = Date.now() - t0;
      m.onstop = () => { const blob = new Blob(chunks, { type: m.mimeType || 'audio/webm' }); if (ms < 500 || !blob.size) { note.textContent = 'Hold the button the whole time you talk.'; return; } const fr = new FileReader(); fr.onload = () => { voice = fr.result; note.textContent = `✓ Got it (${(ms / 1000).toFixed(1)} s)`; }; fr.readAsDataURL(blob); };
      try { m.stop(); } catch (e) { } };
    hold.addEventListener('pointerdown', async e => {
      e.preventDefault(); if (mr) return;
      try { speechSynthesis.cancel(); } catch (x) { }
      try { if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (x) { note.textContent = 'The microphone isn’t working, but you can still send it.'; return; }
      try { chunks = []; mr = new MediaRecorder(stream, { audioBitsPerSecond: 24000 }); mr.ondataavailable = ev => ev.data && ev.data.size && chunks.push(ev.data); mr.start(); t0 = Date.now(); hold.classList.add('on'); hold.innerHTML = '🔴 Talking… let go when done'; note.textContent = ''; setTimeout(() => { if (mr && Date.now() - t0 >= 29000) stopRec(); }, 30000); } catch (x) { mr = null; }
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => hold.addEventListener(ev, stopRec));
    hold.addEventListener('contextmenu', e => e.preventDefault());
    w.querySelector('.bug-send').onclick = async () => {
      if (mr) stopRec(); await new Promise(r => setTimeout(r, 300));
      const id = Date.now().toString(36), t = Date.now(), lab = (WHAT.find(x => x[0] === what) || WHAT[3])[2];
      let testing = false; try { testing = sessionStorage.getItem('study-testday') === '1' || new URLSearchParams(location.search).get('try') === '1'; } catch (e) { }
      const sum = { id, t, what, label: lab, aid: shot.aid || '', title: shot.atitle || '', tool: shot.tool || '', page: shot.page, part: shot.part || '', q: shot.q || '', lastSaid: (sounds.filter(x => x.say).at(-1) || {}).say || '', voice: !!voice, testing, who: (() => { try { return localStorage.getItem('study-role') || ''; } catch (e) { return ''; } })() };
      const snap = { ...shot, id, voice };
      const box = w.querySelector('.bug-box'); box.innerHTML = '<h3>📨 Sending…</h3>';
      const ok = await sendBug(sum, snap);
      try { const L = JSON.parse(localStorage.getItem('study-bugs') || '[]'); L.push(sum); localStorage.setItem('study-bugs', JSON.stringify(L.slice(-30))); } catch (e) { }
      box.innerHTML = `<div class="bug-done">✓</div><h3>${ok ? 'Sent! Your grown-up will look at it.' : 'Saved! It will send when the internet is back.'}</h3><p>Thank you for telling me.</p><button type="button" class="bug-send">OK 👍</button>`;
      bugSay(ok ? 'Sent! Thank you for telling me. Your grown-up will look at it.' : 'Saved! Thank you for telling me.');
      box.querySelector('.bug-send').onclick = close; setTimeout(() => { if (w.isConnected) close(); }, 6000);
    };
  }
  async function putBug(sum, snap) {
    const sb = sbGet(); if (!sb) return false;
    try {
      const { data } = await sb.auth.getSession(); if (!data || !data.session) return false;
      const iso = new Date(sum.t).toISOString();
      const r1 = await sb.from('study_log').upsert({ key: 'bugsnap:' + sum.id, kind: 'bugsnap', t: iso, data: snap }); if (r1.error) throw r1.error;
      const r2 = await sb.from('study_log').upsert({ key: 'bug:' + sum.id, kind: 'bug', t: iso, data: sum }); if (r2.error) throw r2.error;
      return true;
    } catch (e) { console.warn('bug report', e); return false; }
  }
  async function sendBug(sum, snap) {
    if (await putBug(sum, snap)) return true;
    const box = (() => { try { return JSON.parse(localStorage.getItem('study-bug-outbox') || '[]'); } catch (e) { return []; } })();
    box.push({ sum, snap });
    for (const keep of [box.slice(-5), box.slice(-5).map(x => ({ sum: x.sum, snap: { ...x.snap, html: '' } })), box.slice(-5).map(x => ({ sum: x.sum, snap: { id: x.snap.id, sounds: x.snap.sounds, taps: x.snap.taps, errors: x.snap.errors } }))]) {
      try { localStorage.setItem('study-bug-outbox', JSON.stringify(keep)); break; } catch (e) { }
    }
    return false;
  }
  window.__bugRetry = async () => {
    let box; try { box = JSON.parse(localStorage.getItem('study-bug-outbox') || '[]'); } catch (e) { return; }
    if (!box.length) return;
    const left = [];
    for (const x of box) if (!(await putBug(x.sum, x.snap))) left.push(x);
    try { localStorage.setItem('study-bug-outbox', JSON.stringify(left)); } catch (e) { }
  };
  setTimeout(() => window.__bugRetry(), 5000);
  window.addEventListener('online', () => window.__bugRetry());
  window.openBugReport = openBug;

  /* ---------- 6. ⏱️ Stuck for 5 minutes → Skip + automatic bug report (Nov 20, 2026) ----------
     Dylan: "a skip button to appear if he's been on the same page for 5 minutes with nothing being accomplished. So if it's stuck…
     I want to get a 'BUG REPORT' so I can see it exactly as it is and see what wasn't working… That way he doesn't have to bother me."
     Pages say when he's mid-work (window.STUCK_ON) and how to skip (window.STUCK_SKIP). "Something accomplished" = the screen moved on
     (part, question number, step, answers saved, letters filled, a green answer) or he drew on a pad. Taps alone don't count. Time only
     counts while the page is on screen (an iPad asleep doesn't add up). At 5 minutes: a bug report is sent by itself (his screen exactly
     as it is, the sounds, taps, errors; label "Stuck for 5 minutes") and a big ⏭ Skip button shows. Tapping it skips the part and adds
     "he skipped it" to the report. If he gets going again, the button goes away. */
  const STUCK_MS = (() => { try { return +sessionStorage.getItem('study-stuck-ms') || 5 * 60 * 1000; } catch (e) { return 5 * 60 * 1000; } })();   // sessionStorage study-stuck-ms only for testing
  let stuckSig = '', stuckFor = 0, stuckLast = Date.now(), stuckBug = null, drew = 0;
  document.addEventListener('pointermove', e => { if (e.buttons && e.target && e.target.tagName === 'CANVAS') drew = Date.now(); }, true);
  function sigNow() {
    const q = sel => { const el = document.querySelector(sel); return el ? el.textContent.trim().slice(0, 60) : ''; };
    let x = location.search + '|' + q('#app .part-title h2, main:not([hidden]) .part-title h2') + '|' + q('#app .count, main:not([hidden]) .count') + '|' + q('#app .big-word');
    try { if (typeof partIdx !== 'undefined') x += '|p' + partIdx; } catch (e) { }
    try { if (typeof stepNo !== 'undefined') x += '|s' + stepNo; } catch (e) { }
    try { if (typeof items !== 'undefined' && items) x += '|i' + items.length; } catch (e) { }
    try { if (typeof daily !== 'undefined' && daily) x += `|d${daily.phase}${daily.i}.${(daily.results || []).length}.${daily.wi || 0}`; } catch (e) { }
    try { x += '|' + [...document.querySelectorAll('.lbox')].map(b => b.textContent.trim()).join(''); } catch (e) { }
    try { x += '|ok' + TAPS.list.filter(r => r.ok === 1).length; } catch (e) { }
    return x;
  }
  function hideSkip() { const b = document.getElementById('stuckSkip'); if (b) b.remove(); }
  async function stuckFire() {
    let info = {}, html = ''; try { html = screenCopy(); } catch (e) { } try { info = placeInfo(); } catch (e) { }
    const id = Date.now().toString(36), t = Date.now();
    let testing = false; try { testing = sessionStorage.getItem('study-testday') === '1' || new URLSearchParams(location.search).get('try') === '1'; } catch (e) { }
    const sounds = SOUNDS.slice();
    stuckBug = { id, t, what: 'stuck', label: '⏱️ Stuck for 5 minutes (sent by itself)', auto: true, aid: info.aid || '', title: info.atitle || '', tool: info.tool || '', page: info.page, part: info.part || '', q: info.q || '', lastSaid: (sounds.filter(x => x.say).at(-1) || {}).say || '', voice: false, testing, who: (() => { try { return localStorage.getItem('study-role') || ''; } catch (e) { return ''; } })() };
    const snap = { html, sounds, taps: (() => { try { return TAPS.take().slice(-40); } catch (e) { return []; } })(), errors: ERRS.slice(), vw: innerWidth, vh: innerHeight, sy: Math.round(scrollY), ua: navigator.userAgent, ...info, id, voice: null };
    try { const L = JSON.parse(localStorage.getItem('study-bugs') || '[]'); L.push(stuckBug); localStorage.setItem('study-bugs', JSON.stringify(L.slice(-30))); } catch (e) { }
    const b = document.createElement('button'); b.type = 'button'; b.id = 'stuckSkip'; b.setAttribute('data-free', '');
    b.innerHTML = '⏭ Stuck? Skip this part<small>Your grown-up will see what happened</small>';
    b.onclick = async () => {
      b.disabled = true; b.innerHTML = '⏭ Skipping…';
      try { TAPS.add('⏭ Skipped this part (stuck 5 minutes)'); } catch (e) { }
      if (stuckBug) { stuckBug.skipped = true; stuckBug.skippedAt = Date.now(); try { const L = JSON.parse(localStorage.getItem('study-bugs') || '[]').map(x => x.id === stuckBug.id ? stuckBug : x); localStorage.setItem('study-bugs', JSON.stringify(L)); } catch (e) { } putBugSum(stuckBug); }
      hideSkip(); stuckFor = 0; stuckSig = '';
      try { window.STUCK_SKIP && window.STUCK_SKIP(); } catch (e) { console.warn(e); }
    };
    document.body.appendChild(b);
    sendBug(stuckBug, snap);
  }
  async function putBugSum(sum) {   // update just the summary (he skipped)
    const sb = sbGet(); if (!sb) return;
    try { await sb.from('study_log').upsert({ key: 'bug:' + sum.id, kind: 'bug', t: new Date(sum.t).toISOString(), data: sum }); } catch (e) { }
  }
  setInterval(() => {
    const now = Date.now(), dt = now - stuckLast; stuckLast = now;
    let on = false; try { on = typeof window.STUCK_ON === 'function' && !!window.STUCK_ON(); } catch (e) { }
    if (!on || document.hidden || bugOpen) { if (!on) { stuckFor = 0; stuckSig = ''; hideSkip(); } return; }
    const sig = sigNow();
    if (sig !== stuckSig || now - drew < 5000) { stuckSig = sig; stuckFor = 0; if (document.getElementById('stuckSkip')) { hideSkip(); stuckBug = null; } return; }
    if (dt < 15000) stuckFor += dt;   // a long gap = the iPad was asleep
    if (stuckFor >= STUCK_MS && !document.getElementById('stuckSkip')) stuckFire();
  }, 2000);

  /* ---------- 4. Styles ---------- */
  const css = document.createElement('style');
  css.textContent = `
    #studyTools { position:absolute; top:6px; right:10px; z-index:45; display:flex; gap:8px; }
    #bugBtn { font:700 15px Fredoka, Figtree, system-ui, sans-serif; color:#fff; background:#B91C1C; border:2px solid #17201A; border-radius:999px; padding:6px 12px; min-height:36px; cursor:pointer; box-shadow:0 2px 0 #17201A; }
    body.listening #studyTools button, body.listening #bugWrap button { opacity:1 !important; }
    #bugBtn:active { transform:translateY(2px); box-shadow:none; }
    #stuckSkip { position:fixed; left:50%; bottom:18px; transform:translateX(-50%); z-index:9000; display:flex; flex-direction:column; align-items:center; gap:2px;
      font:700 24px Fredoka, sans-serif; color:#17201A; background:#FACC15; border:3px solid #17201A; border-radius:20px; padding:12px 26px; cursor:pointer; box-shadow:0 5px 0 #17201A; animation:stuckin .4s ease-out; }
    #stuckSkip small { font:600 14px Fredoka, sans-serif; } #stuckSkip:active { transform:translateX(-50%) translateY(3px); box-shadow:0 2px 0 #17201A; }
    @keyframes stuckin { from { transform:translateX(-50%) translateY(120%); } }
    #bugWrap { position:fixed; inset:0; z-index:99990; background:rgba(5,10,16,.78); display:flex; align-items:center; justify-content:center; padding:16px; }
    #bugWrap .bug-box { background:#16202B; color:#E5ECF4; border:3px solid #F87171; border-radius:24px; padding:18px 20px; width:min(620px, 100%); max-height:94vh; overflow:auto; text-align:center; font-family:Fredoka, system-ui, sans-serif; }
    #bugWrap h3 { margin:2px 0 12px; font:700 26px Fredoka, sans-serif; }
    #bugWrap .bug-picks { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    #bugWrap .bug-picks button { display:flex; flex-direction:column; align-items:center; gap:4px; font:700 19px Fredoka, sans-serif; color:#E5ECF4; background:#1C2836; border:3px solid #2B3A4D; border-radius:18px; padding:14px 8px; cursor:pointer; }
    #bugWrap .bug-picks button span { font-size:36px; line-height:1; }
    #bugWrap .bug-picks button.on { border-color:#FACC15; background:#33270C; }
    #bugWrap .bug-rec { margin:14px 0 6px; }
    #bugWrap .bug-hold { font:700 19px Fredoka, sans-serif; color:#fff; background:#3A1717; border:3px solid #F87171; border-radius:18px; padding:12px 18px; cursor:pointer; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; touch-action:none; }
    #bugWrap .bug-hold.on { background:#B91C1C; } #bugWrap .bug-hold small { font-size:13px; opacity:.8; }
    #bugWrap .bug-recnote { min-height:1.3em; color:#34D399; font-weight:700; margin-top:6px; }
    #bugWrap .bug-acts { display:flex; justify-content:space-between; gap:12px; margin-top:12px; }
    #bugWrap .bug-acts button, #bugWrap .bug-send { font:700 20px Fredoka, sans-serif; border-radius:16px; padding:12px 20px; cursor:pointer; border:2px solid #2B3A4D; background:#1C2836; color:#E5ECF4; }
    #bugWrap .bug-send { background:#3C7DD9; border-color:#3C7DD9; color:#fff; } #bugWrap .bug-send:disabled { opacity:.45; cursor:default; }
    #bugWrap .bug-done { font-size:64px; color:#34D399; line-height:1; }
    @media (max-width: 520px) { #bugBtn { font-size:13px; padding:5px 9px; } #studyReload { font-size:13px; padding:5px 10px; } }
    #studyReload { font:700 15px Fredoka, Figtree, system-ui, sans-serif; color:#17201A; background:#F5B400;
      border:2px solid #17201A; border-radius:999px; padding:6px 14px; min-height:36px; cursor:pointer; box-shadow:0 2px 0 #17201A; }
    #studyReload:active { transform:translateY(2px); box-shadow:none; }
    body.reloading::after { content:'↻ Getting the newest version…'; position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center;
      background:rgba(14,21,29,.86); color:#FDE68A; font:700 28px Fredoka, system-ui, sans-serif; }
    /* hold to talk */
    .hold-talk { display:flex; flex-direction:column; align-items:center; gap:10px; margin:8px auto; min-height:150px; justify-content:center; }
    .ht-btn { position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; width:min(320px, 82vw); min-height:132px;
      border-radius:28px; border:4px solid #F87171; background:#3A1717; color:#fff; cursor:pointer; font:700 26px Fredoka, sans-serif;
      -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; touch-action:none; box-shadow:0 6px 0 #7F1D1D; transition:transform .08s, box-shadow .08s, background .15s; }
    .ht-btn .ht-mic { font-size:48px; line-height:1; pointer-events:none; }
    .ht-btn .ht-lbl { pointer-events:none; }
    .ht-btn .ht-ring { position:absolute; left:0; bottom:0; height:12px; width:100%; background:rgba(255,255,255,.12); pointer-events:none; }
    .ht-btn .ht-ring i { display:block; height:100%; width:0; background:#FBBF24; }
    .ht-btn.on { background:#B91C1C; transform:translateY(5px); box-shadow:0 1px 0 #7F1D1D; animation:htglow 1.1s ease-in-out infinite; }
    .ht-btn.on.long .ht-ring i { background:#34D399; }
    .ht-btn.wait { opacity:.55; }
    @keyframes htglow { 0%,100% { box-shadow:0 1px 0 #7F1D1D, 0 0 0 0 rgba(248,113,113,.6); } 50% { box-shadow:0 1px 0 #7F1D1D, 0 0 0 14px rgba(248,113,113,0); } }
    .ht-btn.shake { animation:htshake .4s; } @keyframes htshake { 25% { transform:translateX(-8px); } 75% { transform:translateX(8px); } }
    .hold-talk .meter { width:min(320px, 82vw); }
    .hold-talk .talk-note { min-height:1.3em; font:700 19px Fredoka, sans-serif; text-align:center; color:var(--muted, #9AABBF); }
    .hold-talk .talk-note.good { color:var(--good, #34D399); } .hold-talk .talk-note.try { color:var(--try, #FBBF24); }
    /* Parent Review: every tap */
    .tap-list { display:flex; flex-direction:column; gap:2px; margin-top:6px; font-size:14px; }
    .tap-list .tp-h { margin-top:8px; font:700 14px Fredoka, sans-serif; color:var(--navy, #8DB8F2); }
    .tap-list .tp { display:grid; grid-template-columns:44px 92px 54px 1fr; gap:6px; align-items:baseline; padding:3px 6px; border-radius:8px; background:var(--surface-2, #1C2836); }
    .tap-list .tp .n { font:700 13px Fredoka, sans-serif; color:#FDE68A; } .tap-list .tp .tm, .tap-list .tp .gap { color:var(--muted, #9AABBF); font-variant-numeric:tabular-nums; }
    .tap-list .tp.ok .w::after { content:' ✓'; color:var(--good, #34D399); font-weight:700; } .tap-list .tp.no .w::after { content:' ✗'; color:var(--bad, #F87171); font-weight:700; }
    .tap-list .tp.blk { opacity:.7; } .tap-list .tp.blk .w::after { content:' (ignored: the page was still talking)'; color:var(--try, #FBBF24); font-size:12px; }
    .tap-list .tp.fast .gap { color:var(--try, #FBBF24); font-weight:700; }
    .tap-list .tp q { color:var(--muted, #9AABBF); font-size:12px; quotes:none; margin-left:4px; }
  `;
  (document.head || document.documentElement).appendChild(css);
})();
