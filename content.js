(() => {
  if (window.__xiLoaded) return; window.__xiLoaded = true;
  const root = document.documentElement;
  const store = { get: () => { try { return localStorage.getItem('xi-on') === '1'; } catch { return false; } },
                  set: (v) => { try { localStorage.setItem('xi-on', v ? '1' : '0'); } catch {} } };

  // --- controls ---
  const ui = document.createElement('div'); ui.id = 'xi-ui';
  ui.innerHTML = '<button class="xi-toggle" title="Toggle Reels mode (R)" aria-pressed="false"></button>' +
    '<button class="xi-nav" data-d="-1" title="Previous (↑ or K)" aria-label="Previous post"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<button class="xi-nav" data-d="1" title="Next (↓, Space or J)" aria-label="Next post"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<span id="xi-hint">J/K to move, L like, M mute, O open, R exit</span>';
  const toggle = ui.querySelector('.xi-toggle');
  const on = () => root.classList.contains('xi-on');
  const set = (v) => {
    root.classList.toggle('xi-on', v); store.set(v);
    toggle.textContent = v ? 'Exit Reels' : 'Reels';
    toggle.classList.toggle('on', v); toggle.setAttribute('aria-pressed', String(v));
    if (v) { mark(); setTimeout(() => snapTo(current() ?? 0), 60); }
  };
  toggle.onclick = () => set(!on());
  ui.querySelectorAll('.xi-nav').forEach(b => b.onclick = () => go(+b.dataset.d));
  const mount = () => { if (!document.body.contains(ui)) document.body.appendChild(ui); };

  // --- mark post cells (no :has dependency) ---
  const mark = () => {
    let n = 0;
    for (const c of document.querySelectorAll('[data-testid="cellInnerDiv"]')) {
      const isPost = !!c.querySelector('article[data-testid="tweet"]');
      c.classList.toggle('xi-cell', isPost);
      if (isPost) { n++; c.classList.toggle('xi-tall', c.scrollHeight > innerHeight + 4); }
    }
    root.classList.toggle('xi-has', n > 0);
  };
  const cells = () => [...document.querySelectorAll('.xi-cell')].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  const current = () => {
    const list = cells(), mid = innerHeight / 2; let best = null, bd = Infinity;
    list.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs((r.top + r.bottom) / 2 - mid); if (d < bd) { bd = d; best = i; } });
    return best;
  };
  const snapTo = (i) => { const list = cells(); const c = list[Math.max(0, Math.min(list.length - 1, i))]; c?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  let lock = 0;
  const go = (d) => { const now = Date.now(); if (now - lock < 280) return; lock = now; const i = current(); snapTo((i ?? 0) + d); };

  // highlight active post + play only its video
  let raf = 0;
  const refresh = () => {
    raf = 0; if (!on()) return;
    const list = cells(), i = current();
    list.forEach((c, k) => {
      const act = k === i; c.classList.toggle('xi-active', act);
      c.querySelectorAll('video').forEach(v => { if (act) { if (v.paused) v.play().catch(() => {}); } else if (!v.paused) v.pause(); });
    });
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(refresh); }, { passive: true });

  // --- keys ---
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'r' || k === 'R') { e.preventDefault(); set(!on()); return; }
    if (!on()) return;
    if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey) || k === 'j') { e.preventDefault(); e.stopImmediatePropagation(); go(1); }
    else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey) || k === 'k') { e.preventDefault(); e.stopImmediatePropagation(); go(-1); }
    else if (k === 'm' || k === 'M') { const v = cells()[current()]?.querySelector('video'); if (v) v.muted = !v.muted; e.preventDefault(); e.stopImmediatePropagation(); }
    else if (k === 'o' || k === 'O') { cells()[current()]?.querySelector('a[href*="/status/"] time')?.closest('a')?.click(); e.preventDefault(); e.stopImmediatePropagation(); }
    else if (k === 'l' || k === 'L') { const i = current(); cells()[i]?.querySelector('[data-testid="like"],[data-testid="unlike"]')?.click(); e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  // --- keep up with X's infinite, re-rendering timeline ---
  let href = location.href;
  let pend = 0;
  new MutationObserver(() => { if (pend) return; pend = requestAnimationFrame(() => { pend = 0; mount(); mark(); refresh();
    if (location.href !== href) { href = location.href; if (on()) setTimeout(() => { mark(); snapTo(current() ?? 0); }, 400); } }); })
    .observe(document.body, { childList: true, subtree: true });

  mount(); set(store.get());
})();
