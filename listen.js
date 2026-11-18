/* Listen first (Nov 18, 2026, Dylan: "a hot fix that doesn't allow him to tap through and skip the audio so he actually listens to it…
   make the audio play and everything is clickable afterwards. I am tired of him rushing. Across the entire worksheets site.")
   Loaded by do.html, fixup.html and spell.html (spell.html only locks on his login, not for a grown-up).
   While the page is talking (computer voice or a recording), taps, presses and typing are ignored, buttons dim, and a "👂 Listen first…"
   note shows. Not locked: the letter he hears after tapping a key (keySay's keyUtt), the header (Back / Reload), grown-up "Skip this part".
   If the voice gets stuck "speaking" for 20 s straight, it lets go (iPads sometimes never say they finished). */
(function () {
  const FREE = '.app-header, .skip-part, #skipPart, [data-free], body > nav, .tod-bar, #grownDone, .ph-wrap';
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
  window.LISTEN_ON = () => true;   // pages can replace this (spell.html: only his login)
  const echo = () => { try { return typeof keyUtt !== 'undefined' && !!keyUtt; } catch (e) { return false; } };   // the letter after a key tap
  const talking = () => {
    if (echo()) return false;
    const tts = 'speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending);
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
    if (e.type === 'keydown' && (e.metaKey || e.ctrlKey || e.altKey || /^(Tab|Shift|Control|Alt|Meta|F\d+)$/.test(e.key))) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (note) { note.classList.remove('nudge'); void note.offsetWidth; note.classList.add('nudge'); }
  };
  ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'keydown', 'keypress', 'input', 'beforeinput'].forEach(ev =>
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
