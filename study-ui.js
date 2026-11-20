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
  function addReload() {
    if (EMBED || document.getElementById('studyReload')) return;
    const own = document.getElementById('reloadBtn');
    if (own) { own.hidden = false; own.onclick = e => { e.preventDefault(); window.hardReload(); }; own.setAttribute('data-free', ''); return; }
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'studyReload'; b.setAttribute('data-free', ''); b.title = 'Load the newest version of this page';
    b.innerHTML = '↻ Reload';
    b.onclick = () => window.hardReload();
    document.body.appendChild(b); document.body.classList.add('has-reload');
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
    if (el.closest('#studyReload, #reloadBtn, .ht-btn, .replay, #replay, .rp-top, #tod-nav')) return;
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

  /* ---------- 4. Styles ---------- */
  const css = document.createElement('style');
  css.textContent = `
    #studyReload { position:absolute; top:6px; right:10px; z-index:45; font:700 15px Fredoka, Figtree, system-ui, sans-serif; color:#17201A; background:#F5B400;
      border:2px solid #17201A; border-radius:999px; padding:6px 14px; min-height:36px; cursor:pointer; box-shadow:0 2px 0 #17201A; }
    #studyReload:active { transform:translateY(2px); box-shadow:none; }
    body.has-reload #tod-nav { padding-right:118px !important; }
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
