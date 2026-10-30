const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (p) => `£${(p / 100).toFixed(p % 100 ? 2 : 0)}`;
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private window: this visit only */ } },
};
document.documentElement.classList.add('js');
const embedded = window.self !== window.top;
if (embedded) document.documentElement.classList.add('embed');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ----- Shared header and footer -----
const NAV = [['Podcast', 'podcast.html'], ['Shop', 'shop.html'], ['Members', 'members.html'], ['About', 'index.html#about']];
const home = document.body.classList.contains('home');
// Inner pages only ever appear in a modal over the world, even from a direct link.
if (!home && !embedded) location.replace(`./?m=${encodeURIComponent(location.pathname.split('/').pop().replace(/(\.html)?$/, '.html') + location.search + location.hash)}`);
$('[data-nav]').outerHTML = `<header class="nav">
  <a class="logo" href="index.html"><img src="assets/logo/logo-stacked-dark.svg" alt="A Brighter Humanity, home" width="1000" height="300"></a>
  <a class="btn btn-small nav-btn" href="podcast.html"><span class="lg">Listen now</span><span class="sm">Listen</span></a>
  <a class="btn btn-small btn-rose nav-btn" href="index.html#morning"><span class="lg">Today’s mantra, please</span><span class="sm">Mantra</span></a>
  <button class="bag-btn" type="button" data-open-bag aria-label="Open your bag"><svg class="bag-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 8h14l1 13H4zM9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span class="bag-word">Bag</span><b class="bag-count" data-bag-count>0</b></button>
  <div class="post"><button class="post-btn" type="button" aria-expanded="false" aria-controls="post-menu" aria-label="Menu"><svg viewBox="0 0 28 28" width="24" height="24" aria-hidden="true"><path d="M14 3v23" stroke="#8A4B24" stroke-width="3" stroke-linecap="round"/><path d="M6 6h13l4 3.5-4 3.5H6z" fill="#D81F5F"/><path d="M22 14H9l-4 3.5L9 21h13z" fill="#FFD15C"/></svg></button><nav class="post-menu" id="post-menu" aria-label="Main">${[...NAV, ['Sign in', 'account.html'], ['Today’s mantra', 'index.html#morning']].map(([t, u], i) => `<a href="${u}" style="--i:${i}">${t}</a>`).join('')}</nav></div>
</header>
<aside class="drawer" data-bag hidden aria-label="Your bag"></aside><div class="scrim" data-scrim hidden></div>`;

const PAY = [['visa', 'Visa'], ['mastercard', 'Mastercard'], ['amex', 'American Express'], ['apple-pay', 'Apple Pay'], ['google-pay', 'Google Pay'], ['paypal', 'PayPal'], ['klarna', 'Klarna']];
const payImg = (n, alt) => `<img src="assets/img/pay/${n}.svg" alt="${alt}">`;
$('[data-footer]').outerHTML = `<footer class="foot ${home ? 'panel' : ''}"><div class="foot-sheet">
  <div class="foot-grid">
    <div class="foot-brand"><img class="foot-logo" src="assets/logo/logo-stacked-light.svg" alt="A Brighter Humanity" width="1000" height="300"><p>Go on. <em>Flourish.</em></p></div>
    <nav aria-label="Show"><h4>The show</h4><a href="podcast.html">All episodes</a><a href="#" data-link="youtubeUrl" data-pending="The YouTube channel link goes here."><img class="brand" src="assets/img/listen/youtube.svg" alt="">YouTube</a><a href="#" data-link="spotifyUrl" data-pending="The Spotify link goes here."><img class="brand" src="assets/img/listen/spotify.svg" alt="">Spotify</a><a href="#" data-link="appleUrl" data-pending="The Apple Podcasts link goes here."><img class="brand" src="assets/img/listen/apple-podcasts.svg" alt="">Apple Podcasts</a></nav>
    <nav aria-label="Shop and members"><h4>Join in</h4><a href="shop.html">Shop</a><a href="members.html">Members</a><a href="account.html">Your account</a><a href="index.html#morning">Morning mantra</a></nav>
    <nav aria-label="Legal"><h4>The small print</h4><a href="terms.html">Terms</a><a href="privacy.html">Privacy</a><a href="terms.html#returns">Returns</a><a href="mailto:${SITE.email}">Contact</a></nav>
  </div>
  <div class="foot-pay"><div class="pay-badges">${PAY.map(([n, a]) => `<span class="pay">${payImg(n, a)}</span>`).join('')}</div><p class="powered"><span>Secure payments by</span><span class="pay">${payImg('stripe', 'Stripe')}</span><span>Shop powered by</span><span class="pay">${payImg('shopify', 'Shopify')}</span></p></div>
  <p class="foot-small">© ${new Date().getFullYear()} Abigail Tracey. A Brighter Humanity.</p>
</div></footer>`;
$$('[data-email]').forEach((e) => { e.innerHTML = `<a href="mailto:${SITE.email}">${SITE.email}</a>`; });
if (!SITE.previewMode) $$('[data-preview-only]').forEach((e) => e.remove());

const toastEl = $('[data-toast]');
let toastTimer;
function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3800); }
$$('[data-link]').forEach((a) => {
  const url = SITE[a.dataset.link];
  if (url) { a.href = url; a.rel = 'noopener'; return; }
  a.addEventListener('click', (e) => { e.preventDefault(); toast(a.dataset.pending); });
});
$$('.nav-menu a').forEach((a) => a.addEventListener('click', () => { $('.nav-menu').open = false; }));

// ----- Bag -----
const bag = {
  items: store.get('abh-bag', []),
  save() { store.set('abh-bag', this.items); renderBag(); },
  add(id, size) { const i = this.items.find((x) => x.id === id && x.size === size); if (i) i.qty++; else this.items.push({ id, size: size || '', qty: 1 }); this.save(); openBag(); },
  total() { return this.items.reduce((t, i) => t + PRODUCTS.find((p) => p.id === i.id).price * i.qty, 0); },
};
const drawer = $('[data-bag]'), scrim = $('[data-scrim]');
function renderBag() {
  $$('[data-bag-count]').forEach((c) => { c.textContent = bag.items.reduce((t, i) => t + i.qty, 0); });
  drawer.innerHTML = `<div class="drawer-head"><h3>Your bag</h3><button type="button" data-close-bag aria-label="Close bag">✕</button></div>` + (bag.items.length ? `<ul class="bag-list">${bag.items.map((i, n) => { const p = PRODUCTS.find((x) => x.id === i.id); return `<li><img src="${p.img}" alt="" width="72" height="72"><div><b>${p.name}</b>${i.size ? `<small>Size ${i.size}</small>` : ''}<span class="qty"><button type="button" data-q="${n}" data-d="-1" aria-label="One fewer">−</button>${i.qty}<button type="button" data-q="${n}" data-d="1" aria-label="One more">+</button></span></div><span>${money(p.price * i.qty)}</span></li>`; }).join('')}</ul><div class="drawer-foot"><p class="row"><span>Subtotal</span><b>${money(bag.total())}</b></p><p class="hint">${bag.total() >= 5000 ? 'You’ve got free UK delivery.' : `${money(5000 - bag.total())} away from free UK delivery.`}</p><a class="btn wide" href="checkout.html"><span>Checkout</span></a></div>` : `<div class="bag-empty"><p>Nothing in here yet. A tragedy, frankly.</p><a class="btn" href="shop.html"><span>To the shop</span></a></div>`);
}
function openBag() { if (embedded) { parent.postMessage({ abh: 'bag' }, location.origin); return; } renderBag(); drawer.hidden = scrim.hidden = false; requestAnimationFrame(() => { drawer.classList.add('on'); scrim.classList.add('on'); }); }
function closeBag() { drawer.classList.remove('on'); scrim.classList.remove('on'); setTimeout(() => { drawer.hidden = scrim.hidden = true; }, 260); }
document.addEventListener('click', (e) => {
  const t = e.target.closest('button,[data-add]');
  if (!t) return;
  if (t.matches('[data-not-recorded]')) toast('This one hasn’t been recorded yet.');
  if (t.matches('[data-open-bag]')) openBag();
  if (t.matches('[data-close-bag]')) closeBag();
  if (t.matches('[data-q]')) { const it = bag.items[+t.dataset.q]; it.qty += +t.dataset.d; if (it.qty < 1) bag.items.splice(+t.dataset.q, 1); bag.save(); }
  if (t.matches('[data-add]')) bag.add(t.dataset.add);
});
scrim.addEventListener('click', closeBag);
addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!drawer.hidden) closeBag(); if (closeModal) closeModal(); } });
renderBag();

// ----- Media: audio and video live on the top page, so they survive a modal closing -----
const site = location.origin;
const tell = (msg) => parent.postMessage({ abh: msg.t, ...msg }, site);
function paintPlay(src, playing, ratio) {
  $$('[data-play]').forEach((b) => {
    const on = b.dataset.play === src;
    b.classList.toggle('playing', on && playing);
    b.setAttribute('aria-label', on && playing ? 'Pause' : 'Play');
    const bar = b.closest('[data-ep]')?.querySelector('[data-bar]');
    if (bar) bar.style.transform = `scaleX(${on ? ratio : 0})`;
  });
}
function bindPlay(root = document) {
  $$('[data-play]', root).forEach((b) => b.addEventListener('click', () => {
    if (embedded) tell({ t: 'audio', src: b.dataset.play }); else media.toggleAudio(b.dataset.play);
  }));
}
const media = embedded ? null : (() => {
  const audio = new Audio();
  audio.preload = 'metadata';
  let src = '', pageOpen = false;
  const fmt = (s) => (Number.isFinite(s) ? clock(s) : '0:00');
  const trackInfo = (u) => EPISODES.find((x) => x.audio === u) ? { ...EPISODES.find((x) => x.audio === u) } : BONUS.find((x) => x.audio === u) || { title: 'Episode' };

  const mini = document.createElement('aside');
  mini.className = 'mini-player';
  mini.hidden = true;
  mini.setAttribute('aria-label', 'Now playing');
  mini.innerHTML = `<img class="mini-face" src="assets/img/guests/abigail.jpg" alt=""><button class="mini-play" type="button" data-mini-toggle aria-label="Pause"><i></i></button><div class="mini-main"><b data-mini-title></b><small data-mini-by></small></div><span class="mini-time"><span data-mini-now>0:00</span> / <span data-mini-dur>0:00</span></span><button class="mini-skip" type="button" data-mini-back aria-label="Back 15 seconds">−15</button><button class="mini-skip" type="button" data-mini-fwd aria-label="Forward 15 seconds">+15</button><button class="mini-x" type="button" data-mini-close aria-label="Close player">✕</button><input class="mini-seek" type="range" min="0" max="1000" value="0" aria-label="Position">`;
  document.body.append(mini);
  const seek = $('.mini-seek', mini), toggleBtn = $('[data-mini-toggle]', mini);
  const showMini = () => { mini.hidden = !src || pageOpen || !!video.active(); };
  const send = () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    paintPlay(src, !audio.paused, ratio);
    toggleBtn.classList.toggle('playing', !audio.paused);
    toggleBtn.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause');
    if (document.activeElement !== seek) seek.value = ratio * 1000;
    seek.style.setProperty('--p', `${ratio * 100}%`);
    $('[data-mini-now]', mini).textContent = fmt(audio.currentTime);
    $('[data-mini-dur]', mini).textContent = fmt(audio.duration);
    $('.page-modal iframe')?.contentWindow?.postMessage({ abh: 'state', src, playing: !audio.paused, ratio }, site);
  };
  ['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended'].forEach((ev) => audio.addEventListener(ev, send));
  toggleBtn.addEventListener('click', () => { if (audio.paused) audio.play(); else audio.pause(); });
  $('[data-mini-back]', mini).addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
  $('[data-mini-fwd]', mini).addEventListener('click', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); });
  seek.addEventListener('input', () => { if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration; });
  $('[data-mini-close]', mini).addEventListener('click', () => { audio.pause(); src = ''; audio.removeAttribute('src'); audio.load(); send(); showMini(); });

  // Video: one element that only ever changes size, so the video never reloads
  const video = (() => {
    const dock = document.createElement('div');
    dock.className = 'video-dock';
    dock.hidden = true;
    dock.innerHTML = `<div class="video-shade"></div><div class="video-frame"><div class="video-bar"><b data-v-title></b><span><button type="button" data-v-size aria-label="Shrink to corner">↘</button><button type="button" data-v-close aria-label="Close video">✕</button></span></div><div class="video-stage" data-v-stage></div></div>`;
    document.body.append(dock);
    const stage = $('[data-v-stage]', dock), sizeBtn = $('[data-v-size]', dock);
    let on = false;
    const setMini = (m) => { dock.classList.toggle('small', m); sizeBtn.textContent = m ? '↖' : '↘'; sizeBtn.setAttribute('aria-label', m ? 'Make video bigger' : 'Shrink to corner'); };
    sizeBtn.addEventListener('click', () => setMini(!dock.classList.contains('small')));
    $('.video-shade', dock).addEventListener('click', () => setMini(true));
    const close = () => { on = false; dock.hidden = true; stage.innerHTML = ''; setMini(false); showMini(); };
    $('[data-v-close]', dock).addEventListener('click', close);
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && on && !dock.classList.contains('small')) setMini(true); });
    return {
      active: () => on,
      shrink: () => { if (on) setMini(true); },
      open(id, title) {
        audio.pause();
        on = true; dock.hidden = false; setMini(false);
        $('[data-v-title]', dock).textContent = title;
        stage.innerHTML = id
          ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
          : `<div class="video-empty"><img src="assets/img/cover.jpg" alt=""><span>The YouTube video plays here once it’s uploaded.</span></div>`;
        showMini();
      },
    };
  })();

  addEventListener('abh-modal', (e) => { pageOpen = e.detail; if (!pageOpen) video.shrink(); showMini(); });
  addEventListener('message', (e) => {
    if (e.origin !== site) return;
    const d = e.data || {};
    if (d.abh === 'audio') api.toggleAudio(d.src);
    if (d.abh === 'video') video.open(d.id, d.title);
    if (d.abh === 'hello') send();
  });
  const api = {
    toggleAudio(u) {
      if (u === src && !audio.paused) { audio.pause(); return; }
      if (video.active()) document.querySelector('[data-v-close]').click();
      if (u !== src) {
        src = u; audio.src = u;
        const t = trackInfo(u);
        $('[data-mini-title]', mini).textContent = t.title;
        $('[data-mini-by]', mini).textContent = t.guest ? `with ${t.guest}` : (t.role || 'A Brighter Humanity');
      }
      audio.play().catch(() => toast('That wouldn’t play, sorry.'));
      showMini();
    },
    openVideo: (id, title) => video.open(id, title),
    get audio() { return audio; },
  };
  return api;
})();
if (embedded) {
  addEventListener('message', (e) => { if (e.origin === site && e.data?.abh === 'state') paintPlay(e.data.src, e.data.playing, e.data.ratio); });
}
const face = (e) => (e.photo ? `<img src="${e.photo}" alt="${esc(e.guest)}" loading="lazy">` : `<span class="face-initials">${e.initials || 'AT'}</span>`);
const art = (e) => `<div class="ep-art" style="--ep:${e.color}"><span class="ep-theme">${e.theme}</span><div class="ep-faces"><span class="ep-face"><img src="assets/img/guests/abigail.jpg" alt="Abigail Tracey" loading="lazy"></span>${e.guest ? `<span class="ep-x" aria-hidden="true">✦</span><span class="ep-face">${face(e)}</span>` : ''}</div></div>`;
const by = (e) => (e.guest ? `with ${e.guest}, ${e.role}` : e.role);
const epCard = (e) => `<article class="ep" data-ep="${e.id}">${art(e)}<div class="ep-body"><p class="ep-meta">${e.planned ? '<span class="planned">Planned guest</span>' : `Episode ${e.n} · ${e.date} · ${clock(e.secs)}`}</p><h3>${esc(e.title)}</h3><p class="ep-by">${esc(by(e))}</p><p class="ep-blurb">${esc(e.blurb)}</p>${e.credit ? `<p class="ep-credit">${esc(e.credit)}</p>` : ''}<div class="ep-actions"><button class="play" type="button" ${e.audio ? `data-play="${e.audio}"` : 'data-not-recorded'} aria-label="Play"><i></i></button><div class="ep-track"><span data-bar></span></div><button class="yt-btn" type="button" data-yt="${e.id}"><img class="brand" src="assets/img/listen/youtube.svg" alt="">YouTube</button></div></div></article>`;
function bindYT(root = document) {
  $$('[data-yt]', root).forEach((b) => b.addEventListener('click', () => {
    const e = EPISODES.find((x) => x.id === b.dataset.yt);
    if (embedded) tell({ t: 'video', id: e.youtubeId || '', title: e.title }); else media.openVideo(e.youtubeId || '', e.title);
  }));
}

// ----- Sign-up -----
$$('[data-signup]').forEach((form) => {
  const note = $('[data-note]', form.parentElement);
  const say = (msg, alert) => { note.textContent = msg; note.classList.toggle('is-alert', !!alert); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.elements.email;
    if (!input.value.trim() || !input.checkValidity()) { say('That email looks a bit wonky. One more go?', true); input.focus(); return; }
    if (!SITE.signupEndpoint) { say('Sign-ups aren’t connected yet, so your email hasn’t been saved.', true); return; }
    try {
      const res = await fetch(SITE.signupEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset(); say('You’re in. See you in the morning, gorgeous.');
    } catch { say('That didn’t go through. Mind trying again?', true); }
  });
});

// ----- Every page header sits in the same landscape as the home page -----
$$('.page-head').forEach((head, n) => {
  const hills = document.createElement('div');
  hills.className = 'head-hills';
  hills.setAttribute('aria-hidden', 'true');
  const tree = (x, y, s, c) => `<rect x="${x - 2.5 * s}" y="${y - 34 * s}" width="${5 * s}" height="${34 * s}" fill="#5E7A6C"/><circle cx="${x}" cy="${y - 50 * s}" r="${25 * s}" fill="${c}"/><circle cx="${x - 15 * s}" cy="${y - 36 * s}" r="${15 * s}" fill="${c}"/><circle cx="${x + 15 * s}" cy="${y - 36 * s}" r="${15 * s}" fill="${c}"/>`;
  hills.innerHTML = `<svg viewBox="0 0 1600 150" preserveAspectRatio="xMidYMax slice"><path d="M0 92C260 40 520 60 800 88S1320 110 1600 66V150H0Z" fill="var(--hill-far)"/>${tree(150, 88, 1, '#A8BCE3')}${tree(1370, 90, .9, '#BBB2E6')}${tree(560, 84, .7, '#E8A6BE')}<path d="M0 116C300 84 620 124 900 110S1360 92 1600 118V150H0Z" fill="var(--hill-near)"/></svg>`;
  head.append(hills);
});

if (!home) $$('.reveal').forEach((el) => el.classList.add('in'));

// ----- The signpost menu -----
{
  const post = $('.post'), btn = $('.post-btn');
  const set = (on) => { post.classList.toggle('open', on); btn.setAttribute('aria-expanded', on); };
  btn.addEventListener('click', () => set(!post.classList.contains('open')));
  // On phones the signs fill the screen: tapping any sign or the space around them closes it.
  $('.post-menu').addEventListener('click', () => set(false));
  $('.post-menu').addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('click', (e) => { if (!post.contains(e.target)) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && post.classList.contains('open')) { set(false); btn.focus(); } });
}

// ----- Inside a modal: going home means closing it -----
if (embedded) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="index.html"]');
    if (!a) return;
    e.preventDefault();
    parent.postMessage({ abh: 'close', hash: a.getAttribute('href').split('#')[1] || '' }, location.origin);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.hidden) parent.postMessage({ abh: 'close' }, location.origin); });
}

// ----- Home: links to the home page move within it, and never reload it -----
if (home) document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  const m = a?.getAttribute('href').match(/^(?:index\.html)?(#.*)?$/);
  if (!m || a.hasAttribute('data-link')) return;
  e.preventDefault();
  const target = m[1] && m[1].length > 1 ? document.querySelector(m[1]) : null;
  if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  else if (!m[1]) scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
});

// ----- Home: everything else opens over the page, so you never leave -----
const MODAL_PAGES = /^(about|podcast|shop|members|account|checkout|terms|privacy)\.html/;
function initPageModal() {
  const shell = document.createElement('div');
  shell.className = 'page-modal';
  shell.hidden = true;
  shell.setAttribute('role', 'dialog');
  shell.setAttribute('aria-modal', 'true');
  shell.innerHTML = '<div class="page-modal-card" tabindex="-1"><div class="page-modal-bar"><button class="bag-btn" type="button" data-open-bag aria-label="Open your bag"><span class="bag-word">Bag</span><b class="bag-count" data-bag-count>0</b></button><button class="page-close" type="button" aria-label="Close">✕</button></div><iframe title="Page"></iframe></div>';
  document.body.append(shell);
  renderBag();
  const frame = $('iframe', shell);
  const homePath = location.pathname.replace(/[^/]*$/, '');
  const card = $('.page-modal-card', shell);
  let lastFocus = null, hideTimer = 0, opening = false, pushed = false;
  // The card rises straight away; its page fades in the moment the page says it's ready.
  // Changing the page by replace() keeps the iframe out of the Back button's history.
  const setFrame = (href) => { if (frame.contentWindow) frame.contentWindow.location.replace(href); else frame.src = href; };
  const pageReady = () => {
    const path = frame.contentWindow?.location.pathname || '';
    if (path === 'blank') return;
    // The bag is only offered where you can shop.
    shell.classList.toggle('shopping', /\/(shop|checkout)\.html$/.test(path));
    shell.classList.add('loaded');
  };
  frame.addEventListener('load', pageReady);
  const open = (href, push = true) => {
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    closeBag();
    opening = true;
    shell.classList.remove('ready', 'loaded', 'shopping');
    shell.hidden = false;
    setFrame(href);
    requestAnimationFrame(() => requestAnimationFrame(() => shell.classList.add('on', 'ready')));
    dispatchEvent(new CustomEvent('abh-modal', { detail: true }));
    pushed = push;
    // Clean addresses: /privacy rather than a query string. The host serves privacy.html there, which comes straight back here.
    const pretty = `${homePath}${href.replace('.html', '')}`;
    if (push) history.pushState({ modal: href }, '', pretty); else history.replaceState({ modal: href }, '', pretty);
    card.focus({ preventScroll: true });
  };
  const close = (fromHistory = false, hash = '') => {
    if (shell.hidden || !opening) return;
    opening = false;
    shell.classList.remove('on', 'ready', 'loaded');
    dispatchEvent(new CustomEvent('abh-modal', { detail: false }));
    hideTimer = setTimeout(() => { shell.hidden = true; setFrame('about:blank'); }, 280);
    // Closing undoes the step that opened it, so Back never reopens a modal you've just shut.
    if (!fromHistory) { if (pushed && !hash) history.back(); else history.pushState({}, '', homePath + (hash ? `#${hash}` : '')); }
    pushed = false;
    if (hash) document.getElementById(hash)?.scrollIntoView();
    lastFocus?.focus?.({ preventScroll: true });
  };
  // The page behind stays exactly where it is: scrolling over the scrim simply does nothing.
  const stay = (e) => e.preventDefault();
  shell.addEventListener('wheel', stay, { passive: false });
  shell.addEventListener('touchmove', stay, { passive: false });
  addEventListener('keydown', (e) => { if (!shell.hidden && [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.key) && e.target === card) e.preventDefault(); });
  // Fetch every page while the browser's idle, so modals open instantly.
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1200));
  idle(() => ['about', 'podcast', 'shop', 'members', 'terms', 'privacy', 'checkout', 'account'].forEach((n) => { const l = document.createElement('link'); l.rel = 'prefetch'; l.href = `${n}.html`; document.head.append(l); }));
  $('.page-close', shell).addEventListener('click', () => close());
  shell.addEventListener('click', (e) => { if (e.target === shell) close(); });
  // Fetch a page as soon as someone reaches for its link, so it opens straight away.
  const fetched = new Set();
  const prefetch = (e) => {
    const a = e.target.closest?.('a[href]');
    const href = a?.getAttribute('href').split('#')[0];
    if (!href || !MODAL_PAGES.test(href) || fetched.has(href)) return;
    fetched.add(href);
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = href;
    document.head.append(l);
  };
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !MODAL_PAGES.test(a.getAttribute('href'))) return;
    e.preventDefault();
    open(a.getAttribute('href'));
  });
  addEventListener('message', (e) => {
    if (e.origin !== location.origin) return;
    if (e.data?.abh === 'ready') pageReady();
    if (e.data?.abh === 'close') close(false, e.data.hash);
    if (e.data?.abh === 'bag') { bag.items = store.get('abh-bag', []); openBag(); }
  });
  addEventListener('popstate', (e) => { if (e.state?.modal) open(e.state.modal, false); else close(true); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.hidden) close(); });
  // The bag is shared with whatever's in the modal
  addEventListener('storage', (e) => { if (e.key === 'abh-bag') { bag.items = store.get('abh-bag', []); renderBag(); } });
  const start = new URLSearchParams(location.search).get('m');
  if (start && MODAL_PAGES.test(start)) open(start, false);
}

// ----- Home -----
let closeModal = null;
if (home) { initHome(); initPageModal(); }
function initHome() {
  const hero = $('.hero'), toggle = $('[data-scene-toggle]');
  $$('.room').forEach((r, i) => r.style.setProperty('--r', i));
  let userPaused = false, heroVisible = true, modalOpen = false;
  const syncScene = () => hero.classList.toggle('is-paused', userPaused || !heroVisible || modalOpen);
  addEventListener('abh-modal', (e) => { modalOpen = e.detail; syncScene(); });
  toggle.addEventListener('click', () => { userPaused = !userPaused; toggle.setAttribute('aria-pressed', userPaused); toggle.setAttribute('aria-label', userPaused ? 'Play the animation' : 'Pause the animation'); syncScene(); });

  $('[data-latest]').innerHTML = EPISODES.slice(0, 3).map(epCard).join('');
  bindPlay($('[data-latest]')); bindYT($('[data-latest]'));
  $('[data-shop-strip]').innerHTML = PRODUCTS.map((p) => `<article class="strip-item reveal" data-from="pop" style="background:${p.color}"><a href="shop.html#${p.id}"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a><span class="price-tag">${money(p.price)}</span><div class="strip-info"><h3>${p.name}</h3>${p.sizes ? `<a class="btn btn-small" href="shop.html#${p.id}"><span>Choose size</span></a>` : `<button class="btn btn-small" type="button" data-add="${p.id}"><span>Add to bag</span></button>`}</div></article>`).join('');

  // Mantra
  const now = new Date();
  let i = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000) % MANTRAS.length;
  const hr = now.getHours();
  $('[data-greeting]').textContent = hr < 5 ? 'You’re up early, or very late' : hr < 12 ? 'Good morning, you' : hr < 18 ? 'It’s never too late for a morning' : 'Tomorrow’s morning, a little early';
  const box = $('#mantra'), txt = $('[data-mantra]');
  const show = () => { txt.textContent = ''; MANTRAS[i].split(' ').forEach((w, n, all) => { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', n); s.textContent = w; txt.append(s, n < all.length - 1 ? ' ' : ''); }); };
  const sun = $('[data-sun]');
  sun.addEventListener('click', () => { box.hidden = false; sun.setAttribute('aria-expanded', 'true'); sun.classList.add('small'); show(); });
  $('[data-another]').addEventListener('click', () => { i = (i + 1) % MANTRAS.length; show(); });
  $('[data-share]').addEventListener('click', async () => {
    const text = `“${MANTRAS[i]}” — The Morning Mantra, A Brighter Humanity`;
    try { if (navigator.share) await navigator.share({ text, url: location.href.split('#')[0] }); else { await navigator.clipboard.writeText(text); toast('Copied. Go and make her morning.'); } } catch (err) { if (err.name !== 'AbortError') toast('That didn’t work, sorry.'); }
  });

  // The six rooms are the real rooms from the house.
  const allRooms = $$('.scene .room');
  $$('[data-room]').forEach((tile) => {
    const room = allRooms[+tile.dataset.room];
    const r = room.querySelector('rect');
    const x = +r.getAttribute('x'), y = +r.getAttribute('y'), w = +r.getAttribute('width'), hh = +r.getAttribute('height');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'scene tile-room');
    svg.setAttribute('viewBox', `${x} ${y} ${w} ${hh}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');
    const copy = room.cloneNode(true);
    copy.removeAttribute('class');
    svg.append(copy);
    const text = document.createElement('div');
    text.className = 'tile-text';
    while (tile.firstChild) text.append(tile.firstChild);
    tile.append(svg, text);
  });

  // The hero's story walks on its own, and your scrolling makes her hurry, like the hills below.
  if (!reduced) {
    const STORY = new Set(['lx', 'ly', 'suit', 'free', 'gownfly', 'wigfly', 'wigspin', 'casefly', 'paper', 'dogrun', 'beltcase', 'phone-camera']);
    const storyAnims = () => hero.getAnimations({ subtree: true }).filter((a) => STORY.has(a.animationName));
    // Phones skip the wait: the film opens with her already on the belt, moments from jumping.
    if (matchMedia('(max-width:640px)').matches) storyAnims().forEach((an) => { an.currentTime = (an.currentTime || 0) + 8800; });
    let lastY = scrollY, rate = 1, raf = 0;
    const tick = () => {
      rate += (1 - rate) * 0.07;
      const done = Math.abs(rate - 1) < 0.02;
      if (done) rate = 1;
      storyAnims().forEach((a) => { a.playbackRate = rate; });
      raf = done ? 0 : requestAnimationFrame(tick);
    };
    addEventListener('scroll', () => {
      const dy = Math.abs(scrollY - lastY);
      lastY = scrollY;
      rate = Math.min(7, Math.max(rate, 1 + dy * 0.14));
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // The Reading Room only moves while you can see it.
  new IntersectionObserver(([en]) => $('.rr-house').classList.toggle('live', en.isIntersecting)).observe($('.rr-house'));

  // Sections pin with plain CSS, so scrolling stays with the browser.
  const panels = $$('.panel').map((el) => ({ el, anchor: el.previousElementSibling?.classList.contains('anchor') ? el.previousElementSibling : null, hold: el.nextElementSibling?.classList.contains('hold') ? el.nextElementSibling : null }));
  if (!reduced) document.documentElement.classList.add('has-scroll');

  // ----- One landscape. Each section is a place on it; hills, trees and the road run between them. -----
  const NS = 'http://www.w3.org/2000/svg';
  const she = $('.lx g[style]').cloneNode(true);
  she.removeAttribute('transform'); she.removeAttribute('style');
  $$('.suit', she).forEach((x) => x.remove());
  const dogSrc = $('.dog-run > g');
  const LAND = {
    meadow: { far: '#BFE3C8', near: '#8FCFA8', trees: ['#A8BCE3', '#BBB2E6', '#7FBF9A'], mark: '' },
    orchard: { far: '#CBE8BE', near: '#9AD29A', trees: ['#BBB2E6', '#9FC0DD', '#E8A6BE'], mark: '<g transform="translate(1130 0)"><path d="M0 150v-58h76v58z" fill="#FFF6E6"/><path d="M-10 94l48-34 48 34z" fill="#D81F5F"/><rect x="28" y="116" width="20" height="34" fill="#17382E"/><rect x="8" y="104" width="14" height="14" fill="#FFD15C"/><rect x="54" y="104" width="14" height="14" fill="#FFD15C"/></g>' },
    village: { far: '#D7E9AE', near: '#ABCF86', trees: ['#9FC0DD', '#C4BDE8', '#F2B37E'], mark: '<g transform="translate(330 0)"><path d="M0 150l20-110 20 110z" fill="none" stroke="#17382E" stroke-width="4"/><path d="M6 118h28M11 86h18" stroke="#17382E" stroke-width="3"/><circle cx="20" cy="36" r="6" fill="#D81F5F"/><path d="M6 22a20 20 0 0 1 28 0M-2 14a32 32 0 0 1 44 0" fill="none" stroke="#D81F5F" stroke-width="3" stroke-linecap="round"/></g>' },
    market: { far: '#EBDFA0', near: '#CFC077', trees: ['#C4BDE8', '#F2B37E', '#A8BCE3'], mark: '<g transform="translate(1040 0)"><path d="M-132 150V82" stroke="#8A4B24" stroke-width="7"/><path d="M-226 54H-52L-26 75-52 96H-226Z" fill="#FFF6E6" stroke="#17382E" stroke-width="3" stroke-linejoin="round"/><text x="-136" y="81" text-anchor="middle" font-family="Alfa Slab One, serif" font-size="16" fill="#17382E">The Correct Path</text><path d="M6 150V86M124 150V86" stroke="#17382E" stroke-width="5"/><path d="M-6 88l14-30h114l14 30z" fill="#D81F5F"/><path d="M26 58l-10 30M52 58l-6 30M78 58l6 30M104 58l10 30" stroke="#FFF6E6" stroke-width="7"/><rect x="10" y="118" width="110" height="32" fill="#8A4B24"/></g>' },
    library: { far: '#F2C88C', near: '#DD9F66', trees: ['#BBB2E6', '#E08C6E', '#9FC0DD'], mark: '<g transform="translate(300 0)"><rect x="0" y="66" width="130" height="84" fill="#FFF6E6"/><path d="M-10 68l75-40 75 40z" fill="#17382E"/><g fill="#FFD15C"><rect x="14" y="84" width="20" height="30"/><rect x="55" y="84" width="20" height="30"/><rect x="96" y="84" width="20" height="30"/></g><rect x="55" y="124" width="20" height="26" fill="#17382E"/></g>' },
  };
  LAND.dusk = { ...LAND.library, mark: '' };
  const bandFor = ['meadow', 'orchard', 'village', 'market', 'library', 'dusk'];
  const bands = [];
  panels.slice(1).filter((p) => !p.el.matches('.foot')).forEach((p, n) => {
    const stop = document.createElement('div');
    stop.className = 'stop';
    (p.anchor || p.el).before(stop);
    if (p.anchor) stop.append(p.anchor);
    stop.append(p.el);
    if (p.hold) stop.append(p.hold);

    const L = LAND[bandFor[n]];
    const a = 18 + (n % 3) * 7, ph = n * 1.7;
    const ground = (x) => 150 + a * Math.sin(x / 260 + ph) + 8 * Math.sin(x / 90 + ph * 2);
    const curve = (fn, step = 40) => { let d = `M-400 ${fn(-400)}`; for (let x = -360; x <= 2000; x += step) d += `L${x} ${fn(x).toFixed(1)}`; return d; };
    const farFn = (x) => 104 + 26 * Math.sin(x / 340 + ph + 2);
    let trees = '';
    const count = 7;
    for (let i = 0; i < count; i++) {
      const x = 90 + i * 1420 / (count - 1) + 40 * Math.sin(i * 7 + n), s = 0.75 + 0.3 * Math.abs(Math.sin(i * 3 + n)), y = ground(x) + 2, c = L.trees[(i + n) % 3];
      if (bandFor[n] === 'market' && x > 760 && x < 1260) continue; // the stall and its sign stand clear
      if (bandFor[n] === 'dusk' && x > 560 && x < 1480) continue; // nothing grows in front of the Reading Room
      trees += `<rect x="${x - 2.5 * s}" y="${y - 34 * s}" width="${5 * s}" height="${34 * s}" fill="#5E7A6C"/>` + (i % 2
        ? `<ellipse cx="${x}" cy="${y - 52 * s}" rx="${19 * s}" ry="${32 * s}" fill="${c}"/>`
        : `<circle cx="${x}" cy="${y - 50 * s}" r="${25 * s}" fill="${c}"/><circle cx="${x - 15 * s}" cy="${y - 36 * s}" r="${15 * s}" fill="${c}"/><circle cx="${x + 15 * s}" cy="${y - 36 * s}" r="${15 * s}" fill="${c}"/>`);
    }
    const band = document.createElement('div');
    band.className = 'land';
    band.setAttribute('aria-hidden', 'true');
    band.innerHTML = `<svg class="scene" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="g${n}" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="${L.near}"/><stop offset="1" stop-color="${L.near}" stop-opacity="0"/></linearGradient><linearGradient id="f${n}" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="${L.far}"/><stop offset="1" stop-color="${L.far}" stop-opacity="0"/></linearGradient></defs><path d="${curve(farFn)}V240H-400Z" fill="url(#f${n})"/>${L.mark}${trees}<path d="${curve(ground)}V240H-400Z" fill="url(#g${n})"/><path d="${curve((x) => ground(x) + 5)}" fill="none" stroke="#FFF6E6" stroke-width="5" stroke-dasharray="26 18" opacity=".85"/><g data-runner></g></svg>`;
    stop.after(band);
    const runner = $('[data-runner]', band);
    const dir = n % 2 ? -1 : 1;
    const wrapS = document.createElementNS(NS, 'g');
    wrapS.setAttribute('style', 'transform-box:view-box');
    wrapS.setAttribute('transform', `scale(${dir * 0.72} 0.72) translate(-40 -659)`);
    wrapS.append(she.cloneNode(true));
    const dog = dogSrc.cloneNode(true);
    dog.setAttribute('style', 'transform-box:view-box');
    dog.setAttribute('transform', `translate(${dir * 58} 0) scale(${dir * 0.72} 0.72)`);
    runner.append(wrapS, dog);
    bands.push({ el: band, runner, ground, dir });
  });

  const skySun = document.createElement('div');
  skySun.className = 'world-sun';
  skySun.setAttribute('aria-hidden', 'true');
  $('main').prepend(skySun);
  const worldFrame = () => {
    worldQueued = false;
    const vh = innerHeight, y = scrollY, H = document.documentElement.scrollHeight;
    const p = clampN((y - vh * 0.6) / (H - vh * 1.9));
    skySun.style.transform = `translate3d(${(84 - 72 * p).toFixed(2)}vw, ${(58 - Math.sin(p * Math.PI) * 52 + Math.max(0, (p - 0.86) / 0.14) * 70).toFixed(2)}vh, 0)`;
    bands.forEach((b) => {
      const r = b.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const q = clampN((vh - r.top) / (vh + r.height));
      const x = b.dir > 0 ? -160 + 1920 * q : 1760 - 1920 * q;
      b.runner.setAttribute('transform', `translate(${x.toFixed(1)} ${(b.ground(x) + 4).toFixed(1)})`);
    });
  };
  const clampN = (v) => Math.min(1, Math.max(0, v));
  let worldQueued = false;
  const queueWorld = () => { if (!worldQueued) { worldQueued = true; requestAnimationFrame(worldFrame); } };
  addEventListener('scroll', queueWorld, { passive: true });
  addEventListener('resize', queueWorld);
  worldFrame();
  const layout = () => {
    const vh = innerHeight;
    panels.forEach((p) => {
      if (p.hold && !reduced) p.hold.style.height = `${(+p.hold.dataset.vh / 100) * vh}px`;
      const h = p.el.offsetHeight;
      p.el.style.top = h > vh ? `${vh - h}px` : '0px';
    });
  };
  addEventListener('resize', layout);
  const ro = new ResizeObserver(layout);
  panels.forEach((p) => ro.observe(p.el));
  document.fonts?.ready.then(layout);
  layout();

  // Things animate in once, the first time they're seen.
  const seen = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); seen.unobserve(en.target); } }), { threshold: 0.12 });
  panels.forEach((p) => $$('.reveal', p.el).forEach((el, n) => { el.style.setProperty('--d', `${n * 70}ms`); seen.observe(el); }));

  // A section completely covered by the next one stops drawing; the hero also stops animating.
  panels.forEach((p, n) => {
    const next = panels[n + 1]?.anchor;
    if (!next) return;
    new IntersectionObserver(([en]) => {
      const covered = !en.isIntersecting;
      p.el.style.visibility = covered ? 'hidden' : '';
      if (p.el === hero) { heroVisible = !covered; syncScene(); }
    }, { rootMargin: '0px 0px 100000px 0px' }).observe(next);
  });
}

// ----- Podcast page -----
if ($('[data-episodes]')) {
  const f = EPISODES[0];
  $('[data-featured]').innerHTML = `<article class="feat" data-ep="${f.id}"><button class="feat-video" type="button" data-yt="${f.id}" aria-label="Watch on YouTube" style="background:${f.color}"><img src="assets/img/cover.jpg" alt="" width="1254" height="1254"><img class="yt-play" src="assets/img/listen/youtube.svg" alt=""><span class="feat-label">Watch on YouTube</span></button><div class="feat-body"><p class="eyebrow">${f.planned ? 'Up first' : 'Latest episode'}</p><h2>${esc(f.title)}</h2><p class="ep-by">${esc(by(f))}</p><p>${esc(f.blurb)}</p><div class="ep-actions"><button class="play big" type="button" ${f.audio ? `data-play="${f.audio}"` : 'data-not-recorded'} aria-label="Play"><i></i></button><div class="ep-track"><span data-bar></span></div><span class="ep-time">${f.planned ? 'Planned guest' : clock(f.secs)}</span></div></div></article>`;
  const list = $('[data-episodes]');
  let theme = THEMES.find((t) => t.toLowerCase() === location.hash.slice(1).toLowerCase()) || 'All';
  const render = () => { list.innerHTML = EPISODES.filter((e) => theme === 'All' || e.theme === theme).map(epCard).join('') || `<p class="none">No ${theme.toLowerCase()} episodes yet. They’re on their way.</p>`; bindPlay(list); bindYT(list); };
  $('[data-chips]').innerHTML = ['All', ...THEMES].map((t) => `<button type="button" class="chip ${t === theme ? 'on' : ''}" data-chip="${t}">${t}</button>`).join('');
  $$('[data-chip]').forEach((c) => c.addEventListener('click', () => { theme = c.dataset.chip; $$('[data-chip]').forEach((x) => x.classList.toggle('on', x === c)); render(); }));
  render(); bindPlay($('[data-featured]')); bindYT($('[data-featured]'));
}

// ----- Shop page -----
if ($('[data-shop]')) {
  const modal = $('[data-product-modal]');
  $('[data-shop]').innerHTML = PRODUCTS.map((p) => `<article class="prod" id="${p.id}" style="background:${p.color}"><button type="button" class="prod-img" data-view="${p.id}" aria-label="View ${esc(p.name)}"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></button><span class="price-tag big">${money(p.price)}</span><div class="prod-info"><h2>${p.name}</h2><p>${esc(p.line)}</p><button class="btn" type="button" ${p.sizes ? `data-view="${p.id}"` : `data-add="${p.id}"`}><span>${p.sizes ? 'Choose size' : 'Add to bag'}</span></button></div></article>`).join('');
  const view = (id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    modal.innerHTML = `<div class="prod-modal" role="dialog" aria-modal="true" aria-label="${esc(p.name)}"><button type="button" class="x" data-close aria-label="Close">✕</button><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800"><div><h2>${p.name}</h2><p class="pm-price">${money(p.price)}</p><p>${esc(p.detail)}</p>${p.sizes ? `<fieldset class="sizes"><legend>Size</legend>${p.sizes.map((s, n) => `<label><input type="radio" name="size" value="${s}" ${n === 2 ? 'checked' : ''}><span>${s}</span></label>`).join('')}</fieldset>` : ''}<button class="btn wide" type="button" data-add-sized="${p.id}"><span>Add to bag</span></button><p class="hint">Free UK delivery over £50. Returns within 14 days.</p></div></div>`;
    modal.hidden = false;
    $('[data-close]', modal).onclick = closeModal;
    $('[data-add-sized]', modal).onclick = () => { const s = $('input[name=size]:checked', modal)?.value; closeModal(); bag.add(p.id, s); };
  };
  closeModal = () => { modal.hidden = true; };
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => view(b.dataset.view)));
  const hash = location.hash.slice(1);
  if (PRODUCTS.some((p) => p.id === hash && p.sizes)) view(hash);
}

// ----- Members -----
if ($('[data-plans]')) {
  const wrap = $('[data-plans]');
  let period = 'monthly';
  const render = () => { wrap.innerHTML = PLANS.map((p) => `<article class="plan ${p.featured ? 'featured' : ''}">${p.featured ? '<span class="price-tag">The full table</span>' : ''}<h2>${p.name}</h2><p>${p.line}</p><p class="plan-price">${money(p[period])}<small>/${period === 'monthly' ? 'month' : 'year'}</small></p><ul>${p.perks.map((x) => `<li>${x}</li>`).join('')}</ul><a class="btn wide ${p.featured ? '' : 'btn-rose'}" href="checkout.html?plan=${p.id}&period=${period}"><span>Join ${p.name}</span></a></article>`).join(''); };
  $$('[data-bill]').forEach((b) => b.addEventListener('click', () => { period = b.dataset.bill; $$('[data-bill]').forEach((x) => x.classList.toggle('on', x === b)); render(); }));
  render();
}

// ----- Checkout (test mode: card fields are locked to the public test number and nothing is sent anywhere) -----
if ($('[data-checkout]')) {
  const root = $('[data-checkout]');
  const q = new URLSearchParams(location.search);
  const plan = PLANS.find((p) => p.id === q.get('plan'));
  const period = q.get('period') === 'annual' ? 'annual' : 'monthly';
  const sub = plan ? plan[period] : bag.total();
  const ship = plan ? 0 : (sub >= 5000 || !sub ? 0 : 395);
  const total = sub + ship;
  const lines = plan ? `<li><span>${plan.name}<small>Billed ${period === 'monthly' ? 'monthly' : 'annually'}. Cancel any time.</small></span><b>${money(sub)}</b></li>` : bag.items.map((i) => { const p = PRODUCTS.find((x) => x.id === i.id); return `<li><img src="${p.img}" alt="" width="56" height="56"><span>${p.name} × ${i.qty}${i.size ? `<small>Size ${i.size}</small>` : ''}</span><b>${money(p.price * i.qty)}</b></li>`; }).join('');
  if (!plan && !bag.items.length) {
    root.innerHTML = `<div class="bag-empty"><h1>Your bag is empty.</h1><a class="btn" href="shop.html"><span>To the shop</span></a></div>`;
  } else {
    root.innerHTML = `<h1>Checkout</h1>${SITE.previewMode ? '<p class="test-banner"><b>Test mode.</b> Payments aren’t connected, so nothing is charged and nothing you enter leaves this page.</p>' : ''}
    <div class="co-grid"><form data-co novalidate>
      <div class="express"><button type="button" class="ex apple" data-pay aria-label="Pay with Apple Pay"><img src="assets/img/pay/apple-pay-white.svg" alt=""></button><button type="button" class="ex gpay" data-pay aria-label="Pay with Google Pay"><img src="assets/img/pay/google-pay.svg" alt=""></button>${plan ? '' : '<button type="button" class="ex paypal" data-pay aria-label="Pay with PayPal"><img src="assets/img/pay/paypal.svg" alt=""></button>'}</div><p class="or"><span>or pay by card</span></p>
      <h2>Your details</h2><label>Email<input name="email" type="email" autocomplete="email" required></label>
      ${plan ? '' : `<h2>Delivery</h2><div class="two"><label>First name<input name="first" autocomplete="given-name" required></label><label>Last name<input name="last" autocomplete="family-name" required></label></div><label>Address<input name="addr" autocomplete="address-line1" required></label><div class="two"><label>City<input name="city" autocomplete="address-level2" required></label><label>Postcode<input name="post" autocomplete="postal-code" required></label></div>`}
      <h2>Payment</h2><div class="card-box"><div class="card-head"><span>Card</span><span class="pay-mini"><img src="assets/img/pay/visa.svg" alt="Visa"><img src="assets/img/pay/mastercard.svg" alt="Mastercard"><img src="assets/img/pay/amex.svg" alt="American Express"></span></div><label>Card number<input value="4242 4242 4242 4242" readonly tabindex="-1" aria-readonly="true"></label><div class="two"><label>Expiry<input value="12 / 34" readonly tabindex="-1"></label><label>CVC<input value="123" readonly tabindex="-1"></label></div><p class="stripe-note">🔒 Payments secured by <img src="assets/img/pay/stripe.svg" alt="Stripe"></p></div>
      <p class="co-error" data-co-err role="alert"></p>
      <button class="btn wide" type="submit"><span>${plan ? 'Join' : 'Pay'} ${money(total)}</span></button>
      <p class="hint">By continuing you agree to our <a href="terms.html">terms</a> and <a href="privacy.html">privacy policy</a>.${plan ? ' Renews until you cancel.' : ''}</p>
    </form>
    <aside class="summary"><h2>Your order</h2><ul>${lines}</ul><p class="row"><span>Subtotal</span><b>${money(sub)}</b></p>${plan ? '' : `<p class="row"><span>UK delivery</span><b>${ship ? money(ship) : 'Free'}</b></p>`}<p class="row total"><span>Total</span><b>${money(total)}</b></p></aside></div>`;
    const form = $('[data-co]');
    const done = () => {
      const email = form.elements.email.value.trim() || 'you@example.com';
      const ref = `TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      if (plan) store.set('abh-member', { email, plan: plan.id, period, joined: Date.now() });
      else { bag.items = []; bag.save(); }
      root.innerHTML = `<div class="done"><span class="done-star" aria-hidden="true">✦</span><h1>${plan ? 'Welcome in.' : 'Lovely choice.'}</h1><p>${plan ? `You’re in ${plan.name}.` : 'Your order is confirmed.'} Reference <b>${ref}</b>.</p>${SITE.previewMode ? '<p class="test-banner">Test mode: nothing was charged, and no email was sent.</p>' : ''}<a class="btn" href="${plan ? 'account.html' : 'shop.html'}"><span>${plan ? 'To your account' : 'Back to the shop'}</span></a></div>`;
      scrollTo(0, 0);
    };
    $$('[data-pay]', form).forEach((b) => b.addEventListener('click', () => { if (!form.elements.email.value) form.elements.email.value = ''; done(); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.elements].find((el) => el.required && (!el.value.trim() || !el.checkValidity()));
      if (bad) { $('[data-co-err]').textContent = `Please check ${bad.closest('label').firstChild.textContent.trim().toLowerCase()}.`; bad.focus(); return; }
      done();
    });
  }
}

// ----- Account -----
if ($('[data-account]')) {
  const root = $('[data-account]');
  const render = () => {
    const m = store.get('abh-member', null);
    $$('.nav-sign').forEach((a) => { a.textContent = m ? 'Account' : 'Sign in'; });
    if (!m) {
      root.innerHTML = `<div class="signin"><h1>Sign <em>in.</em></h1><p>We’ll email you a link. No passwords to forget.</p><form data-signin novalidate><label class="sr" for="si">Email</label><input id="si" type="email" name="email" placeholder="you@somewhere-lovely.com" required><button class="btn wide" type="submit"><span>Send my link</span></button></form>${SITE.previewMode ? '<p class="test-banner">Preview: signing in opens a sample account straight away. No email is sent.</p>' : ''}<p class="hint">Not a member yet? <a href="members.html">Come in</a>.</p></div>`;
      $('[data-signin]').addEventListener('submit', (e) => { e.preventDefault(); const v = e.target.email.value.trim(); if (!v || !e.target.email.checkValidity()) { toast('That email looks a bit wonky.'); return; } store.set('abh-member', { email: v, plan: 'table', period: 'monthly', joined: Date.now() }); render(); });
      return;
    }
    const plan = PLANS.find((p) => p.id === m.plan) || PLANS[0];
    const next = new Date(m.joined); next.setMonth(next.getMonth() + (m.period === 'annual' ? 12 : 1));
    const sunday = new Date(); sunday.setDate(sunday.getDate() + ((7 - sunday.getDay()) % 7 || 7));
    const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    root.innerHTML = `<div class="acc-head"><div><p class="eyebrow">${esc(plan.name)}</p><h1>Hello, <em>you.</em></h1></div><button class="btn btn-small btn-ghost" type="button" data-signout><span>Sign out</span></button></div>
    <div class="tabs" role="tablist"><button class="on" data-tab="library" role="tab">Library</button><button data-tab="reading" role="tab">Reading list</button><button data-tab="circle" role="tab">Sunday circle</button><button data-tab="billing" role="tab">Billing</button></div>
    <div class="tab" data-pane="library"><ul class="bonus">${BONUS.map((b) => `<li data-ep="b"><button class="play" type="button" data-play="${b.audio}" aria-label="Play"><i></i></button><div><b>${esc(b.title)}</b><div class="ep-track"><span data-bar></span></div></div><span>${clock(b.secs)}</span></li>`).join('')}</ul></div>
    <div class="tab" data-pane="reading" hidden><ul class="reading">${READING.map((r) => `<li><b>${esc(r.book)}</b><p>${esc(r.note)}</p></li>`).join('')}</ul></div>
    <div class="tab" data-pane="circle" hidden><div class="circle"><h2>Next circle: ${fmt(sunday)}</h2><p>Live on video, 10am UK time. Bring a question.</p><button class="btn" type="button" data-circle><span>Save my seat</span></button></div></div>
    <div class="tab" data-pane="billing" hidden><div class="billing"><p class="row"><span>Plan</span><b>${esc(plan.name)}, ${money(plan[m.period])}/${m.period === 'annual' ? 'year' : 'month'}</b></p><p class="row"><span>Next payment</span><b>${fmt(next)}</b></p><p class="row"><span>Card</span><b>Visa ending 4242</b></p><p class="row"><span>Email</span><b>${esc(m.email)}</b></p><div class="bill-actions"><button class="btn btn-small btn-ghost" type="button" data-manage><span>Update card</span></button><button class="btn btn-small btn-rose" type="button" data-cancel><span>Cancel membership</span></button></div></div></div>`;
    bindPlay(root);
    $$('[data-tab]', root).forEach((t) => t.addEventListener('click', () => { $$('[data-tab]', root).forEach((x) => x.classList.toggle('on', x === t)); $$('[data-pane]', root).forEach((p) => { p.hidden = p.dataset.pane !== t.dataset.tab; }); }));
    $('[data-signout]').onclick = () => { store.set('abh-member', null); render(); };
    $('[data-circle]').onclick = () => toast('Seat saved. See you Sunday.');
    $('[data-manage]').onclick = () => toast('This opens Stripe’s billing page once it’s connected.');
    $('[data-cancel]').onclick = () => { if (confirm('Cancel your membership?')) { store.set('abh-member', null); render(); toast('Cancelled. You’re always welcome back.'); } };
  };
  render();
}
if (embedded) tell({ t: 'hello' });
if (store.get('abh-member', null)) $$('.nav-sign').forEach((a) => { a.textContent = 'Account'; });

// ----- Hand-painted arches. One frame for every window, the door and her photos, and a vine that links the windows. -----
const NS_SVG = 'http://www.w3.org/2000/svg';
const wob = (i, seed) => Math.sin(i * 0.9 + seed) * 0.45 + Math.sin(i * 0.37 + seed * 2) * 0.5;
const smooth = (pts, close) => { let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`; for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i], [nx, ny] = pts[i + 1]; d += `Q${x.toFixed(1)} ${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`; } const l = pts[pts.length - 1]; return `${d}L${l[0].toFixed(1)} ${l[1].toFixed(1)}${close ? 'Z' : ''}`; };
const flower = (x, y, r, petal, heart) => [0, 72, 144, 216, 288].map((a) => `<circle cx="${(x + Math.cos(a * Math.PI / 180) * r * 0.62).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * r * 0.62).toFixed(1)}" r="${(r * 0.46).toFixed(1)}" fill="${petal}"/>`).join('') + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.36).toFixed(1)}" fill="${heart}"/>`;
const leaf = (x, y, a, s, fill) => `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})" d="M0 0C${s * 0.35} ${-s * 0.42} ${s * 0.8} ${-s * 0.34} ${s} 0C${s * 0.8} ${s * 0.34} ${s * 0.35} ${s * 0.42} 0 0Z" fill="${fill}"/>`;
function archPoints(W, H, t, seed, open) {
  const r = W / 2 - t, top = t + r, pts = [], step = 18;
  const push = (x, y, nx, ny) => { const o = wob(pts.length, seed); pts.push([x + nx * o, y + ny * o]); };
  const bottom = open ? H + 4 : H - t;
  for (let y = bottom; y > top; y -= step) push(t, y, 1, 0);
  const n = Math.max(10, Math.round(Math.PI * r / step));
  for (let i = 0; i <= n; i++) { const a = Math.PI - (i / n) * Math.PI; push(W / 2 + Math.cos(a) * r, top - Math.sin(a) * r, -Math.cos(a), Math.sin(a)); }
  for (let y = top + step; y < bottom; y += step) push(W - t, y, -1, 0);
  push(W - t, bottom, -1, 0);
  return pts;
}
function paintFrame(el, seed) {
  const W = el.offsetWidth, H = el.offsetHeight;
  if (!W || !H) return;
  const t = W < 140 ? 7 : 15;
  const open = el.classList.contains('rr-door');
  const pts = archPoints(W, H, t, seed, open);
  const inner = smooth(pts, true);
  const dots = archPoints(W, H, t / 2, seed + 3, open).filter((_, i) => i % 1 === 0).map(([x, y], i) => (i % 3 === 2 ? leaf(x - 3, y, i * 47, 6, '#5F8F6E') : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="#FFF6E6"/>`)).join('');
  let svg = el.querySelector(':scope > .paint-frame');
  if (!svg) { svg = document.createElementNS(NS_SVG, 'svg'); svg.setAttribute('class', 'paint-frame'); svg.setAttribute('aria-hidden', 'true'); el.append(svg); }
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<path fill-rule="evenodd" fill="#D79A62" d="M-4 -4H${W + 4}V${H + 4}H-4Z${inner}"/><path d="${inner}" fill="none" stroke="#7C1D3B" stroke-width="1.6"/>${dots}${el.classList.contains('story-pic') ? leaf(W / 2 + 6, 9, -25, 13, '#4F8466') + leaf(W / 2 - 6, 9, 205, 13, '#6FA67F') + flower(W / 2, 9, 11, '#D81F5F', '#FFD15C') : ''}`;
}
function paintVine(wall) {
  const arches = $$('.rr-door, .rr-win', wall);
  const box = wall.getBoundingClientRect();
  const rects = arches.map((a) => a.getBoundingClientRect());
  let svg = wall.querySelector(':scope > .paint-vine');
  if (rects.length < 2 || rects[1].top - rects[0].top > 4 || rects[0].width < 40) { if (svg) svg.remove(); return; }
  if (!svg) { svg = document.createElementNS(NS_SVG, 'svg'); svg.setAttribute('class', 'paint-vine'); svg.setAttribute('aria-hidden', 'true'); wall.append(svg); }
  const crowns = rects.map((r) => [r.left - box.left + r.width / 2, r.top - box.top]);
  const pts = [];
  crowns.forEach(([x, y], i) => {
    pts.push([x, y + 3]);
    if (i < crowns.length - 1) { const nx = crowns[i + 1][0], gap = (rects[i].right + rects[i + 1].left) / 2 - box.left; pts.push([(x + gap) / 2, y + rects[i].width * 0.05]); pts.push([gap, y + rects[i].width * 0.36]); pts.push([(gap + nx) / 2, y + rects[i + 1].width * 0.05]); }
  });
  const d = smooth(pts);
  let extras = '';
  const path = document.createElementNS(NS_SVG, 'path'); path.setAttribute('d', d);
  const len = path.getTotalLength();
  for (let s = 12, i = 0; s < len; s += 26, i++) { const q = path.getPointAtLength(s), q2 = path.getPointAtLength(s + 1); const a = Math.atan2(q2.y - q.y, q2.x - q.x) * 180 / Math.PI + (i % 2 ? 50 : -50); extras += leaf(q.x, q.y, a, 12, i % 3 ? '#6FA67F' : '#4F8466'); }
  crowns.forEach(([x, y], i) => { extras += flower(x, y + 3, 12, i % 2 ? '#FFD15C' : '#D81F5F', i % 2 ? '#D81F5F' : '#FFD15C'); });
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  svg.innerHTML = `<path d="${d}" fill="none" stroke="#4F7A62" stroke-width="2.4" stroke-linecap="round"/>${extras}`;
}
function paintFrames() {
  const framed = $$('.rr-win, .rr-door, .story-pic');
  framed.forEach((el, i) => paintFrame(el, i * 2.3 + 1));
  const wall = $('.rr-wall');
  if (wall) paintVine(wall);
}
{
  let queued = 0;
  const again = () => { cancelAnimationFrame(queued); queued = requestAnimationFrame(paintFrames); };
  const ro = new ResizeObserver(again);
  $$('.rr-win, .rr-door, .story-pic').forEach((el) => ro.observe(el));
  again();
}

// ----- The footer is a drawer: it slides up out of the page as you reach the bottom. -----
{
  const foot = $('.foot'), sheet = $('.foot-sheet');
  if (foot && sheet && !reduced && !embedded) {
    foot.classList.add('foot-slide');
    let queued = false;
    const frame = () => {
      queued = false;
      const r = foot.getBoundingClientRect(), vh = innerHeight;
      if (r.top > vh) return;
      const p = Math.min(1, Math.max(0, (vh - r.top) / Math.min(r.height, vh)));
      sheet.style.transform = `translate3d(0, ${(Math.pow(1 - p, 2) * 62).toFixed(2)}%, 0)`;
      if (p > 0.55) foot.classList.add('open');
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    sheet.style.transform = 'translate3d(0, 62%, 0)';
    frame();
  }
}

// ----- Small print: the contents list follows you down the page. -----
{
  const links = $$('.legal-toc a');
  if (links.length) {
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        const on = a.getAttribute('href') === `#${en.target.id}`;
        a.classList.toggle('on', on);
        if (on) a.parentElement.scrollLeft = a.offsetLeft - 16;
      });
    }), { rootMargin: '-25% 0px -65% 0px' });
    $$('.legal-card').forEach((c) => spy.observe(c));
  }
}

// Tell the modal this page is ready to show.
if (embedded) parent.postMessage({ abh: 'ready' }, location.origin);

// ----- Phones: the footer's lists fold away, and open one at a time -----
{
  const heads = $$('.foot nav h4');
  heads.forEach((h) => {
    h.tabIndex = 0;
    h.setAttribute('role', 'button');
    h.setAttribute('aria-expanded', 'false');
    const toggle = () => {
      const open = !h.parentElement.classList.contains('fold-open');
      heads.forEach((x) => { x.parentElement.classList.remove('fold-open'); x.setAttribute('aria-expanded', 'false'); });
      if (open) { h.parentElement.classList.add('fold-open'); h.setAttribute('aria-expanded', 'true'); }
    };
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
}
