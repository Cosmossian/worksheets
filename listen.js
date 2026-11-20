/* Listen first (Nov 18, 2026, Dylan: "a hot fix that doesn't allow him to tap through and skip the audio so he actually listens to it…
   make the audio play and everything is clickable afterwards. I am tired of him rushing. Across the entire worksheets site.")
   Loaded by do.html, fixup.html and spell.html (spell.html only locks on his login, not for a grown-up).
   While the page is talking (computer voice or a recording), taps, presses and typing are ignored, buttons dim, and a "👂 Listen first…"
   note shows. Not locked: the letter he hears after tapping a key (keySay's keyUtt; also the Spelling Helper's letter after a right pick), the header (Back / Reload), grown-up "Skip this part".
   Nov 20: letting go of the 🎤 hold-to-talk button is never blocked; ignored taps are noted for Parent Review (study-ui.js TAPS).
   If the voice gets stuck "speaking" for 20 s straight, it lets go (iPads sometimes never say they finished). */
(function () {
  const FREE = '.app-header, .skip-part, #skipPart, [data-free], body > nav, .tod-bar, #grownDone, .ph-wrap, #studyReload, #reloadBtn';
  const RELEASE = /^(pointerup|pointercancel|mouseup|touchend|touchcancel|lostpointercapture)$/;   // Nov 20: letting go of the hold-to-talk button always works
  const MAX_MS = 20000;
  const playing = new Set();
  const P = HTMLMediaElement.prototype, play0 = P.play;
  P.play = function () {
    const el = this, off = () => playing.delete(el);
    if (!el.__lfHooked) { el.__lfHooked = true; ['ended', 'pause', 'error', 'emptied', 'abort'].forEach(ev => el.addEventListener(ev, off)); }
    playing.add(el);
    const r = play0.apply(this, arguments);
    if (r && r.catch) r.catch(() => off());
    return r;
  };
  /* Nov 19, 2026 (Dylan: sight words were "taking a really long time between letters"): iPads keep saying speechSynthesis.speaking
     for a while after a voice has finished, so the lock hung on (up to the 20 s stuck limit). Now each spoken line is tracked
     by its own end: done when it ends or errors, or when its length has passed (rough guess from its text), or 4 s after it was
     queued if it never starts. cancel() clears them all. */
  const utts = new Set();
  if ('speechSynthesis' in window) {
    const ss = window.speechSynthesis, speak0 = ss.speak.bind(ss), cancel0 = ss.cancel.bind(ss);
    ss.speak = u => {
      try {
        const off = () => { utts.delete(u); clearTimeout(u.__lfT); };
        const guess = () => 900 + String(u.text || '').length * 85 / Math.max(0.3, u.rate || 1);
        u.addEventListener('end', off); u.addEventListener('error', off);
        u.addEventListener('start', () => { clearTimeout(u.__lfT); u.__lfT = setTimeout(off, guess() + 1500); });
        u.__lfT = setTimeout(off, guess() + 4000);
        utts.add(u);
      } catch (e) { }
      return speak0(u);
    };
    ss.cancel = () => { utts.forEach(u => clearTimeout(u.__lfT)); utts.clear(); return cancel0(); };
  }
  window.LISTEN_ON = () => true;   // pages can replace this (spell.html: only his login)
  const echo = () => { try { return typeof keyUtt !== 'undefined' && !!keyUtt; } catch (e) { return false; } };   // the letter after a key tap
  const talking = () => {
    if (echo()) return false;
    const tts = utts.size > 0;   // not speechSynthesis.speaking: it sticks on iPads (see above)
    for (const a of [...playing]) if (a.paused || a.ended) playing.delete(a);
    return tts || playing.size > 0;
  };
  let since = 0, stuck = false, on = false, note = null;
  const isOn = () => {
    let t = false;
    try { t = window.LISTEN_ON() && talking(); } catch (e) { t = false; }
    const now = Date.now();
    if (!t) { since = 0; stuck = false; return false; }
    if (!since) since = now;
    if (now - since > MAX_MS) stuck = true;
    return !stuck;
  };
  const paint = v => {
    if (v === on) return; on = v;
    document.body && document.body.classList.toggle('listening', v);
    if (!note && document.body) { note = document.createElement('div'); note.id = 'listenNote'; note.textContent = '👂 Listen first…'; note.setAttribute('aria-live', 'polite'); document.body.appendChild(note); }
  };
  setInterval(() => paint(isOn()), 120);
  const stop = e => {
    if (!isOn()) return;
    const t = e.target;
    if (t && t.closest && t.closest(FREE)) return;
    if (RELEASE.test(e.type) && t && t.closest && t.closest('.ht-btn.on')) return;
    if ((e.type === 'pointerdown' || e.type === 'keydown') && window.__tapBlocked) { try { window.__tapBlocked(e); } catch (x) { } }   // Parent Review: "tapped while the page was talking"
    if (e.type === 'keydown' && (e.metaKey || e.ctrlKey || e.altKey || /^(Tab|Shift|Control|Alt|Meta|F\d+)$/.test(e.key))) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (note) { note.classList.remove('nudge'); void note.offsetWidth; note.classList.add('nudge'); }
  };
  ['pointerdown', 'pointerup', 'pointercancel', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'keydown', 'keypress', 'input', 'beforeinput'].forEach(ev =>
    window.addEventListener(ev, stop, { capture: true, passive: false }));
  const css = document.createElement('style');
  css.textContent = `
    body.listening button:not(.app-header *):not(.skip-part), body.listening .cell, body.listening [data-w], body.listening .key, body.listening canvas { opacity:.55; transition:opacity .15s; }
    #listenNote { position:fixed; left:50%; bottom:18px; transform:translateX(-50%); z-index:9999; background:#1E3A5F; color:#E0F2FE; border:2px solid #7FB0F0;
      border-radius:999px; padding:8px 18px; font:600 18px Fredoka, system-ui, sans-serif; pointer-events:none; opacity:0; transition:opacity .15s; }
    body.listening #listenNote { opacity:1; }
    #listenNote.nudge { animation:lfnudge .4s; } @keyframes lfnudge { 0%,100% { transform:translateX(-50%); } 25% { transform:translateX(calc(-50% - 8px)); } 75% { transform:translateX(calc(-50% + 8px)); } }`;
  (document.head || document.documentElement).appendChild(css);
})();
