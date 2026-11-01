(function () {
  'use strict';
  var WA = '601149592037';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var rm = function (n) { return 'RM' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, ''); };
  var wa = function (t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); };

  document.documentElement.classList.add('js');
  $('#yr').textContent = new Date().getFullYear();

  /* sticky nav + mobile menu */
  var nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  var onScroll = function () { nav.classList.toggle('is-solid', window.scrollY > 24); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  var closeMenu = function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(o));
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* reveal on scroll */
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (el, i) { el.style.setProperty('--d', (i % 4) * 0.08 + 's'); io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* WhatsApp links open in new tab, track click if analytics present */
  $$('[data-wa]').forEach(function (a) {
    a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', function () {
      if (window.gtag) window.gtag('event', 'whatsapp_click', { link_text: a.textContent.trim().slice(0, 40) });
      if (window.fbq) window.fbq('track', 'Contact');
    });
  });

  /* lightbox */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), lastFocus;
  var openLb = function (src, cap, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || cap || ''; lbCap.textContent = cap || '';
    lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lb-x').focus();
  };
  var closeLb = function () {
    lb.hidden = true; lbImg.src = ''; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  $$('[data-lb]').forEach(function (b) {
    b.addEventListener('click', function () {
      var im = $('img', b); openLb(b.dataset.lb, b.dataset.cap, im && im.alt);
    });
  });
  $('#lb-x').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* mascot viewer – buttons + drag-to-turn (front, angle, side, back) */
  var mImg = $('#m-img'), stage = $('.mascot__stage'), mBtns = $$('.m-btns button');
  var frames = mBtns.map(function (b) { return { src: b.dataset.src, alt: b.dataset.alt }; });
  frames.forEach(function (f) { var i = new Image(); i.src = f.src; });
  var cur = 0;
  function show(i) {
    i = (i + frames.length) % frames.length;
    if (i === cur) return;
    cur = i;
    mImg.src = frames[i].src; mImg.alt = frames[i].alt;
    mBtns.forEach(function (x, k) { x.classList.toggle('on', k === i); });
  }
  mBtns.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
  var sx = null, base = 0;
  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.m-btns')) return;
    sx = e.clientX; base = cur; stage.classList.add('drag');
    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
  });
  stage.addEventListener('pointermove', function (e) {
    if (sx === null) return;
    show(base + Math.round((sx - e.clientX) / 70));
  });
  var endDrag = function () { sx = null; stage.classList.remove('drag'); };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'ArrowLeft') show(cur - 1);
  });

  /* hero mascot tilt (mouse only) */
  var tilt = $('#tilt');
  if (tilt && window.matchMedia('(hover:hover) and (pointer:fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var art = $('.hero__art');
    art.addEventListener('pointermove', function (e) {
      var r = art.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'rotateY(' + (x * 18).toFixed(1) + 'deg) rotateX(' + (-y * 10).toFixed(1) + 'deg)';
    });
    art.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
  }

  /* price tabs */
  var pricing = $('#pricing');
  if (pricing) {
    pricing.classList.add('tabs-on');
    var tabBtns = $$('.tab', pricing);
    var pick = function (k) {
      tabBtns.forEach(function (t) {
        var on = t.dataset.tab === k;
        t.classList.toggle('on', on); t.setAttribute('aria-selected', String(on));
        $('#pn-' + t.dataset.tab, pricing).classList.toggle('on', on);
      });
    };
    tabBtns.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t.dataset.tab); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        var nx = tabBtns[(i + n + tabBtns.length) % tabBtns.length];
        nx.focus(); pick(nx.dataset.tab); e.preventDefault();
      });
    });
    pricing.pick = pick;
  }

  /* calculator – tiers are read from the price tables above (single source of truth) */
  var tiers = {};
  $$('table.pl[data-key]').forEach(function (t) {
    tiers[t.dataset.key] = $$('tbody tr', t).map(function (r) {
      return { min: +r.dataset.min, max: r.dataset.max ? +r.dataset.max : Infinity, p: +r.dataset.p };
    });
  });
  var prod = $('#c-prod'), qty = $('#c-qty'), adBox = $('#c-addons'), szIn = $$('.szi');
  var sizeQty = function () { return szIn.reduce(function (s, i) { return s + Math.max(0, parseInt(i.value, 10) || 0); }, 0); };
  var rd = function (name) { var r = $('input[name=' + name + ']:checked'); return r ? r.value : ''; };
  var DZ = { none: [0, 0, 'Design sendiri'], light: [50, 100, 'Custom ringan (RM50 – RM100)'], 'new': [150, null, 'Design baharu (RM150+)'] };
  var range = function (lo, hi) { return hi === null ? rm(lo) + '+' : lo === hi ? rm(lo) : rm(lo) + ' – ' + rm(hi); };

  function calc() {
    var key = prod.value, isApp = prod.selectedOptions[0].dataset.app === '1';
    $('#f-sizes').hidden = !isApp; $('#f-qty').hidden = isApp;
    var q = Math.min(5000, isApp ? sizeQty() : Math.max(0, parseInt(qty.value, 10) || 0));
    $('#c-total').textContent = sizeQty();
    var bigQ = Math.max(0, parseInt($('.szi[data-size^="3XL"]').value, 10) || 0);
    var sizeTxt = szIn.filter(function (i) { return (parseInt(i.value, 10) || 0) > 0; })
      .map(function (i) { return i.dataset.size + ' ' + (parseInt(i.value, 10) || 0); }).join(', ');
    adBox.hidden = !isApp;
    var notes = [], tier = null;
    var rows = tiers[key] || [];
    for (var i = 0; i < rows.length; i++) if (q >= rows[i].min && q <= rows[i].max) { tier = rows[i]; break; }
    if (q < 1) notes.push(isApp ? 'Masukkan kuantiti bagi sekurang-kurangnya satu saiz.' : 'Masukkan kuantiti.');
    else if (!tier) notes.push('Kuantiti minimum untuk produk ini ialah ' + rows[0].min + 'pcs.');

    var addPer = 0, picked = [];
    if (isApp) {
      $$('.ad', adBox).forEach(function (c) {
        if (!c.checked) return;
        if (q < +c.dataset.min) { notes.push(c.dataset.name + ' perlu minimum ' + c.dataset.min + 'pcs.'); return; }
        addPer += +c.dataset.p; picked.push(c.dataset.name + (+c.dataset.p ? ' (+RM' + c.dataset.p + ')' : ' (FOC)'));
      });
      $('#c-adn').textContent = picked.length ? '(' + picked.length + ' dipilih)' : '(tiada)';
    }

    var dz = DZ[rd('dz')], shipV = rd('ship'), ship = shipV === 'q' ? null : (parseFloat(shipV) || 0);
    var unit = tier ? tier.p : null;
    var sub = unit === null ? null : (unit + addPer) * q;
    var lo = null, hi = null;
    if (sub !== null && ship !== null) { lo = sub + dz[0] + ship; hi = dz[1] === null ? null : sub + dz[1] + ship; }

    $('#r-tier').textContent = tier ? (tier.max === Infinity ? tier.min + '+ pcs' : tier.min + '–' + tier.max + ' pcs') : '–';
    $('#r-unit').textContent = unit === null ? 'Sebut harga' : rm(unit);
    $('#r-add').textContent = isApp ? (addPer ? '+' + rm(addPer) : 'RM0') : 'Tidak berkaitan';
    $('#r-sub').textContent = sub === null ? '–' : rm(sub);
    $('#r-dz').textContent = dz[1] === 0 ? 'RM0' : range(dz[0], dz[1]);
    $('#r-ship').textContent = ship === null ? 'Ikut sebut harga' : rm(ship);
    $('#r-tot').textContent = lo === null ? (sub === null ? 'Sebut harga' : range(sub + dz[0], dz[1] === null ? null : sub + dz[1]) + ' + postage') : range(lo, hi);
    if (bigQ && isApp) notes.push(bigQ + 'pcs saiz 3XL – 9XL dikenakan caj tambahan, dinyatakan dalam sebut harga.');
    $('#r-note').textContent = notes.join(' ');

    var msg = 'Hi Kainlab, saya nak sebut harga:\n- Produk: ' + prod.selectedOptions[0].textContent +
      '\n- Kuantiti: ' + q + 'pcs' +
      (picked.length ? '\n- Add-ons: ' + picked.join(', ') : '') +
      (isApp && sizeTxt ? '\n- Saiz: ' + sizeTxt + (bigQ ? ' (3XL–9XL: caj tambahan)' : '') : '') +
      '\n- Design: ' + dz[2] +
      '\n- Postage: ' + (shipV === 'q' ? 'Sabah/Sarawak' : shipV === '0' ? 'Ambil sendiri' : 'Semenanjung') +
      '\n- Anggaran dari laman web: ' + $('#r-tot').textContent;
    $('#c-wa').href = wa(msg);
  }
  szIn.forEach(function (i) { i.addEventListener('focus', function () { i.select(); }); });
  $('#q-minus').addEventListener('click', function () { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); calc(); });
  $('#q-plus').addEventListener('click', function () { qty.value = Math.min(5000, (parseInt(qty.value, 10) || 0) + 1); calc(); });
  $('#calc').addEventListener('input', calc);
  $('#calc').addEventListener('change', calc);
  $('#calc').addEventListener('submit', function (e) { e.preventDefault(); });
  calc();

  /* order form -> WhatsApp */
  $('#order').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#o-name').value.trim(), err = $('#o-err');
    if (!name) { err.hidden = false; $('#o-name').focus(); return; }
    err.hidden = true;
    var q = $('#o-qty').value.trim(), note = $('#o-note').value.trim();
    var msg = 'Hi Kainlab, saya ' + name + '.\nProduk: ' + $('#o-prod').value +
      (q ? '\nKuantiti: ' + q + 'pcs' : '') + '\nFabrik: ' + $('#o-fab').value +
      (note ? '\nCatatan: ' + note : '') + '\nBoleh bantu sebut harga?';
    window.open(wa(msg), '_blank', 'noopener');
  });

  /* promo bar + activity toasts: driven by js/config.js (real data only). Add #demo to the URL to preview with labelled samples. */
  (function () {
    var cfg = window.KAINLAB_CONFIG || {}, demo = location.hash === '#demo';
    var promo = cfg.promo || {}, acts = cfg.activity || [];
    if (demo) {
      promo = { enabled: true, text: 'Contoh paparan promo.', endsAt: new Date(Date.now() + 3 * 864e5).toISOString(), slots: 'Tinggal 6 slot', cta: 'Tempah sekarang', url: '#tempah' };
      acts = [
        { name: 'Kamarul', action: 'sudah membuat sebut harga', item: 'Baju Korporat', when: '2 minit lalu' },
        { name: 'Syafa', action: 'sudah membuat sebut harga', item: 'Polo Tee', when: '9 minit lalu' },
        { name: 'Hafiz', action: 'baru tanya harga', item: 'Jersey Rumah Sukan', when: '23 minit lalu' },
        { name: 'Aina', action: 'sudah membuat sebut harga', item: 'Varsity Jacket', when: '1 jam lalu' },
        { name: 'Razak', action: 'baru tanya harga', item: 'Lanyard', when: '2 jam lalu' }
      ];
    }
    /* promo countdown */
    var bar = $('#promo');
    if (bar && promo.enabled && promo.endsAt && Date.parse(promo.endsAt) > Date.now()) {
      var end = Date.parse(promo.endsAt), c = $('#promo-c');
      $('#promo-t').textContent = promo.text + (promo.slots ? ' ' + promo.slots + '.' : '');
      var a = $('#promo-a'); a.textContent = promo.cta || 'Tempah sekarang'; a.href = promo.url || '#tempah';
      var tick = function () {
        var s = Math.floor((end - Date.now()) / 1000);
        if (s <= 0) { bar.hidden = true; document.body.classList.remove('has-promo'); return; }
        var d = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
        c.textContent = 'Tamat dalam ' + (d ? d + ' hari ' : '') + hh + 'j ' + m + 'm ' + ss + 's';
        setTimeout(tick, 1000);
      };
      bar.hidden = false; document.body.classList.add('has-promo'); tick();
    }
    /* activity toasts */
    var toast = $('#toast');
    if (!toast || !acts.length) return;
    var i = 0, timer;
    var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
    function show() {
      var a = acts[i++ % acts.length];
      toast.innerHTML = '<span class="toast__av" aria-hidden="true">' + esc((a.name || '?').charAt(0).toUpperCase()) + '</span>' +
        '<span class="toast__t"><b>' + esc(a.name) + '</b> ' + esc(a.action || 'membuat sebut harga') + ' <b>' + esc(a.item) + '</b>' +
        '<small>' + esc(a.when || '') + (demo ? ' · contoh paparan' : '') + '</small></span>' +
        '<button class="toast__x" aria-label="Tutup">×</button>';
      toast.hidden = false; toast.classList.add('in');
      $('.toast__x', toast).addEventListener('click', function () { clearTimeout(timer); hide(true); });
      timer = setTimeout(function () { hide(false); }, 6000);
    }
    function hide(stop) {
      toast.classList.remove('in');
      setTimeout(function () { toast.hidden = true; }, 300);
      if (!stop) timer = setTimeout(show, 14000 + Math.random() * 8000);
    }
    timer = setTimeout(show, 5000);
  })();

  /* theme music: tries to autoplay; browsers usually block sound until the first tap/click,
     so it then starts on the first interaction. The choice to mute is remembered. */
  (function () {
    var au = $('#bgm'), btn = $('#bgm-btn'), lbl = $('#bgm-t');
    if (!au || !btn) return;
    var VOL = 0.4, fade, wanted = true, playing = false;
    try { if (localStorage.getItem('kb-music') === 'off') wanted = false; } catch (_) {}
    btn.hidden = false;
    au.volume = 0;

    function ui() {
      btn.setAttribute('aria-pressed', String(playing));
      btn.classList.toggle('on', playing);
      btn.setAttribute('aria-label', playing ? 'Senyapkan lagu tema' : 'Mainkan lagu tema Kainlab');
      lbl.textContent = playing ? 'Lagu tema' : (wanted ? 'Ketik untuk lagu tema' : 'Lagu tema');
      btn.classList.toggle('hint', !playing && wanted);
    }
    function fadeTo(v, ms, done) {
      clearInterval(fade);
      var from = au.volume, t0 = Date.now();
      fade = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / ms);
        au.volume = Math.max(0, Math.min(1, from + (v - from) * k));
        if (k >= 1) { clearInterval(fade); if (done) done(); }
      }, 40);
    }
    function start() {
      var p = au.play();
      var ok = function () { au.muted = false; playing = true; ui(); fadeTo(VOL, 1500); };
      if (p && p.then) p.then(ok, function () { playing = false; ui(); }); else ok();
    }
    function stop(remember) {
      playing = false; ui();
      fadeTo(0, 400, function () { au.pause(); });
      if (remember) { wanted = false; try { localStorage.setItem('kb-music', 'off'); } catch (_) {} ui(); }
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (playing) stop(true);
      else { wanted = true; try { localStorage.removeItem('kb-music'); } catch (_) {} start(); }
    });
    /* first interaction unlocks sound */
    var unlock = function (e) {
      if (!wanted || playing || (e.target && e.target.closest && e.target.closest('#bgm-btn'))) return;
      start();
    };
    ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) {
      document.addEventListener(ev, function once(e) {
        unlock(e);
        if (playing || !wanted) document.removeEventListener(ev, once, true);
      }, true);
    });
    /* pause when the tab is hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (playing) au.pause(); }
      else if (playing) au.play().catch(function () {});
    });
    ui();
    if (wanted) start();   /* attempt autoplay with sound; silently falls back to first tap */
  })();
})();
