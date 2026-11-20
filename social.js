/* The Study: Social Studies (added Nov 20, 2026 for the 11/20/26 school day: "Read the Pledge of Allegiance to your learning coach").
   Loaded after rain.js by index.html and do.html.
   - Pledge of Allegiance (pledge): Word Meanings (pledge, allegiance, republic, indivisible, liberty, justice… then a short check),
     Echo Read (the page says a part, he says it back; his voice is saved), Get Ready (right hand over the heart, stand, face the
     flag), Read It to My Learning Coach (the whole Pledge out loud, saved; then the learning coach holds a button and says how it went).
   The Pledge itself is the official U.S. text (4 U.S.C. § 4, public domain). The meanings and pictures are our own. */

const P_TEXT = 'I pledge allegiance to the flag\nof the United States of America,\nand to the republic for which it stands,\none nation under God,\nindivisible,\nwith liberty and justice for all.';
const P_WORDS = 'pledge | a promise | 🤝\nallegiance | being loyal: you stick with it and care about it | ❤️\nflag | the red, white, and blue flag of our country | 🇺🇸\nrepublic | a country where the people choose their leaders | 🗳️\nnation | a country and all of its people | 🗺️\nindivisible | it can’t be split apart | 🔗\nliberty | freedom | 🕊️\njustice | being fair to everyone | ⚖️';
const P_parseWords = s => L_lines(s).map(l => l.split('|').map(x => x.trim())).filter(p => p[0] && p[1]).map(([w, m, e = '']) => ({ w, m, e }));
function P_flag(w = 320) {
  const H = Math.round(w * 10 / 19), sh = H / 13, cw = w * 0.4, ch = sh * 7;
  let g = Array.from({ length: 13 }, (_, i) => `<rect x="0" y="${i * sh}" width="${w}" height="${sh + 0.5}" fill="${i % 2 ? '#FFFFFF' : '#B22234'}"/>`).join('');
  g += `<rect x="0" y="0" width="${cw}" height="${ch}" fill="#3C3B6E"/>`;
  for (let r = 0; r < 9; r++) for (let c = 0; c < (r % 2 ? 5 : 6); c++) g += `<circle cx="${(c * 2 + (r % 2 ? 2 : 1)) * cw / 12}" cy="${(r + 1) * ch / 10}" r="${w / 160}" fill="#fff"/>`;
  return `<svg class="r-flag" viewBox="0 0 ${w} ${H}" width="${w}" aria-label="American flag">${g}</svg>`;
}

Object.assign(LT, {
  pledge: {
    name: 'Pledge of Allegiance', cls: 'social',
    help: 'Learn what the words of the Pledge mean, echo it a part at a time (he hears it, then says it; his voice is saved), get ready (stand, face the flag, right hand over the heart), then read the whole Pledge to his learning coach. At the end the learning coach holds a button and says how it went. Printed: the Pledge, big, with the word meanings.',
    schools: {
      '2026-11-20': { note: '“Read the Pledge of Allegiance to your learning coach (you).” He learns the words, echoes it, then reads it all to you; you hold the button at the end and say how it went. His reading is saved for Parent Review.', set: () => ({ heading: 'The Pledge of Allegiance', text: P_TEXT, words: P_WORDS, learn: true, echo: true, ready: true, coach: true }) }
    },
    own: () => ({ heading: 'The Pledge of Allegiance', text: P_TEXT, words: P_WORDS, learn: true, echo: true, ready: true, coach: true }),
    fields: () => [
      { k: 'heading', label: 'Title', type: 'text' },
      { k: 'text', label: 'The Pledge', type: 'area', rows: 6, help: 'One part per line (each line is one echo).' },
      { k: 'words', label: 'Word meanings', type: 'area', rows: 6, help: 'One per line: word | what it means | emoji' },
      { k: 'learn', label: 'Learn the word meanings (with a short check)', type: 'check' },
      { k: 'echo', label: 'Echo read (hear a part, say it back)', type: 'check' },
      { k: 'ready', label: 'Get ready: stand, face the flag, right hand on the heart', type: 'check' },
      { k: 'coach', label: 'Read it all to his learning coach', type: 'check' }
    ],
    acts: () => [['reset', '↺ Put the Pledge back']],
    act: (a, c) => { if (a === 'reset') { c.text = P_TEXT; c.words = P_WORDS; } },
    title: c => (c.heading || '').trim() || 'The Pledge of Allegiance',
    data: c => ({ heading: LT.pledge.title(c), lines: L_lines(c.text), words: P_parseWords(c.words), learn: !!c.learn, echo: !!c.echo, ready: !!c.ready, coach: !!c.coach }),
    check: d => !d.lines.length ? 'Type the Pledge.' : (d.learn || d.echo || d.ready || d.coach) ? '' : 'Pick at least one part.'
  }
});
L_IDS.push('pledge');
L_CLASS_OF.pledge = 'social';

if (!L_IN_DO) {
  LT.pledge.print = (d, exact) => L_sheetOf(nameDate() + title(d.heading, 'Read it to your learning coach', star('#B22234'), star('#3C3B6E'))
    + `<div style="text-align:center">${P_flag(260).replace('class="r-flag"', '')}</div>`
    + `<div style="font:400 30px/1.7 Andika,sans-serif;padding:4px 40px">${d.lines.map(l => L_esc(l)).join('<br>')}</div>`
    + (d.words.length ? `<div style="border:2px solid #94A3B8;border-radius:12px;padding:8px 16px;display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;font:500 17px Andika,sans-serif">${d.words.map(x => `<div>${x.e} <b>${L_esc(x.w)}</b>: ${L_esc(x.m)}</div>`).join('')}</div>` : '')
    + `<div style="font:600 20px Andika,sans-serif;padding-left:20px">☐ I read the Pledge to my learning coach. &nbsp; Learning coach: ________________</div>`, exact, { gap: 10 });
}

LT.pledge.run = () => {
  const d = SD, run = Date.now().toString(36), helped = [];
  const story = cur => `<div class="ls-story" id="story" style="text-align:center;font-size:clamp(22px,3.4vw,32px);line-height:1.55;padding:10px 20px">${d.lines.map((l, i) => `<span class="s${i === cur ? ' now' : cur >= 0 && i < cur ? ' done' : ''}">${l.split(/\s+/).map(t => `<span class="w">${L_esc(t)}</span>`).join(' ')}</span>`).join('<br>')}</div>`;
  const wireWords = () => { $('story').onclick = e => { const w = e.target.closest('.w'); if (!w) return; const t = w.textContent.replace(/[^A-Za-z']/g, ''); if (!t) return; listenToken++; if (!helped.includes(t.toLowerCase())) helped.push(t.toLowerCase()); playWord(t); }; };

  const learn = async () => {
    const W = d.words;
    await each(W.length, i => new Promise(async res => {
      const x = W[i];
      app.innerHTML = L_exactTag() + head('What do the words in the Pledge mean?') + L_count(i, W.length, 'Word') + `<div class="ls-big" style="display:flex;align-items:center;gap:16px">${x.e ? `<span>${x.e}</span>` : ''}${L_esc(x.w)}</div><div class="s-card"><p><b>${L_esc(x.w)}</b> means <b>${L_esc(x.m)}</b>.</p></div><div class="row acts"><button class="btn big" id="hearW">${SPK}Hear it again</button><button class="btn big primary" id="gotW" disabled>Got it →</button></div>`;
      const t = `${x.w}. ${x.w} means ${x.m.replace(/:/g, ',')}.`; say(t, 0.88); $('hearW').onclick = () => say(t, 0.88);
      await wait(1500); $('gotW').disabled = false;
      await new Promise(r => { $('gotW').onclick = r; });
      mark('Word Meanings', `Learned: ${x.w}`, true, '', '', null, { text: `${x.w} means ${x.m}.` }, ['got it']); L_free();
      res();
    }));
    const pickW = ['liberty', 'justice', 'pledge', 'indivisible'].map(w => W.find(x => x.w.toLowerCase() === w)).filter(Boolean);
    const qs = (pickW.length >= 2 ? pickW : W.slice(0, 4)).filter(() => W.length >= 3);
    await each(qs.length, i => new Promise(async res => {
      const x = qs[i], others = L_shuf(W.filter(y => y !== x)).slice(0, 2), ch = L_shuf([x.m, ...others.map(y => y.m)]);
      app.innerHTML = L_exactTag() + head(`What does <b>${L_esc(x.w)}</b> mean?`) + L_count(i, qs.length, 'Question') + `<div class="ls-big" style="font-size:52px">${x.e} ${L_esc(x.w)}</div><div id="io"></div>`;
      say(`What does ${x.w} mean?`, 0.9);
      const r = await L_choose(ch, x.m, { hint: `Listen again: ${x.w} means ${x.m}.` });
      mark('Word Meanings', `What does “${x.w}” mean?`, r.ok, r.typed, x.m, null, { text: `What does ${x.w} mean?`, choices: ch }, r.picks);
      res();
    }));
    const g = items.filter(x => x.part === 'Word Meanings' && !x.free);
    partDone(g.length ? `${g.filter(x => x.ok).length} of ${g.length} right the first time.` : 'Great learning!');
  };

  const echo = async () => {
    await L_mic();
    await each(d.lines.length, i => new Promise(async res => {
      const line = d.lines[i];
      app.innerHTML = L_exactTag() + head('Listen first. Then say it back! Tap a word if you need to hear it.') + L_count(i, d.lines.length, 'Part') + story(i) + `<div class="row"><button class="btn" id="hearL">${SPK}Hear it again</button></div><div class="message" id="msg">👂 Listen…</div><div id="lsSay"></div>`;
      wireWords(); $('hearL').onclick = () => say(line, 0.82);
      say(line, 0.82); await wait(400);
      setMsg('Now you say it! 🗣️', 'good');
      const nW = line.split(/\s+/).length;
      const r = await L_read({ minMs: Math.min(5000, 600 + nW * 420), label: 'I said it! 🗣️', nudge: 'I’m listening… say it back!' });
      mark('Echo Read', `Part ${i + 1}`, true, '', '', null, { text: line, clips: L_keepClip('pledge', run, i, r.clip) }, [r.heard ? 'said it back (microphone heard him)' : 'tapped “I said it”']); L_free();
      setMsg('Great!', 'good'); await wait(500); res();
    }));
    stopMic();
    partDone('You said the whole Pledge, part by part!');
  };

  const ready = async () => {
    await each(2, i => new Promise(async res => {
      if (i === 0) {
        app.innerHTML = L_exactTag() + head('When we say the Pledge, we stand up tall, face the flag, and put a hand over our heart.') + `<div>${P_flag(300)}</div><div class="s-card"><b>Which hand goes over your heart?</b></div><div id="io"></div>`;
        say('When we say the Pledge, we stand up tall, face the flag, and put a hand over our heart. Which hand goes over your heart?', 0.9);
        const ch = ['✋ my right hand', '🤚 my left hand'];
        const r = await L_choose(ch, ch[0], { row: true, hint: 'It’s your right hand. That’s the hand most people write with.' });
        mark('Get Ready', 'Which hand goes over your heart?', r.ok, r.typed, ch[0], null, { text: 'Which hand goes over your heart for the Pledge?', choices: ch }, r.picks);
      } else {
        const todo = [['stand', '🧍 I’m standing up tall'], ['face', '🇺🇸 I’m facing the flag'], ['hand', '✋ My right hand is on my heart']], left = new Set(todo.map(t => t[0]));
        app.innerHTML = L_exactTag() + head('Get ready! Tap each one when you do it.') + `<div>${P_flag(260)}</div><div class="ls-choices" id="ch">${todo.map(([k, t]) => `<button data-k="${k}">${t}</button>`).join('')}</div><div class="message" id="msg"></div>`;
        say('Get ready! Stand up tall, face the flag, and put your right hand on your heart. Tap each one when you do it.', 0.9);
        await new Promise(r => { $('ch').onclick = e => { const b = e.target.closest('[data-k]'); if (!b || b.disabled) return; b.disabled = true; b.classList.add('right'); left.delete(b.dataset.k); fb('Yes!', 1.1); if (!left.size) { setMsg('You’re ready! 🇺🇸', 'good'); nextUp(1100).then(r); } }; });
        mark('Get Ready', 'Stand, face the flag, right hand on the heart', true, '', '', null, { text: 'He tapped: standing up, facing the flag, right hand on his heart.' }, ['ready']); L_free();
      }
      res();
    }));
    partDone('Ready for the Pledge!');
  };

  const coach = async () => {
    let round = 0, again = true;
    while (again && round < 2) {
      round++;
      await each(1, () => new Promise(async res => {
        await L_mic();
        const t0 = Date.now();
        app.innerHTML = L_exactTag() + head(`${round > 1 ? 'One more time! ' : ''}Read the whole Pledge out loud to your <b>learning coach</b>. Stand up tall, right hand on your heart! Tap a word if you need help.`) + `<div>${P_flag(130)}</div>` + story(-1).replace('font-size:clamp(22px,3.4vw,32px)', 'font-size:clamp(20px,2.8vw,26px);line-height:1.5;padding:10px 20px') + `<div class="message" id="msg"></div><div id="lsSay"></div>`;
        wireWords(); say(round > 1 ? 'One more time! Read the whole Pledge to your learning coach.' : 'Read the whole Pledge out loud to your learning coach. Stand up tall, right hand on your heart!', 0.9);
        const nW = d.lines.join(' ').split(/\s+/).length;
        const r = await L_read({ minMs: Math.min(9000, nW * 330), label: 'I read it all! 🗣️', nudge: 'I’m listening… read it to your learning coach!' });
        stopMic();
        const secs = Math.round((Date.now() - t0) / 1000);
        app.innerHTML = L_exactTag() + head('Great reading! Now your learning coach checks it.') + `<div>${P_flag(200)}</div><div class="s-card"><p>🧑 <b>Learning coach</b>: hold the button below, then tell us how it went.</p></div><div class="row acts"><button class="grownup" id="coachBtn" style="font-size:20px">🧑 Learning coach: hold here (2 seconds)</button></div><div id="io"></div>`;
        fb('Great reading! Now your learning coach checks it.', 0.95);
        await new Promise(rr => holdButton($('coachBtn'), 2000, rr));
        const opts = ['⭐⭐⭐ He read it all, nice and clear', '⭐⭐ He read it with a little help', '🔁 Let’s practice it one more time'];
        $('coachBtn').disabled = true; $('io').innerHTML = `<div class="ls-choices" id="ch">${opts.map((o, i) => `<button data-c="${i}">${o}</button>`).join('')}</div><div class="message" id="msg"></div>`;
        const pick = await new Promise(rr => { $('ch').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; $('ch').querySelectorAll('button').forEach(x => x.disabled = true); b.classList.add('right'); rr(+b.dataset.c); }; });
        again = pick === 2 && round < 2;
        mark('Read It to My Learning Coach', `Read the whole Pledge${round > 1 ? ' (again)' : ''}`, true, '', '', null, { text: `${d.lines.join(' ')}\n\nLearning coach said: ${opts[pick].replace(/^[⭐🔁]+\s*/u, '')}. (${secs} s${helped.length ? `; tapped for help: ${helped.join(', ')}` : ''})`, clips: L_keepClip('pledge', run, 100 + round, r.clip) }, [opts[pick]]); L_free();
        if (pick === 0) { confetti(); setMsg('Amazing! 🇺🇸', 'good'); fb('Amazing job!', 1); }
        else if (pick === 1) { setMsg('Good job! Keep practicing.', 'good'); fb('Good job! Keep practicing.', 1); }
        else { setMsg(round < 2 ? 'Let’s read it one more time!' : 'Good try! Practice again tomorrow.', 'try'); fb(round < 2 ? 'Let’s read it one more time!' : 'Good try! Practice again tomorrow.', 1); }
        await nextUp(1500); res();
      }));
    }
    partDone(helped.length ? `Read the Pledge to the learning coach (tapped for help: ${helped.join(', ')}).` : 'Read the Pledge to the learning coach!');
  };

  PARTS = [];
  if (d.learn && d.words.length) PARTS.push({ name: 'Word Meanings', run: learn });
  if (d.echo) PARTS.push({ name: 'Echo Read', run: echo });
  if (d.ready) PARTS.push({ name: 'Get Ready', run: ready });
  if (d.coach) PARTS.push({ name: 'Read It to My Learning Coach', run: coach });
  return { intro: 'Learn the Pledge of Allegiance, then read it to your learning coach! 🇺🇸' };
};
